"use client"

import { motion } from "framer-motion"
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
    <section className="py-24 px-6" id="experience">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="gradient-text">
              {language === "pt-BR" ? "Experiência Profissional" : "Professional Experience"}
            </span>
          </h2>
        </motion.div>

        {/* Current Role card */}
        {current && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mb-16"
          >
            {/* Gradient border glow */}
            <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-sm" />
            <div className="relative glass rounded-2xl p-8 md:p-10 border border-primary/20">
              <span className="inline-flex items-center gap-2 text-sm text-primary mb-6">
                <span className="animate-pulse">🟢</span>
                {language === "pt-BR" ? "Cargo Atual" : "Current Role"}
              </span>
              <Experience
                index={0}
                language={language}
                title_en={current.title_en}
                title_pt={current.title_pt}
                description_en={current.description_en}
                description_pt={current.description_pt}
                company={current.company}
                start_year={current.start_year}
                end_year={current.end_year}
                location={current.location}
                responsibilities_en={current.responsibilities_en}
                responsibilities_pt={current.responsibilities_pt}
                stack={current.stack}
                bare={true}
              />
            </div>
          </motion.div>
        )}

        {/* Vertical timeline for remaining items */}
        {rest.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-6 font-mono">
              {language === "pt-BR" ? "Experiências Anteriores" : "Previous Experience"}
            </h3>
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 to-border" />

              {rest.map((experience, i) => (
                <div key={experience.id} className="relative pb-10 last:pb-0">
                  {/* Timeline dot */}
                  <div className="absolute left-0 -translate-x-[4.5px] top-3 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background" />
                  <Experience
                    index={i + 1}
                    language={language}
                    title_en={experience.title_en}
                    title_pt={experience.title_pt}
                    description_en={experience.description_en}
                    description_pt={experience.description_pt}
                    company={experience.company}
                    start_year={experience.start_year}
                    end_year={experience.end_year}
                    location={experience.location}
                    responsibilities_en={experience.responsibilities_en}
                    responsibilities_pt={experience.responsibilities_pt}
                    stack={experience.stack}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
