"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { Links } from "./links"

export function HeaderContent() {
	const { language } = useLanguage()

	return (
		<div className="flex flex-col gap-5 items-center md:items-start justify-center">
			<div className="p-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<h1 className="text-4xl lg:text-5xl text-foreground font-semibold sm-mx-auto text-center lg:text-left">
						{language === "en" ? "Hi I'm Danillo" : "Olá! Eu sou o Danillo"}
						<span>&#128075;</span>
					</h1>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="p-2"
				>
					<h2
						className={`${language === "en" ? "text-2xl" : "text-xl"} lg:text-4xl text-muted-foreground tracking-widest whitespace-nowrap overflow-hidden typing-animation`}
					>
						{language === "en" ? "Software Developer" : "Desenvolvedor de Software"}
					</h2>
				</motion.div>
			</div>

			<div className="px-8">
				<div className="flex flex-col gap-2">
					<span className="text-muted-foreground">
						<strong className="text-foreground">{language === "en" ? "Degree: " : "Formação: "}</strong>
						{language === "en" ? "Systems Analysis and Development" : "Análise e Desenvolvimento de Sistemas"}
					</span>
					<span className="text-muted-foreground flex items-center gap-2">
						<strong className="text-foreground">{language === "en" ? "English" : "Inglês"}</strong>
						<span className="text-muted-foreground">—</span>
						<span className="text-muted-foreground">
							{language === "en" ? "B2 (Upper-intermediate)" : "nível B2 (intermediário avançado)"}
						</span>
					</span>
				</div>
			</div>

			<div className="w-96 space-y-5">
				<Links />
				<a
					href="mailto:nilloferreiira@gmail.com"
					className="bg-surface rounded-full py-4 w-4/5 mx-auto font-bold text-foreground flex items-center justify-center gap-2 hover:bg-surface/80 transition-colors"
				>
					{language === "en" ? "Contact me" : "Me contate"} <Mail />
				</a>
			</div>
		</div>
	)
}
