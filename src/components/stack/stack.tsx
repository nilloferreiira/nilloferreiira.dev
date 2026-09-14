"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Kicker } from "@/components/ui/kicker"
import { Marquee } from "@/components/marquee/marquee"

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
	const items = t.groups.flatMap((group) => group.items)

	return (
		<section className="py-24" id="stack">
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				<div className="container max-w-5xl mx-auto px-6">
					<Kicker label={t.kicker} />
					<h2 className="text-3xl md:text-4xl font-bold mb-12">
						<span className="gradient-text">{t.title}</span>
					</h2>
				</div>

				<Marquee items={items} />
			</motion.div>
		</section>
	)
}
