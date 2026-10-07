"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Loader2 } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { ProjectSkeleton } from "@/components/skeletons/project-skeleton"
import { pillTab } from "@/components/ui/chip-button"
import { Project as ProjectType } from "@/types/project/project"
import { usePaginatedProjects } from "@/hooks/projects/usePaginatedProjects"
import { Project } from "./project"
import { ProjectModal } from "./project-modal"

export type BentoSize = "big" | "small" | "full"

// Bento rows on the 6-col grid: a wide pair first, rows of three in the middle, wide pairs last.
// Always fills complete rows whatever the filtered count is.
function bentoSizes(n: number): BentoSize[] {
	if (n === 0) return []
	if (n === 1) return ["full"]
	const rest = n - 2
	let pairs = 0
	if (rest > 0) {
		pairs = [1, 2, 3].find((p) => rest - 2 * p >= 0 && (rest - 2 * p) % 3 === 0) ?? 0
		if (pairs === 0 && rest % 3 !== 0) pairs = -1
	}
	const triples = pairs === -1 ? 0 : (rest - 2 * pairs) / 3
	const sizes: BentoSize[] = ["big", "big"]
	if (pairs === -1) {
		// rest === 1: one leftover card takes the full row
		sizes.push("full")
		return sizes
	}
	for (let i = 0; i < triples * 3; i++) sizes.push("small")
	for (let i = 0; i < pairs * 2; i++) sizes.push("big")
	return sizes
}

// The first API page brings 15: 5 are shown, 10 wait behind "Ver mais"
const INITIAL_COUNT = 5

type Category = "all" | "personal" | "freelance" | "work" | "evento"

const CATEGORIES: { value: Category; label_en: string; label_pt: string }[] = [
	{ value: "all", label_en: "All", label_pt: "Todos" },
	{ value: "personal", label_en: "Personal", label_pt: "Pessoal" },
	{ value: "freelance", label_en: "Freelance", label_pt: "Freelance" },
	{ value: "work", label_en: "Work", label_pt: "Trabalho" },
	{ value: "evento", label_en: "Event", label_pt: "Evento" }
]

export function ProjectContainer() {
	const { language } = useLanguage()
	const isPt = language === "pt-BR"
	const [activeCategory, setActiveCategory] = useState<Category>("all")
	const [activeTagIds, setActiveTagIds] = useState<number[]>([])
	const [selected, setSelected] = useState<ProjectType | null>(null)
	const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
	const [pageStart, setPageStart] = useState(0)

	const { data, isLoading, isError, isPlaceholderData, fetchNextPage, hasNextPage, isFetchingNextPage } = usePaginatedProjects({
		category: activeCategory,
		tagIds: activeTagIds
	})

	const pages = data?.pages ?? []
	const loadedProjects = pages.flatMap((page) => page.data)
	const total = pages[0]?.total ?? 0
	const allTags = pages[0]?.tags ?? []

	const visibleProjects = loadedProjects.slice(0, visibleCount)
	const hasMore = visibleProjects.length < total
	const sizes = bentoSizes(visibleProjects.length)

	// Changing a filter goes back to the first 5
	function resetPagination() {
		setVisibleCount(INITIAL_COUNT)
		setPageStart(0)
	}

	function selectCategory(category: Category) {
		setActiveCategory(category)
		resetPagination()
	}

	function toggleTag(id: number) {
		setActiveTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
		resetPagination()
	}

	// First click reveals the 10 already loaded; after that each click fetches and shows the next API page
	async function showMore() {
		setPageStart(visibleProjects.length)
		if (visibleCount < loadedProjects.length) {
			setVisibleCount(loadedProjects.length)
			return
		}
		if (!hasNextPage || isPlaceholderData) return
		const result = await fetchNextPage()
		setVisibleCount(result.data?.pages.flatMap((page) => page.data).length ?? loadedProjects.length)
	}

	return (
		<Section id="projects" index="05" path={isPt ? "trabalho" : "work"} title={isPt ? "Meus Projetos" : "My Projects"}>
			<Reveal>
				<div className="no-scrollbar flex gap-1.5 mb-3 overflow-x-auto">
					{CATEGORIES.map((cat) => (
						<button
							key={cat.value}
							type="button"
							onClick={() => selectCategory(cat.value)}
							className={pillTab(activeCategory === cat.value)}
						>
							{isPt ? cat.label_pt : cat.label_en}
						</button>
					))}
				</div>

				{!isLoading && allTags.length > 0 && (
					<div className="flex flex-wrap gap-1.5 mb-8">
						{allTags.map((tag) => {
							const isActive = activeTagIds.includes(tag.id)
							return (
								<button
									key={tag.id}
									type="button"
									onClick={() => toggleTag(tag.id)}
									aria-pressed={isActive}
									className={`px-[9px] py-1 rounded-md border font-mono text-[11px] cursor-pointer transition-colors ${
										isActive
											? "bg-v-soft text-v-accent border-v-accent"
											: "bg-v-panel text-v-dim border-v-line hover:border-v-line2 hover:text-v-text"
									}`}
								>
									{tag.name}
								</button>
							)
						})}
					</div>
				)}
			</Reveal>

			{isLoading ? (
				<ProjectSkeleton />
			) : (
				<>
					<motion.div
						layout
						className={`grid grid-cols-6 gap-4 transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : ""}`}
					>
						<AnimatePresence mode="popLayout">
							{visibleProjects.map((project, i) => (
								<Project
									key={project.id}
									language={language}
									project={project}
									index={i}
									delayIndex={Math.max(0, i - pageStart)}
									size={sizes[i]}
									onOpen={setSelected}
								/>
							))}
						</AnimatePresence>
					</motion.div>

					{hasMore && (
						<div className="mt-10 flex flex-col items-center gap-3">
							<button
								type="button"
								onClick={showMore}
								disabled={isFetchingNextPage || isPlaceholderData}
								className="disabled:opacity-60 disabled:cursor-wait inline-flex items-center gap-2.5 px-6 py-3.5 max-[680px]:px-5 max-[680px]:py-[13px] rounded-full border border-v-line2 bg-transparent text-v-text text-[15px] max-[680px]:text-sm font-bold cursor-pointer transition-[background,border-color] duration-200 hover:bg-v-panel2"
							>
								{isFetchingNextPage ? (isPt ? "Carregando…" : "Loading…") : isPt ? "Ver mais" : "Show more"}
								{isFetchingNextPage ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
							</button>
							<span className="font-mono text-[11px] text-v-muted">
								{isPt
									? `mostrando ${visibleProjects.length} de ${total}`
									: `showing ${visibleProjects.length} of ${total}`}
							</span>
						</div>
					)}

					{isError && total === 0 && (
						<p className="text-center text-v-muted py-12 font-mono text-sm">
							{isPt ? "Não foi possível carregar os projetos." : "Couldn't load the projects."}
						</p>
					)}

					{!isError && total === 0 && !isPlaceholderData && (
						<p className="text-center text-v-muted py-12 font-mono text-sm">
							{isPt ? "Nenhum projeto encontrado." : "No projects found."}
						</p>
					)}
				</>
			)}

			<ProjectModal project={selected} language={language} onClose={() => setSelected(null)} />
		</Section>
	)
}
