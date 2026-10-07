"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { DEMO_COPY } from "./copy"
import { ChatDemo } from "./chat-demo"
import { DashDemo } from "./dash-demo"
import { BuildDemo } from "./build-demo"
import { TerminalDemo } from "./terminal-demo"

export function Demos() {
	const { language } = useLanguage()
	const copy = DEMO_COPY[language].demos

	return (
		<Section id="demos" index="02" path={copy.path} title={copy.title}>
			<div className="grid grid-cols-12 gap-5">
				<Reveal className="col-span-12 min-w-0">
					<ChatDemo />
				</Reveal>
				<Reveal className="col-span-12 min-w-0">
					<DashDemo />
				</Reveal>
				<Reveal className="col-span-6 max-[1080px]:col-span-12 min-w-0">
					<BuildDemo />
				</Reveal>
				<Reveal delay={0.1} className="col-span-6 max-[1080px]:col-span-12 min-w-0">
					<TerminalDemo />
				</Reveal>
			</div>
		</Section>
	)
}
