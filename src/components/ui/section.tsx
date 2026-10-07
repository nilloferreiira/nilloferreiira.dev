import { Reveal } from "./reveal"
import { SectionLabel } from "./section-label"

interface SectionProps {
	id: string
	index: string
	path: string
	title?: React.ReactNode
	children: React.ReactNode
	after?: React.ReactNode
}

export const wrap = "max-w-[1512px] mx-auto px-[clamp(20px,5vw,72px)]"

export function Section({ id, index, path, title, children, after }: SectionProps) {
	return (
		<section id={id} className="v-sec border-t border-v-line py-[clamp(72px,10vw,140px)] transition-colors">
			<div className={wrap}>
				<SectionLabel index={index} path={path} />
				{title && (
					<Reveal>
						<h2 className="text-[clamp(34px,4.6vw,64px)] font-extrabold tracking-[-0.035em] leading-[1.02] mb-[clamp(28px,4vw,48px)] text-v-text">
							{title}
						</h2>
					</Reveal>
				)}
				{children}
			</div>
			{after}
		</section>
	)
}
