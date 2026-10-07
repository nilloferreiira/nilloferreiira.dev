"use client"

const bar = "rounded bg-v-panel2"

export function ExperienceSkeleton() {
	return (
		<div className="border-b border-v-line animate-pulse">
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					className="grid grid-cols-[minmax(0,2fr)_minmax(0,6fr)_minmax(0,3fr)] max-[1080px]:grid-cols-[minmax(0,2fr)_minmax(0,6fr)] max-[680px]:grid-cols-1 gap-[clamp(16px,3vw,40px)] py-8 border-t border-v-line"
				>
					<div className="space-y-2">
						<div className={`${bar} h-3 w-24`} />
						<div className={`${bar} h-3 w-14`} />
					</div>
					<div className="space-y-3">
						<div className={`${bar} h-7 w-1/2`} />
						<div className={`${bar} h-3.5 w-1/3`} />
						<div className={`${bar} h-4 w-full`} />
						<div className={`${bar} h-4 w-5/6`} />
						<div className={`${bar} h-3.5 w-2/3`} />
					</div>
					<div className="flex flex-wrap content-start gap-1.5 max-[1080px]:col-start-2 max-[680px]:col-start-auto">
						{[0, 1, 2, 3].map((j) => (
							<div key={j} className={`${bar} h-6 w-16`} />
						))}
					</div>
				</div>
			))}
		</div>
	)
}
