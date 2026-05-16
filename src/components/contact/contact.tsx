"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Heart } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

export function Contact() {
  const { language } = useLanguage()

  const socials = [
    { icon: Github, href: "https://github.com/nilloferreiira", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/nilloferreiira/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:nilloferreiira@gmail.com", label: "Email" },
  ]

  return (
    <footer className="py-16 px-6 border-t border-border/50">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold gradient-text">
            {language === "pt-BR" ? "Vamos conversar?" : "Let's talk?"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {language === "pt-BR"
              ? "Estou sempre aberto a novas oportunidades e projetos interessantes."
              : "I'm always open to new opportunities and interesting projects."}
          </p>

          <div className="flex items-center justify-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:neon-glow"
                aria-label={label}
              >
                <Icon size={20} />
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
