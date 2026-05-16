"use client"

import { motion } from "framer-motion"
import { CalendarDays, ChevronRight, MapPin } from "lucide-react"

interface ExperienceProps {
  language: "en" | "pt-BR"
  title_en: string
  title_pt: string
  description_en: string
  description_pt: string
  company: string
  start_year: number | null
  end_year: number | null
  location: string
  responsibilities_en: string[]
  responsibilities_pt: string[]
  stack: string[]
  index: number
  bare?: boolean
}

export function Experience({
  language,
  title_en,
  title_pt,
  description_en,
  description_pt,
  company,
  start_year,
  end_year,
  location,
  responsibilities_en,
  responsibilities_pt,
  stack,
  index,
  bare,
}: ExperienceProps) {
  const title = language === "en" ? title_en : title_pt
  const description = language === "en" ? description_en : description_pt
  const responsibilities = language === "en" ? responsibilities_en : responsibilities_pt

  const descriptionLines = description.split("\n").filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={bare ? "space-y-4" : "glass glass-hover rounded-xl p-6 space-y-4"}
    >
      {/* Company + Role */}
      <div className="space-y-1">
        <h2 className="text-foreground font-bold text-2xl lg:text-3xl">{company}</h2>
        <p className="text-primary font-medium text-lg">{title}</p>
      </div>

      {/* Date + Location */}
      {(start_year !== null || !!location) && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {start_year !== null && (
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {start_year} – {end_year ?? (language === "pt-BR" ? "Atual" : "Present")}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {location}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {descriptionLines.length > 0 && (
        <div className="space-y-2">
          {descriptionLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="text-muted-foreground text-base leading-relaxed"
            >
              {line}
            </motion.p>
          ))}
        </div>
      )}

      {/* Responsibilities */}
      {responsibilities.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {language === "pt-BR" ? "Responsabilidades" : "Responsibilities"}
          </p>
          <ul className="space-y-1.5">
            {responsibilities.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground text-base">
                <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stack chips */}
      {stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="border border-primary/40 text-primary text-xs rounded-full px-3 py-1"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
