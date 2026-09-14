"use client"

import type { StackRef } from "@/types/stack/stack"
import { X } from "lucide-react"
import { useState } from "react"

interface TagInputProps {
	name: string
	defaultValue?: StackRef[]
	suggestions: StackRef[]
	placeholder?: string
}

export function TagInput({ name, defaultValue = [], suggestions, placeholder }: TagInputProps) {
	const [chips, setChips] = useState<string[]>(defaultValue.map((s) => s.name))
	const [draft, setDraft] = useState("")
	const [showSuggestions, setShowSuggestions] = useState(false)

	const filteredSuggestions = suggestions.filter(
		(s) => draft.trim().length > 0 && s.name.toLowerCase().includes(draft.trim().toLowerCase()) && !chips.includes(s.name)
	)

	function addChip(value: string) {
		const val = value.trim()
		if (!val || chips.includes(val)) return
		setChips((c) => [...c, val])
		setDraft("")
		setShowSuggestions(false)
	}

	function removeChip(idx: number) {
		setChips((c) => c.filter((_, i) => i !== idx))
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault()
			addChip(draft)
		}
	}

	return (
		<div className="relative">
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
					onChange={(e) => {
						setDraft(e.target.value)
						setShowSuggestions(true)
					}}
					onKeyDown={onKeyDown}
					onBlur={() => setTimeout(() => addChip(draft), 100)}
					onFocus={() => setShowSuggestions(true)}
					placeholder={placeholder}
					className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20 px-1 py-1"
				/>
				{chips.map((chip, i) => (
					<input key={`hidden-${chip}-${i}`} type="hidden" name={name} value={chip} />
				))}
			</div>
			{showSuggestions && filteredSuggestions.length > 0 && (
				<div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg bg-[#1a2033] border border-white/10 shadow-lg">
					{filteredSuggestions.map((s) => (
						<button
							key={s.id}
							type="button"
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => addChip(s.name)}
							className="block w-full text-left px-3 py-2 text-sm text-[#c3cadd] hover:bg-white/10 transition"
						>
							{s.name}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
