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

- **Data fetching**: Public data is fetched client-side via React Query hooks (`src/hooks/`) that cache for 5 minutes. Experiences use `useExperiences`. The public projects section uses `usePaginatedProjects` (infinite query, 15 per page, category/tag filters sent to the API); the admin uses `useProjects`, which fetches the full list.
- **Language switching**: A React context (`src/context/language-context.tsx`) provides `language: "en" | "pt-BR"` state. All user-facing content has `_en` / `_pt` variants in the DB and component props. The default language is `pt-BR`.
- **Database**: PostgreSQL via Drizzle ORM. Schema lives in `src/db/schema.ts`. The `db` singleton is in `src/lib/db.ts`. Run `db:generate` after schema changes, then `db:migrate`.
- **Auth**: Supabase Auth via `@supabase/ssr` (no local `sessions`/`users` tables — those were dropped in migration `0006`). `src/lib/supabase/server.ts` and `src/lib/supabase/middleware.ts` create Supabase server clients from `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; `src/app/api/sign-in/route.ts` and `src/app/api/sign-out/route.ts` call `supabase.auth` directly. The middleware (`src/middleware.ts`) calls `getSupabaseUser()` (`supabase.auth.getUser()`) directly — no `/api/session/validate` hop. It protects `/admin/:path*` (except `/admin/login`) and non-GET requests to `/api/projects` and `/api/experiences`.
- **Admin panel**: Protected under `src/app/(private)/admin/`. The route group `(private)` has no layout; protection is entirely handled by middleware. The admin page manages CRUD for projects and experiences via modals and `useMutation`.
- **Env validation**: `src/lib/env.ts` uses Zod to validate `DATABASE_URL` at startup. Add new env vars there.

### Route structure

| Route | Purpose |
|---|---|
| `/` | Public portfolio — header, experiences, projects |
| `/admin/login` | Login form, sets `session` cookie |
| `/admin` | CRUD dashboard for projects & experiences |
| `/api/projects` | GET (full list; or a page with `?limit=&offset=&category=&tags=`), POST (create), PUT (update), DELETE |
| `/api/experiences` | GET (list), POST (create), PUT (update), DELETE |
| `/api/profile-picture` | GET (public: photo shown in About), PUT `{ name }` (select a bucket image) |
| `/api/profile-picture/images` | GET (list the `profile_pictures` bucket), POST (upload JPG/PNG/WebP ≤ 5MB) |
| `/api/sign-in` | POST — authenticates and sets session cookie |
| `/api/sign-out` | GET — clears session cookie |
| `/api/session/validate` | GET — validates session from cookie (used by middleware) |

### Site settings & About photo

`site_settings` is a key/value table for admin-editable config. `about_photo` holds the **file name** of the About photo in the public Supabase Storage bucket `profile_pictures`; the URL is built with `getProfilePictureUrl` (`src/lib/profile-picture.ts`) and falls back to the GitHub avatar when unset. Listing/uploading the bucket needs storage policies for `authenticated` (SQL in `src/app/api/profile-picture/route.ts`).

### Soft deletes

Projects and experiences have a `deletedAt` column. Filter by `deletedAt IS NULL` when querying — the API routes should already do this.

### Images

Remote images must match the `next.config.ts` `remotePatterns` allowlist (currently `github.com`). Add other hostnames there as needed.
