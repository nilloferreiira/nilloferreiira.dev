export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { CvLanguage } from "@/lib/cv"

// Prerequisite (manual, run once in the Supabase SQL editor):
//   insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true);
//   create policy "resumes_authenticated_insert" on storage.objects
//     for insert to authenticated with check (bucket_id = 'resumes');
//   create policy "resumes_authenticated_select" on storage.objects
//     for select to authenticated using (bucket_id = 'resumes');
//   create policy "resumes_authenticated_update" on storage.objects
//     for update to authenticated using (bucket_id = 'resumes') with check (bucket_id = 'resumes');

const MAX_FILE_SIZE = 5 * 1024 * 1024
const CV_LANGUAGES: CvLanguage[] = ["en", "pt"]

export async function GET() {
	try {
		const supabase = await createClient()
		const { data, error } = await supabase.storage.from("resumes").list()
		if (error) throw error

		const files = CV_LANGUAGES.map((language) => {
			const file = data?.find((f) => f.name === `${language}.pdf`)
			return {
				language,
				updatedAt: file?.updated_at ?? null,
				size: file?.metadata?.size ?? null
			}
		})

		return NextResponse.json({ ok: true, data: files })
	} catch (err) {
		console.error("GET /api/cv error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao buscar currículos" }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const language = formData.get("language")
		const file = formData.get("file")

		if (typeof language !== "string" || !CV_LANGUAGES.includes(language as CvLanguage)) {
			return NextResponse.json({ ok: false, error: "Idioma inválido" }, { status: 400 })
		}
		if (!(file instanceof File)) {
			return NextResponse.json({ ok: false, error: "Arquivo ausente" }, { status: 400 })
		}
		if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
			return NextResponse.json({ ok: false, error: "O arquivo deve ser um PDF" }, { status: 400 })
		}
		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json({ ok: false, error: "Arquivo maior que 5MB" }, { status: 400 })
		}

		const supabase = await createClient()
		const { error } = await supabase.storage.from("resumes").upload(`${language}.pdf`, file, {
			contentType: "application/pdf",
			upsert: true,
			cacheControl: "3600"
		})
		if (error) throw error

		return NextResponse.json({ ok: true, data: { language } })
	} catch (err) {
		console.error("POST /api/cv error:", err)
		return NextResponse.json({ ok: false, error: "Erro ao enviar currículo" }, { status: 500 })
	}
}
