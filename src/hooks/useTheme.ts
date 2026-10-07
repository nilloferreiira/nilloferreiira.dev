import { useContext } from "react"
import { themeContext } from "@/context/theme-context"

export function useTheme() {
	return useContext(themeContext)
}
