"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { Check } from "lucide-react"
import { queryClient } from "@/lib/react-query"
import { useProfilePictureImages } from "@/hooks/profile-picture/useProfilePictureImages"
import { PROFILE_PICTURE_TYPES } from "@/lib/profile-picture"

const ACCEPT = Object.keys(PROFILE_PICTURE_TYPES).join(",")

export function ProfilePictureSection() {
	const inputRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState<string | null>(null)
	const { data, isLoading, isError, error: listError } = useProfilePictureImages()

	// invalidating ["profile-picture"] also refreshes the public About photo query
	const refresh = () => queryClient.invalidateQueries({ queryKey: ["profile-picture"] })

	const upload = useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData()
			formData.set("file", file)
			const res = await fetch("/api/profile-picture/images", { method: "POST", body: formData })
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json.error ?? "Erro ao enviar imagem")
			return json.data
		},
		onSuccess: () => {
			setError(null)
			refresh()
		},
		onError: (err: Error) => setError(err.message)
	})

	const select = useMutation({
		mutationFn: async (name: string) => {
			const res = await fetch("/api/profile-picture", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name })
			})
			const json = await res.json()
			if (!res.ok || !json.ok) throw new Error(json.error ?? "Erro ao selecionar imagem")
			return json.data
		},
		onSuccess: () => {
			setError(null)
			refresh()
		},
		onError: (err: Error) => setError(err.message)
	})

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		upload.mutate(file)
		e.target.value = ""
	}

	const busy = upload.isPending || select.isPending

	return (
		<section className="mb-10">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">About photo</h2>
				<div className="flex items-center gap-3">
					{busy && <span className="text-xs text-white/30">{upload.isPending ? "Uploading..." : "Saving..."}</span>}
					<input
						ref={inputRef}
						type="file"
						accept={ACCEPT}
						className="hidden"
						onChange={handleFileChange}
						disabled={busy}
					/>
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={busy}
						className="px-3 py-1.5 rounded-lg text-xs text-primary border border-primary/30 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
					>
						Upload
					</button>
				</div>
			</div>

			{error && <p className="text-xs text-red-400 mb-2">{error}</p>}

			{isLoading ? (
				<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
					))}
				</div>
			) : isError ? (
				<p className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-red-400">
					{listError.message}. If this keeps happening, check the storage policies for the profile_pictures bucket
					(see src/app/api/profile-picture/route.ts).
				</p>
			) : data && data.images.length > 0 ? (
				<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
					{data.images.map((image) => {
						const isSelected = image.name === data.selected
						return (
							<button
								key={image.name}
								type="button"
								onClick={() => !isSelected && select.mutate(image.name)}
								disabled={busy}
								aria-pressed={isSelected}
								aria-label={`Use ${image.name}`}
								title={image.name}
								className={`relative aspect-square rounded-xl overflow-hidden border transition disabled:cursor-wait ${
									isSelected
										? "border-primary ring-2 ring-primary"
										: "border-white/10 hover:border-white/30 cursor-pointer"
								}`}
							>
								<Image src={image.url} alt="" fill sizes="160px" className="object-cover" />
								{isSelected && (
									<span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
										<Check size={10} />
										Selected
									</span>
								)}
							</button>
						)
					})}
				</div>
			) : (
				<p className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/30">
					No images yet. Upload a JPG, PNG or WebP (max 5MB).
				</p>
			)}

			{data && !data.selected && data.images.length > 0 && (
				<p className="text-xs text-white/30 mt-2">No photo selected: the site shows the GitHub avatar.</p>
			)}
		</section>
	)
}
