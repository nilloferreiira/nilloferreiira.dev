"use client"

import { useLanguage } from "@/hooks/useLanguage"

const links = [
	{ href: "#about", en: "About", pt: "Sobre" },
	{ href: "#stack", en: "Stack", pt: "Stack" },
	{ href: "#experience", en: "Experience", pt: "Experiência" },
	{ href: "#projects", en: "Projects", pt: "Projetos" },
	{ href: "#contact", en: "Contact", pt: "Contato" }
]

export function Navbar() {
	const { language, changeLanguage } = useLanguage()

	return (
		<div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
			<nav className="flex items-center gap-7 rounded-full border border-border/50 bg-background/80 backdrop-blur-md px-4 py-2 font-mono text-xs font-bold">
				{links.map((link) => (
					<a
						key={link.href}
						href={link.href}
						className="tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors"
					>
						{language === "pt-BR" ? link.pt : link.en}
					</a>
				))}
				<span className="w-px h-3.5 bg-border" />
				<div className="flex items-center gap-3">
					<button
						onClick={() => changeLanguage?.("pt-BR")}
						className={`cursor-pointer transition-colors ${
							language === "pt-BR" ? "text-primary" : "text-muted-foreground hover:text-foreground"
						}`}
					>
						BR
					</button>
					<span className="text-muted-foreground">|</span>
					<button
						onClick={() => changeLanguage?.("en")}
						className={`cursor-pointer transition-colors ${
							language === "en" ? "text-primary" : "text-muted-foreground hover:text-foreground"
						}`}
					>
						EN
					</button>
				</div>
			</nav>
		</div>
	)
}
