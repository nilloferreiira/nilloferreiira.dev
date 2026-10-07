"use client"

import { useEffect, useState } from "react"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { useTheme } from "@/hooks/useTheme"
import { ChipButton } from "@/components/ui/chip-button"
import { wrap } from "@/components/ui/section"

export const navLinks = [
	{ href: "#about", en: "About", pt: "Sobre" },
	{ href: "#demos", en: "Demos", pt: "Demos" },
	{ href: "#stack", en: "Stack", pt: "Stack" },
	{ href: "#experience", en: "Career", pt: "Carreira" },
	{ href: "#projects", en: "Work", pt: "Trabalho" },
	{ href: "#education", en: "Education", pt: "Formação" },
	{ href: "#contact", en: "Contact", pt: "Contato" }
]

export function Navbar() {
	const { language, changeLanguage } = useLanguage()
	const { mode, toggleMode } = useTheme()
	const [open, setOpen] = useState(false)
	const isPt = language === "pt-BR"

	useEffect(() => {
		if (!open) return
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false)
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [open])

	const label = (link: (typeof navLinks)[number]) => (isPt ? link.pt : link.en)

	return (
		<>
			<header className="fixed top-0 inset-x-0 z-50 border-b border-v-line bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-md">
				<div className={`${wrap} flex items-center justify-between gap-6 h-16`}>
					<a href="#top" className="flex items-center gap-2 font-mono text-sm font-bold text-v-text">
						<b className="text-v-accent">~/</b>danilloferreira
					</a>

					<nav className="flex gap-1 font-mono max-[1080px]:hidden">
						{navLinks.map((link, i) => (
							<a
								key={link.href}
								href={link.href}
								className="flex gap-1.5 px-3 py-2 rounded-lg text-xs text-v-dim transition-colors hover:bg-v-panel2 hover:text-v-text"
							>
								<span className="text-v-muted">0{i + 1}</span>
								{label(link)}
							</a>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<ChipButton
							onClick={() => changeLanguage?.(isPt ? "en" : "pt-BR")}
							aria-label={isPt ? "Mudar idioma" : "Change language"}
						>
							<span className={isPt ? "text-v-accent" : ""}>BR</span>
							<span className="text-v-muted">/</span>
							<span className={!isPt ? "text-v-accent" : ""}>EN</span>
						</ChipButton>
						<ChipButton onClick={toggleMode} aria-label={isPt ? "Alternar tema" : "Toggle theme"}>
							{mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
							<span className="max-[680px]:hidden">{mode === "dark" ? "light" : "dark"}</span>
						</ChipButton>
						<ChipButton
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
							aria-label={isPt ? (open ? "Fechar menu" : "Abrir menu") : open ? "Close menu" : "Open menu"}
							className="min-[1081px]:hidden"
						>
							{open ? <X size={16} /> : <Menu size={16} />}
						</ChipButton>
					</div>
				</div>
			</header>

			<div
				aria-hidden={!open}
				className={`min-[1081px]:hidden fixed top-16 inset-x-0 z-40 flex flex-col px-[clamp(20px,5vw,72px)] pt-3 pb-5 bg-v-bg border-b border-v-line font-mono transition-all duration-250 ${
					open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
				}`}
			>
				{navLinks.map((link, i) => (
					<a
						key={link.href}
						href={link.href}
						onClick={() => setOpen(false)}
						tabIndex={open ? 0 : -1}
						className="flex gap-3 py-3.5 border-b border-v-line text-[15px] text-v-text hover:text-v-accent"
					>
						<span className="text-v-muted">0{i + 1}</span>
						{label(link)}
					</a>
				))}
			</div>
		</>
	)
}
