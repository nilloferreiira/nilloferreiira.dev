import type { CvLanguage } from "@/lib/cv"
import { useQuery } from "@tanstack/react-query"

export interface CvFileStatus {
	language: CvLanguage
	updatedAt: string | null
	size: number | null
}

async function fetchCv(): Promise<CvFileStatus[]> {
	const res = await fetch("/api/cv")
	if (!res.ok) throw new Error("Erro ao buscar currículos")
	const json = await res.json()
	return json.data as CvFileStatus[]
}

export function useCv() {
	return useQuery<CvFileStatus[]>({
		queryKey: ["cv"],
		queryFn: fetchCv,
		staleTime: 1000 * 60 * 5 // 5 minutes
	})
}
