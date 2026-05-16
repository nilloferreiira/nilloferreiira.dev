# CRISPY: Experience Responsibilities Section

## Objective

Enrich the experience cards on the public portfolio with a company name, bilingual role title, date range, location, a bullet-list responsibilities section, and tech-stack chips — matching the approved prototype design. The admin panel form must be updated to manage all new fields.

## Architecture / Stack

- **Drizzle ORM / PostgreSQL** — 8 new columns added to the `experiences` table; a generated migration file is committed as part of the schema PR
- **Next.js API Route** (`/api/experiences`) — POST and PUT handlers extended to accept and persist new fields
- **React / TanStack Query** — `Experience` type expanded; admin mutation and query cache updated automatically via existing `queryClient.setQueryData` pattern
- **Tailwind CSS / Framer Motion** — public `Experience` component redesigned; no new dependencies required

## PR Decomposition

### PR-1: Add new columns to experiences table schema

| Field | Value |
|---|---|
| Branch | `feature/experience-schema-columns` |
| Base | `develop` |
| Estimated size | ~60 lines |
| Depends on | none |

**Objective:** Extend the Drizzle schema with `company`, `start_year`, `end_year`, `location`, `responsibilities_en`, `responsibilities_pt`, and `stack` columns, and commit the generated SQL migration file.

**Scope:**
- Includes: `src/db/schema.ts` column additions; output of `pnpm db:generate` (migration SQL file)
- Excludes: any TypeScript type changes, API changes, or UI changes

**Commit sequence:**
1. `chore(db): add company, role dates, location, responsibilities, and stack columns to experiences`
2. `chore(db): generate migration for experiences schema additions`

**Blocking acceptance criteria:**
- [ ] `pnpm db:generate` produces a new migration file with all 8 new columns
- [ ] All new varchar/integer columns have safe `.default("")` / `null` defaults (no existing rows break)
- [ ] All new array columns use `.array().notNull().default([])`
- [ ] `pnpm build` passes with no TypeScript errors

---

### PR-2: Expand Experience type and update API route

| Field | Value |
|---|---|
| Branch | `feature/experience-api-new-fields` |
| Base | `develop` |
| Estimated size | ~70 lines |
| Depends on | PR-1 |

**Objective:** Update the `Experience` TypeScript type and extend the POST and PUT API handlers to read and persist all new fields.

**Scope:**
- Includes: `src/types/experience/experience.ts`; `src/app/api/experiences/route.ts` POST `.values()` and PUT `.set()` blocks
- Excludes: admin form UI, public-facing component, DB schema (already in PR-1)

**Commit sequence:**
1. `feat(types): expand Experience type with company, dates, location, responsibilities, and stack`
2. `feat(api/experiences): accept and persist new fields in POST and PUT handlers`

**Blocking acceptance criteria:**
- [ ] `pnpm build` passes — no TypeScript errors across all consumers of `Experience`
- [ ] GET response includes all new columns (verified manually via `/api/experiences`)
- [ ] POST with new fields returns the created record with all fields populated
- [ ] PUT with new fields updates only the targeted record

---

### PR-3: Update admin form for new experience fields

| Field | Value |
|---|---|
| Branch | `feature/experience-admin-form` |
| Base | `develop` |
| Estimated size | ~150 lines |
| Depends on | PR-2 |

**Objective:** Add form inputs for all new fields in the experience side panel and update the admin card preview to show company + role instead of the old title + description snippet.

**Scope:**
- Includes: `src/components/admin/experience-panel-content.tsx` (new inputs + `handleSubmit` parsing); `src/components/admin/admin-experience-card.tsx` (preview line change)
- Excludes: public-facing `Experience` component

**Commit sequence:**
1. `feat(admin): add company, dates, location, responsibilities, and stack fields to experience form`
2. `feat(admin): update experience card preview to show company and role`

