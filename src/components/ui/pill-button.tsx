import { tv } from "tailwind-variants"
import { MagneticButton } from "@/components/ui/magnetic-button"

const pillButton = tv({
	base: "inline-flex items-center gap-2.5 px-6 py-3.5 max-[680px]:px-5 max-[680px]:py-[13px] rounded-full border text-[15px] max-[680px]:text-sm font-bold cursor-pointer transition-[background,border-color,color] duration-200",
	variants: {
		variant: {
			primary: "bg-v-text text-v-bg border-v-text hover:bg-v-accent hover:border-v-accent hover:text-v-bg",
			secondary: "bg-transparent text-v-text border-v-line2 hover:bg-v-panel2 hover:text-v-text"
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
	iconPosition?: "start" | "end"
}

export function PillButton({ href, children, variant = "primary", external, icon, iconPosition = "end" }: PillButtonProps) {
	return (
		<MagneticButton
			href={href}
			className={pillButton({ variant })}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		>
			{iconPosition === "start" && icon}
			{children}
			{iconPosition === "end" && icon}
		</MagneticButton>
	)
}
