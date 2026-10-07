"use client"

import { useRef, useState } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { pillTab } from "@/components/ui/chip-button"
import { useInView } from "@/hooks/demos/useInView"
import { useSequence } from "@/hooks/demos/useSequence"
import { DASH_COPY } from "./copy"
import {
	DemoHead,
	FakeInput,
	TypingDots,
	browserFrame,
	browserUrl,
	bubbleAgent,
	bubbleUser,
	demoBody,
	demoCard,
	scenTabs
} from "./demo-head"
import { Typed } from "./typed"

type Copy = (typeof DASH_COPY)["en"]
type View = "admin" | "client"

const layout = "grid grid-cols-[minmax(0,1fr)_minmax(260px,340px)] max-[1080px]:grid-cols-1 min-h-[400px]"
const mainCol = "flex flex-col gap-3.5 p-4 min-w-0"
const tableRow =
	"grid grid-cols-[1.4fr_1fr_1fr_1.3fr_.6fr] max-[680px]:grid-cols-[1.3fr_1fr_.9fr] gap-2.5 items-center px-3.5 py-2.5 text-[13px] border-t first:border-t-0 border-v-line transition-[background,box-shadow] duration-400 [&>span]:min-w-0 [&>span]:overflow-hidden [&>span]:text-ellipsis [&>span]:whitespace-nowrap max-[680px]:[&>span:nth-child(2)]:hidden max-[680px]:[&>span:nth-child(5)]:hidden"

function Assistant({ copy, children }: { copy: Copy; children: React.ReactNode }) {
	return (
		<div className="flex flex-col bg-v-panel border-l border-v-line max-[1080px]:border-l-0 max-[1080px]:border-t">
			<div className="flex items-center gap-2 px-3.5 py-3 border-b border-v-line font-mono text-[11px] text-v-dim">
				<i className="pulse-dot-accent w-[7px] h-[7px]" />
				{copy.ai}
			</div>
			<div className="flex-1 flex flex-col justify-end gap-2 p-3.5 min-h-[200px] max-[680px]:min-h-[170px] [&>.pop-in]:max-w-[92%] [&>.pop-in]:text-[13px]">
				{children}
			</div>
			<FakeInput>{copy.ask}</FakeInput>
		</div>
	)
}

