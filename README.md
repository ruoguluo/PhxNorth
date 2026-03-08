# PhxNorth — Mentorship Platform

A full-stack mentorship platform with React frontend and FastAPI backend.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS |
| Backend  | Python 3.10+, FastAPI, SQLAlchemy, SQLite |
| Auth     | JWT (python-jose), bcrypt (passlib)       |

## Quick Start

### 1. Clone & Install Frontend

```bash
git clone https://github.com/ruoguluo/PhxNorth.git
cd PhxNorth
npm install
```

### 2. Install Backend

```bash
cd server
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Seed Database (first time only)

```bash
cd server
python3 seed.py
```

### 4. Start Backend

```bash
cd server
source venv/bin/activate
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 5. Start Frontend

```bash
# In another terminal, from project root
npm run dev
```

Frontend runs at `http://localhost:5173`. API requests are proxied to port 8000 via Vite.

## Production Deployment

### Build Frontend

```bash
npm run build
```

Static files output to `dist/`. Serve with Nginx, Caddy, or any static file server.

### Nginx Example Config

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/PhxNorth/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Run Backend in Production

```bash
cd server
source venv/bin/activate
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Or with `nohup` for background:

```bash
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 > uvicorn.log 2>&1 &
```

## Test Accounts

| Role    | Email                         | Password    |
|---------|-------------------------------|-------------|
| Admin   | admin@phxnorth.com            | admin123    |
| Mentor  | sarah.mentor@phxnorth.com     | mentor123   |
| Mentor  | david.mentor@phxnorth.com     | mentor123   |
| Mentor  | emily.mentor@phxnorth.com     | mentor123   |
| Mentee  | chen.mentee@phxnorth.com      | mentee123   |
| Mentee  | michael.mentee@phxnorth.com   | mentee123   |
| Mentee  | aisha.mentee@phxnorth.com     | mentee123   |
| Mentee  | james.mentee@phxnorth.com     | mentee123   |
| Mentee  | sofia.mentee@phxnorth.com     | mentee123   |

## API Endpoints

| Method | Endpoint                            | Description              |
|--------|-------------------------------------|--------------------------|
| POST   | `/api/auth/register`                | Register new user        |
| POST   | `/api/auth/login`                   | Login, returns JWT       |
| GET    | `/api/auth/me`                      | Current user profile     |
| GET    | `/api/profile/mentors`              | List mentors             |
| PUT    | `/api/profile/online-status`        | Toggle online status     |
| GET    | `/api/mentorship/availability`      | Get availability slots   |
| PUT    | `/api/mentorship/availability`      | Update availability      |
| GET    | `/api/mentorship/requests`          | List requests            |
| POST   | `/api/mentorship/requests`          | Create request           |
| PUT    | `/api/mentorship/requests/:id/respond` | Accept/decline        |
| GET    | `/api/mentorship/sessions`          | List sessions            |
| GET    | `/api/mentorship/queue`             | Instant queue            |
| GET    | `/api/mentorship/calendar`          | Calendar data            |
| GET    | `/api/mentorship/stats`             | Mentor stats             |
| GET    | `/api/admin/stats`                  | Platform stats           |
| GET    | `/api/admin/users`                  | User management          |

## Project Structure

```
PhxNorth/
├── src/                    # Frontend (React + Vite)
│   ├── app/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Shared UI components
│   │   └── routes.tsx      # Route definitions
│   ├── lib/
│   │   ├── api.ts          # API client (typed fetch wrapper)
│   │   └── auth-context.tsx # Auth state management
│   └── main.tsx
├── server/                 # Backend (FastAPI)
│   ├── main.py             # App entry, CORS, routers
│   ├── database.py         # SQLAlchemy + SQLite config
│   ├── models/             # ORM models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── routers/            # API route handlers
│   ├── utils/              # JWT, password hashing, deps
│   ├── seed.py             # Database seeder
│   └── requirements.txt
├── vite.config.ts          # Vite config with /api proxy
└── package.json
```