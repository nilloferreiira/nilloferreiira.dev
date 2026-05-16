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
	stack: string[]
}
