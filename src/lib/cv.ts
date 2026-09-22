export type CvLanguage = "en" | "pt"

const CV_KEYS: Record<"en" | "pt-BR", CvLanguage> = {
	en: "en",
	"pt-BR": "pt"
}

export function getCvUrl(language: "en" | "pt-BR") {
	const key = CV_KEYS[language]
	return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${key}.pdf`
}

export function getCvDownloadName(language: "en" | "pt-BR") {
	const key = CV_KEYS[language]
	return `danillo-ferreira-cv-${key}.pdf`
}
