"use client"

import { ArrowDown } from "lucide-react"
import { CountUp } from "@/components/ui/count-up"

interface HeroStatsProps {
	stats: { n: string; l: string }[]
	locale: string
	scrollLabel: string
}

export function HeroStats({ stats, locale, scrollLabel }: HeroStatsProps) {
	return (
		<div className="relative mt-[clamp(64px,9vw,120px)] border-t border-v-line">
			<div className="grid grid-cols-4 max-[680px]:grid-cols-2">
				{stats.map((stat, i) => (
					<div
						key={stat.l}
						className={`flex flex-col gap-1.5 py-7 pl-6 border-v-line first:pl-0 border-r last:border-r-0
							max-[680px]:py-[22px] max-[680px]:pl-[18px] max-[680px]:odd:pl-0
							${i === 1 ? "max-[680px]:border-r-0" : ""}
							${i < 2 ? "max-[680px]:border-b" : ""}`}
					>
						<span className="text-[clamp(36px,4vw,52px)] font-extrabold tracking-[-0.03em] leading-none text-v-text">
							<CountUp value={stat.n} locale={locale} />
						</span>
						<span className="font-mono text-[13px] text-v-muted">{stat.l}</span>
					</div>
				))}
			</div>
			<div className="max-[680px]:hidden flex justify-end items-center gap-2 pb-6 font-mono text-xs text-v-muted">
				{scrollLabel} <ArrowDown size={14} />
			</div>
		</div>
	)
}
