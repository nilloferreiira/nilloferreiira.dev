"use client"

import { X } from "lucide-react"
import { useEffect, useId } from "react"
import React from "react"

interface AdminSidePanelProps {
	isOpen: boolean
	title: string
	onClose: () => void
	children: React.ReactNode
}

export function AdminSidePanel({ isOpen, title, onClose, children }: AdminSidePanelProps) {
	const titleId = useId()
	useEffect(() => {
		if (!isOpen) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [isOpen, onClose])

	return (
		<>
			<div
				aria-hidden="true"
				onClick={onClose}
				className={`fixed inset-0 z-10 bg-black/65 transition-opacity duration-300 ease-out ${
					isOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-hidden={!isOpen}
				inert={!isOpen}
				className={`fixed top-0 right-0 bottom-0 z-20 w-full lg:w-[min(1100px,95vw)] flex flex-col bg-shark shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<header className="flex items-center justify-between px-7 py-5 border-b border-white/10 flex-shrink-0">
					<h2 id={titleId} className="text-base font-semibold text-white">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close panel"
						className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
					>
						<X size={18} />
					</button>
				</header>
				<div className="flex-1 overflow-y-auto">{children}</div>
			</div>
		</>
	)
}
