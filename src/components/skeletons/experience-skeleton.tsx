"use client"

function ExperienceCardSkeleton() {
	return (
		<div className="space-y-4 animate-pulse">
			<div className="space-y-2">
				<div className="h-7 w-2/3 rounded bg-muted-foreground/20" />
				<div className="h-5 w-1/3 rounded bg-muted-foreground/15" />
			</div>
			<div className="flex items-center gap-4">
				<div className="h-3.5 w-28 rounded bg-muted-foreground/15" />
				<div className="h-3.5 w-20 rounded bg-muted-foreground/15" />
			</div>
			<div className="space-y-2">
				<div className="h-4 w-full rounded bg-muted-foreground/10" />
				<div className="h-4 w-5/6 rounded bg-muted-foreground/10" />
			</div>
			<div className="space-y-1.5">
				<div className="h-3 w-32 rounded bg-muted-foreground/15 mb-2" />
				<div className="h-3.5 w-4/5 rounded bg-muted-foreground/10" />
				<div className="h-3.5 w-3/4 rounded bg-muted-foreground/10" />
				<div className="h-3.5 w-2/3 rounded bg-muted-foreground/10" />
			</div>
			<div className="flex flex-wrap gap-2">
				{[0, 1, 2, 3].map((i) => (
					<div key={i} className="h-6 w-16 rounded-full bg-muted-foreground/10" />
				))}
			</div>
		</div>
	)
}

export function ExperienceSkeleton() {
	return (
		<div>
			<div className="relative mb-16">
				<div className="relative glass rounded-2xl p-8 md:p-10 border border-primary/20">
					<div className="h-4 w-28 rounded bg-muted-foreground/20 animate-pulse mb-6" />
					<ExperienceCardSkeleton />
				</div>
			</div>

			<div>
				<div className="h-4 w-40 rounded bg-muted-foreground/20 animate-pulse mb-6" />
				<div className="relative pl-8">
					<div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 to-border" />
					{[0, 1, 2].map((i) => (
						<div key={i} className="relative pb-10 last:pb-0">
							<div className="absolute left-0 -translate-x-[4.5px] top-3 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background" />
							<div className="glass rounded-xl p-6">
								<ExperienceCardSkeleton />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
