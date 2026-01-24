# Frontend UI Proposal

## Purpose

Create a Vue 3 + Vite + NuxtUI + Tailwind admin interface (base path `/admin`) for B1Shortener. The UI will provide:

- Secure login page that obtains a JWT from `/auth/login` and stores it in memory (pinia store) and optionally cookies.
- **Short‑URL creation** page: form to enter `targetUrl`, optional expiry; on submit calls `POST /admin/short-urls` and shows the new code.
- **Link‑management** page: table of all short URLs belonging to the admin, with actions to edit, delete, copy the full short URL, and view click stats.
- **Account management** page: update admin password, view token expiry, optionally rotate token.

All pages will be protected by a Vue navigation guard that verifies the presence of a valid JWT; redirects to login if missing.

## Scope

- Routing under `/admin` with Vue Router.
- UI components using NuxtUI (`UPage`, `UHeader`, `UTextInput`, `UButton`, `UTable`, `UModal`, `UCard`, `UToast` etc.).
- State management with Pinia store for auth and short‑URL list.
- API client wrapper around Axios that automatically injects the JWT and handles 401 redirects.
- Unit / integration tests with Vitest and @vue/test-utils.
- Documentation of component usage.

## High‑Level Design

- **Pages**: `pages/admin/login.vue`, `pages/admin/index.vue` (dashboard), `pages/admin/short-urls.vue`, `pages/admin/account.vue`.
- **Components**: `components/ShortUrlForm.vue`, `components/ShortUrlList.vue`, `components/ShortUrlCard.vue`, `components/AccountSettings.vue`.
- **Store**: `stores/auth.ts`, `stores/shortUrls.ts`.
- **API Client**: `src/api/index.ts`.
- **Routes**: Protect `/admin/*` using a `beforeEnter` guard reading from `auth` store.

## Implementation Steps

1. Scaffold basic project files.
2. Implement auth store and login page.
3. Create API client.
4. Build ShortUrlForm and ShortUrlList components.
5. Build dashboard and account pages.
6. Add navigation guard.
7. Write unit tests.
8. Integrate Tailwind and NuxtUI.

## Acceptance Criteria

- Users can log in, receive a JWT, and stay authenticated across navigation.
- After login, `/admin/short-urls` displays list, allows creating, deleting, editing, and copying URLs.
- Account page updates password with proper validation.
- All API calls include JWT; unauthorized calls redirect to login.
- Test coverage > 70 % for frontend.
- Lint passes, no console logs in production.

## Risks & Mitigations

- **Token Expiry**: Handle 401 responses globally to trigger logout.
- **Routing Errors**: Use dynamic imports for large components.
- **Styling**: Rely on NuxtUI base styles to avoid custom CSS where possible.

## Timeline

| Week | Milestone                  |
| ---- | -------------------------- |
| 1    | Scaffold, auth, login      |
| 2    | API client, URL list       |
| 3    | URL creation/edit, account |
| 4    | Tests, lint, documentation |
