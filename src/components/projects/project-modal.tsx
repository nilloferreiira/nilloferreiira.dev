"use client"

import { useEffect } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ExternalLink, X } from "lucide-react"
import { PillButton } from "@/components/ui/pill-button"
import { Kicker } from "@/components/ui/kicker"
import { Tag } from "@/components/ui/tag"
import type { Project } from "@/types/project/project"

interface ProjectModalProps {
	project: Project | null
	language: "en" | "pt-BR"
	onClose: () => void
}

const copy = {
	en: { detailsLabel: "About the project", close: "Close", viewProject: "View project" },
	"pt-BR": { detailsLabel: "Sobre o projeto", close: "Fechar", viewProject: "Ver projeto" }
}

export function ProjectModal({ project, language, onClose }: ProjectModalProps) {
	const t = copy[language]

	useEffect(() => {
		if (!project) return

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}

		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
		const previousOverflow = document.body.style.overflow
		const previousPaddingRight = document.body.style.paddingRight
		document.body.style.overflow = "hidden"
		if (scrollbarWidth > 0) {
			const currentPaddingRight = parseFloat(getComputedStyle(document.body).paddingRight) || 0
			document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`
		}
		window.addEventListener("keydown", onKey)

		return () => {
			document.body.style.overflow = previousOverflow
			document.body.style.paddingRight = previousPaddingRight
			window.removeEventListener("keydown", onKey)
		}
	}, [project, onClose])

	return (
		<AnimatePresence>
			{project && (
				<motion.div
					key="project-modal"
					className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
					role="dialog"
					aria-modal="true"
					aria-labelledby="project-modal-title"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<div aria-hidden="true" className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

					<motion.div
						className="relative w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-2xl border border-v-line2 bg-v-bg2 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
						initial={{ opacity: 0, y: 16, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.98 }}
						transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
					>
						<div className="relative aspect-[16/7] border-b border-v-line">
							{project.imgSrc ? (
								<Image src={project.imgSrc} alt={project.title} fill sizes="640px" className="object-cover" />
							) : (
								<div className="stripes absolute inset-0 flex items-end px-4 py-3 font-mono text-[11px] text-v-muted">
									screenshot · {project.title.toLowerCase()}
								</div>
							)}
							<button
								type="button"
								onClick={onClose}
								aria-label={t.close}
								className="absolute top-3 right-3 w-9 h-9 rounded-full border border-v-line bg-v-bg/80 backdrop-blur flex items-center justify-center text-v-dim hover:text-v-accent transition-colors cursor-pointer"
							>
								<X size={16} />
							</button>
						</div>

						<div className="p-6 md:p-9 space-y-5">
							<h3
								id="project-modal-title"
								className="m-0 text-[clamp(26px,3vw,34px)] font-extrabold tracking-[-0.02em] text-v-text"
							>
								{project.title}
							</h3>

							{project.tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{project.tags.map((tag) => (
										<Tag key={tag.id}>{tag.name}</Tag>
									))}
								</div>
							)}

							<div>
								<Kicker label={t.detailsLabel} />
								<p className="m-0 text-v-dim text-[15px] leading-[1.75]">
									{language === "en" ? project.description_en : project.description_pt}
								</p>
							</div>

							{project.url && (
								<PillButton href={project.url} icon={<ExternalLink size={16} />} external>
									{t.viewProject}
								</PillButton>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
