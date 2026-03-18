# Progress

## 2026-03-18
- Updated auth password hashing in `packages/auth/src/index.ts` to use `bcrypt-ts` (`hash`/`compare`) instead of local scrypt-based helpers.
- Added `bcrypt-ts` dependency in `packages/auth/package.json`.
- Verified no file-level TypeScript errors in `packages/auth/src/index.ts`.
- Note: workspace `packages/auth` typecheck still reports pre-existing DB query typing errors in `packages/db/src/queries/agent.ts` and `packages/db/src/queries/property.ts`.
- Fixed sign-in redirect loop where authenticated users were bounced from onboarding back to sign-in by aligning all session cookie reads/writes to `plotkeys.session_token` (`authSessionCookieName`) across dashboard middleware/session utilities, dashboard server actions, and API auth redirect resolution.
- Fixed NEXT_REDIRECT error in all dashboard server actions: moved `redirect()` calls outside `try/catch` blocks so Next.js redirect throws are no longer caught and re-thrown as error redirects.
