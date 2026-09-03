# Spec — Migrar a Hero (protótipo Lovable → projeto Next.js local)

Objetivo: portar a hero com a grade animada estilo GitHub (com rastro de mouse neon) do protótipo React/Vite para o seu projeto Next.js.

---

## 1. Pré-requisitos

Seu projeto Next.js precisa ter:

- **Tailwind CSS** (v3 — se estiver na v4, ver nota na seção 6)
- **framer-motion** → `npm install framer-motion`
- **lucide-react** → `npm install lucide-react`

---

## 2. Arquivos a criar

### 2.1 `components/GridBackground.tsx`

Componente novo. É um `<canvas>` que desenha a grade de quadrados com pulsação ambiente e "heat map" que segue o mouse (rastro que esfria gradualmente). No Next.js ele **precisa** da diretiva `"use client"` no topo — todo o resto é idêntico ao protótipo.

```tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * GitHub-contribution-style animated grid.
 * Cells pulse randomly and light up with a neon trail when the mouse passes over.
 */
export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 28;
    const GAP = 4;
    const STEP = CELL + GAP;

    let width = 0, height = 0, cols = 0, rows = 0;
    let ambient: Float32Array = new Float32Array(0);
    let speed: Float32Array = new Float32Array(0);
    let heat: Float32Array = new Float32Array(0);

    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / STEP);
      rows = Math.ceil(height / STEP);
      const n = cols * rows;
      ambient = new Float32Array(n);
      speed = new Float32Array(n);
      heat = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        ambient[i] = Math.random() * Math.PI * 2;
        speed[i] = 0.4 + Math.random() * 0.8;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    // Cores (HSL) — mesmas dos tokens do tema
    const CYAN = { h: 170, s: 80, l: 50 };
    const PURPLE = { h: 280, s: 70, l: 60 };
    const BASE = { h: 230, s: 20, l: 16 };

    let raf = 0;
    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // deposita calor sob o mouse
      const radius = 110;
      const cStart = Math.max(0, Math.floor((mouse.x - radius) / STEP));
      const cEnd = Math.min(cols - 1, Math.ceil((mouse.x + radius) / STEP));
      const rStart = Math.max(0, Math.floor((mouse.y - radius) / STEP));
      const rEnd = Math.min(rows - 1, Math.ceil((mouse.y + radius) / STEP));
      for (let r = rStart; r <= rEnd; r++) {
        for (let c = cStart; c <= cEnd; c++) {
          const cx = c * STEP + CELL / 2;
          const cy = r * STEP + CELL / 2;
          const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
          if (dist < radius) {
            const idx = r * cols + c;
            heat[idx] = Math.min(1, heat[idx] + (1 - dist / radius) * 0.25);
          }
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const x = c * STEP;
          const y = r * STEP;

          const pulse = (Math.sin(time * speed[idx] + ambient[idx]) + 1) / 2;
          const ambientGlow = Math.pow(pulse, 8) * 0.28;

          const h = heat[idx];
          heat[idx] = h * 0.94; // esfria

          const glow = Math.min(1, ambientGlow + h);

          if (glow < 0.02) {
            ctx.fillStyle = `hsl(${BASE.h} ${BASE.s}% ${BASE.l}% / 0.16)`;
          } else {
            const mix = c / Math.max(1, cols);
            const hue = CYAN.h + (PURPLE.h - CYAN.h) * mix;
            const light = BASE.l + glow * 30;
            const alpha = 0.16 + glow * 0.6;
            ctx.fillStyle = `hsl(${hue} ${CYAN.s}% ${light}% / ${alpha})`;
          }

          ctx.beginPath();
          ctx.roundRect(x, y, CELL, CELL, 4);
          ctx.fill();

          // bloom extra nas células quentes
          if (heat[idx] > 0.35) {
            const mix = c / Math.max(1, cols);
            const hue = CYAN.h + (PURPLE.h - CYAN.h) * mix;
            ctx.shadowColor = `hsl(${hue} ${CYAN.s}% 55%)`;
            ctx.shadowBlur = 14 * heat[idx];
            ctx.beginPath();
            ctx.roundRect(x, y, CELL, CELL, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const parent = canvas.parentElement;
    window.addEventListener("resize", resize);
    parent?.addEventListener("mousemove", onMove);
    parent?.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent?.removeEventListener("mousemove", onMove);
      parent?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
```

**Pontos de atenção:**
- O canvas se dimensiona pelo **elemento pai** (`parentElement`), então a `<section>` da hero precisa de `relative` + altura definida (`min-h-screen`).
- Os eventos de mouse ficam no pai (a section), não no canvas — o canvas tem `pointer-events-none`.
- Não depende de nenhuma lib externa — só Canvas API.

---

### 2.2 `components/HeroSection.tsx`

Adaptações em relação ao protótipo:

1. `"use client"` no topo (usa framer-motion, contexto de idioma e o GridBackground).
2. Troca o import do Vite `import profilePhoto from "@/assets/profile-photo.png"` por **asset estático do Next**: coloque a foto em `public/profile-photo.png` e use `src="/profile-photo.png"`, ou use `next/image`.
3. Troca `t("pt", "en")` pelo seu mecanismo de idioma atual (você disse que já tem Context API — o padrão é o mesmo).
4. O alias `@/` deve apontar para a raiz ou `src/` conforme seu `tsconfig.json`.

