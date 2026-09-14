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
