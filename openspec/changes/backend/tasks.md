# Backend Implementation Task List

- [x] **Implement DatabaseFactory** | Create `DatabaseFactory` that returns `TypeOrmModuleOptions` based on `AppConfigService`.
- [x] **Ensure unique code generation** | Modify `ShortUrlService.create` to retry generating a code on unique‑constraint violation.
- [x] **Add click tracking** | Create a method to record a click and increment the counter, integrate it in `RedirectController`.
- [x] **Add admin update route** | Implement `PUT /admin/short-urls/:code` in `AdminController` to update short URLs.
- [x] **Align User entity and migration** | Add `@Column({ name: "password_hash" })` to `User.passwordHash` or adjust migration.
- [ ] **Write tests** | Add Jest tests for services and controllers to reach >90 % coverage.
- [ ] **Update Docker‑compose** | Expose backend, set env vars, run migrations on start.
- [ ] **Add scripts in package.json** | Scripts for migrations, lint, etc.
- [ ] **Make rate‑limit configurable** | Expose rate‑limit values via `AppConfigService`.
- [ ] **Create admin seed** | Bootstrap initial admin user on first run if none exists.
