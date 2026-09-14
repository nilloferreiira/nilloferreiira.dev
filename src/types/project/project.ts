import type { StackRef } from "@/types/stack/stack"

export type Project = {
	id: number
	title: string
	description_en: string
	description_pt: string
	imgSrc: string
	url: string
	category: "personal" | "freelance" | "work" | "evento"
	tags: StackRef[]
}

export type ProjectInput = {
	id: number
	title: string
	description_en: string
	description_pt: string
	imgSrc: string
	url: string
	category: Project["category"]
	tags: string[]
}
