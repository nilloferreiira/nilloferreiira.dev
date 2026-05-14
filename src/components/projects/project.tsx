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
      className="glass glass-hover rounded-xl overflow-hidden relative group"
    >
      {/* Top-right external link button */}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-10 p-2 glass rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink className="size-4 text-foreground" />
        </a>
      )}

      {/* Image or folder placeholder */}
      {project.imgSrc ? (
        <Image
          src={project.imgSrc}
          alt={project.title}
          width={500}
          height={300}
          className="w-full object-cover"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-surface">
          <Folder className="size-12 text-muted-foreground" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-foreground font-semibold text-xl">{project.title}</h3>
        <p className="text-muted-foreground text-sm">
          {language === "en" ? project.description_en : project.description_pt}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full glass border border-glass-border text-muted-foreground"
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
