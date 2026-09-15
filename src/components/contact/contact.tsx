"use client"

import { motion } from "framer-motion"
import { Mail, Heart } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { getCvPath } from "@/lib/cv"
import { Kicker } from "@/components/ui/kicker"
import { PillButton } from "@/components/ui/pill-button"

export function Contact() {
  const { language } = useLanguage()

  const socials = [
    {
      label: "GITHUB",
      value: "github.com/nilloferreiira",
      href: "https://github.com/nilloferreiira",
      external: true,
    },
    {
      label: "LINKEDIN",
      value: "linkedin.com/in/nilloferreiira",
      href: "https://www.linkedin.com/in/nilloferreiira/",
      external: true,
    },
    {
      label: language === "pt-BR" ? "CURRÍCULO" : "RESUME",
      value: language === "pt-BR" ? "Baixar PDF" : "Download PDF",
      href: `/files/${getCvPath(language)}`,
      external: false,
    },
  ]

  return (
    <footer className="py-16 px-6 border-t border-border/50" id="contact">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <Kicker label={language === "pt-BR" ? "Contato" : "Contact"} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text">
            {language === "pt-BR" ? "Vamos conversar?" : "Let's talk?"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === "pt-BR"
              ? "Estou sempre aberto a novas oportunidades e projetos interessantes."
              : "I'm always open to new opportunities and interesting projects."}
          </p>

          <div className="flex justify-center">
            <PillButton href="mailto:nilloferreiira@gmail.com" icon={<Mail size={18} />}>
              {language === "pt-BR" ? "Enviar email" : "Send email"}
            </PillButton>
          </div>

          <div className="flex items-center justify-center gap-10 pt-4">
            {socials.map(({ label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
                className="flex flex-col items-center gap-1 group"
              >
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">{value}</span>
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground pt-8 flex items-center justify-center gap-1">
            {language === "pt-BR" ? "Feito com" : "Made with"}
            <Heart size={12} className="text-neon-pink" />
            {language === "pt-BR" ? "por Danillo" : "by Danillo"}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
