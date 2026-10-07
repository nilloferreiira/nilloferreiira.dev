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
				duration: 30,
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
		<div className="marq-mask mt-12 overflow-hidden border-y border-v-line py-5" aria-hidden="true">
			<div ref={trackRef} className="flex w-max gap-12">
				{doubled.map((item, index) => (
					<span
						key={`${item}-${index}`}
						className="flex items-center gap-12 whitespace-nowrap text-[clamp(22px,3vw,40px)] font-extrabold tracking-[-0.03em] text-v-muted"
					>
						{item}
						<span className="text-v-accent font-normal">/</span>
					</span>
				))}
			</div>
		</div>
	)
}
