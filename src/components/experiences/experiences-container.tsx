"use client"

import { useLanguage } from "@/hooks/useLanguage"
import { Experience } from "./experience"
import type { Experience as ExperienceType } from "@/types/experience/experience"

interface ExperiencesContainerProps {
  experiences: ExperienceType[]
}

export function ExperienceContainer({ experiences }: ExperiencesContainerProps) {
  const { language } = useLanguage()

  if (!experiences || experiences.length === 0) return null

  const current = experiences[0]
  const rest = experiences.slice(1)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Current Role card */}
      {current && (
        <div className="relative mb-12">
          {/* Gradient border glow */}
          <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-neon-cyan/50 to-neon-purple/50 blur-sm opacity-30" />
          <div className="relative glass rounded-xl p-6">
            <span className="inline-flex items-center gap-2 text-sm text-primary mb-3">
              <span className="animate-pulse">🟢</span> {language === "pt-BR" ? "Atual" : "Current"}
            </span>
            <Experience
              index={0}
              language={language}
              title_en={current.title_en}
              title_pt={current.title_pt}
              description_en={current.description_en}
              description_pt={current.description_pt}
              bare={true}
            />
          </div>
        </div>
      )}

      {/* Vertical timeline for remaining items */}
      {rest.length > 0 && (
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/40 to-border" />

          {rest.map((experience, i) => (
            <div key={experience.id} className="relative mb-10">
              {/* Timeline dot */}
              <div className="absolute left-0 -translate-x-[4.5px] top-3 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background" />
              <Experience
                index={i + 1}
                language={language}
                title_en={experience.title_en}
                title_pt={experience.title_pt}
                description_en={experience.description_en}
                description_pt={experience.description_pt}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
