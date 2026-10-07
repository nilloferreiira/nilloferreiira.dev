"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { listCard, listCardHeader, listRow } from "@/components/education-now/list-card"

const copy = {
	en: {
		file: "now.md",
		body: "Updated September 2026.",
		items: [
			{ label: "Studying", value: "Postgraduate in Applied AI Engineering" },
			{ label: "Studying", value: "AWS Certified Solutions Architect – Associate" },
			{ label: "Building", value: "Contai, a personal finance app" }
		]
	},
	"pt-BR": {
		file: "agora.md",
		body: "Atualizado em setembro de 2026.",
		items: [
			{ label: "Estudando", value: "Pós-graduação em Engenharia de IA Aplicada" },
			{ label: "Estudando", value: "AWS Certified Solutions Architect – Associate" },
			{ label: "Construindo", value: "Contai, um app de finanças pessoais" }
		]
	}
}

export function Now() {
	const { language } = useLanguage()
	const t = copy[language]

	return (
		<div id="now" className={listCard}>
			<div className={listCardHeader}>
				<span>{t.file}</span>
				<span>{t.body}</span>
			</div>
			{t.items.map((item) => (
				<div key={item.value} className={listRow}>
					<div>
						<small className="block font-mono text-[11px] text-v-muted">{item.label.toLowerCase()}</small>
						<b className="block text-[15px] text-v-text">{item.value}</b>
					</div>
				</div>
			))}
		</div>
	)
}
