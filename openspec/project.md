# Project Context

## Purpose
B1Shortener is a self‑hostable URL shortener SaaS.  It keeps a single administrative user, created on first admin login, and offers a lightweight admin UI to generate, list, and delete shortened URLs.

## Tech Stack
- **Backend** – NestJS (Express adapter) written in TypeScript, using TypeORM to talk to PostgreSQL.
- **Auth** – JWT based, with a simple role‑based guard for the admin route.
- **Frontend** – Vue 3 with Vite, leveraging NuxtUI components (UPage, UHeader, etc.).  The UI is a single‑page app with Vue Router.
- **HTTP Client** – `axios` for API calls inside the frontend.
- **Libraries** – `class-validator` & `class-transformer` for payload validation, `typeorm` for the data layer, `dotenv` for configuration.
- **Runtime** – Docker Compose orchestrates three services: postgres, backend, and frontend.
- **Build tooling** – npm scripts defined in `package.json` for linting, formatting, type‑checking, building and running tests.

## Project Structure
```
url_shortener/
├─ src/
│  ├─ app/
│  │  ├─ modules/
│  │  │  ├─ auth/          – Auth controller, service, guard, DTOs.
│  │  │  ├─ admin/          – Admin dashboard and pages.
│  │  │  ├─ short-url/      – CRUD for short URLs.
│  │  │  └─ analytics/     – Track clicks.
│  │  ├─ common/
│  │  │  ├─ exceptions/    – AppError & helpers.
│  │  │  ├─ pipes/        – Validation pipes.
│  │  │  ├─ models/        – TypeORM entities.
│  │  │  └─ utils/         – Global utilities.
│  │  └─ main.ts           – Application bootstrap.
│  └─ front/
│     └─ src/
│        ├─ ui/            – NuxtUI components.
│        ├─ pages/          – Vue pages.
│        ├─ store/          – Vuex / Pinia (if used).
│        └─ main.tsx        – Vue bootstrap.
├─ docker-compose.yml
├─ Dockerfile
├─ package.json
└─ README.md
```

## Domain Model
- **User** – only the admin user, stored in `users` table.
- **ShortUrl** – `id`, `code`, `targetUrl`, `clicks`, `expiresAt` (optional), `createdAt`.
- **Click** – audit record of a short URL visit.

## Build / Run Commands
- `npm ci` – install dependencies.
- `npm run dev` – starts backend (`npm run start:dev`) and frontend (`npm run frontend:dev`).
- `npm run build` – builds both back and front.
- `npm run type-check` – `tsc --noEmit`.
- `npm run lint` – ESLint + Prettier.
- `npm run format` – Prettier fix.
- `npm test` – Run all Jest tests.
- `npx jest <file>` – Run a single backend test.
- `npx vitest <file>` – Run a single Vue test.
- `docker compose up -d` – spin up all services.

## Development Workflow
1. Create a feature branch: `feature/<short-description>`.
2. Make changes, run `npm run lint && npm run test` locally.
3. Open a pull request against `develop`.
4. CI runs lint, tests, and Docker image build.
5. Once merged to `develop`, deploy by pulling the new image.

## Testing Strategy
- **Unit** – Jest, tests located under `src/**/__tests__/
- **Integration** – Use `@nestjs/testing` module with an in‑memory DB.
- **Frontend** – Vitest + @vue/test-utils.
- **Coverage** – > 80 % for backend, > 70 % for frontend.

## Conventions & Style
- Imports grouped: external → internal relative.
- Naming: camelCase vars, PascalCase types, SCREAMING_SNAKE_CASE constants.
- Types: strict mode, avoid `any`, prefer `unknown`.
- Error handling: custom `AppError`, log with `AppLogger`, no silent failures.
- No `console.log` in production branches.
- Code formatting: Prettier (2 spaces, single quotes, trailing commas).
- Tests: files end with `.spec.ts` (backend) or `.spec.ts` / `.test.ts` (frontend).

## Constraints
- Rate limit incoming short URL requests using a token bucket per‑user.
- Enforce HTTPS & secure cookies in production.
- Short codes are 6‑character alphanumeric, unique.

## External Dependencies
No runtime third‑party services are consumed; the project only interacts with PostgreSQL and internal packages.
