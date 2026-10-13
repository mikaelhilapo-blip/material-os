# Material OS — Development Setup

## Overview
Material OS is a material discovery and comparison tool for architects.
- **Frontend:** React + Vite + Tailwind CSS (port 5173, mapped to host 3000)
- **Backend:** Node.js + Express + Prisma ORM (port 4000, internal only)
- **Database:** PostgreSQL 16

## Running
```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The backend startup automatically:
1. Installs npm dependencies
2. Generates the Prisma client
3. Pushes the schema to PostgreSQL (`prisma db push`)
4. Seeds 18 sample materials (idempotent — skips if data exists)
5. Starts the dev server with nodemon

The frontend startup installs deps and runs Vite dev server with HMR.

## Architecture
- Single-origin: Vite proxies `/api/*` to the backend, so no CORS config needed.
- Auth: JWT-based, stored in localStorage on the client.
- Data model: Users → Materials (supplier listings are global, user-created are private) and Users → Projects → ProjectMaterials (junction).
- Compare selections are stored client-side in localStorage (no server persistence needed).

## Environment Variables
- `DATABASE_URL` — set inline in compose (local PostgreSQL)
- `JWT_SECRET` — defaults in `.env.base44-defaults`, overridable via `/run/base44/app.env`

## Verifying
- Visit `http://localhost:3000` — Discover page with sample materials
- Register an account to access My Materials and Projects
- Select 2–3 materials and compare them on the Compare page
