export type Project = {
	id: number
	title: string
	description_en: string
	description_pt: string
	imgSrc: string
	url: string
	category: 'personal' | 'freelance' | 'work'
	tags: string[]
}
