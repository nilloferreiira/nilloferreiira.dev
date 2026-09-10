interface KickerProps {
	label: string
	className?: string
}

export function Kicker({ label, className }: KickerProps) {
	return (
		<span className={`font-mono text-[11px] tracking-[0.18em] uppercase text-primary block mb-[18px] ${className ?? ""}`}>
			<span className="opacity-60">— </span>
			{label}
		</span>
	)
}
