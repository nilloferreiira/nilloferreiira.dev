export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { unstable_cache, revalidateTag } from "next/cache"
import { projects as projectsSchema, projectStacks, stacks } from "@/db/schema"
import { db } from "@/lib/db"
import { syncProjectStackLinks, loadProjectStackRefs } from "@/db/stack-helpers"
import { isNull, eq, asc, inArray } from "drizzle-orm"
import { PROJECTS_CACHE_TAG } from "@/lib/cache-tags"
import { z } from "zod"

const MAX_PAGE_SIZE = 50

const pageQuerySchema = z.object({
	limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE),
	offset: z.coerce.number().int().min(0).default(0),
	category: z.enum(["personal", "freelance", "work", "evento"]).optional(),
	// comma-separated stack ids; a project must have all of them
	tags: z
		.string()
		.optional()
		.transform((v) => (v ? v.split(",").map(Number).filter(Number.isInteger) : []))
})

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

// GET /api/projects            → every project (used by the admin to reorder)
// GET /api/projects?limit=15&offset=0[&category=personal&tags=1,2]
//                               → one page + total + nextOffset + the tags used across all projects
export async function GET(request: NextRequest) {
	try {
		const projects = await getCachedProjects()
		const params = Object.fromEntries(request.nextUrl.searchParams)

		if (params.limit === undefined) return NextResponse.json({ ok: true, data: projects })

		const parsed = pageQuerySchema.safeParse(params)
		if (!parsed.success) {
			return NextResponse.json({ ok: false, error: "Parâmetros de paginação inválidos" }, { status: 400 })
		}
		const { limit, offset, category, tags } = parsed.data

		// Pages are sliced from the cached list, so paging never hits the DB again until the cache tag is revalidated
		const filtered = projects.filter(
			(p) =>
				(!category || p.category === category) && tags.every((id) => p.tags.some((tag) => tag.id === id))
		)
		const data = filtered.slice(offset, offset + limit)
		const nextOffset = offset + data.length < filtered.length ? offset + data.length : null
		const availableTags = Array.from(new Map(projects.flatMap((p) => p.tags).map((t) => [t.id, t])).values())

		return NextResponse.json({ ok: true, data, total: filtered.length, nextOffset, tags: availableTags })
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
