"use client"

import { Github, Mail } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { PillButton } from "@/components/ui/pill-button"
import { Reveal } from "@/components/ui/reveal"
import { wrap } from "@/components/ui/section"
import { CodeTyper } from "./code-typer"
import { HeroStats } from "./hero-stats"

const copy = {
	en: {
		available: "Available for new projects",
		headline: "Software Engineer. Focus on Architecture & AI.",
		role: "Software Engineer",
		tagline: "Solid architecture. Code that lasts. Disciplined AI. Full ownership, from design to maintenance.",
		cta: "Get in touch",
		scroll: "scroll to explore",
		stats: [
			{ n: "2+", l: "years of experience" },
			{ n: "1", l: "personal AI SaaS in production" },
			{ n: "3,000+", l: "concurrent users served" },
			{ n: "50+", l: "active instances" }
		]
	},
	"pt-BR": {
		available: "Disponível para novos projetos",
		headline: "Software Engineer. Foco em Arquitetura & IA.",
		role: "Software Engineer",
		tagline: "Arquitetura sólida. Código que dura. IA disciplinada. Tudo com ownership total, do design à manutenção.",
		cta: "Me contate",
		scroll: "role para explorar",
		stats: [
			{ n: "2+", l: "anos de experiência" },
			{ n: "1", l: "SaaS pessoal com IA em produção" },
			{ n: "3.000+", l: "usuários simultâneos" },
			{ n: "50+", l: "instâncias ativas" }
		]
	}
}

export function Header() {
	const { language } = useLanguage()
	const t = copy[language]
	const words = t.headline.split(" ")

	return (
		<section id="top" className="relative overflow-hidden pt-[clamp(120px,16vh,180px)]">
			<div className="hero-grid-bg" />
			<div className={wrap}>
				<div className="relative grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] max-[1080px]:grid-cols-1 gap-[clamp(32px,5vw,80px)] items-center">
					<div>
						<div className="inline-flex items-center gap-2.5 px-3.5 py-[7px] mb-7 rounded-full border border-v-line bg-v-panel font-mono text-xs text-v-dim">
							<i className="pulse-dot w-[7px] h-[7px]" />
							{t.available}
						</div>

						<h1 className="flex flex-wrap m-0 text-[clamp(44px,6.6vw,104px)] font-extrabold tracking-[-0.045em] leading-[0.98] text-v-text">
							{words.map((word, i) => (
								<span key={`${language}-${i}`} className="inline-block overflow-hidden mr-[0.24em] pb-[0.08em]">
									<span
										className={`word-in ${i === words.length - 1 ? "grad" : ""}`}
										style={{ animationDelay: `${0.1 + i * 0.06}s` }}
									>
										{word}
									</span>
								</span>
							))}
						</h1>

						<div className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-[15px] text-v-dim">
							<b className="text-v-text">Danillo Ferreira</b>
							<span className="text-v-muted">/</span>
							<span>{t.role}</span>
						</div>

						<p className="mt-[18px] max-w-[560px] text-v-dim text-[clamp(16px,1.4vw,19px)] leading-[1.65] text-pretty">
							{t.tagline}
						</p>

						<div className="mt-9 flex flex-wrap gap-3">
							<PillButton href="#contact" icon={<Mail size={16} />} iconPosition="start">
								{t.cta}
							</PillButton>
							<PillButton
								href="https://github.com/nilloferreiira"
								variant="secondary"
								icon={<Github size={16} />}
								iconPosition="start"
								external
							>
								GitHub
							</PillButton>
						</div>
					</div>

					<Reveal delay={0.3} className="min-w-0">
						<CodeTyper />
					</Reveal>
				</div>

				<HeroStats stats={t.stats} locale={language} scrollLabel={t.scroll} />
			</div>
		</section>
	)
}
