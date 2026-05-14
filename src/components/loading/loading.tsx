"use client"

import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center w-full h-full">
			<Loader2 className="animate-spin text-muted-foreground" size={48} />
		</div>
	)
}
