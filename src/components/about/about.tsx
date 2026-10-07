"use client"

import Image from "next/image"
import { Github } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { Reveal } from "@/components/ui/reveal"
import { SectionLabel } from "@/components/ui/section-label"
import { wrap } from "@/components/ui/section"
import { Clock } from "./clock"

const copy = {
	en: {
		kicker: "about",
		heading: "I'm a fullstack developer.",
		emphasis: "End-to-end on production platforms, from system design to long-term ownership.",
		body: "At Bonsae, I build and maintain features across an educational platform serving 3,000+ concurrent users on 50+ active instances, moving between PHP/Laravel backend services and Node.js APIs. I work AI-first, using Spec-Driven Development to keep AI-assisted work disciplined and production-grade, not a shortcut.",
		facts: [
			["degree", "Systems Dev · 2024"],
			["english", "B2 · EF SET"],
			["current", "Bonsae · Fullstack"],
			["based", "Brazil · remote"]
		],
		timeLabel: "local time"
	},
	"pt-BR": {
		kicker: "sobre",
		heading: "Sou desenvolvedor fullstack.",
		emphasis: "De ponta a ponta em plataformas em produção, da arquitetura à manutenção de longo prazo.",
		body: "Na Bonsae, construo e mantenho features em uma plataforma educacional que atende mais de 3.000 usuários simultâneos em mais de 50 instâncias ativas, transitando entre serviços backend em PHP/Laravel e APIs em Node.js. Trabalho AI-first, usando Spec-Driven Development pra manter o trabalho assistido por IA disciplinado e pronto pra produção, não como atalho.",
		facts: [
			["formação", "ADS · 2024"],
			["inglês", "B2 · EF SET"],
			["atual", "Bonsae · Fullstack"],
			["base", "Brasil · remoto"]
		],
		timeLabel: "horário local"
	}
}

export function About() {
	const { language } = useLanguage()
	const t = copy[language]

	return (
		<section id="about" className="v-sec border-t border-v-line py-[clamp(72px,10vw,140px)] transition-colors">
			<div className={wrap}>
				<SectionLabel index="01" path={t.kicker} />
				<div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] max-[1080px]:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] max-[1080px]:items-start max-[680px]:grid-cols-1 gap-[clamp(32px,5vw,96px)] items-center">
					<Reveal>
						<figure className="group m-0 px-2.5 pt-2.5 rounded-[18px] border border-v-line2 bg-v-panel max-w-[480px] max-[680px]:max-w-[340px] shadow-[12px_12px_0_-1px_var(--soft),12px_12px_0_0_var(--line2)]">
							<div className="relative rounded-[10px] overflow-hidden aspect-[4/5] max-[680px]:aspect-square bg-v-panel2">
								<Image
									src="https://github.com/nilloferreiira.png"
									alt="Danillo Ferreira"
									fill
									sizes="(max-width: 680px) 340px, 480px"
									className="object-cover grayscale-[0.15] transition-[filter,transform] duration-[500ms,800ms] group-hover:grayscale-0 group-hover:scale-[1.03]"
								/>
							</div>
							<figcaption className="flex items-center gap-2 px-1 py-3 font-mono text-xs text-v-dim">
								<Github size={13} />
								nilloferreiira
							</figcaption>
						</figure>
					</Reveal>

					<Reveal delay={0.1}>
						<h2 className="m-0 text-[clamp(32px,3.8vw,58px)] font-extrabold tracking-[-0.035em] leading-[1.05] text-pretty text-v-text">
							{t.heading}{" "}
							<em className="block mt-[0.15em] font-serif italic font-normal tracking-[-0.01em] text-v-accent">
								{t.emphasis}
							</em>
						</h2>
						<p className="mt-[clamp(24px,3vw,40px)] max-w-[720px] text-v-dim text-[clamp(16px,1.3vw,19px)] leading-[1.7] text-pretty">
							{t.body}
						</p>
						<div className="mt-[clamp(32px,4vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] max-[680px]:grid-cols-2 border-t border-v-line">
							{t.facts.map(([k, v]) => (
								<div key={k} className="flex flex-col gap-1.5 py-[18px] pr-4">
									<span className="font-mono text-[11px] text-v-muted">{k}</span>
									<span className="text-[15px] font-semibold text-v-text">{v}</span>
								</div>
							))}
							<div className="flex flex-col gap-1.5 py-[18px] pr-4">
								<span className="font-mono text-[11px] text-v-muted">{t.timeLabel}</span>
								<span className="font-mono text-[15px] font-semibold text-v-text">
									<Clock />
								</span>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	)
}
