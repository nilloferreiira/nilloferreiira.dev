"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { GridBackground } from "./grid-background"
import { HeaderContent } from "./content"

export function Header() {
	return (
		<section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
			<GridBackground />
			<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-background)_85%)]" />
			<div
				className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/5 rounded-full blur-[100px] animate-float pointer-events-none"
				style={{ animationDelay: "0s" }}
			/>
			<div
				className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-[100px] animate-float pointer-events-none"
				style={{ animationDelay: "3s" }}
			/>

			<div className="container max-w-5xl mx-auto relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="relative"
						data-slot="profile-image"
					>
						<div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-2 ring-primary/30 neon-glow">
							<Image
								src="https://github.com/nilloferreiira.png"
								alt="foto de perfil"
								width={224}
								height={224}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="absolute -inset-2 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 blur-xl -z-10" />
					</motion.div>

					<HeaderContent />
				</motion.div>
			</div>
		</section>
	)
}
