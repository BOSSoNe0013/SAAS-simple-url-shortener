<!-- OPENSPEC:START -->
# OpenSpec Agent Instructions

This file is the central reference for AI coding assistants working in this repository. It compiles important commands, styling rules, and project conventions that agents must follow when reading, writing, or testing code.

---

## 1. Build / Lint / Test Commands

| Purpose                                | Command                                                                  | Notes                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Install dependencies                   | `npm ci`                                                                 | Uses the lockfile; keep in sync with Dockerfile.                         |
| Start dev servers (backend + frontend) | `npm run dev`                                                            | Starts NestJS (`start:dev`) and Vite (`frontend:dev`).                   |
| Build all artifacts                    | `npm run build`                                                          | Builds NestJS (`build`) and Vite (`frontend:build`).                     |
| Single backend test file               | `npx jest <path/to/__tests__/foo.spec.ts>`                               | Replace path; can also use `npm run test:backend -- <path>` if defined.  |
| Single frontend test component         | `npx vitest <path/to/__tests__/Bar.test.ts>`                             | Replace path; can also use `npm run test:frontend -- <path>` if defined. |
| Lint all code                          | `npm run lint`                                                           | Runs ESLint + Prettier.                                                  |
| Format code                            | `npm run format`                                                         | Prettier in fix mode.                                                    |
| Type‑check & compile                   | `npm run type-check`                                                     | Runs `tsc --noEmit`.                                                     |
| Docker build image                     | `docker build -t b1shortener:latest .`                                   | Build multi‑stage Dockerfile.                                            |
| Docker compose local                   | `docker compose up -d`                                                   | Starts DB, backend, frontend containers.                                 |
| Docker integration tests               | `docker compose -f docker-compose.test.yml up --abort-on-container-exit` | Uses test Compose file.                                                  |

---

## 2. Code Style & Linting

### Imports

- External imports first, internal imports later.
- Alphabetically sorted, except `* as X` comes last.
- Absolute imports for `src/**` modules using `baseUrl: '.'` in `tsconfig.json`.
- No cyclic re‑exports; keep import paths simple.

### Formatting

- Prettier: 2‑space indentation, single quotes, trailing commas where applicable.
- Each file must terminate with a final newline.
- Use `npm run format` to automatically fix violations.

### TypeScript

- Keep `strict` mode enabled.
- Prefer `const` over `let` unless reassignment is needed.
- Avoid `any`; if unavoidable, cast to `unknown` first.
- Interfaces start with `I` (e.g., `IUserDto`).
- Keep function signatures explicit; avoid implicit `any` types.

### Naming

- Variables & functions: `camelCase`.
- Classes & interfaces: `PascalCase`.
- Constants: `SCREAMING_SNAKE_CASE`.
- Enum members: `UPPER_SNAKE_CASE`.
- Use descriptive names; avoid cryptic abbreviations.

### Error Handling

- Throw custom `AppError` (see `common/exceptions/app-error.ts`).
- Wrap async flows in `try/catch`; log via `AppLogger`.
- Never swallow errors silently; always re‑throw or transform.

### Logging & Console

- No `console.log` in production.
- `console.warn` may be used in tests for debugging.
- Prefer structured logging via `AppLogger` in production code.

---

## 3. Dependency Management

- Dependencies are pinned in `package-lock.json`.
- Install exact versions with `npm ci`.
- When adding a new package: `npm i <pkg>` followed by `git add package.json package-lock.json`.
- Use compatible semver ranges: `^` for patch upgrades; `~` only for breaking changes.

---

## 4. Openspec Rules

- Specifications live in `openspec/specs/` and represent the current truth.
- Proposals reside in `openspec/changes/`; each change has `proposal.md`, `tasks.md`, optionally `design.md` and delta `specs/`.
- Use `openspec validate <id> --strict` to ensure proposals are correct before merging.

---

## 5. Cursor Rules

If a `.cursor/rules.json` exists, it governs the cursor scope. Otherwise the repository uses the following default:

```json
{
  "scope": "typescript, vue",
  "max_tokens": 400
}
```

---

## 6. Copilot Rules

- No dedicated Copilot configuration file.
- Copilot suggestions must be reviewed against the style guide above.
- Prefer self‑explanatory code; avoid over‑reliance on Copilot for critical logic.

---

## 7. Docker & CI

- Docker Compose uses a multi‑stage build: `backend` stage installs dependencies and builds NestJS.
- The CI pipeline runs `npm test` and the Docker Compose test steps to ensure style and tests pass.

---

## 8. Miscellaneous

- Repository secrets (e.g., `DATABASE_URL`, `JWT_SECRET`) reside in `.env` or GitHub Actions secrets.
- TypeORM migrations use `ormconfig.json`; apply with `npm run migration:run`.
- For local dev, create a `.env.local` mirroring `.env` without secrets.

---

## 9. How to Use This File

AI agents should reference this file whenever they need:

- How to run, lint, test, or build the project.
- The naming conventions and style rules.
- Locations of generated files or tooling‑managed artifacts.

When in doubt, refer back to the sections above.

---

_End of AGENTS.md_

<!-- OPENSPEC:END -->