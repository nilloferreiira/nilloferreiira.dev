import type { Metadata } from "next"
import { Manrope, JetBrains_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
import { QueryProvider } from "@/context/query-provider"
import { ThemeProvider } from "@/context/theme-context"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" })
const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
	variable: "--font-instrument-serif",
	display: "swap"
})

export const metadata: Metadata = {
	title: "Nilloferreira.dev",
	description:
		"Personal portfolio of Nillo Ferreira, a software developer specializing in web development and modern technologies."
}

// Runs before paint so the stored theme is applied without a flash
const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem("theme")||"dark"}catch(e){document.documentElement.dataset.theme="dark"}`

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
			<head>
				<link rel="icon" href="favicon.ico" />
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body
				className={`${manrope.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} font-sans bg-v-bg text-v-text antialiased w-full overflow-x-hidden transition-colors duration-400`}
			>
				<QueryProvider>
					<ThemeProvider>
						<LanguageProvider language="pt-BR">{children}</LanguageProvider>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
