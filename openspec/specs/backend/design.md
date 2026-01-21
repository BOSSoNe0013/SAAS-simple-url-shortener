## Context

This change introduces a complete NestJS backend for the URL shortener, adding admin CRUD, JWT authentication
and a public redirect with click tracking, rate limiting, and a new data model.

## Goals / Non‑Goals

- **Goals**
  - Provide a fully‑functional backend with all spec requirements.
  - Enforce admin authentication via JWT.
  - Persist short URLs, clicks, and users in PostgreSQL via TypeORM.
  - Implement per‑IP rate limiting for public endpoint.
  - Enable unique 6‑character code generation with retry.
- **Non‑Goals**
  - Support multiple admins (only a single admin exists).
  - Expose an API for non‑admin public URL creation.

## Decisions

- **Framework:** NestJS with TypeORM; chosen for its architecture and built‑in support for modules/controllers/services.
- **Auth:** JWT strategy using `passport‑jwt` with access token only (no refresh token).
- **Rate Limiting:** Token bucket algorithm implemented in a dedicated `RateLimiterService` with in‑memory store; configurable threshold.
- **Code Generation:** `CodeGenerator` util with `crypto.randomBytes` to create 48‑bit random values, encoded base64url truncated to 6 characters; uniqueness ensured via DB conflict retry loop.
- **Data Model:** Three entities `User`, `ShortUrl`, `Click` plus migrations. `User` seeded at bootstrap.
- **Testing:** Jest unit tests for services and integration tests using `@nestjs/testing` with an in‑memory SQLite DB.

## Risks / Trade‑offs

- **Race Condition in Code Generation:** Uniqueness enforced by DB unique constraint; retry can lead to performance hit if many collisions occur.
- **In‑memory Rate Limiter:** Not persisted across instances; acceptable in single‑node mode but problematic with scaling; considered acceptable for MVP.
- **JWT Secret Management:** Must be stored in `.env`; missing secret causes startup failure; handled via validation.

## Migration Plan

1. Generate migration `YYYYMMDD‑create‑tables.ts` with `CreateTable` queries for `users`, `short_urls`, `clicks`.
2. Seed admin user in `run‑migrations` using a CLI script after migration.
3. Apply migration locally via `npm run migration:run`.

## Open Questions

- Will the application be deployed behind a load balancer that preserves client IP? If not, rate limiting should fallback to `X‑Forwarded‑For`.
- Do we need a cron job to clean expired click records? Not currently required.
