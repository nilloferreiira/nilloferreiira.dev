import { clientEnv } from "@/lib/env.client"

export type CvLanguage = "en" | "pt"

const CV_KEYS: Record<"en" | "pt-BR", CvLanguage> = {
	en: "en",
	"pt-BR": "pt"
}

const CV_DOWNLOAD_NAMES: Record<CvLanguage, string> = {
	en: "Danillo Ferreira Software Engineer Resume.pdf",
	pt: "Danillo Ferreira Currículo Engenheiro de Software.pdf"
}

export function getCvDownloadName(language: "en" | "pt-BR") {
	return CV_DOWNLOAD_NAMES[CV_KEYS[language]]
}

export function getCvUrl(language: "en" | "pt-BR") {
	const key = CV_KEYS[language]
	const filename = getCvDownloadName(language)
	return `${clientEnv.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${key}.pdf?download=${encodeURIComponent(filename)}`
}
