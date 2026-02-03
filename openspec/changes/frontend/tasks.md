# Frontend Implementation Tasks

## 1. Project scaffolding

- [x] Create `src/main.tsx` and Vite config.
- [x] Add NuxtUI and Tailwind dependencies.
- [x] Configure global CSS.

## 2. Auth flow

- [x] Implement Pinia `auth` store.
- [x] Develop `pages/admin/login.vue` with form validation.
- [x] Axios instance with interceptor for JWT.
- [x] Handle 401 globally to clear store and redirect.

## 3. Navigation guard

- [x] Vue Router `beforeEach` guard checks `auth.isAuthenticated`.
- [x] Redirect to `/admin/login` if not.

## 4. URL CRUD UI

- [x] `ShortUrlForm.vue` component.
- [ ] `ShortUrlList.vue` component with `UTable`.
- [ ] `ShortUrlCard.vue` for single URL view/edit.
- [x] Integration with `stores/shortUrls`.
- [x] Copy short URL to clipboard.

## 5. Account management

- [x] `AccountSettings.vue` component for password change.
- [x] Validation and API call to `/admin/account`.

## 6. Pages assembly

- [x] `/pages/admin/dashboard.vue` dashboard.
- [x] `/pages/admin/short-url.vue` page.
- [ ] `/pages/admin/short-urls.vue` page.
- [x] `/admin/account.vue` page.

## 7. Short code redirection

- [x] Request to `/<CODE>` must check if short code exist, retrieve target URL then redirect.
- [ ] Redirect to target page using `302` HTTP code.

## 8. Styling & UX

- [x] Use NuxtUI components consistently.
- [x] Tailwind responsive layout.
- [x] Toast notifications for success/error.

## 9. Testing

- [ ] Unit tests for components.
- [ ] Integration tests for store actions.

## 10. Documentation & Cleanup

- [ ] Update README with frontend instructions.
- [ ] Ensure lint passes, format code.
