"use client"

import Image from "next/image"
import { Github } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { useProfilePicture } from "@/hooks/profile-picture/useProfilePicture"
import { FALLBACK_PHOTO_URL } from "@/lib/profile-picture"
import { Reveal } from "@/components/ui/reveal"
import { SectionLabel } from "@/components/ui/section-label"
import { wrap } from "@/components/ui/section"
import { Clock } from "./clock"

const copy = {
	en: {
		kicker: "about",
		heading: "Software Engineer focused on architecture and AI in production.",
		emphasis: "I build intelligent products that work.",
		paragraphs: [
			"Automation that saves time, systems that scale, code that lasts. Backend (Node.js, PHP/Laravel), frontend (React, Next.js), AI integrated in ways that deliver real results.",
			"At Bonsae, I cut the time writers spend on research and writing down to just 10 minutes of review and publishing. I turned a manual process into an intelligent content machine. Solid architecture, code that lasts, products that grow with you."
		],
		facts: [
			["degree", "Systems Dev · 2025"],
			["english", "B2 · EF SET"],
			["current", "Bonsae · Fullstack"],
			["based", "Brazil · remote"]
		],
		timeLabel: "local time"
	},
	"pt-BR": {
		kicker: "sobre",
		heading: "Software Engineer com foco em arquitetura e IA em produção.",
		emphasis: "Construo produtos inteligentes que funcionam.",
		paragraphs: [
			"Automação que economiza tempo, sistemas que crescem, código que dura. Backend (Node.js, PHP/Laravel), frontend (React, Next.js), IA integrada de forma que traga resultado real.",
			"Na Bonsae, reduzi o tempo que redatores gastam em pesquisa e escrita para apenas 10 minutos em revisão e publicação. Transformei um processo manual em uma máquina de conteúdo inteligente. Arquitetura sólida, código que dura, produtos que crescem com você."
		],
		facts: [
			["formação", "ADS · 2025"],
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
	const { data: photo, isError } = useProfilePicture()
	// wait for the API instead of showing the fallback first and swapping it
	const photoUrl = photo?.url ?? (isError ? FALLBACK_PHOTO_URL : null)

	return (
		<section id="about" className="v-sec border-t border-v-line py-[clamp(72px,10vw,140px)] transition-colors">
			<div className={wrap}>
				<SectionLabel index="01" path={t.kicker} />
				<div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] max-[1080px]:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] max-[1080px]:items-start max-[680px]:grid-cols-1 gap-[clamp(32px,5vw,96px)] items-center">
					<Reveal>
						<figure className="group m-0 px-2.5 pt-2.5 rounded-[18px] border border-v-line2 bg-v-panel max-w-[480px] max-[680px]:max-w-[340px] shadow-[12px_12px_0_-1px_var(--soft),12px_12px_0_0_var(--line2)]">
							<div
								className={`relative rounded-[10px] overflow-hidden aspect-[4/5] max-[680px]:aspect-square bg-v-panel2 ${
									photoUrl ? "" : "animate-pulse"
								}`}
							>
								{photoUrl && (
									<Image
										key={photoUrl}
										src={photoUrl}
										alt="Danillo Ferreira"
										fill
										sizes="(max-width: 680px) 340px, 480px"
										className="object-cover grayscale-[0.15] transition-[filter,transform] duration-[500ms,800ms] group-hover:grayscale-0 group-hover:scale-[1.03]"
									/>
								)}
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
						<div className="mt-[clamp(24px,3vw,40px)] flex flex-col gap-4">
							{t.paragraphs.map((paragraph) => (
								<p key={paragraph} className="m-0 max-w-[720px] text-v-dim text-[clamp(16px,1.3vw,19px)] leading-[1.7] text-pretty">
									{paragraph}
								</p>
							))}
						</div>
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
