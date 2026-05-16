"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  const allTags = Array.from(new Set((projects ?? []).flatMap((p) => p.tags)))

  const filteredProjects = (projects ?? []).filter((p) => {
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
    <section className="py-24 px-6" id="projects">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="gradient-text">
              {language === "pt-BR" ? "Meus Projetos" : "My Projects"}
            </span>
          </h2>
        </motion.div>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "pt-BR" ? cat.label_pt : cat.label_en}
              </button>
            )
          })}
        </div>

        {/* Tag filter pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {allTags.map((tag) => {
              const isActive = activeTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 text-xs rounded-full font-mono transition-all duration-200 border ${
                    isActive
                      ? "bg-accent/20 text-accent border-accent/40"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        )}

        {/* Projects grid */}
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project, i) => (
              <Project
                key={project.id}
                language={language}
                project={project}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <p className="text-center text-muted-foreground py-12 font-mono text-sm">
            {language === "pt-BR" ? "Nenhum projeto encontrado." : "No projects found."}
          </p>
        )}
      </div>
    </section>
  )
}
