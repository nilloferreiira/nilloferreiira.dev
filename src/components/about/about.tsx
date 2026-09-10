"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Kicker } from "@/components/ui/kicker"

const copy = {
	en: {
		kicker: "About",
		title: "A bit about me",
		body: "I'm a fullstack developer working end-to-end on production platforms, from system design to long-term ownership. At Bonsae, I build and maintain features across an educational platform serving 3,000+ concurrent users on 50+ active instances, moving between PHP/Laravel backend services and Node.js APIs. I work AI-first, using Spec-Driven Development to keep AI-assisted work disciplined and production-grade, not a shortcut.",
		stats: [
			{ n: "2+", l: "years of experience" },
			{ n: "3,000+", l: "concurrent users served" },
			{ n: "50+", l: "active instances" }
		]
	},
	"pt-BR": {
		kicker: "Sobre",
		title: "Um pouco sobre mim",
		body: "Sou desenvolvedor fullstack, atuando de ponta a ponta em plataformas em produção, da arquitetura à manutenção de longo prazo. Na Bonsae, construo e mantenho features em uma plataforma educacional que atende mais de 3.000 usuários simultâneos em mais de 50 instâncias ativas, transitando entre serviços backend em PHP/Laravel e APIs em Node.js. Trabalho AI-first, usando Spec-Driven Development pra manter o trabalho assistido por IA disciplinado e pronto pra produção, não como atalho.",
		stats: [
			{ n: "2+", l: "anos de experiência" },
			{ n: "3.000+", l: "usuários simultâneos" },
			{ n: "50+", l: "instâncias ativas" }
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
