import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/context/language-context"
import { QueryProvider } from "@/context/query-provider"

export const metadata: Metadata = {
	title: "Nilloferreira.dev",
	description:
		"Personal portfolio of Nillo Ferreira, a software developer specializing in web development and modern technologies."
}

//TODO definir font inter

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
					<body className="bg-background text-muted-foreground px-4 py-6 lg:p-24 mx-auto w-full space-y-20 overflow-x-hidden">{children}</body>
				</LanguageProvider>
			</QueryProvider>
		</html>
	)
}
