"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { listCard, listCardHeader, listRow } from "@/components/education-now/list-card"

const copy = {
	en: {
		file: "now.md",
		body: "Updated September 2026.",
		items: [
			{ label: "Studying", values: ["Postgraduate in Applied AI Engineering", "AWS Certified Solutions Architect – Associate"] },
			{ label: "Building", values: ["Contai, a personal finance app"] }
		]
	},
	"pt-BR": {
		file: "agora.md",
		body: "Atualizado em setembro de 2026.",
		items: [
			{ label: "Estudando", values: ["Pós-graduação em Engenharia de IA Aplicada", "AWS Certified Solutions Architect – Associate"] },
			{ label: "Construindo", values: ["Contai, um app de finanças pessoais"] }
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
				<div key={item.label} className={listRow}>
					<div>
						<small className="block font-mono text-[11px] text-v-muted">{item.label.toLowerCase()}</small>
						{item.values.map((value) => (
							<b key={value} className="block text-[15px] text-v-text">
								{value}
							</b>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
