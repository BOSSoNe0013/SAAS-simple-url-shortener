# SAAS Simple URL Shortener

> A minimal, self‑hostable SaaS URL shortener built with NestJS (backend) and Vite + NuxtUI (frontend).

## Overview

The repository contains:

- **Backend** – NestJS REST API handling CRUD of short URLs, authentication, rate‑limiting and click tracking.
- **Frontend** – NuxtUI + Vite SPA serving `/admin` for management and handling redirect requests.
- **Docker** – Two Docker images (backend & frontend) and a docker‑compose stack for local development and production.

## Prerequisites

- Docker Engine >= 24
- Node.js 20+ (for local dev)
- npm 9+ or yarn 1.22+

## Getting Started (local dev)

```bash
# Clone repo
git clone https://github.com/BOSSoNe0013/SAAS-simple-url-shortener.git
cd SAAS-simple-url-shortener

# Install dependencies
npm ci

# Start dev servers (NestJS + Vite)
npm run dev
```

The API runs on `http://localhost:5601` and the frontend on `http://localhost:5173`. Navigate to `http://localhost:5173/admin` to log in and start creating short URLs.

## Building a Production Asset

```bash
# Build backend and frontend assets
npm run build
```

The compiled JavaScript for the backend lives in `app/dist` while the frontend bundle is output to `frontend/dist`.

## Docker Images

Images are built with multi‑stage Dockerfiles.

```bash
# Build only the backend image
docker build -t b1shortener-backend:latest -f docker/backend.Dockerfile .

# Build only the frontend image
docker build -t b1shortener-frontend:latest -f docker/frontend.Dockerfile .
```

### Running the stack with Docker Compose

```bash
# Start all containers
docker compose up -d
```

- **Backend** – exposed on port `5601`.
- **Frontend** – exposed on port `80` through nginx.
- **Postgres** – used by the backend, exposed on port `5432`.

You can override any of the environment variables in `.env` or the compose file – see the `.env.example` for required values.

## Usage

- Access the admin UI at `http://localhost/admin`.
- Log in as an admin user (by default you may need to create one via a seeding script or API).
- Create short URLs under `/admin/short-urls`.
- Visiting `http://localhost/\<code\>` will trigger the 302 redirect.

## Cleaning Up

```bash
# Stop containers and remove volumes
docker compose down -v
```

## Contributing

See `CONTRIBUTING.md` for guidelines.
