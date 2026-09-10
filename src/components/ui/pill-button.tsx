import { tv } from "tailwind-variants"

const pillButton = tv({
	base: "inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300",
	variants: {
		variant: {
			primary: "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:border-primary/60 hover:neon-glow",
			secondary: "glass glass-hover border border-border hover:border-primary/40"
		}
	},
	defaultVariants: {
		variant: "primary"
	}
})

interface PillButtonProps {
	href: string
	children: React.ReactNode
	variant?: "primary" | "secondary"
	external?: boolean
	icon?: React.ReactNode
}

export function PillButton({ href, children, variant = "primary", external, icon }: PillButtonProps) {
	return (
		<a
			href={href}
			className={pillButton({ variant })}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		>
			{children}
			{icon}
		</a>
	)
}
