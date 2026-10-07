import type { Project, ProjectPage } from "@/types/project/project"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

export const PROJECTS_PAGE_SIZE = 15

interface ProjectFilters {
	category: Project["category"] | "all"
	tagIds: number[]
}

async function fetchProjectPage(offset: number, { category, tagIds }: ProjectFilters): Promise<ProjectPage> {
	const params = new URLSearchParams({ limit: String(PROJECTS_PAGE_SIZE), offset: String(offset) })
	if (category !== "all") params.set("category", category)
	if (tagIds.length > 0) params.set("tags", tagIds.join(","))

	const res = await fetch(`/api/projects?${params}`)
	if (!res.ok) throw new Error("Erro ao buscar projetos")
	const json = await res.json()
	return { data: json.data, total: json.total, nextOffset: json.nextOffset, tags: json.tags }
}

// Public site: loads projects 15 at a time. Lives under the "projects" key so admin invalidations reach it.
export function usePaginatedProjects(filters: ProjectFilters) {
	return useInfiniteQuery({
		queryKey: ["projects", "paged", filters.category, filters.tagIds],
		queryFn: ({ pageParam }) => fetchProjectPage(pageParam, filters),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5 // 5 minutes
	})
}
