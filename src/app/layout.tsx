import type { Metadata } from "next"
import { Manrope, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
import { QueryProvider } from "@/context/query-provider"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" })

export const metadata: Metadata = {
	title: "Nilloferreira.dev",
	description:
		"Personal portfolio of Nillo Ferreira, a software developer specializing in web development and modern technologies."
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR">
			<head>
				<link rel="icon" href="favicon.ico" />
			</head>

			<QueryProvider>
				<LanguageProvider language="pt-BR">
					<body
						className={`${manrope.variable} ${jetbrainsMono.variable} bg-background text-muted-foreground py-6 lg:py-24 mx-auto w-full space-y-20 overflow-x-hidden`}
					>
						{children}
					</body>
				</LanguageProvider>
			</QueryProvider>
		</html>
	)
}
