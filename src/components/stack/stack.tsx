"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { Marquee } from "@/components/marquee/marquee"

const groups = [
	{ label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP"] },
	{ label: "Backend", items: ["Node.js", "Fastify", "Laravel", "PHP", "REST APIs"] },
	{ label: "Database", items: ["PostgreSQL", "MySQL", "Redis", "Prisma", "Supabase", "Drizzle ORM"] },
	{ label: "Mobile & DevOps", items: ["Flutter", "Dart", "React Native", "Docker", "AWS", "Git"] }
]

const copy = {
	en: { title: "Day-to-day technologies" },
	"pt-BR": { title: "Tecnologias do dia a dia" }
}

export function Stack() {
	const { language } = useLanguage()
	const t = copy[language]
	const items = groups.flatMap((group) => group.items)

	return (
		<Section id="stack" index="03" path="stack" title={t.title} after={<Marquee items={items} />}>
			<Reveal>
				<div className="grid grid-cols-4 max-[1080px]:grid-cols-2 border-t border-l border-v-line">
					{groups.map((group) => (
						<div
							key={group.label}
							className="flex flex-col gap-3.5 p-[22px] max-[680px]:p-4 border-r border-b border-v-line transition-colors duration-300 hover:bg-v-panel"
						>
							<span className="font-mono text-[11px] text-v-accent">{group.label.toLowerCase()}/</span>
							<ul className="list-none m-0 p-0 flex flex-col gap-2">
								{group.items.map((item, i) => (
									<li
										key={item}
										className="flex justify-between gap-2 text-[15px] max-[680px]:text-sm font-semibold text-v-text"
									>
										{item}
										<span className="font-mono text-[11px] font-normal text-v-muted">
											{String(i + 1).padStart(2, "0")}
										</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Reveal>
		</Section>
	)
}
