# Contributing

Thanks for contributing to QR Share.

This project is intentionally small. The main maintenance goal is to keep the product understandable, dependency-light, and easy to verify.

## Development Setup

```bash
npm ci
npm run dev
```

## Before Opening A Pull Request

Run the full local verification flow:

```bash
npm run format
npm run verify
npm run test:e2e
```

## Project Expectations

- Keep functions short and explicit.
- Prefer pure helpers in `src/lib`.
- Keep state local unless lifting it is clearly necessary.
- Do not add backend, analytics, accounts, or persistence features without discussion.
- Preserve accessibility and mobile usability.
- Prefer small focused components over broad abstractions.

## Scope Discipline

QR Share v1 is intentionally narrow.

Changes that are usually out of scope unless discussed first:

- general-purpose QR reader behavior
- file transfer
- encryption or secret-sharing workflows
- local database or background sync features
- UI framework additions

## Tests

- Unit tests should cover payload and encoding logic thoroughly.
- Component tests should cover user-facing state and error handling.
- Playwright tests should stay deterministic and CI-friendly.
- Camera tests should continue using mocks or adapter hooks, not real devices.

## Pull Request Notes

Helpful PRs usually include:

- a short problem statement
- the chosen approach
- screenshots for UI changes
- test coverage notes
- any behavior or accessibility tradeoffs

## Questions

If you want to expand the product scope, open an issue or draft PR first so the product direction stays coherent.
