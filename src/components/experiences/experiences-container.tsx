"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { ExperienceSkeleton } from "@/components/skeletons/experience-skeleton"
import type { Experience as ExperienceType } from "@/types/experience/experience"
import { Experience } from "./experience"

interface ExperiencesContainerProps {
	experiences: ExperienceType[]
	isLoading?: boolean
}

export function ExperienceContainer({ experiences, isLoading }: ExperiencesContainerProps) {
	const { language } = useLanguage()
	const isPt = language === "pt-BR"

	if (!isLoading && (!experiences || experiences.length === 0)) return null

	return (
		<Section
			id="experience"
			index="04"
			path={isPt ? "carreira" : "career"}
			title={isPt ? "Experiência Profissional" : "Professional Experience"}
		>
			{isLoading ? (
				<ExperienceSkeleton />
			) : (
				<div className="border-b border-v-line">
					{experiences.map((experience, i) => (
						<Reveal key={experience.id}>
							<Experience experience={experience} language={language} current={i === 0 && experience.end_year === null} />
						</Reveal>
					))}
				</div>
			)}
		</Section>
	)
}
