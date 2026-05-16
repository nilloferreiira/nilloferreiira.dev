import { Pencil, Trash2 } from "lucide-react"
import { Experience } from "@/types/experience/experience"

interface AdminExperienceRowProps {
	experience: Experience
	onEdit: (experience: Experience) => void
	onDelete: (id: number) => void
	isActive?: boolean
}

export function AdminExperienceCard({ experience, onEdit, onDelete, isActive }: AdminExperienceRowProps) {
	const primary = experience.company || experience.title_pt || experience.title_en
	const secondary = experience.title_pt || experience.title_en

	return (
		<div
			className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
				isActive
					? "bg-white/8 ring-1 ring-primary/30"
					: "hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10"
			}`}
		>
			<div className="flex-1 min-w-0">
				<div className="font-medium text-white text-sm truncate">{primary}</div>
				{primary !== secondary && <div className="text-xs text-white/40 mt-0.5 truncate">{secondary}</div>}
			</div>

			<div className="flex items-center gap-1 flex-shrink-0">
				<button
					onClick={() => onEdit(experience)}
					className="p-1.5 text-white/30 hover:text-primary transition rounded-lg hover:bg-white/5"
				>
					<Pencil size={14} />
				</button>
				<button
					onClick={() => onDelete(experience.id)}
					className="p-1.5 text-white/30 hover:text-rose-400 transition rounded-lg hover:bg-white/5"
				>
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	)
}
