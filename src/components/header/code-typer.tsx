"use client"

import { useEffect, useState } from "react"

const CODE_TOKENS: [string, string][] = [
	["tok-k", "const"], ["", " dev "], ["tok-p", "="], ["", " {\n"],
	["", "  name"], ["tok-p", ":"], ["tok-s", ' "Danillo Ferreira"'], ["", ",\n"],
	["", "  role"], ["tok-p", ":"], ["tok-s", ' "Software Engineer"'], ["", ",\n"],
	["", "  focus"], ["tok-p", ":"], ["", " ["], ["tok-s", '"APIs"'], ["", ", "], ["tok-s", '"IA"'], ["", ", "], ["tok-s", '"web"'], ["", "],\n"],
	["", "  stack"], ["tok-p", ":"], ["", " ["], ["tok-s", '"Node"'], ["", ", "], ["tok-s", '"Laravel"'], ["", ", "], ["tok-s", '"Postgres"'], ["", "],\n"],
	["", "  available"], ["tok-p", ":"], ["tok-b", " true"], ["", ",\n"],
	["", "};\n\n"],
	["tok-k", "export default"], ["", " dev;"]
]

const TOTAL = CODE_TOKENS.reduce((acc, [, text]) => acc + text.length, 0)
const LINES = 10

export function CodeTyper() {
	const [n, setN] = useState(0)

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setN(TOTAL)
			return
		}
		let interval: ReturnType<typeof setInterval> | undefined
		const start = setTimeout(() => {
			interval = setInterval(() => {
				setN((v) => {
					if (v >= TOTAL) {
						clearInterval(interval)
						return v
					}
					return v + 1
				})
			}, 22)
		}, 700)
		return () => {
			clearTimeout(start)
			clearInterval(interval)
		}
	}, [])

	let left = n
	const out: React.ReactNode[] = []
	for (let k = 0; k < CODE_TOKENS.length && left > 0; k++) {
		const [cls, text] = CODE_TOKENS[k]
		out.push(
			<span key={k} className={cls}>
				{text.slice(0, left)}
			</span>
		)
		left -= text.length
	}

	return (
		<div className="font-mono border border-v-line bg-v-bg2 rounded-[14px] overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] [[data-theme=light]_&]:shadow-v-card">
			<div className="flex items-center justify-between px-3.5 py-2.5 border-b border-v-line text-xs text-v-muted">
				<span className="flex items-center gap-2 text-v-dim">
					<i className="w-2 h-2 rounded-[2px] bg-v-accent2" />
					dev.ts
				</span>
				<span>TypeScript</span>
			</div>
			<div className="grid grid-cols-[auto_1fr] text-[clamp(12px,1vw,14px)] leading-[1.85] py-4">
				<div className="px-3.5 text-v-muted text-right select-none opacity-60" aria-hidden="true">
					{Array.from({ length: LINES }, (_, k) => (
						<div key={k}>{k + 1}</div>
					))}
				</div>
				<div className="pr-4 whitespace-pre overflow-hidden text-v-text">
					{out}
					<span className="caret" />
				</div>
			</div>
		</div>
	)
}
