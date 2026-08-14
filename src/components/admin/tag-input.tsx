"use client"

import { X } from "lucide-react"
import { useState } from "react"

interface TagInputProps {
	name: string
	defaultValue?: string[]
	placeholder?: string
}

export function TagInput({ name, defaultValue = [], placeholder }: TagInputProps) {
	const [chips, setChips] = useState<string[]>(defaultValue)
	const [draft, setDraft] = useState("")

	function addChip() {
		const val = draft.trim()
		if (!val) return
		setChips((c) => [...c, val])
		setDraft("")
	}

	function removeChip(idx: number) {
		setChips((c) => c.filter((_, i) => i !== idx))
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault()
			addChip()
		}
	}

	return (
		<div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 min-h-[52px] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition">
			{chips.map((chip, i) => (
				<span
					key={`${chip}-${i}`}
					className="flex items-center gap-1.5 bg-[#232c44] text-[#c3cadd] text-sm pl-3 pr-1.5 py-1 rounded-md"
				>
					{chip}
					<button
						type="button"
						onClick={() => removeChip(i)}
						className="text-white/40 hover:text-white transition px-1"
					>
						<X size={13} />
					</button>
				</span>
			))}
			<input
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				onKeyDown={onKeyDown}
				onBlur={addChip}
				placeholder={placeholder}
				className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20 px-1 py-1"
			/>
			<input type="hidden" name={name} value={chips.join(",")} />
		</div>
	)
}
