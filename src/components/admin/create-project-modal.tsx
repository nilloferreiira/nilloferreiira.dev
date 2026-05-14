"use client"

// Use API /api/projects instead of server action
import { Modal } from "./modal"
import { Project } from "@/types/project/project"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"

interface Props {
	isOpen: boolean
	onClose: () => void
}

export function CreateProjectModal({ isOpen, onClose }: Props) {
	const { mutateAsync: createProjectMutation, isPending } = useMutation({
		mutationFn: async (data: Project) => {
			const res = await fetch("/api/projects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			})
			if (!res.ok) throw new Error("Erro ao criar projeto")
			const json = await res.json()
			return json.data
		},
		onSuccess: (res) => {
			queryClient.setQueryData(["projects"], (oldData: Project[] | undefined) => {
				if (!oldData) return [res[0]]
				return [...oldData, res[0]]
			})
			onClose()
		}
	})

	async function handleCreateProject(data: Project) {
		await createProjectMutation(data)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Create Project"
			modalForm="create-project-form"
			saveLabel="Create"
			isPending={isPending}
		>
			<form
				id="create-project-form"
				className="bg-shark p-4 rounded-lg space-y-3"
				onSubmit={(e) => {
					e.preventDefault()
					const form = new FormData(e.currentTarget as HTMLFormElement)
					const data: Project = {
						id: 0, // ID will be set by the server/database

						title: String(form.get("title") ?? ""),
						description_pt: String(form.get("description_pt") ?? ""),
						description_en: String(form.get("description_en") ?? ""),
						imgSrc: String(form.get("imgSrc") ?? ""),
						url: String(form.get("url") ?? ""),
						category: (String(form.get("category") ?? "personal")) as Project["category"],
						tags: String(form.get("tags") ?? "").split(",").map(t => t.trim()).filter(Boolean)
					}
					handleCreateProject(data)
				}}
			>
				<div>
					<label className="block text-sm text-text-secondary mb-1">Title</label>
					<input name="title" required className="w-full p-2 rounded-md bg-shark border border-white/5" />
				</div>

				<div>
					<label className="block text-sm text-text-secondary mb-1">Description (PT)</label>
					<textarea name="description_pt" rows={3} className="w-full p-2 rounded-md bg-shark border border-white/5" />
				</div>

				<div>
					<label className="block text-sm text-text-secondary mb-1">Description (EN)</label>
					<textarea name="description_en" rows={3} className="w-full p-2 rounded-md bg-shark border border-white/5" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div>
						<label className="block text-sm text-text-secondary mb-1">Image URL</label>
						<input name="imgSrc" className="w-full p-2 rounded-md bg-shark border border-white/5" />
					</div>
					<div>
						<label className="block text-sm text-text-secondary mb-1">Project URL</label>
						<input name="url" className="w-full p-2 rounded-md bg-shark border border-white/5" />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div>
						<label className="block text-sm text-text-secondary mb-1">Category</label>
						<select name="category" defaultValue="personal" className="w-full p-2 rounded-md bg-shark border border-white/5">
							<option value="personal">Personal</option>
							<option value="freelance">Freelance</option>
							<option value="work">Work</option>
						</select>
					</div>
					<div>
						<label className="block text-sm text-text-secondary mb-1">Tags (comma-separated)</label>
						<input name="tags" placeholder="react, typescript, ..." className="w-full p-2 rounded-md bg-shark border border-white/5" />
					</div>
				</div>

				{/* Buttons are handled by Modal footer via modalForm */}
			</form>
		</Modal>
	)
}
