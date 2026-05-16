"use client"

import type { Project } from "@/types/project/project"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Folder } from "lucide-react"

interface ProjectProps {
  project: Project
  language: "en" | "pt-BR"
  index: number
}

export function Project({ project, language, index }: ProjectProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="glass glass-hover rounded-xl overflow-hidden transition-all duration-300 group flex flex-col"
    >
      {/* Preview area */}
      {project.imgSrc ? (
        <Image
          src={project.imgSrc}
          alt={project.title}
          width={500}
          height={300}
          className="w-full object-cover"
        />
      ) : (
        <div className="h-36 bg-gradient-to-br from-surface to-surface-raised flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <Folder size={36} className="text-muted-foreground/30" />
          {project.url && (
            <div className="absolute top-2 right-2">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
          {language === "en" ? project.description_en : project.description_pt}
        </p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
