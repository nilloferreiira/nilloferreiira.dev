"use client"

import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { useCv, type CvFileStatus } from "@/hooks/cv/useCv"
import type { CvLanguage } from "@/lib/cv"

const CV_LABELS: Record<CvLanguage, string> = {
	en: "English CV",
	pt: "Portuguese CV"
}

function formatUpdatedAt(updatedAt: string | null) {
	if (!updatedAt) return "Not uploaded yet"
	return `Updated ${new Date(updatedAt).toLocaleDateString()}`
}

function CvUploadCard({ language, status }: { language: CvLanguage; status: CvFileStatus | undefined }) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState<string | null>(null)

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData()
			formData.set("language", language)
			formData.set("file", file)
			const res = await fetch("/api/cv", { method: "POST", body: formData })
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json.error ?? "Erro ao enviar currículo")
			return json.data
		},
		onSuccess: () => {
			setError(null)
			queryClient.invalidateQueries({ queryKey: ["cv"] })
		},
		onError: (err: Error) => setError(err.message)
	})

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		mutateAsync(file)
		e.target.value = ""
	}

	return (
		<div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
			<div>
				<p className="text-sm text-white">{CV_LABELS[language]}</p>
				<p className="text-xs text-white/30 mt-0.5">{isPending ? "Uploading..." : formatUpdatedAt(status?.updatedAt ?? null)}</p>
				{error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
			</div>
			<div>
				<input
					ref={inputRef}
					type="file"
					accept="application/pdf"
					className="hidden"
					onChange={handleFileChange}
					disabled={isPending}
				/>
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					disabled={isPending}
					className="px-3 py-1.5 rounded-lg text-xs text-primary border border-primary/30 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
				>
					{status?.updatedAt ? "Replace" : "Upload"}
				</button>
			</div>
		</div>
	)
}

export function CvSection() {
	const { data: cvFiles } = useCv()

	function statusFor(language: CvLanguage) {
		return cvFiles?.find((f) => f.language === language)
	}

	return (
		<section className="mb-10">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">CV</h2>
			</div>
			<div className="flex flex-col gap-2">
				<CvUploadCard language="en" status={statusFor("en")} />
				<CvUploadCard language="pt" status={statusFor("pt")} />
			</div>
		</section>
	)
}
