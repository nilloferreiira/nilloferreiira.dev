"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Project } from "./project"
import { Project as ProjectType } from "@/types/project/project"

interface ProjectsContainerProps {
	projects: ProjectType[]
}

export function ProjectContainer({ projects }: ProjectsContainerProps) {
	const { language } = useLanguage()

	return (
		<div className="bg-shark w-full flex flex-col items-start justify-center p-4 lg:p-16 rounded-lg space-y-6 lg:space-y-12">
			<h1 className="text-zinc-100 font-semibold text-3xl">
				{language == "pt-BR" ? "Meus projetos " : "My projects "}&#x1F447;
			</h1>

			{/* projects grid  */}
			<div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
				{/* project card  */}
				{projects &&
					projects.map((project) => (
						<Project
							key={project.id}
							language={language}
							project={project}
						/>
					))}
			</div>
		</div>
	)
}
