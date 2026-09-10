import { tv } from "tailwind-variants"

const tag = tv({
	base: "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-mono border transition-colors",
	variants: {
		active: {
			true: "bg-accent/20 text-accent border-accent/40",
			false: "bg-transparent text-muted-foreground border-border"
		}
	},
	defaultVariants: {
		active: false
	}
})

interface TagProps {
	children: React.ReactNode
	active?: boolean
}

export function Tag({ children, active }: TagProps) {
	return <span className={tag({ active })}>{children}</span>
}
