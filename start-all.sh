#!/usr/bin/env bash
#
# Native dev launcher for the WHOLE stack (both repos), with hot reload.
#
#   ./start-all.sh
#
# Runs the infra (Postgres/Redis/Kafka) in Docker, and the three app processes
# natively so you get reload:
#   - Behavioral backend (phxnorth-backend, FastAPI)  :8000
#   - Demo backend       (PhxNorth/server, FastAPI)   :8081
#   - Frontend           (Vite dev server)            :5173   (proxies to both)
#
# Prereqs: Docker Desktop, Poetry (backend), Python 3 + Node (frontend/demo).
# The sibling repos must sit side-by-side: ~/Projects/PhxNorth and
# ~/Projects/phxnorth-backend.
#
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$(cd "$ROOT/../phxnorth-backend" && pwd)"

# NOTE: env overrides are scoped to each app's subshell below (NOT exported
# globally) so the behavioral backend's Postgres URL never leaks into the
# SQLite demo server.

cleanup() { echo; echo "Stopping app processes… (infra stays up; 'make infra-down' to stop it)"; kill 0 2>/dev/null || true; }
trap cleanup EXIT INT TERM

echo "==> Infra (Postgres/Redis/Kafka) via Docker"
docker compose -f "$BACKEND/docker-compose.yml" up -d postgres redis kafka

echo "==> Behavioral backend on :8000 (phxnorth-backend)"
(
  cd "$BACKEND"
  # Point the natively-run backend at the Dockerised infra on localhost.
  # (The repo .env targets the in-network 'postgres' host / a different
  # password, so we override to match the docker-compose Postgres.)
  export DATABASE_URL="postgresql+asyncpg://phxnorth:phxnorth@localhost:5432/phxnorth"
  export REDIS_URL="redis://localhost:6379/0"
  export KAFKA_BOOTSTRAP_SERVERS='["localhost:29092"]'
  poetry install >/dev/null 2>&1 || true
  poetry run alembic upgrade head || echo "[warn] alembic upgrade failed — run migrations manually"
  exec poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) &

echo "==> Demo backend on :8081 (PhxNorth/server)"
(
  cd "$ROOT/server"
  # The demo server is SQLite — pin it explicitly so a stray DATABASE_URL in
  # the parent environment can't point it at Postgres.
  export DATABASE_URL="sqlite:///./phxnorth.db"
  [ -d venv ] || python3 -m venv venv
  # shellcheck disable=SC1091
  . venv/bin/activate
  pip install -q -r requirements.txt
  [ -f phxnorth.db ] || python3 seed.py
  exec python3 -m uvicorn main:app --host 0.0.0.0 --port 8081 --reload
) &

echo "==> Frontend on :5173 (Vite)"
(
  cd "$ROOT"
  [ -d node_modules ] || npm install
  exec npm run dev
) &

echo
echo "Frontend:        http://localhost:5173"
echo "Demo API:        http://localhost:8081/docs"
echo "Behavioral API:  http://localhost:8000/docs"
echo "Press Ctrl-C to stop the app processes."
wait
