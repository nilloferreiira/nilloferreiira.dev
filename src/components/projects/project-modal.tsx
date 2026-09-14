"use client"

import { useEffect } from "react"
import Image from "next/image"
import { ExternalLink, Folder, X } from "lucide-react"
import { PillButton } from "@/components/ui/pill-button"
import { Kicker } from "@/components/ui/kicker"
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

	if (!project) return null

	const description = language === "en" ? project.description_en : project.description_pt

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="project-modal-title"
		>
			<div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

			<div
				className="relative glass rounded-2xl max-w-[640px] w-full max-h-[85vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="relative aspect-[16/7] bg-gradient-to-br from-surface to-surface-raised">
					{project.imgSrc ? (
						<Image src={project.imgSrc} alt={project.title} fill className="object-cover" />
					) : (
						<div className="absolute inset-0 flex items-center justify-center">
							<Folder size={40} className="text-muted-foreground/30" />
						</div>
					)}
					<button
						onClick={onClose}
						aria-label={t.close}
						className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
					>
						<X size={16} />
					</button>
				</div>

				<div className="p-6 md:p-8 space-y-4">
					<h3 id="project-modal-title" className="text-2xl font-bold">
						{project.title}
					</h3>

					{project.tags.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{project.tags.map((tag) => (
								<span
									key={tag.id}
									className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 font-mono"
								>
									{tag.name}
								</span>
							))}
						</div>
					)}

					<div>
						<Kicker label={t.detailsLabel} />
						<p className="text-muted-foreground leading-relaxed">{description}</p>
					</div>

					{project.url && (
						<PillButton href={project.url} icon={<ExternalLink size={16} />} external>
							{t.viewProject}
						</PillButton>
					)}
				</div>
			</div>
		</div>
	)
}
