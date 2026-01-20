<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are the central knowledge base for all AI assistants running in this repository.  The file is ~150 lines long and covers commands, style guides, dependency management, cursor/copilot rules, and test utilities.

---

## 1. Project Commands

| Purpose | Command | Notes |
|---------|---------|-------|
| Install dependencies | `npm ci` | Uses `package-lock.json`; keep in sync with Dockerfile.
| Start dev servers (backend + frontend) | `npm run dev` | Starts NestJS (`start:dev`) and Vite dev server (`frontend:dev`). |
| Build all artifacts | `npm run build` | Builds NestJS (`build`) and Vite (`frontend:build`). |
| Run Docker compose locally | `docker compose up -d` | Creates DB, backend, and frontend containers.
| Run single backend test by file | `npx jest <path/to/__tests__/foo.spec.ts>` | Useful for quick test debugging. |
| Run single frontend test by component | `npx vitest <path/to/__tests__/Bar.spec.ts>` | Runs Vitest on a single file. |
| Lint all code | `npm run lint` | Invokes ESLint + Prettier. |
| Format code | `npm run format` | Runs Prettier in fix mode. |
| Type‑check + compile project | `npm run type-check` | Runs `tsc --noEmit`. |
| Docker build image | `docker build -t b1shortener:latest .` | Builds the multi‑stage Dockerfile. |
| Run integration tests in Docker | `docker compose -f docker-compose.test.yml up --abort-on-container-exit` | Uses a special test Compose file. |

---

## 2. Code Style & Linting

### Imports
* Group external imports, then internal relative imports.
* Sort alphabetically, except `* as X` is last.
* Use absolute imports for modules in `src/**` with `baseUrl` set to `.` in `tsconfig.json`.

### Formatting
* Prettier: 2 space indentation, single quotes, trailing commas where applicable (ES5/ES6).
* Files must end with a newline.

### TypeScript
* Use `strict` mode (`noImplicitAny` etc).
* Prefer `const` over `let` when reassignment never occurs.
* Never use the `any` type; if impossible, cast to `unknown` first.
* Interface names start with `I` (`IUserDto`).

### Naming
* Variables & function names: `camelCase`.
* Classes & interfaces: `PascalCase`.
* Constants: `SCREAMING_SNAKE_CASE`.
* Enum members: `UPPER_SNAKE_CASE`.

### Error Handling
* Throw custom `AppError` (see `common/exceptions/app-error.ts`).
* Use `try/catch` in async flows; log the error with `AppLogger`.
* No `Error` swallowed silently; always re‑throw or convert.

### Testing
* Backend tests use Jest; test files end with `.spec.ts` and are placed under `src/**/__tests__`.
* Frontend tests use Vitest; test files end with `.spec.ts` or `.test.ts`.
* Use `jest-mock-extended` for mocking services.
* No `console.log` in production; tests may use `console.warn` for debugging.

---

## 3. Dependency Management

* All dependencies are pinned in `package-lock.json` (npm) or `yarn.lock` if used.
* Use `npm ci` to install exactly the locked versions.
* For new dependencies, run `npm i <pkg>` then commit both `package.json` and lock file.
* Version ranges should be `^` for patch upgrades and `~` only if the package has breaking changes.

---

## 4. Cursor Rules

Cursor integration is optional.  If a `.cursor` directory exists with a `rules.json` file, follow those rules.
If not present, this project uses the cursor default of:
```json
{
  "scope": "typescript, vue",
  "max_tokens": 400
}
```

---

## 5. Copilot Rules

No dedicated Copilot config file is available.  Copilot may be enabled, but developers are encouraged to review suggested snippets against the style guide above.

---

## 6. Docker & CI

* Docker Compose uses a multi‑stage build; the `backend` stage installs dependencies and builds NestJS.
* The CI pipeline (GitHub Actions) mirrors the `npm test` and `docker compose` steps, ensuring style and tests pass before merge.

---

## 7. Miscellaneous

* All repository secrets (e.g., DATABASE_URL, JWT_SECRET) must be stored in a .env file or GitHub Actions secrets.
* Database migrations use TypeORM `ormconfig.json`; run `npm run migration:run` to apply.
* For local development, create a `.env.local` mirroring `.env` without secrets.

---

## 8. How to Use This File

AI agents should reference this file whenever they need to know:
* How to run, lint, test, or build the project.
* Naming conventions and style rules to follow.
* Which directories or files are generated or managed by tools.

When in doubt, refer back to the sections above.

---

<!-- OPENSPEC:END -->
