"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { listCard, listCardHeader, listRow } from "@/components/education-now/list-card"

const copy = {
	en: {
		file: "education.json",
		items: [
			{ title: "Systems Analysis & Development", org: "Associate Degree", period: "2021 — 2024" },
			{ title: "Full-Stack Bootcamp", org: "Rocketseat — Ignite", period: "2023" },
			{ title: "English B2 — Upper Intermediate", org: "EF SET Certified", period: "2024" }
		]
	},
	"pt-BR": {
		file: "formação.json",
		items: [
			{ title: "Análise e Desenvolvimento de Sistemas", org: "Tecnólogo", period: "2021 — 2024" },
			{ title: "Bootcamp Full-Stack", org: "Rocketseat — Ignite", period: "2023" },
			{ title: "Inglês B2 — Intermediário Avançado", org: "EF SET Certified", period: "2024" }
		]
	}
}

export function Education() {
	const { language } = useLanguage()
	const t = copy[language]

	return (
		<div className={listCard}>
			<div className={listCardHeader}>
				<span>{t.file}</span>
				<span>{t.items.length}</span>
			</div>
			{t.items.map((item) => (
				<div key={item.title} className={listRow}>
					<div>
						<b className="block text-[15px] text-v-text">{item.title}</b>
						<small className="text-[13px] text-v-muted">{item.org}</small>
					</div>
					<span className="font-mono text-[11px] text-v-muted whitespace-nowrap text-right">{item.period}</span>
				</div>
			))}
		</div>
	)
}
