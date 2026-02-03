# Contributing Guide

Welcome! We appreciate your interest in improving this project. This guide explains how to get started, the style guidelines, and how to maintain high quality throughout the codebase.

## How to Contribute

1. **Fork & clone**: Fork the repo, then clone your fork.
2. **Create a feature branch**: Name it something descriptive like `feature/<brief>`. Example: `feature/add-redirect-rate-limit`.
3. **Check out the latest `develop`**: Make sure you are up‑to‑date.
4. **Make your changes**: Follow the coding style, add tests, documentation, or fixes as needed.
5. **Run the test suite**:
   ```bash
   npm ci
   npm test
   ```
6. **Commit**: Use an appropriate commit message (Conventional Commits are preferred – see `package.json` for a lint rule).
7. **Push and open a PR**: Push to your fork and create a Pull Request targeting **`develop`**.
8. **Respond to review**: Fix requested changes in the same branch.
9. **Merge**: Once the PR is approved, it will be merged by a maintainer.

## Code Quality

- Follow the [style guide](./docs/style.md) used throughout the repository.
- Keep your changes small and focused. Break large changes into multiple commits/PRs.
- Run lint & format before committing:
  ```bash
  npm run lint
  npm run format
  ```
- Add or update tests. Coverage is required for new features and should not regress.
- Do not commit binary files. If a build artifact is necessary for a PR, commit the **source** and let the CI build.

## Documentation

- If you add a new feature, update the README, docs, or create a new `docs/` entry.
- Mention usage in the **README** or in a comment if it changes public behaviour.

## Testing

The repo uses Jest for unit tests, and it checks all compiled outputs. Your tests should:

- Test both positive and negative paths.
- Use the `short-url.service.spec.ts` template as a pattern.
- Mock external dependencies (like Postgres) using `jest-mock` or `typeorm`’s `MockConnection`.

## Security & Vulnerabilities

- Any public facing change must be reviewed for security implications.
- Use the `--only=production` flag for dependencies that ship to production.

## Other Resources

- [OpenSpec](./openspec/AGENTS.md) – Spec‑driven development workflow.
- [Docker Docs](./docker/README.md) – Building and deploying.
- [Issue Template](./ISSUE_TEMPLATE.md) – Use the provided templates for consistent issue reporting.

Happy hacking!
