"""Wrapper for Daily.co REST API."""

import os
import time
from datetime import datetime, timedelta

import httpx

DAILY_API_KEY = os.getenv("DAILY_API_KEY", "")
DAILY_API_URL = os.getenv("DAILY_API_URL", "https://api.daily.co/v1")


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {DAILY_API_KEY}",
        "Content-Type": "application/json",
    }


def create_room(
    session_id: int,
    duration_minutes: int = 60,
    enable_recording: bool = True,
    max_participants: int | None = None,
    entity_type: str = "session",
) -> dict:
    room_name = f"phxnorth-{entity_type}-{session_id}-{int(time.time())}"
    exp = int((datetime.utcnow() + timedelta(minutes=duration_minutes + 30)).timestamp())
    properties: dict = {
        "exp": exp,
        "enable_screenshare": True,
        "enable_chat": True,
        "enable_knocking": False,
        "start_video_off": False,
        "start_audio_off": False,
        "enable_recording": "cloud" if enable_recording else False,
        "enable_transcription_storage": enable_recording,
    }
    if max_participants:
        properties["max_participants"] = max_participants
    body = {"name": room_name, "privacy": "private", "properties": properties}
    with httpx.Client(timeout=15) as client:
        resp = client.post(f"{DAILY_API_URL}/rooms", headers=_headers(), json=body)
        resp.raise_for_status()
        return resp.json()


def create_token(
    room_name: str,
    user_name: str,
    user_id: str,
    is_owner: bool = False,
    exp_minutes: int = 120,
) -> str:
    exp = int((datetime.utcnow() + timedelta(minutes=exp_minutes)).timestamp())
    body = {
        "properties": {
            "room_name": room_name,
            "user_name": user_name,
            "user_id": user_id,
            "is_owner": is_owner,
            "exp": exp,
            "enable_screenshare": True,
            "enable_recording": "cloud" if is_owner else False,
            "start_video_off": False,
            "start_audio_off": False,
        }
    }
    with httpx.Client(timeout=15) as client:
        resp = client.post(f"{DAILY_API_URL}/meeting-tokens", headers=_headers(), json=body)
        resp.raise_for_status()
        return resp.json()["token"]


def get_room(room_name: str) -> dict | None:
    with httpx.Client(timeout=10) as client:
        resp = client.get(f"{DAILY_API_URL}/rooms/{room_name}", headers=_headers())
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        return resp.json()


def delete_room(room_name: str) -> bool:
    with httpx.Client(timeout=10) as client:
        resp = client.delete(f"{DAILY_API_URL}/rooms/{room_name}", headers=_headers())
        if resp.status_code == 404:
            return False
        resp.raise_for_status()
        return True


def get_recording_link(room_name: str) -> str | None:
    with httpx.Client(timeout=10) as client:
        resp = client.get(f"{DAILY_API_URL}/recordings", headers=_headers(), params={"room_name": room_name})
        resp.raise_for_status()
        data = resp.json()
        if data.get("data") and len(data["data"]) > 0:
            return data["data"][0].get("download_link")
        return None
