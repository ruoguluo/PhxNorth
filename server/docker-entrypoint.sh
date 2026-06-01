#!/bin/sh
# Seed the SQLite DB on first boot (persisted in the /data volume), then serve.
set -e

mkdir -p /data

if [ ! -f /data/phxnorth.db ]; then
  echo "[entrypoint] seeding database at /data/phxnorth.db ..."
  python seed.py
else
  echo "[entrypoint] existing database found at /data/phxnorth.db"
fi

exec python -m uvicorn main:app --host 0.0.0.0 --port 8081
