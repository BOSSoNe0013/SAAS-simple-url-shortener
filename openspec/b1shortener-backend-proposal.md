# Backend Implementation Proposal

## Purpose
Add a fully‑functional NestJS backend that:
- Provides admin‑only CRUD for short URLs.
- Generates unique 6‑character alphanumeric codes.
- Records click statistics and optionally supports expiration.
- Implements JWT‑based authentication with a single admin user.
- Exposes a public endpoint `GET /:code` that records a click and redirects the caller.

## Scope
1. **Domain Entities**
   * `User` – minimal admin user.
   * `ShortUrl` – includes `code`, `targetUrl`, `clicks`, `expiresAt`.
   * `Click` – audit record of each visit.
2. **DTOs** – validation for creating/updating URLs.
3. **Services** – business logic, code generation, rate limiting, click tracking.
4. **Controllers** – REST API for admin routes, public redirect route.
5. **Auth** – JWT middleware and guard.
6. **Database** – TypeORM migrations for the three tables.
7. **Testing** – Unit and integration tests using Jest.
8. **Docker** – Updated docker‑compose to expose the backend.

## High‑Level Design
```
src/
 ├─ domain/
 │   ├─ entities/
 │   │   ├─ user.entity.ts
 │   │   ├─ short-url.entity.ts
 │   │   └─ click.entity.ts
 │   ├─ dto/
 │   │   ├─ create-short-url.dto.ts
 │   │   └─ update-short-url.dto.ts
 │   ├─ services/
 │   │   ├─ auth.service.ts
 │   │   ├─ short-url.service.ts
 │   │   └─ click.service.ts
 │   ├─ controllers/
 │   │   ├─ admin.controller.ts
 │   │   └─ redirect.controller.ts
 │   ├─ guards/
 │   │   └─ jwt.guard.ts
 │   └─ utils/
 │       └─ code-generator.ts
 ├─ migrations/
 │   └─ 2024-XX-XX-create-tables.ts
 └─ main.ts
```

## Implementation Steps
1. Create entity files and a migration.
2. Implement DTOs with `class-validator`.
3. Write `CodeGenerator` utility to produce unique codes.
4. Build `AuthService` (hash password, generate JWT, validate token).
5. Build `ShortUrlService` (create, list, delete, update, record click, rate‑limit).
6. Add `JwtGuard` for protected routes.
7. Implement admin controllers.
8. Implement public redirect controller.
9. Add unit tests for each service and controller.
10. Update docker‑compose, Dockerfile and `package.json` scripts.

## Acceptance Criteria
- **Admin** can create, read, update, delete short URLs via JWT‑protected routes.
- **Public** can visit `/CODE` and be redirected; click is recorded.
- Rate limiting is enforced per IP using a simple token bucket.
- All database interactions use TypeORM; migrations can bootstrap the schema.
- Tests cover >90 % of business logic.
- Linter passes, no console logs in production.

## Risks & Mitigations
- **Race condition** on code generation – use unique constraint and retry.
- **Security** – ensure JWT secrets come from `.env`; store admin password hashed.
- **Rate limit** – configurable in `app-config.ts`.

## Proposed timeline
| Week | Milestone |
|------|-----------|
| 1 | Project setup, entity definitions, migration |
| 2 | AuthService, JWT guard, basic routes |
| 3 | ShortUrlService, code generator, public redirect |
| 4 | Testing, Docker integration, documentation |

## Next Steps
Confirm the plan or suggest modifications before proceeding with code generation.
