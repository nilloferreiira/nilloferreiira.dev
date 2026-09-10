"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Kicker } from "@/components/ui/kicker"
import { Tag } from "@/components/ui/tag"

const copy = {
	en: {
		kicker: "Stack",
		title: "Day-to-day technologies",
		groups: [
			{ label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP"] },
			{ label: "Backend", items: ["Node.js", "Fastify", "Laravel", "PHP", "REST APIs"] },
			{ label: "Database", items: ["PostgreSQL", "MySQL", "Redis", "Prisma", "Supabase", "Drizzle ORM"] },
			{ label: "Mobile & DevOps", items: ["Flutter", "Dart", "React Native", "Docker", "AWS", "Git"] }
		]
	},
	"pt-BR": {
		kicker: "Stack",
		title: "Tecnologias do dia a dia",
		groups: [
			{ label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP"] },
			{ label: "Backend", items: ["Node.js", "Fastify", "Laravel", "PHP", "REST APIs"] },
			{ label: "Database", items: ["PostgreSQL", "MySQL", "Redis", "Prisma", "Supabase", "Drizzle ORM"] },
			{ label: "Mobile & DevOps", items: ["Flutter", "Dart", "React Native", "Docker", "AWS", "Git"] }
		]
	}
}

export function Stack() {
	const { language } = useLanguage()
	const t = copy[language]

	return (
		<section className="py-24 px-6" id="stack">
			<div className="container max-w-5xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Kicker label={t.kicker} />
					<h2 className="text-3xl md:text-4xl font-bold mb-12">
						<span className="gradient-text">{t.title}</span>
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{t.groups.map((group) => (
							<div key={group.label} className="glass rounded-xl p-6 space-y-4">
								<p className="font-mono text-xs uppercase tracking-wider text-primary">{group.label}</p>
								<div className="flex flex-wrap gap-2">
									{group.items.map((item) => (
										<Tag key={item}>{item}</Tag>
									))}
								</div>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}
