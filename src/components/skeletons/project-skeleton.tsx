"use client"

export function ProjectSkeleton() {
	return (
		<div className="grid grid-cols-6 gap-4 animate-pulse">
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					key={i}
					className={`${i < 2 ? "col-span-3" : "col-span-2"} max-[1080px]:col-span-3 max-[680px]:col-span-6 rounded-2xl border border-v-line bg-v-panel overflow-hidden flex flex-col`}
				>
					<div className="stripes aspect-video border-b border-v-line" />
					<div className="p-5 space-y-3">
						<div className="h-5 w-1/2 rounded bg-v-panel2" />
						<div className="h-3.5 w-full rounded bg-v-panel2" />
						<div className="h-3.5 w-5/6 rounded bg-v-panel2" />
						<div className="flex gap-1.5">
							<div className="h-5 w-12 rounded bg-v-panel2" />
							<div className="h-5 w-16 rounded bg-v-panel2" />
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
