"""Fire-and-forget dispatch of behavioral events to the DISC backend."""

import logging
import httpx
from datetime import datetime, timezone
from uuid import uuid4

logger = logging.getLogger(__name__)

DISC_BACKEND_URL = "http://localhost:8000/api/v1"

# In-memory cache: JWT token -> DISC user UUID
_uuid_cache: dict[str, str] = {}


async def _resolve_disc_uuid(token: str) -> str | None:
    if token in _uuid_cache:
        return _uuid_cache[token]
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                f"{DISC_BACKEND_URL}/users/me",
                headers={"Authorization": f"Bearer {token}"},
            )
            if resp.status_code == 200:
                data = resp.json()
                uuid = data.get("id")
                if uuid:
                    _uuid_cache[token] = str(uuid)
                    return str(uuid)
    except Exception as e:
        logger.debug("Failed to resolve DISC UUID: %s", e)
    return None


async def dispatch_chat_events(events: list[dict], token: str) -> None:
    if not events:
        return

    disc_uuid = await _resolve_disc_uuid(token)
    if not disc_uuid:
        logger.debug("Could not resolve DISC UUID, skipping event dispatch")
        return

    now = datetime.now(timezone.utc).isoformat()

    batch = []
    for event in events:
        batch.append({
            "event_id": str(uuid4()),
            "user_id": disc_uuid,
            "event_type": event["event_type"],
            "timestamp": now,
            "payload": event.get("payload", {}),
        })

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                f"{DISC_BACKEND_URL}/events/batch",
                json={"events": batch},
                headers={"Authorization": f"Bearer {token}"},
            )
            if resp.status_code in (200, 201, 202):
                logger.info("Dispatched %d chat events to DISC backend for user %s",
                            len(batch), disc_uuid)
            else:
                logger.warning("DISC events dispatch returned %d: %s",
                               resp.status_code, resp.text[:200])
    except Exception as e:
        logger.debug("DISC events dispatch failed (non-critical): %s", e)
