"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface CountUpProps {
	value: string
	locale: string
}

// Animates the numeric part of strings like "2+", "3,000+" or "3.000+" when it scrolls into view
export function CountUp({ value, locale }: CountUpProps) {
	const ref = useRef<HTMLSpanElement>(null)
	const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/)
	const prefix = match?.[1] ?? ""
	const target = match ? parseInt(match[2].replace(/[.,]/g, ""), 10) : 0
	const suffix = match?.[3] ?? ""
	const format = (n: number) => `${prefix}${Math.round(n).toLocaleString(locale)}${suffix}`

	useEffect(() => {
		const el = ref.current
		if (!el || !match) return

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			el.textContent = format(target)
			return
		}

		el.textContent = format(0)
		let tween: gsap.core.Tween | undefined
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return
				const obj = { v: 0 }
				tween = gsap.to(obj, {
					v: target,
					duration: 1.6,
					ease: "power2.out",
					onUpdate: () => {
						el.textContent = format(obj.v)
					}
				})
				observer.disconnect()
			},
			{ threshold: 0.4 }
		)
		observer.observe(el)

		return () => {
			observer.disconnect()
			tween?.kill()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, locale])

	return <span ref={ref}>{match ? format(target) : value}</span>
}
