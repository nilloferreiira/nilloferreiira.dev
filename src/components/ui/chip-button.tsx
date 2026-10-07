import { tv } from "tailwind-variants"

export const chipButton = tv({
	base: "h-[34px] min-w-[34px] px-2.5 rounded-lg border border-v-line bg-v-panel text-v-dim font-mono text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5 transition-[border-color,color] duration-200 hover:border-v-line2 hover:text-v-text"
})

// Rounded pill used for tabs and filters (demo scenarios, project categories)
export function pillTab(active: boolean) {
	return `shrink-0 px-3.5 py-2 rounded-full border font-mono text-xs cursor-pointer transition-all duration-200 ${
		active
			? "bg-v-text border-v-text text-v-bg"
			: "bg-transparent border-v-line text-v-dim hover:border-v-line2 hover:text-v-text"
	}`
}

type ChipButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function ChipButton({ className, type = "button", ...rest }: ChipButtonProps) {
	return <button type={type} className={chipButton({ className })} {...rest} />
}
