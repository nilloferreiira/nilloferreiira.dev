"use client"

import { useEffect, useState } from "react"

const format = () =>
	new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })

export function Clock() {
	const [time, setTime] = useState<string | null>(null)

	useEffect(() => {
		setTime(format())
		const id = setInterval(() => setTime(format()), 15000)
		return () => clearInterval(id)
	}, [])

	return <span suppressHydrationWarning>{time ?? "--:--"} UTC-3</span>
}
