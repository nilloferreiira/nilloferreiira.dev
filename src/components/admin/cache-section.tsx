"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { RefreshCw } from "lucide-react"

type Scope = "all" | "projects" | "experiences" | "cv"

const SCOPES: { scope: Scope; label: string; queryKeys: string[] }[] = [
	{ scope: "all", label: "Invalidate all", queryKeys: ["projects", "experiences", "cv", "stacks"] },
	{ scope: "projects", label: "Projects", queryKeys: ["projects"] },
	{ scope: "experiences", label: "Experiences", queryKeys: ["experiences"] },
	{ scope: "cv", label: "CVs", queryKeys: ["cv"] }
]

export function CacheSection() {
	const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

	const { mutate, isPending, variables } = useMutation({
		mutationFn: async (scope: Scope) => {
			const res = await fetch("/api/cache/revalidate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ scope })
			})
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json.error ?? "Erro ao invalidar cache")
			return scope
		},
		onSuccess: (scope) => {
			const entry = SCOPES.find((s) => s.scope === scope)!
			for (const key of entry.queryKeys) queryClient.invalidateQueries({ queryKey: [key] })
			setMessage({ type: "ok", text: `${entry.label === "Invalidate all" ? "All caches" : entry.label} invalidated` })
		},
		onError: (err: Error) => setMessage({ type: "error", text: err.message })
	})

	return (
		<section className="mb-10">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Cache</h2>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				{SCOPES.map(({ scope, label }) => (
					<button
						key={scope}
						type="button"
						onClick={() => mutate(scope)}
						disabled={isPending}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-primary border border-primary/30 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
					>
						<RefreshCw size={12} className={isPending && variables === scope ? "animate-spin" : ""} />
						{label}
					</button>
				))}
				{message && (
					<span className={`text-xs ${message.type === "ok" ? "text-white/40" : "text-red-400"}`}>{message.text}</span>
				)}
			</div>
		</section>
	)
}
