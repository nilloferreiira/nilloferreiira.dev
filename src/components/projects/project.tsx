"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { Project as ProjectType } from "@/types/project/project"
import { Tag } from "@/components/ui/tag"
import type { BentoSize } from "./projects-container"

interface ProjectProps {
	project: ProjectType
	language: "en" | "pt-BR"
	index: number
	size: BentoSize
	// Position within the batch being revealed, so newly loaded cards stagger from 0
	delayIndex?: number
	onOpen?: (project: ProjectType) => void
}

export function Project({ project, language, index, size, delayIndex, onOpen }: ProjectProps) {
	const big = size !== "small"
	const span = size === "full" ? "col-span-6" : big ? "col-span-3 max-[1080px]:col-span-3" : "col-span-2 max-[1080px]:col-span-3"

	return (
		// The card is not interactive itself: the real <button> lives in the title and its ::after
		// stretches over the whole card, so the card stays clickable while the button keeps a short accessible name
		<motion.article
			layout
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.97 }}
			transition={{ delay: (delayIndex ?? index) * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
			className={`group relative ${span} max-[680px]:col-span-6 flex flex-col overflow-hidden rounded-2xl border border-v-line bg-v-panel shadow-v-card has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-v-accent transition-[border-color,background,translate] duration-300 hover:border-v-line2 hover:bg-v-panel2 hover:-translate-y-1`}
		>
			<div
				className={`relative w-full ${big ? "aspect-[16/8]" : "aspect-video"} border-b border-v-line overflow-hidden`}
			>
				{project.imgSrc ? (
					<Image
						src={project.imgSrc}
						alt=""
						fill
						sizes={big ? "(max-width: 680px) 100vw, 50vw" : "(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 33vw"}
						className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
					/>
				) : (
					<div className="stripes absolute inset-0 flex items-end justify-between px-3.5 py-3 font-mono text-[11px] text-v-muted">
						<span>screenshot · {project.title.toLowerCase()}</span>
						<span>{String(index + 1).padStart(2, "0")}</span>
					</div>
				)}
			</div>

			<div className="flex flex-col flex-1 gap-3 px-[22px] pt-5 pb-[22px] w-full">
				<div className="flex items-center justify-between gap-3">
					<h3 className="m-0 text-[21px] font-bold tracking-[-0.02em] text-v-text">
						<button
							type="button"
							onClick={() => onOpen?.(project)}
							className="text-left cursor-pointer focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
						>
							{project.title}
						</button>
					</h3>
					<span aria-hidden="true" className="shrink-0 w-[30px] h-[30px] rounded-full border border-v-line flex items-center justify-center text-v-text transition-all duration-300 group-hover:bg-v-accent group-hover:border-v-accent group-hover:text-v-bg group-hover:-rotate-45">
						<ChevronRight size={14} />
					</span>
				</div>
				<p className="m-0 flex-1 text-v-dim text-sm leading-[1.55]">
					{language === "en" ? project.description_en : project.description_pt}
				</p>
				{project.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{project.tags.map((tag) => (
							<Tag key={tag.id}>{tag.name}</Tag>
						))}
					</div>
				)}
			</div>
		</motion.article>
	)
}
