"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface MarqueeProps {
	items: string[]
}

export function Marquee({ items }: MarqueeProps) {
	const trackRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const mm = gsap.matchMedia()

		mm.add("(prefers-reduced-motion: no-preference)", () => {
			const tween = gsap.to(trackRef.current, {
				xPercent: -50,
				duration: 22,
				repeat: -1,
				ease: "none"
			})

			return () => {
				tween.kill()
			}
		})

		return () => {
			mm.revert()
		}
	}, [])

	const doubled = [...items, ...items]

	return (
		<div className="w-full overflow-hidden border-y border-foreground/[0.06] bg-foreground/[0.02] py-[22px]">
			<div ref={trackRef} className="flex w-max gap-14">
				{doubled.map((item, index) => (
					<span
						key={`${item}-${index}`}
						className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-foreground-subtle"
					>
						{item} <span className="text-muted-foreground">✦</span>
					</span>
				))}
			</div>
		</div>
	)
}
