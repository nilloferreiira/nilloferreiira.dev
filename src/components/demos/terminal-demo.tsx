"use client"

import { useRef } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { useInView } from "@/hooks/demos/useInView"
import { useSequence } from "@/hooks/demos/useSequence"
import { DEMO_COPY, TERM_LINES } from "./copy"
import { DemoHead, demoBody, demoCard } from "./demo-head"
import { Typed } from "./typed"

const prompt = <span className="text-[#5EEAD4]">~/api $ </span>

export function TerminalDemo() {
	const { language } = useLanguage()
	const copy = DEMO_COPY[language].term
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref)
	const step = useSequence(
		TERM_LINES.length,
		(s) => {
			const prev = TERM_LINES[s - 1]
			return s === 0 ? 500 : prev && prev.c ? prev.x.length * 26 + 450 : 260
		},
		inView,
		3600
	)

	return (
		<div ref={ref} className={demoCard}>
			<DemoHead {...copy} />
			<div className={demoBody}>
				<div className="font-mono flex flex-col gap-0.5 h-full min-h-[340px] max-[680px]:min-h-[300px] px-[18px] py-4 rounded-xl border border-v-line bg-[#0B0F16] [[data-theme=light]_&]:bg-[#101317] text-[#D6DBE2] text-[12.5px] max-[680px]:text-[11.5px] leading-[1.75] overflow-hidden">
					{TERM_LINES.slice(0, step).map((line, k) => (
						<div key={k} className="pop-in whitespace-pre-wrap break-all">
							{line.c ? (
								<>
									{prompt}
									<Typed text={line.x} />
								</>
							) : (
								line.h.map(([cls, text], j) => (
									<span key={j} className={cls}>
										{text}
									</span>
								))
							)}
						</div>
					))}
					{(step === 0 || step >= TERM_LINES.length) && (
						<div className="pop-in">
							{prompt}
							<span className="caret" />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
