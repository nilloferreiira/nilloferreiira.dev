export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
	PROFILE_PICTURES_BUCKET,
	PROFILE_PICTURE_MAX_SIZE,
	PROFILE_PICTURE_TYPES,
	getProfilePictureUrl
} from "@/lib/profile-picture"
import { getCachedAboutPhotoName } from "@/db/site-settings"

// Storage policies required for this route: see the comment in ../route.ts

// GET /api/profile-picture/images → every image in the bucket + the selected one (admin)
export async function GET() {
	try {
		const supabase = await createClient()
		const { data, error } = await supabase.storage
			.from(PROFILE_PICTURES_BUCKET)
			.list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } })
		if (error) throw error

		const images = (data ?? [])
			.filter((f) => f.id && f.name !== ".emptyFolderPlaceholder")
			.map((f) => ({
				name: f.name,
				url: getProfilePictureUrl(f.name),
				size: (f.metadata?.size as number | undefined) ?? null,
				createdAt: f.created_at ?? null
			}))

		const selected = await getCachedAboutPhotoName()
		return NextResponse.json({ ok: true, data: { images, selected } })
	} catch (err) {
		console.error("GET /api/profile-picture/images error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao listar imagens do bucket" }, { status: 500 })
	}
}

// POST /api/profile-picture/images (multipart "file") → upload a new image; does not select it (admin)
export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get("file")

		if (!(file instanceof File)) {
			return NextResponse.json({ ok: false, error: "Arquivo ausente" }, { status: 400 })
		}
		const ext = PROFILE_PICTURE_TYPES[file.type]
		if (!ext) {
			return NextResponse.json({ ok: false, error: "A imagem deve ser JPG, PNG ou WebP" }, { status: 400 })
		}
		if (file.size > PROFILE_PICTURE_MAX_SIZE) {
			return NextResponse.json({ ok: false, error: "Imagem maior que 5MB" }, { status: 400 })
		}

		// Unique, URL-safe name so uploads never overwrite each other
		const base =
			file.name
				.replace(/\.[^.]+$/, "")
				.normalize("NFD")
				.replace(/[̀-ͯ]/g, "")
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "")
				.slice(0, 60) || "photo"
		const name = `${Date.now()}-${base}.${ext}`

		const supabase = await createClient()
		const { error } = await supabase.storage.from(PROFILE_PICTURES_BUCKET).upload(name, file, {
			contentType: file.type,
			upsert: false,
			cacheControl: "31536000"
		})
		if (error) throw error

		return NextResponse.json({
			ok: true,
			data: { name, url: getProfilePictureUrl(name), size: file.size, createdAt: new Date().toISOString() }
		})
	} catch (err) {
		console.error("POST /api/profile-picture/images error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao enviar imagem" }, { status: 500 })
	}
}