```tsx
"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, FileText, Mail, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext"; // seu contexto existente
import GridBackground from "@/components/GridBackground";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Grade animada interativa (quadrados estilo GitHub + rastro de mouse) */}
      <GridBackground />

      {/* Fade das bordas da grade para o fundo */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_85%)]" />

      {/* Orbes de fundo */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-neon-cyan/5 blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-neon-purple/5 blur-[100px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="container max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
        >
          {/* Foto de perfil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden neon-glow ring-2 ring-primary/30">
              <img src="/profile-photo.png" alt="Danillo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 blur-xl -z-10" />
          </motion.div>

          {/* Info */}
          <div className="text-center md:text-left space-y-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t("Olá! Eu sou o ", "Hey! I'm ")}
                <span className="gradient-text">Danillo</span> 👋
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mt-2 font-light">
                {t("Desenvolvedor de Software", "Software Developer")}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="text-primary font-medium">{t("Formação:", "Education:")}</span>{" "}
                {t("Análise e Desenvolvimento de Sistemas", "Systems Analysis and Development")}
              </p>
              <p>
                <span className="text-primary font-medium">{t("Inglês", "English")}</span> —{" "}
                {t("nível B2 (intermediário avançado)", "B2 level (upper intermediate)")}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex items-center gap-3 justify-center md:justify-start">
              {[
                { icon: Github, href: "https://github.com/SEU-USUARIO", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/in/SEU-USUARIO", label: "LinkedIn" },
                { icon: FileText, href: "#", label: "CV" },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="glass glass-hover w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:neon-glow">
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <a href="mailto:seu@email.com"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:neon-glow font-medium">
                {t("Me contate", "Contact me")} <Mail size={18} />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs font-mono tracking-widest uppercase">
          {t("Role para explorar", "Scroll to explore")}
        </span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={18} className="text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
```

---

## 3. Tokens de tema (CSS global)

A hero usa variáveis CSS em formato HSL (padrão shadcn). No seu `globals.css` (ou equivalente), garanta que existam:

```css
@layer base {
  :root {
    --background: 230 25% 7%;
    --foreground: 210 40% 96%;
    --primary: 170 80% 50%;        /* neon cyan */
    --accent: 280 70% 60%;         /* neon purple */
    --muted-foreground: 215 20% 65%;
    --neon-cyan: 170 80% 50%;
    --neon-purple: 280 70% 60%;
    --glass-bg: 230 25% 12%;
    --glass-border: 210 40% 90%;
  }

  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .glass {
    background: hsl(var(--glass-bg) / 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid hsl(var(--glass-border) / 0.3);
  }
  .glass-hover:hover {
    background: hsl(var(--glass-bg) / 0.8);
    border-color: hsl(var(--neon-cyan) / 0.3);
  }
  .neon-glow {
    box-shadow: 0 0 20px hsl(var(--neon-cyan) / 0.15),
                0 0 40px hsl(var(--neon-cyan) / 0.05);
  }
  .gradient-text {
    background: linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--neon-purple)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

---

## 4. Tailwind config

No `tailwind.config.ts`, mapeie os tokens e adicione a animação `float`:

```ts
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: "hsl(var(--primary))",
      accent: "hsl(var(--accent))",
      "muted-foreground": "hsl(var(--muted-foreground))",
      "neon-cyan": "hsl(var(--neon-cyan))",
      "neon-purple": "hsl(var(--neon-purple))",
    },
    keyframes: {
      float: {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-20px)" },
      },
    },
    animation: {
      float: "float 6s ease-in-out infinite",
    },
  },
},
```

---

## 5. Uso na página

```tsx
// app/page.tsx (ou onde sua home renderiza a hero)
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* ...demais seções */}
    </main>
  );
}
```

Se seu `LanguageContext` já envolve a árvore no layout, nada mais muda. Se não, garanta `<LanguageProvider>` envolvendo a página.

---

## 6. Notas e diferenças de plataforma

- **App Router vs Pages Router:** os componentes acima funcionam nos dois; no App Router, `"use client"` é obrigatório (já incluído). No Pages Router é opcional mas inofensivo.
- **Tailwind v4:** se o projeto usa v4, não há `tailwind.config.ts` — defina as cores/keyframes via `@theme` no CSS global e ajuste o mapeamento de tokens.
- **Foto de perfil:** com `next/image` você ganha otimização; basta trocar o `<img>` por `<Image src="/profile-photo.png" width={224} height={224} ... />` e adicionar `fill` + container relativo se preferir.
- **Performance:** o canvas roda em `requestAnimationFrame` e pausa sozinho quando a aba perde foco. Custo baixo (~células = (largura/32) × (altura/32)).
- **Links placeholder:** lembre de trocar `SEU-USUARIO`, o `mailto:` e o link do CV pelos valores reais.
- **Ajustes de intensidade (opcional):** opacidade base da célula (`0.16`), pulso ambiente (`0.28`), raio do mouse (`110`), fator de resfriamento do rastro (`0.94`) e bloom (`> 0.35`) — todos constantes no topo/`draw` do `GridBackground`.
