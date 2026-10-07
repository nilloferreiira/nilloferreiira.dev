"use client"

import { useRef } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { useInView } from "@/hooks/demos/useInView"
import { useSequence } from "@/hooks/demos/useSequence"
import { DEMO_COPY } from "./copy"
import { DemoHead, browserFrame, browserUrl, demoBody, demoCard } from "./demo-head"

const PARTS = ["<Header />", "<Hero />", "<Features />", "<Footer />"]

export function BuildDemo() {
	const { language } = useLanguage()
	const copy = DEMO_COPY[language].build
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref)
	const phase = useSequence(5, (s) => (s === 0 ? 600 : s === 4 ? 900 : 750), inView, 3400)
	const styled = phase >= 5
	const progress = Math.min(phase, 5) * 20

	return (
		<div ref={ref} className={demoCard}>
			<DemoHead k={copy.k} t={copy.t} d={copy.d} />
			<div className={demoBody}>
				<div className="grid grid-cols-[minmax(0,1fr)_170px] max-[680px]:grid-cols-1 gap-4">
					<div className={browserFrame}>
						<div className="flex items-center gap-2.5 px-3 py-[9px] border-b border-v-line">
							<div className={browserUrl}>{styled ? "https://cliente.com.br" : "localhost:3000"}</div>
						</div>
						<div className={`site flex flex-col gap-2.5 p-3.5 h-[300px] max-[680px]:h-[240px] ${styled ? "styled" : ""}`}>
							<div className={`blk s-nav h-[30px] flex items-center justify-between px-2.5 ${phase >= 1 ? "on" : ""}`}>
								<div className="bar logo-bar" style={{ width: 36 }} />
								<div className="flex gap-1.5">
									<div className="bar w-7" />
									<div className="bar w-7" />
									<div className="bar w-7" />
								</div>
							</div>
							<div className={`blk s-hero flex-[1.4] flex flex-col justify-center gap-2 px-4 ${phase >= 2 ? "on" : ""}`}>
								<div className="bar" style={{ width: "62%", height: 12 }} />
								<div className="bar sub" style={{ width: "44%" }} />
								<div className="bar cta mt-1.5" style={{ width: 60 }} />
							</div>
							<div className={`blk s-cards flex-1 grid grid-cols-3 gap-2 !border-0 ${phase >= 3 ? "on" : ""}`}>
								<div />
								<div />
								<div />
							</div>
							<div className={`blk s-foot h-[22px] ${phase >= 4 ? "on" : ""}`} />
						</div>
					</div>

					<div className="font-mono">
						<div className="flex flex-col max-[680px]:flex-row max-[680px]:flex-wrap gap-0.5 text-xs">
							<div className="px-2 pb-1.5 text-[10px] text-v-muted max-[680px]:hidden">{copy.tree}/</div>
							{PARTS.map((part, k) => (
								<div
									key={part}
									className={`px-2 py-1.5 rounded-md whitespace-nowrap transition-all duration-300 ${
										phase === k + 1 ? "bg-v-soft text-v-accent" : phase > k ? "text-v-text" : "text-v-muted"
									}`}
								>
									{part}
								</div>
							))}
						</div>
						<div className="h-[3px] mt-3 rounded-[2px] bg-v-panel2 overflow-hidden">
							<i className="block h-full bg-[image:var(--grad)] transition-[width] duration-600" style={{ width: `${progress}%` }} />
						</div>
						<div className={`mt-2 text-[11px] ${styled ? "text-v-ok" : "text-v-muted"}`}>
							{styled ? `✓ ${copy.done}` : `${copy.compiling} ${progress}%`}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
