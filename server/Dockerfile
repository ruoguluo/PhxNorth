# Demo backend (FastAPI + SQLite) — mentorship, billing, conversations, matching.
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    DATABASE_URL=sqlite:////data/phxnorth.db

WORKDIR /app

# build-essential covers any source wheels (bcrypt/cryptography ship manylinux
# wheels, but this keeps the build robust across platforms).
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .
RUN chmod +x docker-entrypoint.sh

EXPOSE 8081
ENTRYPOINT ["./docker-entrypoint.sh"]
