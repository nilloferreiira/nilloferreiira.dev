"use client"

import { Contact } from "@/components/contact/contact"
import { ExperienceContainer } from "@/components/experiences/experiences-container"
import { Header } from "@/components/header/header"
import { SwitchLanguage } from "@/components/language/switch"
import { LoadingSpinner } from "@/components/loading/loading"
import { ProjectContainer } from "@/components/projects/projects-container"
import { useExperiences } from "@/hooks/experiences/useExperiences"
import { useProjects } from "@/hooks/projects/useProjects"

export default function Home() {
	const { data: projects, isLoading: isLoadingProjects } = useProjects()
	const { data: experiences, isLoading: isLoadingExperiences } = useExperiences()
	const isLoading = isLoadingProjects && isLoadingExperiences
	return (
		<>
			<div className="absolute right-10 md:right-20 md:-mt-10">
				<SwitchLanguage />
			</div>
			<Header />
			<main className="lg:p-10 w-full flex flex-col items-center justify-center gap-20">
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						<ExperienceContainer experiences={experiences!} />
						<ProjectContainer projects={projects!} />
					</>
				)}
				<Contact />
			</main>
		</>
	)
}
