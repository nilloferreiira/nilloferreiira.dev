"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { motion } from "framer-motion"
import { Github, Linkedin, FileUser } from "lucide-react"
import { tv } from "tailwind-variants"

const linkButton = tv({
	variants: {
		variant: {
			glass: "glass glass-hover neon-glow rounded-full size-12 flex items-center justify-center transition-all",
		},
	},
	defaultVariants: {
		variant: "glass",
	},
})

export function Links() {
	const { language } = useLanguage()
	const cvPath = language === "en" ? "danillo-ferreira-cv-en.pdf" : "danillo-ferreira-cv-pt.pdf"

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.6 }}
			className="flex items-center gap-3 justify-center md:justify-start"
			data-slot="social-links"
		>
			<a
				href="https://github.com/nilloferreiira"
				target="_blank"
				className={linkButton({ variant: "glass" })}
			>
				<span><Github className="text-foreground" /></span>
			</a>
			<a
				href="https://www.linkedin.com/in/nilloferreiira/"
				target="_blank"
				className={linkButton({ variant: "glass" })}
			>
				<span><Linkedin className="text-foreground" /></span>
			</a>
			<a
				href={`/files/${cvPath}`}
				download
				className={linkButton({ variant: "glass" })}
			>
				<span><FileUser className="text-foreground" /></span>
			</a>
		</motion.div>
	)
}
