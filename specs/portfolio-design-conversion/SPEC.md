# Portfolio Design Conversion Plan

## Context

The portfolio needs a complete visual overhaul. The `portfollio-glow-main/` folder contains a reference design (React 18 + Vite + Tailwind v3 + Framer Motion + shadcn/ui) that establishes the new visual language: glass-morphism cards, neon glow effects, animated background orbs, scroll-triggered reveals, and a full semantic color token system. The current project is Next.js 15 / React 19 / Tailwind v4 — no motion library, 4 ad-hoc color vars, no glass effects.

**Goals:** Convert the public-facing sections to the new visual language, keep the admin section untouched, and add project category/tags filtering backed by real DB data.

**Decided:** Adopt the cyan/neon palette. Add ContactSection. Add project filtering. Add category + tags to the DB schema (with admin form support).

---

## Phase 1 — Foundation

### 1.1 Install packages
```bash
pnpm add framer-motion tailwind-variants tailwind-merge
```

### 1.2 Rebuild `src/app/globals.css`

Replace the current 4 ad-hoc variables with a full semantic system in `@theme`. Keep Tailwind v4 `@theme` syntax.

**New token structure:**
```css
@theme {
  /* Surfaces */
  --color-background: hsl(230 25% 7%);       /* #0d0f1a — near-black blue */
  --color-surface: hsl(230 20% 12%);          /* glass card bg */
  --color-surface-raised: hsl(230 20% 16%);   /* elevated surface */

  /* Content */
  --color-foreground: hsl(210 20% 92%);       /* near-white */
  --color-foreground-subtle: hsl(215 15% 70%);
  --color-muted-foreground: hsl(215 15% 55%);

  /* Brand */
  --color-primary: hsl(170 80% 50%);          /* cyan #0fd6b0 */
  --color-primary-foreground: hsl(230 25% 7%);
  --color-accent: hsl(280 70% 60%);           /* purple #a855f7 */
  --color-neon-cyan: hsl(170 80% 50%);
  --color-neon-purple: hsl(280 70% 60%);
  --color-neon-pink: hsl(330 80% 60%);

  /* Borders & inputs */
  --color-border: hsl(230 15% 20%);
  --color-glass-border: hsl(230 15% 25%);
  --color-ring: hsl(170 80% 50%);             /* focus ring = cyan */

  /* Keep animations */
  --animation-typing: typing 8s steps(25) infinite;
  --animation-blink: blink 0.5s step-end infinite alternate;
  --animation-float: float 6s ease-in-out infinite;
}
```

**New utility classes to add:**
```css
.glass {
  background: hsl(230 20% 12% / 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid hsl(230 15% 25% / 0.3);
}
.glass-hover:hover {
  background: hsl(230 20% 12% / 0.8);
  border-color: hsl(170 80% 50% / 0.3);
}
.neon-glow {
  box-shadow: 0 0 20px hsl(170 80% 50% / 0.15), 0 0 40px hsl(170 80% 50% / 0.05);
}
.neon-text {
  text-shadow: 0 0 20px hsl(170 80% 50% / 0.5);
}
.gradient-text {
  background: linear-gradient(135deg, hsl(170 80% 50%), hsl(280 70% 60%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
```

**Update `body` in layout.tsx:** change `bg-bg` → `bg-background`, `text-text-secondary` → `text-muted-foreground`.

---

## Phase 2 — DB Schema & API

### 2.1 Update `src/db/schema.ts`

Add to the `projects` table:
```ts
category: text('category').notNull().default('personal'),  // 'personal' | 'freelance' | 'work'
tags: text('tags').array().notNull().default([]),
```

### 2.2 Create migration

Run `pnpm drizzle-kit generate` to create the migration file, then `pnpm drizzle-kit migrate` (or equivalent push command).

### 2.3 Update `src/types/project/project.ts`

Add `category: 'personal' | 'freelance' | 'work'` and `tags: string[]`.

### 2.4 Update API routes

- `src/app/api/projects/route.ts` — include `category` and `tags` in GET response, POST and PUT body parsing.

---

## Phase 3 — Public Section Redesigns

All redesigned components follow the user's React rules:
- Named exports, no default export
- `tailwind-variants` (`tv()`) for variants
- `tailwind-merge` (`twMerge()`) for class merging
- `ComponentProps<'element'>` + `VariantProps`
- `data-slot` attributes
- No comments unless non-obvious

### 3.1 Header / Hero

**`src/components/header/header.tsx`**
- Add 2 animated background orbs (absolute, blur-[100px], `animate-float` with staggered `animationDelay`)
- Wrap layout in `motion.div` with stagger container pattern
- Profile image: `motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.6, delay:0.2 }}`
- Profile image gets `neon-glow` ring and a gradient radial backdrop

