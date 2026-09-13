"use client"

export function ProjectSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="glass rounded-xl overflow-hidden flex flex-col">
					<div className="h-36 bg-muted-foreground/10 animate-pulse" />
					<div className="p-5 flex flex-col flex-1 space-y-3 animate-pulse">
						<div className="h-5 w-3/4 rounded bg-muted-foreground/20" />
						<div className="space-y-2 flex-1">
							<div className="h-3.5 w-full rounded bg-muted-foreground/10" />
							<div className="h-3.5 w-5/6 rounded bg-muted-foreground/10" />
						</div>
						<div className="flex flex-wrap gap-1.5">
							<div className="h-5 w-12 rounded-full bg-muted-foreground/10" />
							<div className="h-5 w-16 rounded-full bg-muted-foreground/10" />
							<div className="h-5 w-10 rounded-full bg-muted-foreground/10" />
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
