"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Kicker } from "@/components/ui/kicker"

const copy = {
	en: {
		kicker: "Education",
		title: "Education & Certifications",
		items: [
			{ kind: "degree", title: "Systems Analysis & Development", org: "Associate Degree", period: "2021 — 2024", status: "Completed" },
			{ kind: "cert", title: "Full-Stack Bootcamp", org: "Rocketseat — Ignite", period: "2023", status: "Completed" },
			{ kind: "cert", title: "English B2 — Upper Intermediate", org: "EF SET Certified", period: "2024", status: "Completed" }
		]
	},
	"pt-BR": {
		kicker: "Formação",
		title: "Educação & Certificações",
		items: [
			{ kind: "degree", title: "Análise e Desenvolvimento de Sistemas", org: "Tecnólogo", period: "2021 — 2024", status: "Concluído" },
			{ kind: "cert", title: "Bootcamp Full-Stack", org: "Rocketseat — Ignite", period: "2023", status: "Concluído" },
			{ kind: "cert", title: "Inglês B2 — Intermediário Avançado", org: "EF SET Certified", period: "2024", status: "Concluído" }
		]
	}
}

export function Education() {
	const { language } = useLanguage()
	const t = copy[language]

	return (
		<section className="py-24 px-6" id="education">
			<div className="container max-w-5xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Kicker label={t.kicker} />
					<h2 className="text-3xl md:text-4xl font-bold mb-12">
						<span className="gradient-text">{t.title}</span>
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{t.items.map((item) => (
							<div key={item.title} className="glass rounded-xl p-6 space-y-2">
								<p className="text-xs font-mono uppercase tracking-wider text-primary">
									{item.kind === "degree" ? "DEGREE" : "CERT"}
								</p>
								<p className="font-semibold text-lg">{item.title}</p>
								<p className="text-muted-foreground text-sm">{item.org}</p>
								<p className="text-xs font-mono text-muted-foreground">
									{item.period} · {item.status}
								</p>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}
