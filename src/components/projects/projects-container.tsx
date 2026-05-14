"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Project } from "./project"
import { Project as ProjectType } from "@/types/project/project"

interface ProjectsContainerProps {
  projects: ProjectType[]
}

type Category = "all" | "personal" | "freelance" | "work"

const CATEGORIES: { value: Category; label_en: string; label_pt: string }[] = [
  { value: "all", label_en: "All", label_pt: "Todos" },
  { value: "personal", label_en: "Personal", label_pt: "Pessoal" },
  { value: "freelance", label_en: "Freelance", label_pt: "Freelance" },
  { value: "work", label_en: "Work", label_pt: "Trabalho" },
]

export function ProjectContainer({ projects }: ProjectsContainerProps) {
  const { language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [activeTags, setActiveTags] = useState<string[]>([])

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)))

  const filteredProjects = projects.filter((p) => {
    const categoryMatch = activeCategory === "all" || p.category === activeCategory
    const tagMatch = activeTags.length === 0 || activeTags.every((t) => p.tags.includes(t))
    return categoryMatch && tagMatch
  })

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="glass w-full flex flex-col items-start justify-center p-4 lg:p-16 rounded-xl space-y-6 lg:space-y-10">
      <h1 className="text-foreground font-semibold text-3xl">
        {language === "pt-BR" ? "Meus projetos " : "My projects "}&#x1F447;
      </h1>

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                isActive
                  ? "glass bg-primary/20 border border-primary/50 text-primary"
                  : "glass text-muted-foreground border border-transparent"
              }`}
            >
              {language === "pt-BR" ? cat.label_pt : cat.label_en}
            </button>
          )
        })}
      </div>

      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = activeTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "glass text-muted-foreground border border-transparent"
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}

      {/* Projects grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <Project
              key={project.id}
              language={language}
              project={project}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
