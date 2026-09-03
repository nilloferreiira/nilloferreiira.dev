"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Links } from "./links"

export function HeaderContent() {
	const { language } = useLanguage()

	return (
		<div className="flex flex-col gap-5 text-center md:text-left">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
					{language === "en" ? "Hey! I'm " : "Olá! Eu sou o "}
					<span className="gradient-text">Danillo</span>
					<span> &#128075;</span>
				</h1>
				<p className="text-xl md:text-2xl text-muted-foreground mt-2 font-light">
					{language === "en" ? "Software Engineer" : "Engenheiro de Software"}
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="space-y-1 text-sm text-muted-foreground"
			>
				<p>
					<span className="text-primary font-medium">{language === "en" ? "Education: " : "Formação: "}</span>
					{language === "en" ? "Systems Analysis and Development" : "Análise e Desenvolvimento de Sistemas"}
				</p>
				<p>
					<span className="text-primary font-medium">{language === "en" ? "English" : "Inglês"}</span>
					{" — "}
					{language === "en" ? "B2 level (upper intermediate)" : "nível B2 (intermediário avançado)"}
				</p>
			</motion.div>

			<Links />

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7 }}
				className="flex justify-center md:justify-start"
			>
				<a
					href="mailto:nilloferreiira@gmail.com"
					className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:neon-glow font-medium"
				>
					{language === "en" ? "Contact me" : "Me contate"} <Mail size={18} />
				</a>
			</motion.div>
		</div>
	)
}
