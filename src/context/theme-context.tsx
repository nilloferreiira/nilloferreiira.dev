"use client"

import { createContext, useEffect, useState } from "react"

type Mode = "dark" | "light"

interface ThemeContextProps {
	mode: Mode
	toggleMode?: () => void
	children?: React.ReactNode
}

export const themeContext = createContext<ThemeContextProps>({ mode: "dark", toggleMode: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mode, setMode] = useState<Mode>("dark")

	// The inline script in layout.tsx already applied the stored theme; sync state with it
	useEffect(() => {
		if (document.documentElement.dataset.theme === "light") setMode("light")
	}, [])

	function toggleMode() {
		const next: Mode = mode === "dark" ? "light" : "dark"
		setMode(next)
		document.documentElement.dataset.theme = next
		try {
			localStorage.setItem("theme", next)
		} catch {}
	}

	return <themeContext.Provider value={{ mode, toggleMode }}>{children}</themeContext.Provider>
}
