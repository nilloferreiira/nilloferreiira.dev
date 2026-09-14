"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/hooks/useLanguage"
import { Project } from "./project"
import { ProjectModal } from "./project-modal"
import { ProjectSkeleton } from "@/components/skeletons/project-skeleton"
import { Project as ProjectType } from "@/types/project/project"

interface ProjectsContainerProps {
  projects: ProjectType[]
  isLoading?: boolean
}

type Category = "all" | "personal" | "freelance" | "work" | "evento"

const CATEGORIES: { value: Category; label_en: string; label_pt: string }[] = [
  { value: "all", label_en: "All", label_pt: "Todos" },
  { value: "personal", label_en: "Personal", label_pt: "Pessoal" },
  { value: "freelance", label_en: "Freelance", label_pt: "Freelance" },
  { value: "work", label_en: "Work", label_pt: "Trabalho" },
  { value: "evento", label_en: "Event", label_pt: "Evento" },
]

export function ProjectContainer({ projects, isLoading }: ProjectsContainerProps) {
  const { language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [activeTagIds, setActiveTagIds] = useState<number[]>([])
  const [selected, setSelected] = useState<ProjectType | null>(null)

  const allTags = Array.from(
    new Map((projects ?? []).flatMap((p) => p.tags).map((t) => [t.id, t])).values()
  )

  const filteredProjects = (projects ?? []).filter((p) => {
    const categoryMatch = activeCategory === "all" || p.category === activeCategory
    const tagMatch = activeTagIds.length === 0 || activeTagIds.every((id) => p.tags.some((t) => t.id === id))
    return categoryMatch && tagMatch
  })

  function toggleTag(id: number) {
    setActiveTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
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

        {isLoading ? (
          <ProjectSkeleton />
        ) : (
          <>
            {/* Tag filter pills */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-8">
                {allTags.map((tag) => {
                  const isActive = activeTagIds.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-2.5 py-1 text-xs rounded-full font-mono transition-all duration-200 border ${
                        isActive
                          ? "bg-accent/20 text-accent border-accent/40"
                          : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
                      }`}
                    >
                      {tag.name}
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
                    onOpen={setSelected}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <p className="text-center text-muted-foreground py-12 font-mono text-sm">
                {language === "pt-BR" ? "Nenhum projeto encontrado." : "No projects found."}
              </p>
            )}
          </>
        )}

        <ProjectModal project={selected} language={language} onClose={() => setSelected(null)} />
      </div>
    </section>
  )
}
