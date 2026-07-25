"use client"

import { Reorder, useDragControls } from "framer-motion"
import { AdminProjectCard } from "@/components/admin/admin-project-card"
import { Project } from "@/types/project/project"

interface SortableProjectItemProps {
	project: Project
	isActive?: boolean
	onEdit: (project: Project) => void
	onDelete: (id: number) => void
	onDragStart: () => void
	onDragEnd: () => void
}

export function SortableProjectItem({ project, isActive, onEdit, onDelete, onDragStart, onDragEnd }: SortableProjectItemProps) {
	const controls = useDragControls()

	return (
		<Reorder.Item
			value={project}
			dragListener={false}
			dragControls={controls}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			<AdminProjectCard project={project} isActive={isActive} onEdit={onEdit} onDelete={onDelete} dragControls={controls} />
		</Reorder.Item>
	)
}
