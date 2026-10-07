"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { Education } from "@/components/education/education"
import { Now } from "@/components/now/now"

export function EducationNow() {
	const { language } = useLanguage()
	const isPt = language === "pt-BR"

	return (
		<Section
			id="education"
			index="06"
			path={isPt ? "formação" : "education"}
			title={isPt ? "Educação & Certificações" : "Education & Certifications"}
		>
			<div className="grid grid-cols-2 max-[680px]:grid-cols-1 gap-5">
				<Reveal>
					<Education />
				</Reveal>
				<Reveal delay={0.1}>
					<Now />
				</Reveal>
			</div>
		</Section>
	)
}
