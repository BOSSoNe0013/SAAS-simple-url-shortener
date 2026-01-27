# Frontend Implementation Tasks

## 1. Project scaffolding

- [x] Create `src/main.tsx` and Vite config.
- [x] Add NuxtUI and Tailwind dependencies.
- [x] Configure global CSS.

## 2. Auth flow

- [x] Implement Pinia `auth` store.
- [x] Develop `pages/admin/login.vue` with form validation.
- [x] Axios instance with interceptor for JWT.
- [ ] Handle 401 globally to clear store and redirect.

## 3. Navigation guard

- [x] Vue Router `beforeEach` guard checks `auth.isAuthenticated`.
- [x] Redirect to `/admin/login` if not.

## 4. URL CRUD UI

- [x] `ShortUrlForm.vue` component.
- [ ] `ShortUrlList.vue` component with `UTable`.
- [ ] `ShortUrlCard.vue` for single URL view/edit.
- [ ] Integration with `stores/shortUrls`.
- [ ] Copy short URL to clipboard.

## 5. Account management

- [ ] `AccountSettings.vue` component for password change.
- [ ] Validation and API call to `/admin/account`.

## 6. Pages assembly

- [ ] `/pages/admin/dashboard.vue` dashboard.
- [ ] `/pages/admin/short-url.vue` page.
- [ ] `/pages/admin/short-urls.vue` page.
- [ ] `/admin/account.vue` page.

## 7. Styling & UX

- [ ] Use NuxtUI components consistently.
- [ ] Tailwind responsive layout.
- [ ] Toast notifications for success/error.

## 8. Testing

- [ ] Unit tests for components.
- [ ] Integration tests for store actions.

## 9. Documentation & Cleanup

- [ ] Update README with frontend instructions.
- [ ] Ensure lint passes, format code.
