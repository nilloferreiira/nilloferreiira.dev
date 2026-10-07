"use client"

import { Fragment, useRef, useState } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { pillTab } from "@/components/ui/chip-button"
import { useInView } from "@/hooks/demos/useInView"
import { useSequence } from "@/hooks/demos/useSequence"
import { DEMO_COPY, type Scenario, type ScriptStep } from "./copy"
import {
	DemoHead,
	FakeInput,
	TypingDots,
	bubbleAgent,
	bubbleUser,
	demoBody,
	demoCard,
	scenTabs
} from "./demo-head"

type ChatCopy = (typeof DEMO_COPY)["en"]["chat"]

const time = (n: number) => `14:${String(20 + n).padStart(2, "0")}`

function ChatRun({ copy, scenario, inView }: { copy: ChatCopy; scenario: Scenario; inView: boolean }) {
	const script = scenario.script
	const step = useSequence(
		script.length,
		(s) => (script[s].t === "a" ? 1700 : script[s].t === "u" ? 1300 : 550),
		inView,
		3800
	)
	const shown = script.slice(0, step)
	const messages = shown.filter((e): e is Extract<ScriptStep, { t: "u" | "a" }> => e.t !== "l")
	const logs = shown.filter((e): e is Extract<ScriptStep, { t: "l" }> => e.t === "l")
	const lastNode = logs.length ? logs[logs.length - 1].n : -1
	const typing = step < script.length && script[step].t === "a"

	return (
		<div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] max-[680px]:grid-cols-1 gap-5 items-stretch">
			<div className="flex flex-col w-full max-w-[380px] max-[680px]:max-w-none justify-self-center rounded-[22px] border border-v-line bg-v-bg2 overflow-hidden">
				<div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-v-line">
					<div className="w-[34px] h-[34px] rounded-full bg-[image:var(--grad)] flex items-center justify-center text-[#0A0D14] font-extrabold text-[13px]">
						{scenario.avatar}
					</div>
					<div>
						<b className="block text-sm text-v-text">{scenario.contact}</b>
						<small className="font-mono text-[11px] text-v-ok">{copy.online}</small>
					</div>
				</div>
				<div className="h-[340px] max-[680px]:h-[300px] flex flex-col justify-end gap-2 p-4 overflow-hidden">
					{messages.map((m, k) => (
						<div key={k} className={m.t === "u" ? bubbleUser : bubbleAgent}>
							{m.x}
							<small className="block mt-1 font-mono text-[10px] text-v-muted text-right">{time(k)}</small>
						</div>
					))}
					{typing && <TypingDots />}
				</div>
				<FakeInput>{copy.input}</FakeInput>
			</div>

			<div className="flex flex-col rounded-[14px] border border-v-line bg-v-bg2 overflow-hidden font-mono">
				<div className="flex justify-between px-4 py-3 border-b border-v-line text-xs text-v-muted">
					<span>{copy.flow}</span>
					<span>
						{logs.length} {copy.events}
					</span>
				</div>
				<div className="flex flex-wrap items-center gap-2 p-4 border-b border-v-line">
					{scenario.nodes.map((node, k) => (
						<Fragment key={node}>
							{k > 0 && <span className="text-[11px] text-v-muted">→</span>}
							<span
								className={`px-2.5 py-1.5 rounded-lg border text-[11px] transition-all duration-300 ${
									lastNode === k ? "border-v-accent text-v-accent bg-v-soft" : "border-v-line text-v-muted"
								}`}
							>
								{node}
							</span>
						</Fragment>
					))}
				</div>
				<div className="flex-1 flex flex-col justify-end gap-1.5 px-4 py-3.5 text-xs min-h-[220px] max-[680px]:min-h-[160px] overflow-hidden">
					{logs.map((log, k) => (
						<div key={k} className="pop-in grid grid-cols-[62px_1fr] gap-2.5 text-v-dim">
							<span className="text-v-muted">
								{time(k)}.{String(12 + k * 7).padStart(2, "0")}
							</span>
							<span>
								<b className="text-v-accent font-medium">{log.x[0]}</b> {log.x[1]}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export function ChatDemo() {
	const { language } = useLanguage()
	const copy = DEMO_COPY[language]
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref)
	const [scenarioId, setScenarioId] = useState("ecom")
	const scenario = copy.scenarios.find((s) => s.id === scenarioId) ?? copy.scenarios[0]

	return (
		<div ref={ref} className={demoCard}>
			<DemoHead {...copy.chat} />
			<div className={scenTabs} role="tablist">
				{copy.scenarios.map((s) => (
					<button
						key={s.id}
						type="button"
						role="tab"
						aria-selected={s.id === scenarioId}
						className={pillTab(s.id === scenarioId)}
						onClick={() => setScenarioId(s.id)}
					>
						{s.label}
					</button>
				))}
			</div>
			<div className={demoBody}>
				<ChatRun key={language + scenarioId} copy={copy.chat} scenario={scenario} inView={inView} />
			</div>
		</div>
	)
}
