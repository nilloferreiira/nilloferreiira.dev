export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { siteSettings } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { getCachedAboutPhotoName } from "@/db/site-settings"
import { PROFILE_PICTURE_CACHE_TAG } from "@/lib/cache-tags"
import {
	ABOUT_PHOTO_KEY,
	FALLBACK_PHOTO_URL,
	PROFILE_PICTURES_BUCKET,
	getProfilePictureUrl
} from "@/lib/profile-picture"

// Prerequisite (manual, run once in the Supabase SQL editor) — the bucket is public, so reading
// an image by URL works for everyone, but listing and uploading need these policies:
//   create policy "profile_pictures_authenticated_select" on storage.objects
//     for select to authenticated using (bucket_id = 'profile_pictures');
//   create policy "profile_pictures_authenticated_insert" on storage.objects
//     for insert to authenticated with check (bucket_id = 'profile_pictures');

const selectSchema = z.object({ name: z.string().min(1).max(512) })

// GET /api/profile-picture → photo shown in About (public)
export async function GET() {
	try {
		const name = await getCachedAboutPhotoName()
		const url = name ? getProfilePictureUrl(name) : FALLBACK_PHOTO_URL
		return NextResponse.json({ ok: true, data: { name, url } })
	} catch (err) {
		console.error("GET /api/profile-picture error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar foto de perfil" }, { status: 500 })
	}
}

// PUT /api/profile-picture { name } → select which bucket image appears in About (admin)
export async function PUT(request: NextRequest) {
	try {
		const parsed = selectSchema.safeParse(await request.json().catch(() => null))
		if (!parsed.success) return NextResponse.json({ ok: false, error: "Nome inválido" }, { status: 400 })
		const { name } = parsed.data

		const supabase = await createClient()
		const { data: files, error } = await supabase.storage.from(PROFILE_PICTURES_BUCKET).list("", { search: name })
		if (error) throw error
		if (!files?.some((f) => f.name === name)) {
			return NextResponse.json({ ok: false, error: "Imagem não encontrada no bucket" }, { status: 400 })
		}

		await db
			.insert(siteSettings)
			.values({ key: ABOUT_PHOTO_KEY, value: name })
			.onConflictDoUpdate({ target: siteSettings.key, set: { value: name, updatedAt: new Date() } })

		revalidateTag(PROFILE_PICTURE_CACHE_TAG)
		return NextResponse.json({ ok: true, data: { name, url: getProfilePictureUrl(name) } })
	} catch (err) {
		console.error("PUT /api/profile-picture error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao selecionar foto de perfil" }, { status: 500 })
	}
}
