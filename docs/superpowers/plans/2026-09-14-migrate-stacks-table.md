# Normalize Project Tags & Experience Stack into a Shared `stacks` Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the free-text `projects.tags` / `experiences.stack` Postgres array columns with a shared `stacks` lookup table plus `project_stacks` / `experience_stacks` junction tables, migrating existing data with no duplicate `stacks` rows, and give the admin panel a case-insensitive autocomplete against existing stacks.

**Architecture:** Three sequential Drizzle migrations (create tables → hand-written data migration → drop old columns), a small write-layer helper for exact-trim find-or-create + relink, an explicit two-query-and-merge read layer (no Drizzle `relations()`, matching the codebase's existing plain-select convention), and a cutover of the two entity types (`Project`/`Experience`) from `string[]` to `{id,name}[]` (`StackRef[]`) that ripples through API routes, hooks, display components, and the admin `TagInput`.

**Tech Stack:** Next.js 15, Drizzle ORM 0.45.1 / drizzle-kit 0.31.8, `postgres` (postgres-js driver), PostgreSQL, TanStack React Query, pnpm.

**Spec:** No separate spec document — requirements were captured directly in conversation with the user (decisions locked in below) and validated against the live codebase via exploration. This plan is self-contained.

## Global Constraints

- **No automated tests** — explicit user instruction ("ignore the tests for now"). Verification at each task is `pnpm lint` / `pnpm build` (type + lint gate) plus manual SQL (psql or `drizzle-kit studio`) and dev-server click-through where noted. Do not add vitest/jest/pglite or any test files.
- **Dedup policy**: exact string match after `trim()` only, no case-folding, for both the one-time data migration and the ongoing write-time find-or-create. "React" and "react" remain separate `stacks` rows unless they were already written as the identical string.
- **Admin autocomplete**: suggestion matching against existing `stacks` is case-insensitive, but whatever string the user commits (click-selected or free-typed) is stored verbatim.
- **API contract**: GET `/api/projects` and GET `/api/experiences` return `tags` / `stack` as `{ id: number; name: string }[]`. POST/PUT bodies send `tags` / `stack` as `string[]` of names; the server resolves each to an existing `stacks` row or creates it.
- **One shared `stacks` table** — not two separate tables. `project_stacks` and `experience_stacks` both reference it.
- **Worktree**: all work happens in `.claude/worktrees/feat+migrate-stacks-table` on branch `feat/migrate-stacks-table`, created via the `superpowers:using-git-worktrees` skill before Task 1 begins.
- **Package manager**: pnpm exclusively (`pnpm dev`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm lint`, `pnpm build`).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/db/schema.ts` | Modify: add `stacks`, `projectStacks`, `experienceStacks` table defs; later remove `projects.tags` / `experiences.stack` fields. |
| `src/db/migrations/000X_add_stacks_tables.sql` | Create: drizzle-kit generated DDL for the three new tables + FKs. |
| `src/db/migrations/000X_populate_stacks_from_arrays.sql` | Create: hand-written data migration (distinct-trim dedup + junction population). |
| `src/db/migrations/000X_drop_tags_and_stack_arrays.sql` | Create: drizzle-kit generated `DROP COLUMN` DDL. |
| `src/db/stack-helpers.ts` | Create: shared exact-trim find-or-create + relink/read helpers used by both API routes. |
| `src/app/api/stacks/route.ts` | Create: `GET` returning all `stacks` rows, for the admin autocomplete. |
| `src/hooks/stacks/useStacks.ts` | Create: React Query hook wrapping `/api/stacks`. |
| `src/types/stack/stack.ts` | Create: shared `StackRef` type. |
| `src/types/project/project.ts` | Modify: `Project.tags: StackRef[]`; add `ProjectInput` write-shape type. |
| `src/types/experience/experience.ts` | Modify: `Experience.stack: StackRef[]`; add `ExperienceInput` write-shape type. |
| `src/app/api/projects/route.ts` | Modify: GET joins through `project_stacks`; POST/PUT run in a transaction using `stack-helpers.ts`. |
| `src/app/api/experiences/route.ts` | Modify: same pattern for `experience_stacks`. |
| `src/components/projects/project.tsx`, `project-modal.tsx` | Modify: render `tag.name`, key by `tag.id`. |
| `src/components/admin/admin-project-card.tsx` | Modify: same. |
| `src/components/experiences/experience.tsx` | Modify: render `tech.name`, key by `tech.id` (fixes today's unsafe raw-string key). |
| `src/components/projects/projects-container.tsx` | Modify: tag filter state/logic moves from strings to stack ids. |
| `src/components/admin/tag-input.tsx` | Modify: add case-insensitive suggestion dropdown; replace comma-joined hidden input with one hidden input per chip. |
| `src/components/admin/project-panel-content.tsx`, `experience-panel-content.tsx` | Modify: wire `useStacks()` into `TagInput`, build `ProjectInput`/`ExperienceInput` from `FormData.getAll(...)`. |

---

### Task 1: Schema — add `stacks`, `project_stacks`, `experience_stacks` tables

**Files:**
- Modify: `src/db/schema.ts`
- Create: `src/db/migrations/000X_add_stacks_tables.sql` (drizzle-kit generated, filename TBD by drizzle-kit)

**Interfaces:**
- Produces: `stacks` table (`id`, `name` unique, `createdAt`), `projectStacks` table (`id`, `projectId` FK→`projects.id` cascade, `stackId` FK→`stacks.id` cascade, unique `(projectId, stackId)`), `experienceStacks` table (`id`, `experienceId` FK→`experiences.id` cascade, `stackId` FK→`stacks.id` cascade, unique `(experienceId, stackId)`). `projects.tags` and `experiences.stack` are **untouched** in this task — they're dropped later in Task 4.

- [ ] **Step 1: Add the three new table definitions to `src/db/schema.ts`**

Append after the existing `experiences` table definition:

```ts
import { pgTable, text, varchar, timestamp, serial, integer, unique } from "drizzle-orm/pg-core"

// ...existing projects, experiences tables unchanged...

export const stacks = pgTable(
	"stacks",
	{
		id: serial("id").primaryKey(),
		name: varchar("name").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull()
	},
	(table) => [unique("stacks_name_unique").on(table.name)]
)

export const projectStacks = pgTable(
	"project_stacks",
	{
		id: serial("id").primaryKey(),
		projectId: integer("project_id")
			.notNull()
			.references(() => projects.id, { onDelete: "cascade" }),
		stackId: integer("stack_id")
			.notNull()
			.references(() => stacks.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull()
	},
	(table) => [unique("project_stacks_project_id_stack_id_unique").on(table.projectId, table.stackId)]
)

export const experienceStacks = pgTable(
	"experience_stacks",
	{
		id: serial("id").primaryKey(),
		experienceId: integer("experience_id")
			.notNull()
			.references(() => experiences.id, { onDelete: "cascade" }),
		stackId: integer("stack_id")
			.notNull()
			.references(() => stacks.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull()
	},
	(table) => [unique("experience_stacks_experience_id_stack_id_unique").on(table.experienceId, table.stackId)]
)
```

Note the `unique(...).on(...)` array-config form must match the drizzle-orm 0.45.1 API already used implicitly by this codebase's drizzle-kit version — if `pnpm db:generate` errors on this syntax, fall back to the object-callback form: `(table) => ({ nameUnique: unique("stacks_name_unique").on(table.name) })`.

- [ ] **Step 2: Generate migration A**

Run: `pnpm db:generate --name add_stacks_tables`

Expected: a new file `src/db/migrations/000X_add_stacks_tables.sql` (X follows the last existing migration, `0006`) containing three `CREATE TABLE` statements and four `ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY ... ON DELETE cascade` statements (two per junction table), separated by `--> statement-breakpoint`. Read the generated file and confirm it matches this shape before proceeding — do not hand-edit it if it matches.

- [ ] **Step 3: Apply the migration**

Run: `pnpm db:migrate`

Expected: no errors. Verify with `psql "$DATABASE_URL" -c "\dt"` (or `npx drizzle-kit studio --config ./src/db/drizzle.config.ts`) that `stacks`, `project_stacks`, `experience_stacks` now exist alongside `projects`/`experiences`.

- [ ] **Step 4: Type-check**

Run: `pnpm lint && pnpm build`
Expected: no errors (this task only adds new, unreferenced schema exports — nothing else changed yet).

- [ ] **Step 5: Commit**

```bash
git add src/db/schema.ts src/db/migrations/
git commit -m "feat: add stacks, project_stacks, experience_stacks tables"
```

---

### Task 2: Data migration — populate `stacks` and junction tables from existing arrays

**Files:**
- Create: `src/db/migrations/000X_populate_stacks_from_arrays.sql` (drizzle-kit `--custom` scaffold, hand-edited)

**Interfaces:**
- Consumes: `projects.tags` (`text[]`), `experiences.stack` (`text[]`) — both still present from Task 1.
- Produces: fully populated `stacks`, `project_stacks`, `experience_stacks` rows reflecting every distinct trimmed value in the source arrays, deduplicated exactly (case-sensitive) both within a single row's array and across the whole dataset.

- [ ] **Step 1: Scaffold the empty custom migration**

Run: `pnpm db:generate --custom --name populate_stacks_from_arrays`

Expected: an empty (or near-empty) `src/db/migrations/000X_populate_stacks_from_arrays.sql` file ready to hand-edit.

- [ ] **Step 2: Write the data migration SQL**

Replace the file's contents with:

```sql
-- 1. Populate `stacks` from distinct trimmed values across BOTH source
--    arrays. Exact string match after trim() only (no case-folding).
--    ON CONFLICT on the unique name constraint handles cross-table overlap
--    (e.g. "React" appearing in both projects.tags and experiences.stack).
INSERT INTO "stacks" ("name")
SELECT DISTINCT trim(tag) AS name
FROM "projects", unnest("tags") AS tag
WHERE trim(tag) <> ''
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint

INSERT INTO "stacks" ("name")
SELECT DISTINCT trim(tech) AS name
FROM "experiences", unnest("stack") AS tech
WHERE trim(tech) <> ''
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint

-- 2. Populate project_stacks. The outer DISTINCT collapses duplicate
--    values within a single project's own array (e.g. tags = '{React,React}').
INSERT INTO "project_stacks" ("project_id", "stack_id")
SELECT DISTINCT p."id", s."id"
FROM "projects" p, unnest(p."tags") AS tag
JOIN "stacks" s ON s."name" = trim(tag)
WHERE trim(tag) <> ''
ON CONFLICT ("project_id", "stack_id") DO NOTHING;
--> statement-breakpoint

-- 3. Populate experience_stacks, same pattern.
INSERT INTO "experience_stacks" ("experience_id", "stack_id")
SELECT DISTINCT e."id", s."id"
FROM "experiences" e, unnest(e."stack") AS tech
JOIN "stacks" s ON s."name" = trim(tech)
WHERE trim(tech) <> ''
ON CONFLICT ("experience_id", "stack_id") DO NOTHING;
```

- [ ] **Step 3: Apply the migration**

Run: `pnpm db:migrate`

Expected: no errors.

- [ ] **Step 4: Manually verify row-count reconciliation**

Run via `psql "$DATABASE_URL"` (or `npx drizzle-kit studio --config ./src/db/drizzle.config.ts`):

```sql
-- Should return two equal numbers:
SELECT COUNT(DISTINCT trim(v)) FROM (
  SELECT trim(tag) v FROM projects, unnest(tags) AS tag
  UNION
  SELECT trim(tech) FROM experiences, unnest(stack) AS tech
) x WHERE v <> '';

SELECT COUNT(*) FROM stacks;
```

Then eyeball per-row reconciliation:

```sql
SELECT p.id, p.tags, array_agg(s.name ORDER BY s.name) AS migrated
FROM projects p
LEFT JOIN project_stacks ps ON ps.project_id = p.id
LEFT JOIN stacks s ON s.id = ps.stack_id
GROUP BY p.id, p.tags ORDER BY p.id;

SELECT e.id, e.stack, array_agg(s.name ORDER BY s.name) AS migrated
FROM experiences e
LEFT JOIN experience_stacks es ON es.experience_id = e.id
LEFT JOIN stacks s ON s.id = es.stack_id
GROUP BY e.id, e.stack ORDER BY e.id;
```

Expected: for every row, `migrated` contains exactly the distinct trimmed values of the original array (order may differ, `array_agg` is sorted here for easy comparison). **Do not proceed to Task 4 (column drop) until this reconciles.**

- [ ] **Step 5: Commit**

```bash
git add src/db/migrations/
git commit -m "feat: migrate existing tags/stack array data into stacks tables"
```

---

### Task 3: Write-layer helper + read-only `/api/stacks` endpoint

**Files:**
- Create: `src/db/stack-helpers.ts`
- Create: `src/app/api/stacks/route.ts`
- Create: `src/types/stack/stack.ts`
- Create: `src/hooks/stacks/useStacks.ts`

**Interfaces:**
- Consumes: `stacks`, `projectStacks`, `experienceStacks` from `src/db/schema.ts` (Task 1); `db` singleton from `src/lib/db.ts`.
- Produces: `StackRef = { id: number; name: string }` (exported from `src/types/stack/stack.ts`); `syncProjectStackLinks(tx, projectId: number, names: string[]): Promise<void>`; `loadProjectStackRefs(dbOrTx, projectId: number): Promise<StackRef[]>`; `syncExperienceStackLinks(tx, experienceId: number, names: string[]): Promise<void>`; `loadExperienceStackRefs(dbOrTx, experienceId: number): Promise<StackRef[]>` — all from `src/db/stack-helpers.ts`. `useStacks(): UseQueryResult<StackRef[]>` from `src/hooks/stacks/useStacks.ts`. This task is purely additive — no existing file is modified, so the app continues to build and behave exactly as before.

- [ ] **Step 1: Create the shared `StackRef` type**

Create `src/types/stack/stack.ts`:

```ts
export type StackRef = {
	id: number
	name: string
}
```

- [ ] **Step 2: Create the write/read helper module**

Create `src/db/stack-helpers.ts`:

```ts
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { stacks, projectStacks, experienceStacks } from "@/db/schema"
import type { StackRef } from "@/types/stack/stack"

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
type Queryable = Tx | typeof db

async function upsertStackIds(tx: Tx, names: string[]): Promise<number[]> {
	const uniqueNames = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)))
	const ids: number[] = []
	for (const name of uniqueNames) {
		const [row] = await tx
			.insert(stacks)
			.values({ name })
			.onConflictDoUpdate({ target: stacks.name, set: { name } })
			.returning({ id: stacks.id })
		ids.push(row.id)
	}
	return ids
}

export async function syncProjectStackLinks(tx: Tx, projectId: number, names: string[]): Promise<void> {
	const stackIds = await upsertStackIds(tx, names)
	await tx.delete(projectStacks).where(eq(projectStacks.projectId, projectId))
	if (stackIds.length > 0) {
		await tx.insert(projectStacks).values(stackIds.map((stackId) => ({ projectId, stackId })))
	}
}

export async function loadProjectStackRefs(dbOrTx: Queryable, projectId: number): Promise<StackRef[]> {
	return dbOrTx
		.select({ id: stacks.id, name: stacks.name })
		.from(projectStacks)
		.innerJoin(stacks, eq(projectStacks.stackId, stacks.id))
		.where(eq(projectStacks.projectId, projectId))
}

export async function syncExperienceStackLinks(tx: Tx, experienceId: number, names: string[]): Promise<void> {
	const stackIds = await upsertStackIds(tx, names)
	await tx.delete(experienceStacks).where(eq(experienceStacks.experienceId, experienceId))
	if (stackIds.length > 0) {
		await tx.insert(experienceStacks).values(stackIds.map((stackId) => ({ experienceId, stackId })))
	}
}

export async function loadExperienceStackRefs(dbOrTx: Queryable, experienceId: number): Promise<StackRef[]> {
	return dbOrTx
		.select({ id: stacks.id, name: stacks.name })
		.from(experienceStacks)
		.innerJoin(stacks, eq(experienceStacks.stackId, stacks.id))
		.where(eq(experienceStacks.experienceId, experienceId))
}
```

`onConflictDoUpdate` (not `onConflictDoNothing`) is required: the `postgres-js` driver returns no row from `.returning()` when `DO NOTHING` hits a conflict, which would break find-or-create inside the loop. The no-op `set: { name }` forces Postgres to always return a row via `RETURNING`, whether inserted or pre-existing.

- [ ] **Step 3: Create the `/api/stacks` GET route**

Create `src/app/api/stacks/route.ts`:

```ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { stacks as stacksSchema } from "@/db/schema"
import { db } from "@/lib/db"
import { asc } from "drizzle-orm"

export async function GET() {
	try {
		const rows = await db.select().from(stacksSchema).orderBy(asc(stacksSchema.name))
		return NextResponse.json({ ok: true, data: rows })
	} catch (err) {
		console.error("GET /api/stacks error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar stacks" }, { status: 500 })
	}
}
```

No `unstable_cache` wrapper — this is a low-traffic, admin-only lookup list; caching it would require wiring a new invalidation tag into every project/experience write path for little benefit.

- [ ] **Step 4: Create the `useStacks` hook**

Create `src/hooks/stacks/useStacks.ts`:

```ts
import type { StackRef } from "@/types/stack/stack"
import { useQuery } from "@tanstack/react-query"

async function fetchStacks(): Promise<StackRef[]> {
	const res = await fetch("/api/stacks")
	if (!res.ok) throw new Error("Erro ao buscar stacks")
	const json = await res.json()
	return json.data as StackRef[]
}

export function useStacks() {
	return useQuery<StackRef[]>({
		queryKey: ["stacks"],
		queryFn: fetchStacks,
		staleTime: 1000 * 60 * 5
	})
}
```

- [ ] **Step 5: Type-check and manually verify the new endpoint**

Run: `pnpm lint && pnpm build`
Expected: no errors.

Run: `pnpm dev`, then in another terminal `curl http://localhost:3000/api/stacks | jq`
Expected: `{"ok":true,"data":[{"id":1,"name":"..."},...]}` listing every `stacks` row created in Task 2, sorted by name.

- [ ] **Step 6: Commit**

```bash
git add src/db/stack-helpers.ts src/app/api/stacks/ src/types/stack/ src/hooks/stacks/
git commit -m "feat: add stack sync helpers and /api/stacks endpoint"
```

---

### Task 4: Cutover — drop old columns, rewire API routes and entity types

**Files:**
- Modify: `src/db/schema.ts` (remove `tags` from `projects`, `stack` from `experiences`)
- Create: `src/db/migrations/000X_drop_tags_and_stack_arrays.sql`
- Modify: `src/types/stack/stack.ts` is already correct from Task 3 (no change)
- Modify: `src/types/project/project.ts`
- Modify: `src/types/experience/experience.ts`
- Modify: `src/app/api/projects/route.ts`
- Modify: `src/app/api/experiences/route.ts`

**Interfaces:**
- Consumes: `syncProjectStackLinks`, `loadProjectStackRefs`, `syncExperienceStackLinks`, `loadExperienceStackRefs` from Task 3; `StackRef` from Task 3.
- Produces: `Project.tags: StackRef[]`, `Experience.stack: StackRef[]` (entity/read shape); `ProjectInput` (write shape, `tags: string[]`), `ExperienceInput` (write shape, `stack: string[]`). GET/POST/PUT on both routes now speak these shapes. **This task intentionally lands as one commit** — splitting schema/types/routes into separate commits would leave the build broken in between, since these three pieces change the same contract together.

- [ ] **Step 1: Remove the old array columns from the schema**

In `src/db/schema.ts`, delete this line from `projects`:
```ts
	tags: text("tags").array().notNull().default([]),
```
and this line from `experiences`:
```ts
	stack: text("stack").array().notNull().default([]),
```
(`responsibilities_en`/`responsibilities_pt` stay untouched — out of scope.)

- [ ] **Step 2: Generate and apply the drop-column migration**

Run: `pnpm db:generate --name drop_tags_and_stack_arrays`

Expected: `src/db/migrations/000X_drop_tags_and_stack_arrays.sql` containing:
```sql
ALTER TABLE "projects" DROP COLUMN "tags";
--> statement-breakpoint
ALTER TABLE "experiences" DROP COLUMN "stack";
```

Run: `pnpm db:migrate`
Expected: no errors. **Only run this if Task 2's reconciliation check passed** — this is destructive.

- [ ] **Step 3: Update the `Project`/`ProjectInput` types**

Replace `src/types/project/project.ts` with:

```ts
import type { StackRef } from "@/types/stack/stack"

export type Project = {
	id: number
	title: string
	description_en: string
	description_pt: string
	imgSrc: string
	url: string
	category: "personal" | "freelance" | "work" | "evento"
	tags: StackRef[]
}

export type ProjectInput = {
	id: number
	title: string
	description_en: string
	description_pt: string
	imgSrc: string
	url: string
	category: Project["category"]
	tags: string[]
}
```

- [ ] **Step 4: Update the `Experience`/`ExperienceInput` types**

Replace `src/types/experience/experience.ts` with:

```ts
import type { StackRef } from "@/types/stack/stack"

export type Experience = {
	id: number
	title_en: string
	title_pt: string
	description_en: string
	description_pt: string
	company: string
	start_year: number | null
	end_year: number | null
	location: string
	responsibilities_en: string[]
	responsibilities_pt: string[]
	stack: StackRef[]
}

export type ExperienceInput = {
	id: number
	title_en: string
	title_pt: string
	description_en: string
	description_pt: string
	company: string
	start_year: number | null
	end_year: number | null
	location: string
	responsibilities_en: string[]
	responsibilities_pt: string[]
	stack: string[]
}
```

- [ ] **Step 5: Rewrite `src/app/api/projects/route.ts`**

Replace the full file with:

```ts
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { unstable_cache, revalidateTag } from "next/cache"
import { projects as projectsSchema, projectStacks, stacks } from "@/db/schema"
import { db } from "@/lib/db"
import { syncProjectStackLinks, loadProjectStackRefs } from "@/db/stack-helpers"
import { isNull, eq, asc, inArray } from "drizzle-orm"
import { PROJECTS_CACHE_TAG } from "@/lib/cache-tags"

const getCachedProjects = unstable_cache(
	async () => {
		const rows = await db
			.select()
			.from(projectsSchema)
			.where(isNull(projectsSchema.deletedAt))
			.orderBy(asc(projectsSchema.position))

		if (rows.length === 0) return []

		const links = await db
			.select({ projectId: projectStacks.projectId, id: stacks.id, name: stacks.name })
			.from(projectStacks)
			.innerJoin(stacks, eq(projectStacks.stackId, stacks.id))
			.where(
				inArray(
					projectStacks.projectId,
					rows.map((r) => r.id)
				)
			)

		const tagsByProject = new Map<number, { id: number; name: string }[]>()
		for (const link of links) {
			const list = tagsByProject.get(link.projectId) ?? []
			list.push({ id: link.id, name: link.name })
			tagsByProject.set(link.projectId, list)
		}

		return rows.map((row) => ({ ...row, tags: tagsByProject.get(row.id) ?? [] }))
	},
	["projects"],
	{ tags: [PROJECTS_CACHE_TAG], revalidate: false }
)

export async function GET() {
	try {
		const projects = await getCachedProjects()
		return NextResponse.json({ ok: true, data: projects })
	} catch (err) {
		console.error("GET /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar projetos" }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const result = await db.transaction(async (tx) => {
			const [created] = await tx
				.insert(projectsSchema)
				.values({
					title: body.title,
					description_en: body.description_en,
					description_pt: body.description_pt,
					imgSrc: body.imgSrc,
					url: body.url,
					category: body.category ?? "personal"
				})
				.returning()

			await syncProjectStackLinks(tx, created.id, body.tags ?? [])
			const tags = await loadProjectStackRefs(tx, created.id)
			return { ...created, tags }
		})

		revalidateTag(PROJECTS_CACHE_TAG)
		return NextResponse.json({ ok: true, data: [result] })
	} catch (err) {
		console.error("POST /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao criar projeto" }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		if (!body?.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const result = await db.transaction(async (tx) => {
			const [updated] = await tx
				.update(projectsSchema)
				.set({
					title: body.title,
					description_en: body.description_en,
					description_pt: body.description_pt,
					imgSrc: body.imgSrc,
					url: body.url,
					category: body.category ?? "personal"
				})
				.where(eq(projectsSchema.id, body.id))
				.returning()

			await syncProjectStackLinks(tx, updated.id, body.tags ?? [])
			const tags = await loadProjectStackRefs(tx, updated.id)
			return { ...updated, tags }
		})

		revalidateTag(PROJECTS_CACHE_TAG)
		return NextResponse.json({ ok: true, data: [result] })
	} catch (err) {
		console.error("PUT /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao atualizar projeto" }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const id = body?.id
		if (!id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const deleted = await db.update(projectsSchema).set({ deletedAt: new Date() }).where(eq(projectsSchema.id, id))

		revalidateTag(PROJECTS_CACHE_TAG)
		return NextResponse.json({ ok: true, data: deleted })
	} catch (err) {
		console.error("DELETE /api/projects error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao deletar projeto" }, { status: 500 })
	}
}
```

- [ ] **Step 6: Rewrite `src/app/api/experiences/route.ts`**

Replace the full file with:

```ts
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { unstable_cache, revalidateTag } from "next/cache"
import { experiences as experiencesSchema, experienceStacks, stacks } from "@/db/schema"
import { db } from "@/lib/db"
import { syncExperienceStackLinks, loadExperienceStackRefs } from "@/db/stack-helpers"
import { asc, isNull, eq, inArray } from "drizzle-orm"
import { EXPERIENCES_CACHE_TAG } from "@/lib/cache-tags"

const getCachedExperiences = unstable_cache(
	async () => {
		const rows = await db
			.select()
			.from(experiencesSchema)
			.where(isNull(experiencesSchema.deletedAt))
			.orderBy(asc(experiencesSchema.position))

		if (rows.length === 0) return []

		const links = await db
			.select({ experienceId: experienceStacks.experienceId, id: stacks.id, name: stacks.name })
			.from(experienceStacks)
			.innerJoin(stacks, eq(experienceStacks.stackId, stacks.id))
			.where(
				inArray(
					experienceStacks.experienceId,
					rows.map((r) => r.id)
				)
			)

		const stackByExperience = new Map<number, { id: number; name: string }[]>()
		for (const link of links) {
			const list = stackByExperience.get(link.experienceId) ?? []
			list.push({ id: link.id, name: link.name })
			stackByExperience.set(link.experienceId, list)
		}

		return rows.map((row) => ({ ...row, stack: stackByExperience.get(row.id) ?? [] }))
	},
	["experiences"],
	{ tags: [EXPERIENCES_CACHE_TAG], revalidate: false }
)

export async function GET() {
	try {
		const experiences = await getCachedExperiences()
		return NextResponse.json({ ok: true, data: experiences })
	} catch (err) {
		console.error("GET /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar experiências" }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const result = await db.transaction(async (tx) => {
			const [created] = await tx
				.insert(experiencesSchema)
				.values({
					title_pt: body.title_pt,
					title_en: body.title_en,
					description_en: body.description_en,
					description_pt: body.description_pt,
					company: body.company ?? "",
					start_year: body.start_year ?? null,
					end_year: body.end_year ?? null,
					location: body.location ?? "",
					responsibilities_en: body.responsibilities_en ?? [],
					responsibilities_pt: body.responsibilities_pt ?? []
				})
				.returning()

			await syncExperienceStackLinks(tx, created.id, body.stack ?? [])
			const stack = await loadExperienceStackRefs(tx, created.id)
			return { ...created, stack }
		})

		revalidateTag(EXPERIENCES_CACHE_TAG)
		return NextResponse.json({ ok: true, data: [result] })
	} catch (err) {
		console.error("POST /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao criar experiência" }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		if (!body?.id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const result = await db.transaction(async (tx) => {
			const [updated] = await tx
				.update(experiencesSchema)
				.set({
					title_pt: body.title_pt,
					title_en: body.title_en,
					description_en: body.description_en,
					description_pt: body.description_pt,
					company: body.company ?? "",
					start_year: body.start_year ?? null,
					end_year: body.end_year ?? null,
					location: body.location ?? "",
					responsibilities_en: body.responsibilities_en ?? [],
					responsibilities_pt: body.responsibilities_pt ?? []
				})
				.where(eq(experiencesSchema.id, body.id))
				.returning()

			await syncExperienceStackLinks(tx, updated.id, body.stack ?? [])
			const stack = await loadExperienceStackRefs(tx, updated.id)
			return { ...updated, stack }
		})

		revalidateTag(EXPERIENCES_CACHE_TAG)
		return NextResponse.json({ ok: true, data: [result] })
	} catch (err) {
		console.error("PUT /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao atualizar experiência" }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}))
		const id = body?.id
		if (!id) return NextResponse.json({ ok: false, error: "ID ausente" }, { status: 400 })

		const deleted = await db
			.update(experiencesSchema)
			.set({ deletedAt: new Date() })
			.where(eq(experiencesSchema.id, id))

		revalidateTag(EXPERIENCES_CACHE_TAG)
		return NextResponse.json({ ok: true, data: deleted })
	} catch (err) {
		console.error("DELETE /api/experiences error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao deletar experiência" }, { status: 500 })
	}
}
```

- [ ] **Step 7: Verify via curl (frontend still broken until Task 5/6 — that's expected)**

Run: `pnpm dev`, then:
```bash
curl -s http://localhost:3000/api/projects | jq '.data[0].tags'
curl -s http://localhost:3000/api/experiences | jq '.data[0].stack'
```
Expected: arrays of `{"id":N,"name":"..."}` objects, not plain strings. `pnpm lint`/`pnpm build` will still show errors in the frontend files touched by Tasks 5-6 — that's expected at this checkpoint; do not commit until those are fixed. Proceed directly to Task 5 before committing this task's work (or commit here with a WIP note and amend — but per repo convention, prefer finishing Tasks 4-6 as one logical unit before the final commit of this cutover; see note below).

**Note on commit boundary**: because `Project`/`Experience` type changes ripple into every frontend consumer, this task's changes will not produce a clean `pnpm build` until Tasks 5 and 6 are also applied. Do not commit Task 4 in isolation — carry the uncommitted changes forward and make the first commit after Task 6's build passes. (If using subagent-driven-development, flag this dependency explicitly so the reviewer doesn't gate Task 4 on a green build in isolation.)

---

### Task 5: Update display components and the project tag filter

**Files:**
- Modify: `src/components/projects/project.tsx`
- Modify: `src/components/projects/project-modal.tsx`
- Modify: `src/components/admin/admin-project-card.tsx`
- Modify: `src/components/experiences/experience.tsx`
- Modify: `src/components/projects/projects-container.tsx`

**Interfaces:**
- Consumes: `Project.tags: StackRef[]`, `Experience.stack: StackRef[]` from Task 4.
- Produces: no new exports — these are leaf UI components; their prop types now flow from the updated `Project`/`Experience` types automatically via `useProjects()`/`useExperiences()`.

- [ ] **Step 1: Update `src/components/projects/project.tsx`**

Find:
```tsx
{project.tags.length > 0 && (
  <div className="flex flex-wrap gap-1.5">
    {project.tags.map((tag, index) => (
      <span key={`${tag}-${index}`} className="... font-mono">{tag}</span>
    ))}
  </div>
)}
```
Replace the `.map` line and key with:
```tsx
{project.tags.map((tag) => (
  <span key={tag.id} className="... font-mono">{tag.name}</span>
))}
```
(Keep the surrounding `length > 0` guard and className exactly as they are today — only the `.map` callback and key change.)

- [ ] **Step 2: Update `src/components/projects/project-modal.tsx`**

Apply the identical change as Step 1 to its own copy of the tag-pill rendering block.

- [ ] **Step 3: Update `src/components/admin/admin-project-card.tsx`**

Find:
```tsx
{project.tags.map((tag, i) => (
  <span key={`${tag}-${i}`} className="text-xs bg-white/8 text-white/50 px-1.5 py-0.5 rounded">{tag}</span>
))}
```
Replace with:
```tsx
{project.tags.map((tag) => (
  <span key={tag.id} className="text-xs bg-white/8 text-white/50 px-1.5 py-0.5 rounded">{tag.name}</span>
))}
```

- [ ] **Step 4: Update `src/components/experiences/experience.tsx`**

Find:
```tsx
{stack.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {stack.map((tech) => (
      <span key={tech} className="border border-primary/40 text-primary text-xs rounded-full px-3 py-1">{tech}</span>
    ))}
  </div>
)}
```
Replace with:
```tsx
{stack.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {stack.map((tech) => (
      <span key={tech.id} className="border border-primary/40 text-primary text-xs rounded-full px-3 py-1">{tech.name}</span>
    ))}
  </div>
)}
```
Also update the component's prop type declaration for `stack` from `string[]` to `StackRef[]` (import `StackRef` from `@/types/stack/stack`).

- [ ] **Step 5: Update `src/components/projects/projects-container.tsx` filter logic**

Find:
```tsx
const allTags = Array.from(new Set((projects ?? []).flatMap((p) => p.tags)))
```
and the surrounding `activeTags`/`toggleTag`/`tagMatch` logic. Replace with:
```tsx
const allTags = Array.from(
  new Map((projects ?? []).flatMap((p) => p.tags).map((t) => [t.id, t])).values()
)
```
Change the state declaration:
```tsx
const [activeTagIds, setActiveTagIds] = useState<number[]>([])
```
Change the filter predicate:
```tsx
const tagMatch = activeTagIds.length === 0 || activeTagIds.every((id) => p.tags.some((t) => t.id === id))
```
Change the toggle function:
```tsx
function toggleTag(id: number) {
  setActiveTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
}
```
Update the tag-pill rendering block to iterate `allTags` (now `StackRef[]`), calling `toggleTag(tag.id)` on click, checking `isActive = activeTagIds.includes(tag.id)`, and rendering `tag.name` as the label. Keep everything else (className, layout) exactly as it is today.

- [ ] **Step 6: Type-check**

Run: `pnpm lint && pnpm build`
Expected: no errors — this is the checkpoint where the build should go green again after Task 4's transient breakage, **assuming Task 6 (admin panel) is also applied**, since `project-panel-content.tsx`/`experience-panel-content.tsx` still reference the old `TagInput` contract until Task 6. If Task 6 hasn't been done yet, expect remaining errors scoped to `src/components/admin/project-panel-content.tsx` and `experience-panel-content.tsx` only — proceed to Task 6 before the final commit.

- [ ] **Step 7: Manual verification (public page)**

Run: `pnpm dev`, open `http://localhost:3000`.
Expected: project cards show tag chips with correct labels; the tag filter row renders and toggling a pill filters the visible projects correctly; experience section shows stack chips; no "duplicate key" React warnings in the browser console.

- [ ] **Step 8: Commit (after Task 6 is also complete — see cutover note in Task 4)**

```bash
git add src/db/schema.ts src/db/migrations/ src/types/ src/app/api/projects/route.ts src/app/api/experiences/route.ts \
  src/components/projects/project.tsx src/components/projects/project-modal.tsx src/components/admin/admin-project-card.tsx \
  src/components/experiences/experience.tsx src/components/projects/projects-container.tsx
git commit -m "feat: cutover projects/experiences API and display components to normalized stacks"
```

---

### Task 6: Redesign `TagInput` with case-insensitive autocomplete and wire up admin panels

**Files:**
- Modify: `src/components/admin/tag-input.tsx`
- Modify: `src/components/admin/project-panel-content.tsx`
- Modify: `src/components/admin/experience-panel-content.tsx`

**Interfaces:**
- Consumes: `useStacks()` from Task 3; `StackRef` from Task 3; `ProjectInput`/`ExperienceInput` from Task 4.
- Produces: `TagInput` now takes `suggestions: StackRef[]` and `defaultValue?: StackRef[]`; consumers parse submitted values via `form.getAll(name)` instead of splitting a comma-joined string.

- [ ] **Step 1: Rewrite `src/components/admin/tag-input.tsx`**

Replace the full file with:

```tsx
"use client"

import type { StackRef } from "@/types/stack/stack"
import { X } from "lucide-react"
import { useState } from "react"

interface TagInputProps {
	name: string
	defaultValue?: StackRef[]
	suggestions: StackRef[]
	placeholder?: string
}

export function TagInput({ name, defaultValue = [], suggestions, placeholder }: TagInputProps) {
	const [chips, setChips] = useState<string[]>(defaultValue.map((s) => s.name))
	const [draft, setDraft] = useState("")
	const [showSuggestions, setShowSuggestions] = useState(false)

	const filteredSuggestions = suggestions.filter(
		(s) => draft.trim().length > 0 && s.name.toLowerCase().includes(draft.trim().toLowerCase()) && !chips.includes(s.name)
	)

	function addChip(value: string) {
		const val = value.trim()
		if (!val || chips.includes(val)) return
		setChips((c) => [...c, val])
		setDraft("")
		setShowSuggestions(false)
	}

	function removeChip(idx: number) {
		setChips((c) => c.filter((_, i) => i !== idx))
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault()
			addChip(draft)
		}
	}

	return (
		<div className="relative">
			<div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 min-h-[52px] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition">
				{chips.map((chip, i) => (
					<span
						key={`${chip}-${i}`}
						className="flex items-center gap-1.5 bg-[#232c44] text-[#c3cadd] text-sm pl-3 pr-1.5 py-1 rounded-md"
					>
						{chip}
						<button
							type="button"
							onClick={() => removeChip(i)}
							className="text-white/40 hover:text-white transition px-1"
						>
							<X size={13} />
						</button>
					</span>
				))}
				<input
					value={draft}
					onChange={(e) => {
						setDraft(e.target.value)
						setShowSuggestions(true)
					}}
					onKeyDown={onKeyDown}
					onBlur={() => setTimeout(() => addChip(draft), 100)}
					onFocus={() => setShowSuggestions(true)}
					placeholder={placeholder}
					className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20 px-1 py-1"
				/>
				{chips.map((chip, i) => (
					<input key={`hidden-${chip}-${i}`} type="hidden" name={name} value={chip} />
				))}
			</div>
			{showSuggestions && filteredSuggestions.length > 0 && (
				<div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg bg-[#1a2033] border border-white/10 shadow-lg">
					{filteredSuggestions.map((s) => (
						<button
							key={s.id}
							type="button"
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => addChip(s.name)}
							className="block w-full text-left px-3 py-2 text-sm text-[#c3cadd] hover:bg-white/10 transition"
						>
							{s.name}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
```

Key changes from the original: the `onBlur` uses a short `setTimeout` so a suggestion-button click (which also blurs the text input) has time to fire its own `onClick` first (`onMouseDown` with `preventDefault` on the suggestion button additionally prevents the blur from stealing focus before the click registers — both mechanisms together avoid the classic "blur closes the dropdown before click fires" bug). Serialization changed from a single comma-joined hidden input to **one hidden `<input type="hidden">` per chip, all sharing the same `name`** — this is read back via `FormData.getAll(name)`, which safely handles chip values containing a literal comma (the old `join(",")`/`split(",")` approach did not).

- [ ] **Step 2: Wire `TagInput` into `src/components/admin/project-panel-content.tsx`**

Add the import and hook call:
```tsx
import { useStacks } from "@/hooks/stacks/useStacks"
// inside the component:
const { data: stacks = [] } = useStacks()
```
Update the `<TagInput>` usage:
```tsx
<TagInput name="tags" defaultValue={project?.tags ?? []} suggestions={stacks} placeholder="add tag, press enter" />
```
Update the submit handler's tag parsing from:
```tsx
tags: String(form.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean)
```
to:
```tsx
tags: form.getAll("tags").map((t) => String(t).trim()).filter(Boolean)
```
Update the `useMutation` generic and the object built from `FormData` to produce a `ProjectInput` (import `ProjectInput` from `@/types/project/project`) instead of `Project` — the rest of the submitted fields (`title`, `description_en`, etc.) are unchanged, only the `tags` field's source/type differs.

- [ ] **Step 3: Wire `TagInput` into `src/components/admin/experience-panel-content.tsx`**

Apply the identical pattern from Step 2, using `experience?.stack ?? []` as `defaultValue`, `name="stack"`, and building an `ExperienceInput` (import from `@/types/experience/experience`) with:
```tsx
stack: form.getAll("stack").map((s) => String(s).trim()).filter(Boolean)
```

- [ ] **Step 4: Type-check**

Run: `pnpm lint && pnpm build`
Expected: no errors. This is the final green-build checkpoint for the whole cutover (Tasks 4-6 combined).

- [ ] **Step 5: Manual end-to-end verification**

Run: `pnpm dev`, log into `/admin/login`, go to `/admin`.

- Open the create-project panel, type a few characters matching an existing stack (e.g. type "reac" if "React" exists) — expect a case-insensitive suggestion dropdown to show "React"; click it — expect a chip to appear.
- Type a brand-new value not in `suggestions`, press Enter — expect a new chip to appear.
- Type a value containing a literal comma (e.g. `"Node, Express"` as one single tag) — expect it to survive as one chip, not split into two, both before and after saving.
- Save the project, reload the page — expect the saved tags to persist correctly, including the comma-containing one.
- Edit the same project: remove one chip, add a different one, save, reload — expect the change persisted (old tag gone, new tag present) and check via `psql`/`drizzle-kit studio` that `project_stacks` row count for that project matches its current chip count exactly (no leftover rows from the replace).
- Repeat the same flow for an experience's Stack field.
- On the public page, confirm the tag filter and chips still render correctly after these edits.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/tag-input.tsx src/components/admin/project-panel-content.tsx src/components/admin/experience-panel-content.tsx
git commit -m "feat: add case-insensitive stack autocomplete to admin panel"
```

At this point, also make the deferred commit from Task 5 (Step 8) if it wasn't made yet, since Task 6 is what finally makes that build green.

---

## Self-Review Notes

- **Spec coverage**: create `stacks` table ✅ (Task 1), create `project_stacks`/`experience_stacks` ✅ (Task 1), drop `projects.tags`/`experiences.stack` ✅ (Task 4), migrate data without duplicates ✅ (Task 2, exact-trim dedup + unique constraints), new worktree ✅ (Global Constraints — created via `using-git-worktrees` before Task 1), no automated tests ✅ (Global Constraints, no test files anywhere in this plan).
- **Type consistency checked**: `StackRef` (Task 3) used identically in `stack-helpers.ts`, `project.ts`, `experience.ts`, `tag-input.tsx`. `syncProjectStackLinks`/`loadProjectStackRefs`/`syncExperienceStackLinks`/`loadExperienceStackRefs` names match between their Task 3 definition and Task 4 usage in the route files. `ProjectInput`/`ExperienceInput` names match between Task 4 (definition) and Task 6 (usage).
- **No placeholders**: every step has literal code, not a description of code.
