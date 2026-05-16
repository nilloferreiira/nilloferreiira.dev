# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build with Turbopack
pnpm lint         # Run ESLint
pnpm db:generate  # Generate Drizzle migrations from schema changes
pnpm db:migrate   # Apply pending migrations to the database
```

No test suite is configured.

## Architecture

This is a **Next.js 15 personal portfolio** with a private admin panel. The app is "use client" heavy — the root `page.tsx` is a client component that fetches data via React Query hooks.

### Key patterns

- **Data fetching**: All public data (projects, experiences) is fetched client-side via `useProjects` and `useExperiences` hooks (`src/hooks/`), which call the `/api/projects` and `/api/experiences` routes and cache results for 5 minutes.
- **Language switching**: A React context (`src/context/language-context.tsx`) provides `language: "en" | "pt-BR"` state. All user-facing content has `_en` / `_pt` variants in the DB and component props. The default language is `pt-BR`.
- **Database**: PostgreSQL via Drizzle ORM. Schema lives in `src/db/schema.ts`. The `db` singleton is in `src/lib/db.ts`. Run `db:generate` after schema changes, then `db:migrate`.
- **Auth**: Cookie-based session auth. Sign-in creates a DB session row (`sessions` table, 7-day expiry). The middleware (`src/middleware.ts`) runs on `/admin/:path*` — it calls `/api/session/validate` internally (needed because middleware runs on Edge and cannot import Drizzle directly).
- **Admin panel**: Protected under `src/app/(private)/admin/`. The route group `(private)` has no layout; protection is entirely handled by middleware. The admin page manages CRUD for projects and experiences via modals and `useMutation`.
- **Env validation**: `src/lib/env.ts` uses Zod to validate `DATABASE_URL` at startup. Add new env vars there.

### Route structure

| Route | Purpose |
|---|---|
| `/` | Public portfolio — header, experiences, projects |
| `/admin/login` | Login form, sets `session` cookie |
| `/admin` | CRUD dashboard for projects & experiences |
| `/api/projects` | GET (list), POST (create), PUT (update), DELETE |
| `/api/experiences` | GET (list), POST (create), PUT (update), DELETE |
| `/api/sign-in` | POST — authenticates and sets session cookie |
| `/api/sign-out` | GET — clears session cookie |
| `/api/session/validate` | GET — validates session from cookie (used by middleware) |

### Soft deletes

Projects and experiences have a `deletedAt` column. Filter by `deletedAt IS NULL` when querying — the API routes should already do this.

### Images

Remote images must match the `next.config.ts` `remotePatterns` allowlist (currently `github.com`). Add other hostnames there as needed.
