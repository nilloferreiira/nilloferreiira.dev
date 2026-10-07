"use client"

import { useEffect, useState } from "react"
import { FileText, Github, Linkedin } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { getCvUrl, getCvDownloadName } from "@/lib/cv"
import { Reveal } from "@/components/ui/reveal"
import { SectionLabel } from "@/components/ui/section-label"
import { ChipButton } from "@/components/ui/chip-button"
import { wrap } from "@/components/ui/section"

const EMAIL = "nilloferreiira@gmail.com"

const copy = {
	en: {
		kicker: "contact",
		title: ["Let's", "talk?"],
		body: "I'm always open to new opportunities and interesting projects. Drop me a line.",
		copy: "copy",
		copied: "copied",
		cv: "Download PDF",
		footer: "Made with care · 2026"
	},
	"pt-BR": {
		kicker: "contato",
		title: ["Vamos", "conversar?"],
		body: "Estou sempre aberto a novas oportunidades e projetos interessantes. Mande uma mensagem.",
		copy: "copiar",
		copied: "copiado",
		cv: "Baixar PDF",
		footer: "Feito com cuidado · 2026"
	}
}

export function Contact() {
	const { language } = useLanguage()
	const t = copy[language]
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (!copied) return
		const id = setTimeout(() => setCopied(false), 1600)
		return () => clearTimeout(id)
	}, [copied])

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(EMAIL)
			setCopied(true)
		} catch {}
	}

	const socials = [
		{
			label: "GitHub",
			handle: "@nilloferreiira",
			icon: <Github size={16} />,
			props: { href: "https://github.com/nilloferreiira", target: "_blank", rel: "noopener noreferrer" }
		},
		{
			label: "LinkedIn",
			handle: "/in/nilloferreiira",
			icon: <Linkedin size={16} />,
			props: { href: "https://www.linkedin.com/in/nilloferreiira/", target: "_blank", rel: "noopener noreferrer" }
		},
		{
			label: "CV",
			handle: t.cv,
			icon: <FileText size={16} />,
			props: { href: getCvUrl(language), download: getCvDownloadName(language) }
		}
	]

	return (
		<footer id="contact" className="v-sec border-t border-v-line pt-[clamp(72px,10vw,140px)] transition-colors">
			<div className={wrap}>
				<SectionLabel index="07" path={t.kicker} className="after:hidden" />
				<Reveal>
					<h2 className="m-0 text-[clamp(52px,10vw,160px)] font-extrabold tracking-[-0.055em] leading-[0.92] text-v-text">
						{t.title[0]} <span className="grad">{t.title[1]}</span>
					</h2>
				</Reveal>
				<Reveal delay={0.1}>
					<p className="mt-6 max-w-[560px] text-v-dim text-[clamp(16px,1.4vw,19px)] leading-[1.65]">{t.body}</p>

					<div className="mt-[clamp(28px,4vw,48px)] flex flex-wrap items-center gap-4">
						<a
							href={`mailto:${EMAIL}`}
							className="text-[clamp(20px,2.6vw,34px)] font-bold tracking-[-0.02em] text-v-text border-b-2 border-v-accent pb-1 break-all hover:text-v-accent transition-colors"
						>
							{EMAIL}
						</a>
						<ChipButton onClick={copyEmail} aria-live="polite">
							{copied ? `✓ ${t.copied}` : t.copy}
						</ChipButton>
					</div>

					<div className="mt-12 grid grid-cols-3 max-[680px]:grid-cols-1 border-t border-v-line">
						{socials.map((social) => (
							<a
								key={social.label}
								{...social.props}
								className="flex justify-between items-center gap-3 py-[22px] pr-5 border-b border-v-line text-v-text hover:text-v-accent transition-colors"
							>
								<span className="flex items-center gap-2.5 font-bold">
									{social.icon}
									{social.label}
								</span>
								<small className="font-mono text-xs text-v-muted">{social.handle}</small>
							</a>
						))}
					</div>
				</Reveal>

				<div className="flex flex-wrap justify-between gap-4 pt-7 pb-10 font-mono text-xs text-v-muted">
					<span>~/danilloferreira</span>
					<span>{t.footer}</span>
				</div>
			</div>
		</footer>
	)
}