function AdminView({ copy, inView }: { copy: Copy; inView: boolean }) {
	const p = useSequence(5, (s) => [700, 2200, 1500, 2000, 1400][s], inView, 4200)
	const flag = p >= 3

	return (
		<div className={layout}>
			<div className={mainCol}>
				<div className="grid grid-cols-3 max-[680px]:grid-cols-2 gap-2.5">
					{copy.kpis.map(([k, v, s], i) => (
						<div
							key={k}
							className={`flex flex-col gap-1 px-3.5 py-3 rounded-[10px] border border-v-line transition-all duration-400 max-[680px]:last:col-span-2 ${
								flag && i === 2 ? "hl" : ""
							}`}
						>
							<span className="font-mono text-[10px] text-v-muted">{k}</span>
							<b className="text-[22px] tracking-[-0.02em] text-v-text">{v}</b>
							<small className="font-mono text-[10px] text-v-dim">{s}</small>
						</div>
					))}
				</div>

				<div className="rounded-[10px] border border-v-line overflow-hidden">
					<div className={`${tableRow} font-mono !text-[10px] text-v-muted bg-v-panel`}>
						{copy.cols.map((c) => (
							<span key={c}>{c}</span>
						))}
					</div>
					{copy.rows.map((row, i) => (
						<div key={row[0]} className={`${tableRow} text-v-text ${flag && copy.risk.includes(i) ? "hl" : ""}`}>
							<span className="font-semibold">{row[0]}</span>
							<span>{row[1]}</span>
							<span className="font-mono !text-[11px] text-v-dim">{row[2]}</span>
							<span className="!overflow-visible relative flex items-center h-1.5 rounded-[3px] bg-v-panel2">
								<i className="block h-full rounded-[3px] bg-[image:var(--grad)]" style={{ width: `${row[3]}%` }} />
								<em className="absolute -right-0.5 -top-4 not-italic font-mono text-[10px] text-v-muted">{row[3]}%</em>
							</span>
							<span className="font-mono !text-[11px] text-v-dim">{row[4]}</span>
						</div>
					))}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-[10px] text-v-muted mr-1">{copy.stockT}</span>
					{copy.stock.map(([name, qty, low]) => (
						<span
							key={name}
							className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-v-line text-xs text-v-text transition-all duration-400 ${
								flag && low ? "hl" : ""
							}`}
						>
							{name}
							<b className="font-mono text-[11px] font-medium text-v-dim">{qty}</b>
						</span>
					))}
				</div>
			</div>

			<Assistant copy={copy}>
				{p >= 1 && <div className={bubbleUser}>{p === 1 ? <Typed text={copy.q} speed={30} /> : copy.q}</div>}
				{p === 2 && <TypingDots />}
				{p >= 3 && <div className={bubbleAgent}>{copy.a}</div>}
				{p >= 3 && (
					<button
						type="button"
						className={`pop-in self-start text-left px-3 py-2 rounded-lg border font-mono text-[11px] cursor-pointer ${
							p >= 4
								? "border-v-ok text-v-ok bg-[color-mix(in_oklab,var(--ok)_10%,transparent)]"
								: "border-v-accent text-v-accent bg-v-soft"
						}`}
					>
						{p >= 4 ? `✓ ${copy.actDone}` : `→ ${copy.act}`}
					</button>
				)}
			</Assistant>
		</div>
	)
}

function ClientView({ copy, inView }: { copy: Copy; inView: boolean }) {
	const p = useSequence(4, (s) => [900, 1600, 2000, 1500][s], inView, 4200)
	const pct = p >= 1 ? 70 : 55

	return (
		<div className={layout}>
			<div className={mainCol}>
				<div className="flex justify-between items-end gap-3">
					<div>
						<b className="block text-xl tracking-[-0.02em] text-v-text">{copy.hi}</b>
						<small className="font-mono text-[11px] text-v-muted">{copy.order}</small>
					</div>
					<span className="text-[28px] font-extrabold tracking-[-0.03em] text-v-text">{pct}%</span>
				</div>
				<div className="h-1.5 rounded-[3px] bg-v-panel2 overflow-hidden">
					<i
						className="block h-full bg-[image:var(--grad)] transition-[width] duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)]"
						style={{ width: `${pct}%` }}
					/>
				</div>
				<ol className="steps list-none mt-1.5 p-0 flex flex-col">
					{copy.steps.map(([label, date], i) => {
						const state = i < 2 ? "ok" : i === 2 ? "cur" : ""
						return (
							<li
								key={label}
								className={`${state} relative grid grid-cols-[16px_1fr_auto] gap-3 items-center py-[9px] text-sm ${
									state ? "text-v-text" : "text-v-muted"
								}`}
							>
								<span
									className={`relative z-[1] w-4 h-4 rounded-full border-2 ${
										state === "ok"
											? "bg-v-accent border-v-accent"
											: state === "cur"
												? "pulse-dot-accent !bg-v-bg2 border-v-accent"
												: "bg-v-bg2 border-v-line2"
									}`}
								/>
								<b className="font-semibold">{label}</b>
								<small className={`font-mono text-[11px] ${state === "cur" ? "text-v-accent" : ""}`}>{date}</small>
							</li>
						)
					})}
				</ol>
				<div
					className={`px-3.5 py-3 rounded-[10px] border transition-all duration-600 ${
						p >= 1 ? "opacity-100 border-v-accent bg-v-soft" : "opacity-40 border-v-line"
					}`}
				>
					<span className="font-mono text-[10px] text-v-muted">{copy.update}</span>
					<p className="mt-1 mb-0 text-[13px] text-v-dim">{copy.upd}</p>
				</div>
			</div>

			<Assistant copy={copy}>
				{p >= 2 && <div className={bubbleUser}>{p === 2 ? <Typed text={copy.cq} speed={30} /> : copy.cq}</div>}
				{p === 3 && <TypingDots />}
				{p >= 4 && <div className={bubbleAgent}>{copy.ca}</div>}
			</Assistant>
		</div>
	)
}

export function DashDemo() {
	const { language } = useLanguage()
	const copy = DASH_COPY[language]
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref)
	const [view, setView] = useState<View>("admin")

	return (
		<div ref={ref} className={demoCard}>
			<DemoHead {...copy.head} />
			<div className={scenTabs} role="tablist">
				{copy.views.map(([id, label]) => (
					<button
						key={id}
						type="button"
						role="tab"
						aria-selected={view === id}
						className={pillTab(view === id)}
						onClick={() => setView(id as View)}
					>
						{label}
					</button>
				))}
			</div>
			<div className={demoBody}>
				<div className={browserFrame}>
					<div className="flex items-center gap-2.5 px-3 py-[9px] border-b border-v-line">
						<div className={browserUrl}>{copy.url[view]}</div>
					</div>
					{view === "admin" ? (
						<AdminView key={language + view} copy={copy} inView={inView} />
					) : (
						<ClientView key={language + view} copy={copy} inView={inView} />
					)}
				</div>
			</div>
		</div>
	)
}
