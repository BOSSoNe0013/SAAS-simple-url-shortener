# Frontend UI Capability

## ADDED Requirements

### Requirement: Admin‑Only Front‑End for URL Shortener

The frontend must provide an authenticated UI under the route `/admin` that allows the single admin user to perform all CRUD operations on short URLs, view click statistics, and manage account settings.

#### UI Screens

- **Login Screen** (`/admin/login`): Form for username/password, submits to `/auth/login`. Stores JWT in application state.
- **Short Link Creation Screen**: Form to enter `targetUrl` (required) and optional `expiresAt`; on submit creates a new short URL via `POST /admin/short-urls`.
- **Short Links Management Screen** (`/admin/short-urls`): Tables list all URLs, show code, target, clicks, expiry; provide edit, delete, copy actions.
- **Account Management Screen** (`/admin/account`): Change admin password, view token expiry.

#### Navigation Guard

All routes under `/admin/*` must be guarded: unauthenticated users are redirected to `/admin/login`.

#### Tech Stack

The frontend will be built with Vue 3, Vite, NuxtUI, Tailwind CSS, and Pinia for state. Axios will be used for HTTP calls.

---