**`src/components/header/content.tsx`**
- Keep typing animation for the subtitle
- Wrap heading in `motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}`
- Wrap subtitle/typing block with `transition={{ delay:0.4 }}`

**`src/components/header/links.tsx`**
- Replace plain link/button styles with `glass glass-hover` + `neon-glow` on hover
- Use `tv()` for link button variants
- Icons remain from `lucide-react`
- Wrap in `motion.div transition={{ delay:0.6 }}`

### 3.2 Experiences

**`src/components/experiences/experiences-container.tsx`**
- Add a "Current Role" card at top (first experience item): gradient-border card with backdrop-blur
  - Gradient border via absolute `inset-[-1px]` div with `bg-gradient-to-r from-neon-cyan/50 to-neon-purple/50 blur-sm opacity-30`
  - "🟢 Current" badge with `animate-pulse`
- Below: vertical timeline (absolute line `left-[7px] w-[2px] bg-gradient-to-b from-primary/40 to-border`)
- Each item has a 15×15px dot (border + bg-background)

**`src/components/experiences/experience.tsx`**
- Wrap in `motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay: index * 0.15, duration:0.5 }}`
- Each responsibility item: `motion.li initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }} transition={{ delay: 0.1 * i }}`
- Apply `glass glass-hover` to the card

### 3.3 Projects

**`src/components/projects/projects-container.tsx`**
- Add filter state: `activeCategory: 'all' | 'personal' | 'freelance' | 'work'` and `activeTags: string[]`
- Derive `filteredProjects` from TanStack Query data + filter state (frontend-only)
- Extract unique tags from all projects for the tag filter buttons
- Wrap grid in `<AnimatePresence mode="popLayout">`
- Category filter buttons: `glass` style, active state with `bg-primary/20 border-primary/50`

**`src/components/projects/project.tsx`**
- Render `project.tags` as small pill badges
- Add `motion.div layout initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }} transition={{ delay: index * 0.05, duration:0.35 }}`
- Card: `glass glass-hover` background
- Preview area: folder icon placeholder or `imgSrc` image
- GitHub/URL action buttons in top-right corner

### 3.4 New Contact Section

**New file: `src/components/contact/contact.tsx`**
```
- Centered layout, border-top divider
- Heading with .gradient-text
- Row of 3 social icon buttons (glass style): GitHub, LinkedIn, Email
- "Built with ♥" attribution line
- motion.div whileInView entrance
```

**Add to `src/app/page.tsx`:** import and render `<Contact />` below `<ProjectContainer />`.

---

## Phase 4 — Admin Form Updates

**`src/components/admin/create-project-modal.tsx`**
- Add `category` select field (options: Personal, Freelance, Work)
- Add `tags` text input (comma-separated, parsed to array on submit)
- Zod schema update: add `category` and `tags` fields

**`src/components/admin/edit-project-modal.tsx`**
- Same fields added, pre-populated from existing project data

---

## Critical Files

| File | Change |
|---|---|
| `src/app/globals.css` | Full rebuild — new color tokens + utilities |
| `src/app/layout.tsx` | Update body classNames (bg-background, text-foreground) |
| `src/app/page.tsx` | Add `<Contact />` import/render |
| `src/db/schema.ts` | Add `category`, `tags` to projects table |
| `src/types/project/project.ts` | Add `category`, `tags` types |
| `src/app/api/projects/route.ts` | Handle new fields in GET/POST/PUT |
| `src/components/header/header.tsx` | Orbs + motion |
| `src/components/header/content.tsx` | Motion entrance |
| `src/components/header/links.tsx` | Glass-morphism + motion |
| `src/components/experiences/experiences-container.tsx` | Timeline layout + current role card |
| `src/components/experiences/experience.tsx` | whileInView animations |
| `src/components/projects/projects-container.tsx` | Filter state + AnimatePresence |
| `src/components/projects/project.tsx` | Glass card + motion + tags |
| `src/components/contact/contact.tsx` | New component |
| `src/components/admin/create-project-modal.tsx` | category + tags fields |
| `src/components/admin/edit-project-modal.tsx` | category + tags fields |

---

## Verification

1. `pnpm dev` — run dev server, check home page
2. **Hero:** orbs visible and floating, profile photo fades in, links have glass style
3. **Experiences:** timeline line visible, items slide in on scroll
4. **Projects:** filter buttons appear, clicking category hides/shows cards with layout animation, tech tags visible on cards
5. **Contact:** section appears below projects, social links work
6. **Admin:** create/edit project modals show category + tags fields, submission works
7. `pnpm build` — no TypeScript errors