**Form inputs added:**
- Company — `<input name="company" />`
- Start Year / End Year — `grid grid-cols-2` number inputs (end year empty = "Atual")
- Location — `<input name="location" />`
- Responsibilities (PT) — `<textarea name="responsibilities_pt" />` one per line
- Responsibilities (EN) — `<textarea name="responsibilities_en" />` one per line
- Stack — `<input name="stack" />` comma-separated (same UX as projects' Tags field)
- Role (PT) / Role (EN) labels renamed from "Title (PT/EN)"; `name` attributes unchanged

**`handleSubmit` parsing:**
- `responsibilities_*`: split on `"\n"`, trim, filter empty
- `stack`: split on `","`, trim, filter empty
- `start_year` / `end_year`: `Number(value) || null`

**Blocking acceptance criteria:**
- [ ] Creating a new experience with all fields saves correctly (verified via GET response)
- [ ] Editing an existing experience pre-fills all fields
- [ ] Saving with empty responsibilities/stack sends `[]`, not `[""]`
- [ ] `pnpm build` passes with no TypeScript errors
- [ ] `pnpm lint` passes with no warnings

---

### PR-4: Redesign public Experience component to match prototype

| Field | Value |
|---|---|
| Branch | `feature/experience-card-redesign` |
| Base | `develop` |
| Estimated size | ~180 lines |
| Depends on | PR-2 |

**Objective:** Redesign `experience.tsx` to render company name, role, date range, location, description, responsibilities bullet list, and stack chips — matching the approved prototype. Update `experiences-container.tsx` to pass all new props.

**Scope:**
- Includes: `src/components/experiences/experience.tsx` (full layout redesign); `src/components/experiences/experiences-container.tsx` (prop forwarding)
- Excludes: admin panel, API, DB

**Layout per card (prototype-matched):**
```
Company Name (h2, bold)               📅 2023 – Atual
Role Title (primary color, subtitle)  📍 Remoto

Description paragraph.

Responsabilidades
> Bullet one
> Bullet two

[Node.js]  [TypeScript]  [Docker]
```

**Commit sequence:**
1. `feat(experience): redesign card layout with company, role, dates, location, and stack chips`
2. `feat(experience): add responsibilities section with chevron bullet list`
3. `refactor(experiences-container): forward new Experience fields to card component`

**Implementation notes:**
- Icons: `CalendarDays` and `MapPin` from `lucide-react` (already installed)
- Date display: render only if `start_year` is set; `end_year ?? (language === "pt-BR" ? "Atual" : "Present")`
- Responsibilities header: `"Responsabilidades"` / `"Responsibilities"` based on language
- Chevron bullet: `ChevronRight` from lucide or a styled `>` `<span>`
- Stack chips: `border border-primary/40 text-primary text-xs rounded-full px-3 py-1`
- Guards: skip responsibilities section if array is empty; skip date/location row if `start_year` is null; skip stack row if array is empty
- `experiences-container.tsx`: spread all `Experience` fields into each `<Experience />` call (or pass the object and destructure inside)

**Blocking acceptance criteria:**
- [ ] Current role card renders company, role, date, location, description, responsibilities, and chips
- [ ] Previous experience cards render the same structure without the "Cargo Atual" badge
- [ ] Language toggle switches role and responsibilities; company and stack remain unchanged
- [ ] Cards with empty responsibilities or stack render without those sections (no blank space)
- [ ] `pnpm build` passes with no TypeScript errors
- [ ] Visual match to prototype verified in browser at `/`

---

## Execution Rules

1. **Gitflow**: all work branches off `develop`; only `develop` merges into `main` at release.
2. **Conventional Commits**: `feat`, `fix`, `test`, `chore`, `docs`, `refactor` — with scope. Vague messages ("WIP", "fix", "ajustes") are forbidden.
3. **TDD note**: this project has no configured test suite (`CLAUDE.md`: "No test suite is configured"). TypeScript strict checking and ESLint serve as the quality gate in place of unit tests. All acceptance criteria must be verified manually in the browser and via `pnpm build` + `pnpm lint`.
4. **Agent stop**: after opening each PR the agent stops and waits for explicit human approval before advancing to the next PR.
5. **Parallel execution**: PR-3 and PR-4 both depend only on PR-2 and share no state — they may be worked in parallel worktrees once PR-2 is merged.
6. **DB migration runtime**: `pnpm db:migrate` must be run against the target database after PR-1 is merged and before any API changes in PR-2 are deployed.
