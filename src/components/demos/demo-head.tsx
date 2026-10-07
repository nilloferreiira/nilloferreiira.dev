interface DemoHeadProps {
	k: string
	t: string
	d: string
}

export function DemoHead({ k, t, d }: DemoHeadProps) {
	return (
		<div className="flex max-[680px]:flex-col justify-between items-start gap-4 px-6 py-[22px] border-b border-v-line">
			<div>
				<div className="font-mono text-[11px] text-v-accent">{k}</div>
				<h3 className="mt-1.5 mb-1 text-xl tracking-[-0.02em] font-bold text-v-text">{t}</h3>
				<p className="m-0 max-w-[520px] text-v-dim text-sm leading-[1.55]">{d}</p>
			</div>
			<span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-v-muted whitespace-nowrap">
				<i className="pulse-dot w-1.5 h-1.5" />
				live demo
			</span>
		</div>
	)
}

export const demoCard =
	"flex flex-col h-full overflow-hidden rounded-2xl border border-v-line bg-v-panel shadow-v-card"
export const demoBody = "demo-lines flex-1 p-6 max-[680px]:p-4"
export const scenTabs =
	"no-scrollbar flex gap-1.5 px-6 max-[680px]:px-4 py-3 border-b border-v-line overflow-x-auto font-mono"

export const browserFrame = "border border-v-line rounded-xl bg-v-bg2 overflow-hidden"
export const browserUrl = "flex-1 px-2.5 py-1 rounded-md bg-v-panel2 font-mono text-[11px] text-v-muted"
export const bubble = "pop-in max-w-[82%] px-[13px] py-2.5 rounded-[14px] text-sm leading-[1.45] text-v-text"
export const bubbleUser = `${bubble} self-end bg-v-bubble-u rounded-br-[4px]`
export const bubbleAgent = `${bubble} self-start bg-v-bubble-a rounded-bl-[4px]`

export function TypingDots() {
	return (
		<div className="pop-in typing-dots self-start flex gap-1 px-3.5 py-3 rounded-[14px] bg-v-bubble-a">
			<i />
			<i />
			<i />
		</div>
	)
}

export function FakeInput({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-3 mb-3 px-3.5 py-2.5 rounded-full border border-v-line text-[13px] text-v-muted">{children}</div>
	)
}
