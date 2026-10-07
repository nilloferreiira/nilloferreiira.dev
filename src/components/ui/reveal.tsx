"use client"

import { motion, useReducedMotion } from "framer-motion"

interface RevealProps {
	children: React.ReactNode
	delay?: number
	className?: string
}

// Fade + rise when scrolled into view (power3.out)
export function Reveal({ children, delay = 0, className }: RevealProps) {
	const reduceMotion = useReducedMotion()

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.15 }}
			transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
		>
			{children}
		</motion.div>
	)
}
