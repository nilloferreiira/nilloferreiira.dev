"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
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
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (!open) return
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false)
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [open])

	const label = (link: (typeof links)[number]) => (language === "pt-BR" ? link.pt : link.en)

	return (
		<div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
			<div className="relative max-w-full">
				<nav className="flex max-w-full items-center gap-4 sm:gap-7 rounded-full border border-border/50 bg-background/80 backdrop-blur-md px-4 py-2 font-mono text-xs font-bold">
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-expanded={open}
						aria-label={
							language === "pt-BR" ? (open ? "Fechar menu" : "Abrir menu") : open ? "Close menu" : "Open menu"
						}
						className="sm:hidden cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
					>
						{open ? <X size={16} /> : <Menu size={16} />}
					</button>
					{links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="hidden sm:inline tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors"
						>
							{label(link)}
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
				{open && (
					<div className="sm:hidden absolute top-full mt-2 inset-x-0 flex flex-col gap-1 rounded-2xl border border-border/50 bg-background/90 backdrop-blur-md p-2 font-mono text-xs font-bold">
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								onClick={() => setOpen(false)}
								className="rounded-lg px-3 py-2 tracking-[0.04em] text-muted-foreground hover:text-foreground transition-colors"
							>
								{label(link)}
							</a>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
