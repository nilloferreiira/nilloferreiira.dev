"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Kicker } from "@/components/ui/kicker"

const copy = {
	en: {
		kicker: "Now",
		title: "What I'm working on",
		body: "Updated September 2026.",
		items: [
			{ label: "Studying", value: "Postgraduate in Applied AI Engineering" },
			{ label: "Building", value: "Contai, a personal finance app" }
		]
	},
	"pt-BR": {
		kicker: "Agora",
		title: "No que estou trabalhando",
		body: "Atualizado em setembro de 2026.",
		items: [
			{ label: "Estudando", value: "Pós-graduação em Engenharia de IA Aplicada" },
			{ label: "Construindo", value: "Contai, um app de finanças pessoais" }
		]
	}
}

export function Now() {
	const { language } = useLanguage()
	const t = copy[language]

	return (
		<section className="py-24 px-6" id="now">
			<div className="container max-w-5xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Kicker label={t.kicker} />
					<h2 className="text-3xl md:text-4xl font-bold mb-2">
						<span className="gradient-text">{t.title}</span>
					</h2>
					<p className="text-xs text-muted-foreground font-mono mb-8">{t.body}</p>

					<div className="glass rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-border/30">
						{t.items.map((item) => (
							<div key={item.label} className="p-6 space-y-1">
								<p className="text-xs font-mono uppercase tracking-wider text-primary">{item.label}</p>
								<p className="text-foreground">{item.value}</p>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}
