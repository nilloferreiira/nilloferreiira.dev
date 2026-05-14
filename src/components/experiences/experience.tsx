"use client"

import { motion } from "framer-motion"

interface ExperienceProps {
  language: "en" | "pt-BR"
  title_en: string
  title_pt: string
  description_en: string
  description_pt: string
  index: number
  bare?: boolean
}

export function Experience({ language, title_en, title_pt, description_en, description_pt, index, bare }: ExperienceProps) {
  function formatLines(text: string) {
    return text.split("\n").filter(Boolean)
  }

  const title = language === "en" ? title_en : title_pt
  const lines = formatLines(language === "en" ? description_en : description_pt)

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={bare ? "space-y-4" : "glass glass-hover rounded-xl p-6 space-y-4"}
    >
      <h2 className="text-foreground font-bold text-2xl lg:text-3xl">{title}</h2>
      <ul className="space-y-2">
        {lines.map((line, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className="text-muted-foreground text-base leading-relaxed"
          >
            {line}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
