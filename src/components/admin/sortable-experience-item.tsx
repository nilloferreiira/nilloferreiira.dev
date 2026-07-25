"use client"

import { Reorder, useDragControls } from "framer-motion"
import { AdminExperienceCard } from "@/components/admin/admin-experience-card"
import { Experience } from "@/types/experience/experience"

interface SortableExperienceItemProps {
	experience: Experience
	isActive?: boolean
	onEdit: (experience: Experience) => void
	onDelete: (id: number) => void
	onDragStart: () => void
	onDragEnd: () => void
}

export function SortableExperienceItem({
	experience,
	isActive,
	onEdit,
	onDelete,
	onDragStart,
	onDragEnd
}: SortableExperienceItemProps) {
	const controls = useDragControls()

	return (
		<Reorder.Item
			value={experience}
			dragListener={false}
			dragControls={controls}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			<AdminExperienceCard experience={experience} isActive={isActive} onEdit={onEdit} onDelete={onDelete} dragControls={controls} />
		</Reorder.Item>
	)
}
