# PhxNorth dev shortcuts. Run `make` (or `make help`) to list targets.
# Docker targets use the root docker-compose.yml (full stack incl. the
# behavioral backend pulled in from ../phxnorth-backend).

.DEFAULT_GOAL := help
.PHONY: help up up-light down down-v build rebuild logs logs-api ps \
        restart-api seed reseed dev dev-all infra infra-down \
        kafka kafka-down stop-all \
        test test-demo test-backend

## help: list available targets
help:
	@grep -E '^## ' $(MAKEFILE_LIST) | sed -e 's/## //' | awk -F': ' '{printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

## up: build + start the full stack (web, demo-api, api, celery, infra)
up:
	docker compose up -d --build
	@echo "Frontend: http://localhost:8080   Demo API: http://localhost:8081/docs   Behavioral API: http://localhost:8000/docs"

## up-light: start only the frontend + demo API (skip behavioral backend + infra)
up-light:
	docker compose up -d --build web demo-api
	@echo "Frontend: http://localhost:8080   Demo API: http://localhost:8081/docs"

## down: stop all containers
down:
	docker compose down

## down-v: stop containers AND remove volumes (wipes demo DB + infra data)
down-v:
	docker compose down -v

## build: build all images without starting
build:
	docker compose build

## rebuild: force a clean rebuild (no cache)
rebuild:
	docker compose build --no-cache

## logs: tail logs for all services
logs:
	docker compose logs -f

## logs-api: tail logs for the behavioral backend only
logs-api:
	docker compose logs -f api

## ps: show running services
ps:
	docker compose ps

## restart-api: rebuild + restart the behavioral api (e.g. after editing .env)
restart-api:
	docker compose up -d --build api

## seed: (re)seed the demo database inside the running container
seed:
	docker compose exec demo-api python seed.py

## reseed: wipe the demo DB volume and recreate it from seed
reseed:
	docker compose rm -sf demo-api
	docker volume rm phxnorth_demo_data 2>/dev/null || true
	docker compose up -d --build demo-api

## dev: run the non-Docker local dev servers (frontend + demo API only)
dev:
	./start-dev.sh

## dev-all: native hot-reload for BOTH repos (Postgres/Redis in Docker, apps native)
dev-all:
	./start-all.sh

## infra: start Postgres + Redis (for native backend dev)
infra:
	docker compose -f ../phxnorth-backend/docker-compose.yml up -d postgres redis

## infra-down: stop the Postgres + Redis infra containers
infra-down:
	docker compose -f ../phxnorth-backend/docker-compose.yml stop postgres redis

## kafka: start Kafka (optional, for event streaming features)
kafka:
	docker compose -f ../phxnorth-backend/docker-compose.yml up -d kafka

## kafka-down: stop Kafka
kafka-down:
	docker compose -f ../phxnorth-backend/docker-compose.yml stop kafka

## stop-all: stop everything (app processes + all infra containers incl. Kafka)
stop-all:
	-pkill -f "uvicorn.*8000" 2>/dev/null
	-pkill -f "uvicorn.*8081" 2>/dev/null
	-pkill -f "vite" 2>/dev/null
	docker compose -f ../phxnorth-backend/docker-compose.yml stop postgres redis kafka 2>/dev/null || true

## test: run both test suites (demo server + behavioral backend)
test: test-demo test-backend

## test-demo: run the demo server pytest suite
test-demo:
	cd server && (./venv/bin/python -m pytest tests/ -q || python3 -m pytest tests/ -q)

## test-backend: run the behavioral backend pytest suite
test-backend:
	cd ../phxnorth-backend && poetry run pytest -q
