"use client"

import { useRef } from "react"
import gsap from "gsap"

const PULL_STRENGTH = 0.35
const RETURN_EASE = "elastic.out(1, 0.4)"

interface MagneticButtonBaseProps {
	children: React.ReactNode
	className?: string
	pullStrength?: number
	returnEase?: string
}

type MagneticButtonProps = MagneticButtonBaseProps &
	(
		| ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
		| ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
	)

export function MagneticButton({
	children,
	className,
	pullStrength = PULL_STRENGTH,
	returnEase = RETURN_EASE,
	href,
	...rest
}: MagneticButtonProps) {
	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)

	function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
		const el = ref.current
		if (!el) return

		const rect = el.getBoundingClientRect()
		const x = (event.clientX - rect.left - rect.width / 2) * pullStrength
		const y = (event.clientY - rect.top - rect.height / 2) * pullStrength

		gsap.to(el, { x, y, duration: 0.3, ease: "power2.out" })
	}

	function handleMouseLeave() {
		const el = ref.current
		if (!el) return

		gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: returnEase })
	}

	if (href !== undefined) {
		return (
			<a
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={href}
				className={className}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				{...(rest as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)}
			>
				{children}
			</a>
		)
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			className={className}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			{...(rest as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)}
		>
			{children}
		</button>
	)
}
