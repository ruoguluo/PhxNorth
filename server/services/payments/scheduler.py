"""Daily payout scheduler (FR-07).

A lightweight, dependency-free background scheduler that runs the mentor
payout sweep once per day at ``config.PAYOUT_SCHEDULE_HOUR``. Implemented with
a stdlib daemon thread so the demo server needs no extra packages
(APScheduler/Celery).

Notes
-----
- ``process_due_payouts`` is idempotent (it only sweeps captured, unpaid
  earnings), so an accidental double-run does not double-pay.
- For multi-worker / multi-process deployments, prefer running
  ``run_payouts.py`` from system cron and set ``ENABLE_PAYOUT_SCHEDULER=false``
  to avoid each worker starting its own thread.
"""

from __future__ import annotations

import threading
import time
from datetime import datetime, timedelta

import config
from database import SessionLocal
from services.billing import process_due_payouts

_started = False
_lock = threading.Lock()


def _seconds_until_next_run(hour: int) -> float:
    now = datetime.now()
    nxt = now.replace(hour=hour, minute=0, second=0, microsecond=0)
    if nxt <= now:
        nxt += timedelta(days=1)
    return (nxt - now).total_seconds()


def run_once() -> int:
    """Run a single payout sweep. Returns the number of payouts created."""
    db = SessionLocal()
    try:
        payouts = process_due_payouts(db)
        return len(payouts)
    finally:
        db.close()


def _loop(hour: int) -> None:
    while True:
        time.sleep(_seconds_until_next_run(hour))
        try:
            count = run_once()
            print(f"[payout-scheduler] ran sweep, created {count} payout(s)")
        except Exception as exc:  # never let the thread die
            print(f"[payout-scheduler] error: {exc}")
        # Guard against same-second re-entry.
        time.sleep(1)


def start_scheduler() -> bool:
    """Start the daily payout thread once. Returns True if it was started."""
    global _started
    if not getattr(config, "ENABLE_PAYOUT_SCHEDULER", False):
        return False
    with _lock:
        if _started:
            return False
        thread = threading.Thread(
            target=_loop,
            args=(config.PAYOUT_SCHEDULE_HOUR,),
            name="payout-scheduler",
            daemon=True,
        )
        thread.start()
        _started = True
        return True
