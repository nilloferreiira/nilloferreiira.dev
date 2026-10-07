import { useEffect, useState } from "react"

// Tracks whether the element is on screen (not one-shot: demos pause when scrolled away)
export function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.3) {
	const [inView, setInView] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold })
		observer.observe(el)
		return () => observer.disconnect()
	}, [ref, threshold])

	return inView
}
