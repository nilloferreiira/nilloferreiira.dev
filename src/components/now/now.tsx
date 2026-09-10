"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Kicker } from "@/components/ui/kicker"

const copy = {
	en: {
		kicker: "Now",
		title: "What I'm working on",
		body: "Updated May 2026.",
		items: [
			{ label: "Studying", value: "AWS Solutions Architect Associate" },
			{ label: "Reading", value: "Designing Data-Intensive Applications" },
			{ label: "Building", value: "A Go CLI to automate deploys" },
			{ label: "Listening", value: "Lo-fi & podcasts on systems architecture" }
		]
	},
	"pt-BR": {
		kicker: "Agora",
		title: "No que estou trabalhando",
		body: "Atualizado em maio de 2026.",
		items: [
			{ label: "Estudando", value: "AWS Solutions Architect Associate" },
			{ label: "Lendo", value: "Designing Data-Intensive Applications" },
			{ label: "Construindo", value: "Uma CLI em Go para automatizar deploys" },
			{ label: "Ouvindo", value: "Lo-fi & podcasts sobre arquitetura de sistemas" }
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
