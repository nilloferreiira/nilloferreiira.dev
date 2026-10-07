interface SectionLabelProps {
	index: string
	path: string
	className?: string
}

export function SectionLabel({ index, path, className }: SectionLabelProps) {
	return (
		<div
			className={`flex items-center gap-3.5 mb-[clamp(20px,2.5vw,32px)] font-mono after:content-[''] after:flex-1 after:h-px after:bg-v-line ${className ?? ""}`}
		>
			<span className="text-xs text-v-accent">{index}</span>
			<span className="text-[13px] text-v-muted">
				~/<b className="text-v-dim font-medium">{path}</b>
			</span>
		</div>
	)
}
