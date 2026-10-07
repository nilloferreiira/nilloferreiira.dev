import { tv } from "tailwind-variants"

const tag = tv({
	base: "inline-flex items-center rounded-md px-[9px] py-1 font-mono text-[11px] border transition-colors",
	variants: {
		active: {
			true: "bg-v-soft text-v-accent border-v-accent",
			false: "bg-v-panel text-v-dim border-v-line"
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
