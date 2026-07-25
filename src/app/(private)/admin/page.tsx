"use client"

import { AdminExperienceCard } from "@/components/admin/admin-experience-card"
import { SortableProjectItem } from "@/components/admin/sortable-project-item"
import { AdminSidePanel } from "@/components/admin/admin-side-panel"
import { ProjectPanelContent } from "@/components/admin/project-panel-content"
import { ExperiencePanelContent } from "@/components/admin/experience-panel-content"
import { LoadingSpinner } from "@/components/loading/loading"
import { useExperiences } from "@/hooks/experiences/useExperiences"
import { useProjects } from "@/hooks/projects/useProjects"
import { Project } from "@/types/project/project"
import type { Experience } from "@/types/experience/experience"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { Reorder } from "framer-motion"
import { LogOut, Plus } from "lucide-react"

type PanelState =
	| { mode: "idle" }
	| { mode: "create-project" }
	| { mode: "edit-project"; project: Project }
	| { mode: "create-experience" }
	| { mode: "edit-experience"; experience: Experience }

const panelTitles: Record<PanelState["mode"], string> = {
	idle: "",
	"create-project": "New Project",
	"edit-project": "Edit Project",
	"create-experience": "New Experience",
	"edit-experience": "Edit Experience"
}

export default function AdminPage() {
	const [panel, setPanel] = useState<PanelState>({ mode: "idle" })
	const isPanelOpen = panel.mode !== "idle"

	const { data: projects, isLoading: isLoadingProjects } = useProjects()
	const { data: experiences, isLoading: isLoadingExperiences } = useExperiences()
	const isLoaded = !isLoadingProjects && !isLoadingExperiences

	const { mutateAsync: deleteProjectMutation } = useMutation({
		mutationFn: async (id: number) => {
			const res = await fetch("/api/projects", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id })
			})
			if (!res.ok) throw new Error("Erro ao deletar projeto")
			return res.json()
		},
		onSuccess: (_, id) => {
			queryClient.setQueryData(["projects"], (old: Project[] | undefined) => old?.filter((p) => p.id !== id) ?? [])
			if (panel.mode === "edit-project" && panel.project.id === id) setPanel({ mode: "idle" })
		}
	})

	const { mutateAsync: deleteExperienceMutation } = useMutation({
		mutationFn: async (id: number) => {
			const res = await fetch("/api/experiences", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id })
			})
			if (!res.ok) throw new Error("Erro ao deletar experiência")
			return res.json()
		},
		onSuccess: (_, id) => {
			queryClient.setQueryData(["experiences"], (old: Experience[] | undefined) => old?.filter((e) => e.id !== id) ?? [])
			if (panel.mode === "edit-experience" && panel.experience.id === id) setPanel({ mode: "idle" })
		}
	})

	async function handleDeleteProject(id: number) {
		if (!window.confirm("Delete this project?")) return
		await deleteProjectMutation(id)
	}

	const dragSnapshotRef = useRef<Project[] | null>(null)

	const { mutate: reorderProjects } = useMutation({
		mutationFn: async (newOrder: Project[]) => {
			const res = await fetch("/api/projects/reorder", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderedIds: newOrder.map((p) => p.id) })
			})
			if (!res.ok) throw new Error("Erro ao reordenar projetos")
			return res.json()
		},
		onError: () => {
			if (dragSnapshotRef.current) queryClient.setQueryData(["projects"], dragSnapshotRef.current)
		}
	})

	function handleProjectDragStart() {
		dragSnapshotRef.current = queryClient.getQueryData<Project[]>(["projects"]) ?? null
	}

	function handleProjectDragEnd() {
		const current = queryClient.getQueryData<Project[]>(["projects"])
		if (current) reorderProjects(current)
	}

	async function handleDeleteExperience(id: number) {
		if (!window.confirm("Delete this experience?")) return
		await deleteExperienceMutation(id)
	}

	const router = useRouter()

	async function handleSignOut() {
		try {
			await fetch("/api/sign-out", { method: "GET" })
			router.push("/admin/login")
		} catch (err) {
			console.error("Sign out failed", err)
		}
	}

	return (
		<div className="flex h-screen bg-shark text-white overflow-hidden">
			<div className="flex-1 min-w-0 overflow-y-auto">
				{!isLoaded ? (
					<LoadingSpinner />
				) : (
					<div className="p-6 lg:p-10 max-w-4xl">
						<header className="flex items-center justify-between mb-10">
							<div>
								<h1 className="text-xl font-bold text-white">Admin</h1>
								<p className="text-xs text-white/30 mt-0.5">nilloferreira.dev</p>
							</div>
							<button
								onClick={handleSignOut}
								className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/5 transition"
							>
								<LogOut size={13} />
								Sign out
							</button>
						</header>

						<section className="mb-10">
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
									Projects
									{projects && (
										<span className="ml-2 text-white/20 font-normal normal-case tracking-normal">
											{projects.length}
										</span>
									)}
								</h2>
								<button
									onClick={() => setPanel({ mode: "create-project" })}
									className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-primary border border-primary/30 hover:bg-primary/10 transition"
								>
									<Plus size={12} />
									Add
								</button>
							</div>
							<Reorder.Group
								as="div"
								axis="y"
								values={projects ?? []}
								onReorder={(newOrder) => queryClient.setQueryData(["projects"], newOrder)}
								className="space-y-0.5"
							>
								{projects?.map((p) => (
									<SortableProjectItem
										key={p.id}
										project={p}
										isActive={panel.mode === "edit-project" && panel.project.id === p.id}
										onEdit={(proj) => setPanel({ mode: "edit-project", project: proj })}
										onDelete={handleDeleteProject}
										onDragStart={handleProjectDragStart}
										onDragEnd={handleProjectDragEnd}
									/>
								))}
								{projects?.length === 0 && (
									<p className="text-sm text-white/20 py-4 px-3">No projects yet.</p>
								)}
							</Reorder.Group>
						</section>

						<section>
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
									Experiences
									{experiences && (
										<span className="ml-2 text-white/20 font-normal normal-case tracking-normal">
											{experiences.length}
										</span>
									)}
								</h2>
								<button
									onClick={() => setPanel({ mode: "create-experience" })}
									className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-primary border border-primary/30 hover:bg-primary/10 transition"
								>
									<Plus size={12} />
									Add
								</button>
							</div>
							<div className="space-y-0.5">
								{experiences?.map((e) => (
									<AdminExperienceCard
										key={e.id}
										experience={e}
										isActive={panel.mode === "edit-experience" && panel.experience.id === e.id}
										onEdit={(exp) => setPanel({ mode: "edit-experience", experience: exp })}
										onDelete={handleDeleteExperience}
									/>
								))}
								{experiences?.length === 0 && (
									<p className="text-sm text-white/20 py-4 px-3">No experiences yet.</p>
								)}
							</div>
						</section>
					</div>
				)}
			</div>

			<AdminSidePanel
				isOpen={isPanelOpen}
				title={panelTitles[panel.mode]}
				onClose={() => setPanel({ mode: "idle" })}
			>
				{panel.mode === "create-project" && (
					<ProjectPanelContent key="create-project" project={null} onClose={() => setPanel({ mode: "idle" })} />
				)}
				{panel.mode === "edit-project" && (
					<ProjectPanelContent
						key={panel.project.id}
						project={panel.project}
						onClose={() => setPanel({ mode: "idle" })}
					/>
				)}
				{panel.mode === "create-experience" && (
					<ExperiencePanelContent key="create-experience" experience={null} onClose={() => setPanel({ mode: "idle" })} />
				)}
				{panel.mode === "edit-experience" && (
					<ExperiencePanelContent
						key={panel.experience.id}
						experience={panel.experience}
						onClose={() => setPanel({ mode: "idle" })}
					/>
				)}
			</AdminSidePanel>
		</div>
	)
}
