#!/usr/bin/env bash
#
# Local dev launcher for PhxNorth (demo backend + frontend).
#
#   ./start-dev.sh
#
# Starts:
#   - Demo API (FastAPI + SQLite) on http://localhost:8081
#   - Frontend (Vite)            on http://localhost:5173
#
# This covers auth, mentorship, billing (FR-07), conversations/inbox (FR-05),
# and mentor matching. For the AI features that need the behavioral backend
# (FR-01/02/03 + 5D), also start phxnorth-backend on :8000 — see the README in
# that repo (the frontend proxies /api/v1 -> :8000).
#
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER="$ROOT/server"

cleanup() { echo; echo "Shutting down…"; kill 0 2>/dev/null || true; }
trap cleanup EXIT INT TERM

echo "==> Demo backend (FastAPI + SQLite) on :8081"
cd "$SERVER"
if [ ! -d venv ]; then
  echo "    creating venv…"
  python3 -m venv venv
fi
# shellcheck disable=SC1091
source venv/bin/activate
pip install -q -r requirements.txt
# pytest isn't in requirements.txt; install it so `pytest` works for tests.
pip install -q pytest >/dev/null 2>&1 || true
if [ ! -f phxnorth.db ]; then
  echo "    seeding database (first run)…"
  python3 seed.py
fi
python3 -m uvicorn main:app --host 0.0.0.0 --port 8081 --reload &

echo "==> Frontend (Vite) on :5173"
cd "$ROOT"
if [ ! -d node_modules ]; then
  echo "    installing npm deps (first run)…"
  npm install
fi
npm run dev &

echo
echo "Frontend:    http://localhost:5173"
echo "Demo API:    http://localhost:8081/docs"
echo "Press Ctrl-C to stop both."
wait
