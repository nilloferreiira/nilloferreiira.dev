import type { StackRef } from "@/types/stack/stack"
import { useQuery } from "@tanstack/react-query"

async function fetchStacks(): Promise<StackRef[]> {
	const res = await fetch("/api/stacks")
	if (!res.ok) throw new Error("Erro ao buscar stacks")
	const json = await res.json()
	return json.data as StackRef[]
}

export function useStacks() {
	return useQuery<StackRef[]>({
		queryKey: ["stacks"],
		queryFn: fetchStacks,
		staleTime: 1000 * 60 * 5
	})
}
