"use client"

import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { Project } from "@/types/project/project"

interface Props {
	project: Project | null
	onClose: () => void
}

const inputClass =
	"w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
const labelClass = "block text-sm font-medium text-white/40 mb-2 uppercase tracking-wider"

export function ProjectPanelContent({ project, onClose }: Props) {
	const isEdit = project !== null

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: Project) => {
			const res = await fetch("/api/projects", {
				method: isEdit ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			})
			if (!res.ok) throw new Error(isEdit ? "Erro ao atualizar projeto" : "Erro ao criar projeto")
			const json = await res.json()
			return json.data
		},
		onSuccess: (res) => {
			queryClient.setQueryData(["projects"], (oldData: Project[] | undefined) => {
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
		const data: Project = {
			id: project?.id ?? 0,
			title: String(form.get("title") ?? ""),
			description_pt: String(form.get("description_pt") ?? ""),
			description_en: String(form.get("description_en") ?? ""),
			imgSrc: String(form.get("imgSrc") ?? ""),
			url: String(form.get("url") ?? ""),
			category: String(form.get("category") ?? "personal") as Project["category"],
			tags: String(form.get("tags") ?? "")
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		}
		mutateAsync(data)
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col min-h-full">
			<div className="flex-1 px-7 py-6 space-y-6">
				<div>
					<label className={labelClass}>Title</label>
					<input name="title" required defaultValue={project?.title ?? ""} className={inputClass} />
				</div>

				<div>
					<label className={labelClass}>Description (PT)</label>
					<textarea
						name="description_pt"
						rows={4}
						defaultValue={project?.description_pt ?? ""}
						className={`${inputClass} resize-none`}
					/>
				</div>

				<div>
					<label className={labelClass}>Description (EN)</label>
					<textarea
						name="description_en"
						rows={4}
						defaultValue={project?.description_en ?? ""}
						className={`${inputClass} resize-none`}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className={labelClass}>Image URL</label>
						<input name="imgSrc" defaultValue={project?.imgSrc ?? ""} className={inputClass} />
					</div>
					<div>
						<label className={labelClass}>Project URL</label>
						<input name="url" defaultValue={project?.url ?? ""} className={inputClass} />
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className={labelClass}>Category</label>
						<select name="category" defaultValue={project?.category ?? "personal"} className={inputClass}>
							<option value="personal" className="bg-[#1a1f2e] text-white">Personal</option>
							<option value="freelance" className="bg-[#1a1f2e] text-white">Freelance</option>
							<option value="work" className="bg-[#1a1f2e] text-white">Work</option>
							<option value="evento" className="bg-[#1a1f2e] text-white">Evento</option>
						</select>
					</div>
					<div>
						<label className={labelClass}>Tags</label>
						<input
							name="tags"
							defaultValue={project?.tags.join(", ") ?? ""}
							placeholder="react, typescript..."
							className={inputClass}
						/>
					</div>
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
