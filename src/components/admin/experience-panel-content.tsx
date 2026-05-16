"use client"

import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import type { Experience } from "@/types/experience/experience"

interface Props {
	experience: Experience | null
	onClose: () => void
}

const inputClass =
	"w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
const labelClass = "block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider"

export function ExperiencePanelContent({ experience, onClose }: Props) {
	const isEdit = experience !== null

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: Experience) => {
			const res = await fetch("/api/experiences", {
				method: isEdit ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			})
			if (!res.ok) throw new Error(isEdit ? "Erro ao atualizar experiência" : "Erro ao criar experiência")
			const json = await res.json()
			return json.data
		},
		onSuccess: (res) => {
			queryClient.setQueryData(["experiences"], (oldData: Experience[] | undefined) => {
				if (!oldData) return [res[0]]
				if (isEdit) return oldData.map((item) => (item.id === res[0].id ? res[0] : item))
				return [...oldData, res[0]]
			})
			onClose()
		}
	})

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = new FormData(e.currentTarget)
		const data: Experience = {
			id: experience?.id ?? 0,
			title_pt: String(form.get("title_pt") ?? ""),
			title_en: String(form.get("title_en") ?? ""),
			description_pt: String(form.get("description_pt") ?? ""),
			description_en: String(form.get("description_en") ?? ""),
			company: "",
			start_year: null,
			end_year: null,
			location: "",
			responsibilities_en: [],
			responsibilities_pt: [],
			stack: []
		}
		mutateAsync(data)
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col min-h-full">
			<div className="flex-1 px-7 py-6 space-y-6">
				<div>
					<label className={labelClass}>Title (PT)</label>
					<input name="title_pt" required defaultValue={experience?.title_pt ?? ""} className={inputClass} />
				</div>

				<div>
					<label className={labelClass}>Title (EN)</label>
					<input name="title_en" defaultValue={experience?.title_en ?? ""} className={inputClass} />
				</div>

				<div>
					<label className={labelClass}>Description (PT)</label>
					<textarea
						name="description_pt"
						rows={5}
						defaultValue={experience?.description_pt ?? ""}
						className={`${inputClass} resize-none`}
					/>
				</div>

				<div>
					<label className={labelClass}>Description (EN)</label>
					<textarea
						name="description_en"
						rows={5}
						defaultValue={experience?.description_en ?? ""}
						className={`${inputClass} resize-none`}
					/>
				</div>
			</div>

			<div className="flex gap-3 px-7 py-5 border-t border-white/10 flex-shrink-0">
				<button
					type="button"
					onClick={onClose}
					className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-base transition"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isPending}
					className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-base font-medium hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
				>
					{isPending ? "Saving..." : isEdit ? "Save" : "Create"}
				</button>
			</div>
		</form>
	)
}
