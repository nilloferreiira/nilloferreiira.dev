"use client"

import { X } from "lucide-react"
import { useEffect } from "react"
import React from "react"

interface AdminSidePanelProps {
	isOpen: boolean
	title: string
	onClose: () => void
	children: React.ReactNode
}

export function AdminSidePanel({ isOpen, title, onClose, children }: AdminSidePanelProps) {
	useEffect(() => {
		if (!isOpen) return
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", handler)
		return () => window.removeEventListener("keydown", handler)
	}, [isOpen, onClose])

	return (
		<div
			className={`flex-shrink-0 h-full overflow-hidden transition-all duration-300 ease-out border-l ${
				isOpen ? "w-full lg:w-[500px] border-white/10" : "w-0 border-transparent"
			}`}
		>
			<div className="w-full lg:w-[500px] h-full flex flex-col bg-shark">
				<header className="flex items-center justify-between px-7 py-5 border-b border-white/10 flex-shrink-0">
					<h2 className="text-base font-semibold text-white">{title}</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition"
					>
						<X size={18} />
					</button>
				</header>
				<div className="flex-1 overflow-y-auto">{children}</div>
			</div>
		</div>
	)
}
