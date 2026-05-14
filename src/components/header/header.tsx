"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { HeaderContent } from "./content"

export function Header() {
	return (
		<header className="relative w-full lg:w-4/5 lg:p-6 pt-10 flex flex-col lg:flex-row items-center justify-center lg:items-start lg:justify-start overflow-hidden">
			<div
				className="absolute top-0 left-1/4 w-72 h-72 bg-neon-cyan/20 rounded-full blur-[100px] animate-float pointer-events-none"
				style={{ animationDelay: "0s" }}
			/>
			<div
				className="absolute top-0 right-1/4 w-72 h-72 bg-neon-purple/20 rounded-full blur-[100px] animate-float pointer-events-none"
				style={{ animationDelay: "2s" }}
			/>

			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="relative"
				data-slot="profile-image"
			>
				<div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,hsl(170_80%_50%/0.15),transparent_70%)] pointer-events-none" />
				<Image
					src="https://github.com/nilloferreiira.png"
					alt="foto de perfil"
					width={288}
					height={288}
					className="size-72 ring-2 rounded-full ring-neon-cyan/40 neon-glow"
				/>
			</motion.div>

			<HeaderContent />
		</header>
	)
}
