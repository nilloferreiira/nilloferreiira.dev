"use client"

import { useEffect, useState } from "react"

interface TypedProps {
	text: string
	speed?: number
}

export function Typed({ text, speed = 26 }: TypedProps) {
	const [n, setN] = useState(0)

	useEffect(() => {
		setN(0)
		const id = setInterval(() => {
			setN((v) => {
				if (v >= text.length) {
					clearInterval(id)
					return v
				}
				return v + 1
			})
		}, speed)
		return () => clearInterval(id)
	}, [text, speed])

	return (
		<>
			{text.slice(0, n)}
			{n < text.length && <span className="caret" />}
		</>
	)
}
