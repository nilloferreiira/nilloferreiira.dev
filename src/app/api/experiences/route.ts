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
