"use client"

import React, { useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
	isOpen: boolean
	title?: string
	modalForm?: string
	children?: React.ReactNode
	onClose: () => void
	onSave?: () => void
	isPending?: boolean
	saveLabel?: string
	/**
	 * Allow closing when clicking the overlay. Default: false (don't close)
	 */
	closeOnOverlayClick?: boolean
	/**
	 * If provided and closeOnOverlayClick is false, show a confirmation
	 * dialog with this message when clicking the overlay. If omitted, overlay
	 * clicks are ignored.
	 */
	overlayConfirmMessage?: string
}

export function Modal({
	isOpen,
	title,
	children,
	onClose,
	onSave,
	isPending,
	modalForm,
	saveLabel = "Save",
	closeOnOverlayClick = false,
	overlayConfirmMessage
}: ModalProps) {
	useEffect(() => {
		if (!isOpen) return

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}

		// disable scroll while modal is open
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		window.addEventListener("keydown", onKey)

		return () => {
			document.body.style.overflow = previousOverflow
			window.removeEventListener("keydown", onKey)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
			{/* overlay */}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={() => {
					if (closeOnOverlayClick) {
						onClose()
						return
					}

					if (overlayConfirmMessage) {
						// eslint-disable-next-line no-restricted-globals
						const ok = confirm(overlayConfirmMessage)
						if (ok) onClose()
					}
					// otherwise ignore overlay clicks
				}}
			/>

			{/* panel */}
			<div className="relative w-full max-w-2xl mx-4">
				<div className="bg-bg rounded-2xl shadow-lg ring-1 ring-white/5 overflow-hidden">
					<header className="flex items-center justify-between p-4 border-b border-white/5">
						<div className="flex items-center gap-3">
							<h3 className="text-lg font-semibold text-white">{title}</h3>
						</div>
						<button aria-label="Close modal" onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition">
							<X size={18} className="text-white" />
						</button>
					</header>

					<div className="p-6 text-text-secondary">{children}</div>

					<footer className="flex items-center justify-end gap-3 p-4 border-t border-white/5">
						<button
							onClick={onClose}
							className="px-4 py-2 rounded-xl bg-transparent border border-white/5 text-white/80 hover:bg-white/5 transition"
						>
							Cancel
						</button>
						{(onSave || modalForm) && (
							<button
								onClick={onSave}
								type="submit"
								disabled={isPending}
								form={modalForm}
								className={`px-4 py-2 rounded-xl bg-primary text-white hover:brightness-95 transition ${
									isPending ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{isPending ? "Saving..." : saveLabel}
							</button>
						)}
					</footer>
				</div>
			</div>
		</div>
	)
}
