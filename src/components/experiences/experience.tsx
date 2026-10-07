"use client"

import type { Experience as ExperienceType } from "@/types/experience/experience"
import { Tag } from "@/components/ui/tag"

interface ExperienceProps {
	experience: ExperienceType
	language: "en" | "pt-BR"
	current?: boolean
}

export function Experience({ experience, language, current }: ExperienceProps) {
	const isPt = language === "pt-BR"
	const title = isPt ? experience.title_pt : experience.title_en
	const description = isPt ? experience.description_pt : experience.description_en
	const responsibilities = isPt ? experience.responsibilities_pt : experience.responsibilities_en
	const descriptionLines = description.split("\n").filter(Boolean)
	const period =
		experience.start_year !== null
			? `${experience.start_year} — ${experience.end_year ?? (isPt ? "Atual" : "Present")}`
			: null

	return (
		<div className="grid grid-cols-[minmax(0,2fr)_minmax(0,6fr)_minmax(0,3fr)] max-[1080px]:grid-cols-[minmax(0,2fr)_minmax(0,6fr)] max-[680px]:grid-cols-1 gap-[clamp(16px,3vw,40px)] max-[680px]:gap-3 py-8 border-t border-v-line">
			<div className="flex flex-col max-[680px]:flex-row max-[680px]:justify-between gap-2 font-mono text-xs text-v-muted">
				{period && <span>{period}</span>}
				{current ? (
					<span className="inline-flex items-center gap-1.5 text-[11px] text-v-ok">
						<i className="pulse-dot w-1.5 h-1.5" />
						{isPt ? "atual" : "current"}
					</span>
				) : (
					experience.location && <span>{experience.location}</span>
				)}
			</div>

			<div>
				{/* company is optional in the DB: fall back to the role as the heading */}
				<h3 className="m-0 text-[clamp(24px,2.4vw,32px)] font-bold tracking-[-0.025em] text-v-text">
					{experience.company || title}
				</h3>
				{experience.company && <div className="mt-1 font-mono text-[13px] text-v-accent">{title}</div>}
				{descriptionLines.map((line, i) => (
					<p key={i} className="mt-3.5 mb-3 text-v-dim text-[15px] leading-[1.6] text-pretty">
						{line}
					</p>
				))}
				{responsibilities.length > 0 && (
					<ul className="m-0 p-0 list-none flex flex-col gap-1.5">
						{responsibilities.map((item, i) => (
							<li key={i} className="flex gap-2.5 text-sm text-v-dim before:content-['→'] before:font-mono before:text-v-muted">
								{item}
							</li>
						))}
					</ul>
				)}
			</div>

			{experience.stack.length > 0 && (
				<div className="flex flex-wrap content-start gap-1.5 max-[1080px]:col-start-2 max-[680px]:col-start-auto">
					{experience.stack.map((tech) => (
						<Tag key={tech.id}>{tech.name}</Tag>
					))}
				</div>
			)}
		</div>
	)
}
