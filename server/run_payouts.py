#!/usr/bin/env python3
"""Standalone mentor payout sweep (FR-07).

Run from cron for multi-worker / production deployments, e.g. daily at 04:00:

    0 4 * * *  cd /path/to/server && ./venv/bin/python run_payouts.py

Idempotent: only sweeps captured, not-yet-paid earnings.
"""

from database import SessionLocal
from services.billing import process_due_payouts


def main() -> None:
    db = SessionLocal()
    try:
        payouts = process_due_payouts(db)
        total = round(sum(p.amount for p in payouts), 2)
        print(f"Created {len(payouts)} payout(s), disbursed {total}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
