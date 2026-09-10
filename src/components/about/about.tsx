"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Kicker } from "@/components/ui/kicker"

const copy = {
	en: {
		kicker: "About",
		title: "A bit about me",
		body: "I've been a developer for over four years, working on full-stack products with a backend focus. I enjoy problems that mix clean architecture, performance, and an interface that respects the people using it. Currently at Bonsae as a Backend Developer, writing Node.js APIs and building things that need to work every day, for a lot of people.",
		stats: [
			{ n: "4+", l: "years of experience" },
			{ n: "20+", l: "projects shipped" },
			{ n: "10+", l: "stacks under belt" }
		]
	},
	"pt-BR": {
		kicker: "Sobre",
		title: "Um pouco sobre mim",
		body: "Sou desenvolvedor há mais de quatro anos, trabalhando em produtos full-stack com foco em backend. Gosto de problemas que misturam arquitetura limpa, performance e uma interface que respeita quem usa. Atualmente no time da Bonsae como Desenvolvedor Backend, escrevendo APIs em Node.js e construindo coisas que precisam funcionar todo dia, para muita gente.",
		stats: [
			{ n: "4+", l: "anos de experiência" },
			{ n: "20+", l: "projetos entregues" },
			{ n: "10+", l: "stacks dominadas" }
		]
	}
}

export function About() {
	const { language } = useLanguage()
	const t = copy[language]

	return (
		<section className="py-24 px-6" id="about">
			<div className="container max-w-5xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Kicker label={t.kicker} />
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						<span className="gradient-text">{t.title}</span>
					</h2>
					<p className="text-muted-foreground max-w-[780px] text-base md:text-lg leading-relaxed mb-12">{t.body}</p>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[780px]">
						{t.stats.map((stat) => (
							<div key={stat.l} className="glass rounded-xl p-6 text-center space-y-1">
								<p className="text-4xl md:text-5xl font-bold gradient-text">{stat.n}</p>
								<p className="text-sm text-muted-foreground font-mono uppercase tracking-wide">{stat.l}</p>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}
