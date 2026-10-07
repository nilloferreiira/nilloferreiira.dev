import { useEffect, useRef, useState } from "react"

// Advances 0..len, holds, then loops. delayFor(i) = wait before revealing step i.
export function useSequence(len: number, delayFor: (step: number) => number, active: boolean, hold = 3200) {
	const [step, setStep] = useState(0)
	const delayRef = useRef(delayFor)
	delayRef.current = delayFor

	useEffect(() => {
		if (!active) return
		const delay = step >= len ? hold : delayRef.current(step)
		const id = setTimeout(() => setStep(step >= len ? 0 : step + 1), delay)
		return () => clearTimeout(id)
	}, [step, active, len, hold])

	return step
}
