import { ExternalLink, GripVertical, Pencil, Trash2 } from "lucide-react"
import type { DragControls } from "framer-motion"
import { Project } from "@/types/project/project"
import { imagePlaceholderStyle } from "@/components/admin/image-placeholder"

interface AdminProjectRowProps {
	project: Project
	onEdit: (project: Project) => void
	onDelete: (id: number) => void
	isActive?: boolean
	dragControls?: DragControls
}

const categoryStyle: Record<Project["category"], string> = {
	personal: "bg-primary/15 text-primary",
	freelance: "bg-amber-400/15 text-amber-400",
	work: "bg-violet-400/15 text-violet-400",
	evento: "bg-rose-400/15 text-rose-400"
}

export function AdminProjectCard({ project, onEdit, onDelete, isActive, dragControls }: AdminProjectRowProps) {
	return (
		<div
			className={`flex items-center gap-4 px-2.5 py-3.5 border-b border-[#1a2033] transition-all ${
				isActive ? "bg-white/8 ring-1 ring-primary/30" : "hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10"
			}`}
		>
			{dragControls && (
				<div
					onPointerDown={(e) => dragControls.start(e)}
					className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 flex-shrink-0 touch-none"
				>
					<GripVertical size={14} />
				</div>
			)}

			{project.imgSrc ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={project.imgSrc}
					alt={project.title}
					className="w-14 h-10 object-cover rounded-md bg-white/5 flex-shrink-0"
				/>
			) : (
				<div style={imagePlaceholderStyle} className="w-14 h-10 rounded-md flex-shrink-0" />
			)}

			<div className="min-w-0 w-40 flex-shrink-0">
				<div className="font-medium text-white text-sm truncate">{project.title}</div>
				<span
					className={`text-xs px-1.5 py-0.5 rounded-md font-medium mt-0.5 inline-block ${categoryStyle[project.category]}`}
				>
					{project.category}
				</span>
			</div>

			<div className="flex flex-wrap gap-1 flex-1 min-w-0">
				{project.tags.map((tag, i) => (
					<span key={`${tag}-${i}`} className="text-xs bg-white/8 text-white/50 px-1.5 py-0.5 rounded">
						{tag}
					</span>
				))}
			</div>

			<div className="flex items-center gap-1 flex-shrink-0">
				{project.url && (
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						className="p-1.5 text-white/30 hover:text-white/70 transition rounded-lg hover:bg-white/5"
						onClick={(e) => e.stopPropagation()}
					>
						<ExternalLink size={14} />
					</a>
				)}
				<button
					onClick={() => onEdit(project)}
					className="p-1.5 text-white/30 hover:text-primary transition rounded-lg hover:bg-white/5"
				>
					<Pencil size={14} />
				</button>
				<button
					onClick={() => onDelete(project.id)}
					className="p-1.5 text-white/30 hover:text-rose-400 transition rounded-lg hover:bg-white/5"
				>
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	)
}
