"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

export function Contact() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full border-t border-border pt-16 pb-8 flex flex-col items-center gap-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Let&apos;s connect</h2>
        <p className="text-muted-foreground">Find me on the web</p>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://github.com/nilloferreiira"
          target="_blank"
          rel="noopener noreferrer"
          className="glass glass-hover neon-glow rounded-full size-12 flex items-center justify-center transition-all"
        >
          <Github className="size-5 text-foreground" />
        </a>
        <a
          href="https://www.linkedin.com/in/nilloferreiira/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass glass-hover neon-glow rounded-full size-12 flex items-center justify-center transition-all"
        >
          <Linkedin className="size-5 text-foreground" />
        </a>
        <a
          href="mailto:nilloferreiira@gmail.com"
          className="glass glass-hover neon-glow rounded-full size-12 flex items-center justify-center transition-all"
        >
          <Mail className="size-5 text-foreground" />
        </a>
      </div>

      <p className="text-muted-foreground text-sm">Built with ♥ by Danillo Ferreira</p>
    </motion.section>
  )
}
