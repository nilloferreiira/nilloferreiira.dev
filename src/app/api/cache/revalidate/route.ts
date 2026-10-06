export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { EXPERIENCES_CACHE_TAG, PROJECTS_CACHE_TAG } from "@/lib/cache-tags"

// CVs have no server-side cache tag: /api/cv reads Supabase Storage on every
// request, so "cv" only needs the client-side query invalidation.
const SCOPE_TAGS = {
	projects: [PROJECTS_CACHE_TAG],
	experiences: [EXPERIENCES_CACHE_TAG],
	cv: [],
	all: [PROJECTS_CACHE_TAG, EXPERIENCES_CACHE_TAG]
} as const

export type CacheScope = keyof typeof SCOPE_TAGS

export async function POST(request: NextRequest) {
	try {
		const { scope } = await request.json().catch(() => ({ scope: undefined }))

		if (typeof scope !== "string" || !(scope in SCOPE_TAGS)) {
			return NextResponse.json({ ok: false, error: "Escopo inválido" }, { status: 400 })
		}

		for (const tag of SCOPE_TAGS[scope as CacheScope]) revalidateTag(tag)

		return NextResponse.json({ ok: true, scope })
	} catch (err) {
		console.error("POST /api/cache/revalidate error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao invalidar cache" }, { status: 500 })
	}
}
