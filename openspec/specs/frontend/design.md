## Context

This change introduces a Vue 3 + Vite + NuxtUI + Tailwind admin dashboard for managing short URLs. It builds upon the backend API (JWT protected) and provides a modern, responsive UI.

## Goals / Non‑Goals

- **Goals**
  - Deliver a fully functional admin interface with login, URL CRUD, and account management.
  - Enforce authentication via JWT stored in Pinia and Axios interceptor.
  - Use NuxtUI components for consistent look‑and‑feel.
  - Provide responsive design with Tailwind.
- **Non‑Goals**
  - Public URL creation (only backend handles that).
  - Server‑side rendering; the app is a SPA.

## Decisions

- **UI Library**: NuxtUI chosen for ready‑made Vue 3 components and Tailwind styling.
- **State Management**: Pinia because of lighter bundle size and Vue 3 friendliness.
- **Routing**: Vue Router with nested routes under `/admin`. Guard with `beforeEach` that checks auth token.
- **HTTP Client**: Axios wrapper that attaches JWT and handles 401 globally.
- **Clipboard**: Use modern `navigator.clipboard.writeText` API for copying short URLs.

## Risks / Trade‑offs

- **Token persistence**: Keeping JWT in memory means refresh on page reload; we will use `localStorage` optional fallback.
- **Routing errors**: Ensure guard runs before component load to avoid flicker.
- **Styling**: NuxtUI components are heavily styled, which may conflict with application branding; we limit custom CSS.

## Migration Plan

1. Add required dependencies (`axios`, `pinia`, `vue-router`, `nuxtui`, `tailwindcss`).
2. Set up Vite config and Tailwind.
3. Build auth flow + guard.
4. Build list and form components.
5. Assemble pages and navigation.
6. Write tests and lint.

---
