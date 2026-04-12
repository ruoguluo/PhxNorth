import os
import uuid
import asyncio
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, WebSocket, WebSocketDisconnect, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models.message import Message
from models.session import Session as MentorSession
from models.user import User
from utils.deps import get_current_user
from services.chat_signal_classifier import classify_message
from services.disc_event_dispatcher import dispatch_chat_events

router = APIRouter(prefix="/api/messages", tags=["Messages"])

# File upload config
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        # session_id -> list of connected websockets
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: int):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: int):
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def broadcast_to_session(self, session_id: int, message: dict, exclude: WebSocket | None = None):
        if session_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[session_id]:
                if connection is exclude:
                    continue
                try:
                    await connection.send_json(message)
                except:
                    disconnected.append(connection)
            # Clean up disconnected clients
            for conn in disconnected:
                self.disconnect(conn, session_id)

manager = ConnectionManager()


# Schemas
class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: int
    session_id: int
    sender_id: int
    sender_role: str
    sender_name: str | None = None
    content: str
    file_url: str | None = None
    file_name: str | None = None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# REST Endpoints

@router.get("/session/{session_id}", response_model=List[MessageResponse])
def get_session_messages(
    session_id: int,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get message history for a session."""
    # Verify user is part of this session
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.mentor_id != current_user.id and session.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view these messages")

    messages = (
        db.query(Message)
        .filter(Message.session_id == session_id)
        .order_by(Message.created_at.asc())
        .limit(limit)
        .all()
    )

    # Add sender names
    results = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        resp = MessageResponse.model_validate(msg)
        resp.sender_name = sender.full_name if sender else "Unknown"
        results.append(resp)

    return results


@router.post("/session/{session_id}", response_model=MessageResponse)
def send_message(
    session_id: int,
    msg: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message to a session (REST fallback)."""
    # Verify user is part of this session
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.mentor_id != current_user.id and session.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to send messages")

    # Determine sender role
    sender_role = "mentor" if current_user.id == session.mentor_id else "mentee"

    # Create message
    message = Message(
        session_id=session_id,
        sender_id=current_user.id,
        sender_role=sender_role,
        content=msg.content,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    resp = MessageResponse.model_validate(message)
    resp.sender_name = current_user.full_name
    return resp


@router.put("/session/{session_id}/read")
def mark_messages_read(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all messages in a session as read for the current user."""
    # Verify user is part of this session
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.mentor_id != current_user.id and session.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Mark messages from other user as read
    db.query(Message).filter(
        Message.session_id == session_id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).update({"is_read": True})

    db.commit()
    return {"status": "success", "message": "Messages marked as read"}


@router.post("/session/{session_id}/upload", response_model=MessageResponse)
async def upload_file_message(
    session_id: int,
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a file and create a message with the file attachment."""
    # Verify user is part of this session
    session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.mentor_id != current_user.id and session.mentee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Validate file extension
    _, ext = os.path.splitext(file.filename or "")
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    # Save file to disk
    session_dir = os.path.join(UPLOAD_DIR, str(session_id))
    os.makedirs(session_dir, exist_ok=True)

    # Use UUID prefix to avoid name collisions
    safe_name = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join(session_dir, safe_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    file_url = f"/api/messages/uploads/{session_id}/{safe_name}"

    # Determine sender role
    sender_role = "mentor" if current_user.id == session.mentor_id else "mentee"

    # Create message
    message = Message(
        session_id=session_id,
        sender_id=current_user.id,
        sender_role=sender_role,
        content=f"Shared a file: {file.filename}",
        file_url=file_url,
        file_name=file.filename,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    # Dispatch behavioral signals to DISC backend (fire-and-forget)
    try:
        auth_token = request.headers.get("Authorization", "").replace("Bearer ", "")
        events = classify_message(
            content=message.content, file_url=file_url,
            session_id=session_id, sender_id=current_user.id,
            created_at=message.created_at, db=db,
        )
        if events and auth_token:
            asyncio.create_task(dispatch_chat_events(events, auth_token))
    except Exception:
        pass  # Never let signal dispatch break file upload

    # Build payload for WS broadcast
    msg_payload = {
        "id": message.id,
        "session_id": session_id,
        "sender_id": current_user.id,
        "sender_role": sender_role,
        "sender_name": current_user.full_name,
        "content": message.content,
        "file_url": file_url,
        "file_name": file.filename,
        "is_read": False,
        "created_at": message.created_at.isoformat(),
    }

    # Broadcast to other clients via WebSocket
    await manager.broadcast_to_session(session_id, msg_payload)

    resp = MessageResponse.model_validate(message)
    resp.sender_name = current_user.full_name
    return resp


@router.get("/uploads/{session_id}/{filename}")
def serve_upload(session_id: int, filename: str):
    """Serve an uploaded file."""
    file_path = os.path.join(UPLOAD_DIR, str(session_id), filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)


# WebSocket Endpoint
@router.websocket("/ws/session/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: int,
    token: str | None = None,
    db: Session = Depends(get_db),
):
    """WebSocket endpoint for real-time messaging."""
    # Authenticate using query parameter token
    if not token:
        await websocket.close(code=4001, reason="Missing authentication token")
        return

    try:
        # Verify token and get user
        from utils.security import verify_token
        payload = verify_token(token)
        if not payload:
            await websocket.close(code=4001, reason="Invalid token")
            return

        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            await websocket.close(code=4001, reason="User not found")
            return

        # Verify user is part of this session
        session = db.query(MentorSession).filter(MentorSession.id == session_id).first()
        if not session:
            await websocket.close(code=4004, reason="Session not found")
            return

        if session.mentor_id != user.id and session.mentee_id != user.id:
            await websocket.close(code=4003, reason="Not authorized")
            return

        # Accept connection
        await manager.connect(websocket, session_id)

        # Determine sender role
        sender_role = "mentor" if user.id == session.mentor_id else "mentee"

        try:
            while True:
                # Receive message
                data = await websocket.receive_json()
                content = data.get("content", "").strip()

                if not content:
                    continue

                # Save to database
                message = Message(
                    session_id=session_id,
                    sender_id=user.id,
                    sender_role=sender_role,
                    content=content,
                )
                db.add(message)
                db.commit()
                db.refresh(message)

                # Dispatch behavioral signals to DISC backend (fire-and-forget)
                try:
                    events = classify_message(
                        content=content, file_url=None,
                        session_id=session_id, sender_id=user.id,
                        created_at=message.created_at, db=db,
                    )
                    if events and token:
                        asyncio.create_task(dispatch_chat_events(events, token))
                except Exception:
                    pass  # Never let signal dispatch break chat

                # Build message payload
                msg_payload = {
                    "id": message.id,
                    "session_id": session_id,
                    "sender_id": user.id,
                    "sender_role": sender_role,
                    "sender_name": user.full_name,
                    "content": content,
                    "file_url": None,
                    "file_name": None,
                    "is_read": False,
                    "created_at": message.created_at.isoformat(),
                }

                # Send confirmation back to sender
                await websocket.send_json(msg_payload)

                # Broadcast to other clients (exclude sender to prevent duplicates)
                await manager.broadcast_to_session(session_id, msg_payload, exclude=websocket)

        except WebSocketDisconnect:
            manager.disconnect(websocket, session_id)

    except Exception as e:
        await websocket.close(code=4000, reason=str(e))
