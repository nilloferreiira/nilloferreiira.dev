"use client"

import { About } from "@/components/about/about"
import { Contact } from "@/components/contact/contact"
import { Demos } from "@/components/demos/demos"
import { EducationNow } from "@/components/education-now/education-now"
import { ExperienceContainer } from "@/components/experiences/experiences-container"
import { Header } from "@/components/header/header"
import { Navbar } from "@/components/navbar/navbar"
import { ProjectContainer } from "@/components/projects/projects-container"
import { Stack } from "@/components/stack/stack"
import { useExperiences } from "@/hooks/experiences/useExperiences"

export default function Home() {
	const { data: experiences, isLoading: isLoadingExperiences } = useExperiences()
	return (
		<div className="min-h-screen relative">
			<Navbar />
			<Header />
			<main className="w-full flex flex-col">
				<About />
				<Demos />
				<Stack />
				<ExperienceContainer experiences={experiences ?? []} isLoading={isLoadingExperiences} />
				<ProjectContainer />
				<EducationNow />
			</main>
			<Contact />
		</div>
	)
}
