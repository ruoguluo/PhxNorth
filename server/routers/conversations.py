"""Conversations API (FR-05).

Durable mentor<->mentee threads that span sessions. Lets either party browse
their full message history (an inbox), see unread counts, and continue a
conversation independently of a specific session.
"""

import asyncio
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from models.conversation import Conversation
from models.message import Message
from models.session import Session as MentorSession
from models.user import User
from utils.deps import get_current_user
from services.chat_signal_classifier import classify_message
from services.disc_event_dispatcher import dispatch_chat_events
from services.conversation_store import link_message
from routers.messages import MessageResponse, manager

router = APIRouter(prefix="/api/conversations", tags=["Conversations"])


class ConversationResponse(BaseModel):
    id: int
    counterparty_id: int
    counterparty_name: Optional[str] = None
    counterparty_role: str
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0


class ConversationMessageCreate(BaseModel):
    content: str


def _counterparty(convo: Conversation, me: User) -> tuple[int, str]:
    """Return (counterparty_user_id, counterparty_role) relative to ``me``."""
    if me.id == convo.mentor_id:
        return convo.mentee_id, "mentee"
    return convo.mentor_id, "mentor"


def _require_member(convo: Conversation, me: User) -> None:
    if me.id not in (convo.mentor_id, convo.mentee_id):
        raise HTTPException(status_code=403, detail="Not authorized for this conversation")


@router.get("", response_model=List[ConversationResponse])
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List the current user's conversations, most recent first."""
    convos = (
        db.query(Conversation)
        .filter(
            or_(
                Conversation.mentor_id == current_user.id,
                Conversation.mentee_id == current_user.id,
            )
        )
        .order_by(Conversation.last_message_at.desc())
        .all()
    )

    results: List[ConversationResponse] = []
    for convo in convos:
        cp_id, cp_role = _counterparty(convo, current_user)
        counterparty = db.query(User).filter(User.id == cp_id).first()
        last = (
            db.query(Message)
            .filter(Message.conversation_id == convo.id)
            .order_by(Message.created_at.desc())
            .first()
        )
        unread = (
            db.query(Message)
            .filter(
                Message.conversation_id == convo.id,
                Message.sender_id != current_user.id,
                Message.is_read == False,  # noqa: E712
            )
            .count()
        )
        results.append(
            ConversationResponse(
                id=convo.id,
                counterparty_id=cp_id,
                counterparty_name=counterparty.full_name if counterparty else None,
                counterparty_role=cp_role,
                last_message=last.content if last else None,
                last_message_at=convo.last_message_at,
                unread_count=unread,
            )
        )
    return results


@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    _require_member(convo, current_user)
    cp_id, cp_role = _counterparty(convo, current_user)
    counterparty = db.query(User).filter(User.id == cp_id).first()
    return ConversationResponse(
        id=convo.id,
        counterparty_id=cp_id,
        counterparty_name=counterparty.full_name if counterparty else None,
        counterparty_role=cp_role,
        last_message_at=convo.last_message_at,
    )


@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    limit: int = 100,
    offset: int = 0,
    q: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Full message history for a conversation (across every session)."""
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    _require_member(convo, current_user)

    query = db.query(Message).filter(Message.conversation_id == conversation_id)
    if q:
        query = query.filter(Message.content.ilike(f"%{q}%"))
    messages = (
        query.order_by(Message.created_at.asc()).offset(offset).limit(limit).all()
    )

    results = []
    name_cache: dict[int, str] = {}
    for msg in messages:
        if msg.sender_id not in name_cache:
            sender = db.query(User).filter(User.id == msg.sender_id).first()
            name_cache[msg.sender_id] = sender.full_name if sender else "Unknown"
        resp = MessageResponse.model_validate(msg)
        resp.sender_name = name_cache[msg.sender_id]
        results.append(resp)
    return results


@router.put("/{conversation_id}/read")
def mark_conversation_read(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all incoming messages in the conversation as read."""
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    _require_member(convo, current_user)

    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.is_read == False,  # noqa: E712
    ).update({"is_read": True})
    db.commit()
    return {"status": "success"}


@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def send_conversation_message(
    conversation_id: int,
    body: ConversationMessageCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message in a conversation (continues the most recent session)."""
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    _require_member(convo, current_user)

    content = (body.content or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Message content is required")

    # Attach to the most recent session shared by the pair (messages require one).
    session = (
        db.query(MentorSession)
        .filter(
            MentorSession.mentor_id == convo.mentor_id,
            MentorSession.mentee_id == convo.mentee_id,
        )
        .order_by(MentorSession.id.desc())
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=400, detail="No session exists for this conversation yet"
        )

    sender_role = "mentor" if current_user.id == convo.mentor_id else "mentee"
    message = Message(
        session_id=session.id,
        sender_id=current_user.id,
        sender_role=sender_role,
        content=content,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    link_message(db, message, convo.mentor_id, convo.mentee_id)

    # Behavioral signals (fire-and-forget).
    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        events = classify_message(
            content=content,
            file_url=None,
            session_id=session.id,
            sender_id=current_user.id,
            created_at=message.created_at,
            db=db,
        )
        if events and token:
            asyncio.create_task(dispatch_chat_events(events, token))
    except Exception:
        pass

    # Mirror to any open session WebSocket viewers.
    try:
        await manager.broadcast_to_session(
            session.id,
            {
                "id": message.id,
                "session_id": session.id,
                "sender_id": current_user.id,
                "sender_role": sender_role,
                "sender_name": current_user.full_name,
                "content": content,
                "file_url": None,
                "file_name": None,
                "is_read": False,
                "created_at": message.created_at.isoformat(),
            },
        )
    except Exception:
        pass

    resp = MessageResponse.model_validate(message)
    resp.sender_name = current_user.full_name
    return resp
