"use client"

import { useEffect, useRef } from "react"

export function GridBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const CELL = 28
		const GAP = 4
		const STEP = CELL + GAP

		let width = 0
		let height = 0
		let cols = 0
		let rows = 0
		let ambient: Float32Array = new Float32Array(0)
		let speed: Float32Array = new Float32Array(0)
		let heat: Float32Array = new Float32Array(0)

		const mouse = { x: -9999, y: -9999 }

		const resize = () => {
			const parent = canvas.parentElement
			if (!parent) return
			width = parent.clientWidth
			height = parent.clientHeight
			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			canvas.width = width * dpr
			canvas.height = height * dpr
			canvas.style.width = `${width}px`
			canvas.style.height = `${height}px`
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

			cols = Math.ceil(width / STEP)
			rows = Math.ceil(height / STEP)
			const n = cols * rows
			ambient = new Float32Array(n)
			speed = new Float32Array(n)
			heat = new Float32Array(n)
			for (let i = 0; i < n; i++) {
				ambient[i] = Math.random() * Math.PI * 2
				speed[i] = 0.4 + Math.random() * 0.8
			}
		}

		const onMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			mouse.x = e.clientX - rect.left
			mouse.y = e.clientY - rect.top
		}
		const onLeave = () => {
			mouse.x = -9999
			mouse.y = -9999
		}

		const CYAN = { h: 170, s: 80, l: 50 }
		const PURPLE = { h: 280, s: 70, l: 60 }
		const BASE = { h: 230, s: 20, l: 16 }

		let raf = 0
		let time = 0

		const draw = () => {
			time += 0.016
			ctx.clearRect(0, 0, width, height)

			const radius = 110
			const cStart = Math.max(0, Math.floor((mouse.x - radius) / STEP))
			const cEnd = Math.min(cols - 1, Math.ceil((mouse.x + radius) / STEP))
			const rStart = Math.max(0, Math.floor((mouse.y - radius) / STEP))
			const rEnd = Math.min(rows - 1, Math.ceil((mouse.y + radius) / STEP))
			for (let r = rStart; r <= rEnd; r++) {
				for (let c = cStart; c <= cEnd; c++) {
					const cx = c * STEP + CELL / 2
					const cy = r * STEP + CELL / 2
					const dist = Math.hypot(cx - mouse.x, cy - mouse.y)
					if (dist < radius) {
						const idx = r * cols + c
						heat[idx] = Math.min(1, heat[idx] + (1 - dist / radius) * 0.25)
					}
				}
			}

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const idx = r * cols + c
					const x = c * STEP
					const y = r * STEP

					const pulse = (Math.sin(time * speed[idx] + ambient[idx]) + 1) / 2
					const ambientGlow = Math.pow(pulse, 8) * 0.28

					const h = heat[idx]
					heat[idx] = h * 0.94

					const glow = Math.min(1, ambientGlow + h)

					if (glow < 0.02) {
						ctx.fillStyle = `hsl(${BASE.h} ${BASE.s}% ${BASE.l}% / 0.16)`
					} else {
						const mix = c / Math.max(1, cols)
						const hue = CYAN.h + (PURPLE.h - CYAN.h) * mix
						const light = BASE.l + glow * 30
						const alpha = 0.16 + glow * 0.6
						ctx.fillStyle = `hsl(${hue} ${CYAN.s}% ${light}% / ${alpha})`
					}

					ctx.beginPath()
					ctx.roundRect(x, y, CELL, CELL, 4)
					ctx.fill()

					if (heat[idx] > 0.35) {
						const mix = c / Math.max(1, cols)
						const hue = CYAN.h + (PURPLE.h - CYAN.h) * mix
						ctx.shadowColor = `hsl(${hue} ${CYAN.s}% 55%)`
						ctx.shadowBlur = 14 * heat[idx]
						ctx.beginPath()
						ctx.roundRect(x, y, CELL, CELL, 4)
						ctx.fill()
						ctx.shadowBlur = 0
					}
				}
			}

			raf = requestAnimationFrame(draw)
		}

		resize()
		draw()

		const parent = canvas.parentElement
		window.addEventListener("resize", resize)
		parent?.addEventListener("mousemove", onMove)
		parent?.addEventListener("mouseleave", onLeave)

		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", resize)
			parent?.removeEventListener("mousemove", onMove)
			parent?.removeEventListener("mouseleave", onLeave)
		}
	}, [])

	return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}
