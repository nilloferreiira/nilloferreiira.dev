"use client"

import { Home } from "lucide-react"
import { PillButton } from "@/components/ui/pill-button"
import { useLanguage } from "@/hooks/useLanguage"

export default function NotFound() {
	const { language } = useLanguage()
	const isPt = language === "pt-BR"

	return (
		<main className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
			<p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">Error 404</p>
			<h1 className="text-7xl md:text-9xl font-bold gradient-text neon-text">404</h1>
			<h2 className="text-2xl md:text-3xl font-bold text-foreground">
				{isPt ? "Página não encontrada" : "Page not found"}
			</h2>
			<p className="text-muted-foreground max-w-md">
				{isPt
					? "A página que você procura não existe ou foi movida."
					: "The page you're looking for doesn't exist or has been moved."}
			</p>
			<PillButton href="/" icon={<Home size={18} />}>
				{isPt ? "Voltar ao início" : "Back to home"}
			</PillButton>
		</main>
	)
}
