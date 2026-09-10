"use client"

import { About } from "@/components/about/about"
import { Contact } from "@/components/contact/contact"
import { Education } from "@/components/education/education"
import { ExperienceContainer } from "@/components/experiences/experiences-container"
import { Header } from "@/components/header/header"
import { SwitchLanguage } from "@/components/language/switch"
import { LoadingSpinner } from "@/components/loading/loading"
import { Now } from "@/components/now/now"
import { ProjectContainer } from "@/components/projects/projects-container"
import { Stack } from "@/components/stack/stack"
import { useExperiences } from "@/hooks/experiences/useExperiences"
import { useProjects } from "@/hooks/projects/useProjects"

export default function Home() {
	const { data: projects, isLoading: isLoadingProjects } = useProjects()
	const { data: experiences, isLoading: isLoadingExperiences } = useExperiences()
	const isLoading = isLoadingProjects || isLoadingExperiences
	return (
		<div className="min-h-screen relative">
			<div className="fixed top-6 right-6 z-50">
				<SwitchLanguage />
			</div>
			<Header />
			<main className="w-full flex flex-col">
				<About />
				<Stack />
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						<ExperienceContainer experiences={experiences!} />
						<ProjectContainer projects={projects!} />
					</>
				)}
				<Education />
				<Now />
				<Contact />
			</main>
		</div>
	)
}
