# John Buchan Homes — Design Handoff Package

Use this package to redesign the **public marketing site** (not the admin panel).

## Stack (do not change)

- React 19 + TypeScript + Vite
- React Router v7
- CSS Modules + design tokens in `src/styles/tokens.css`
- Supabase CMS (content comes from hooks; demo fallback in `src/data/`)

## Brand context

- **Company:** John Buchan Homes — luxury custom home builder, Seattle Eastside (Bellevue, Clyde Hill, Medina, etc.)
- **Positioning:** "Build with Certainty." Family-owned since 1961. White-glove, high-touch — not volume production.
- **Audience:** High-net-worth homeowners planning $2M+ custom builds or major renovations.
- **Tone:** Confident, warm, refined — never corporate or template-y. Think estate builder, not tract home marketing.

## Current design tokens

```css
--color-bg-dark: #0d1512;
--color-bg-mid: #1a2420;
--color-text: #f5f0e8;
--color-accent: #b0824c;
--font-serif: 'Cormorant Garamond';
--font-sans: 'Inter';
```

Logo: `public/assets/logo-reverse.svg` (light version for dark backgrounds).

## Pages to prioritize (visual redesign)

1. **Homepage** (`src/pages/public/Home.tsx`, `Home.module.css`) — hero (YouTube embed), credibility strip, path tiles, process, testimonials, CTAs
2. **Navigation** (`src/components/layout/Nav.tsx`, `Nav.module.css`) — full-screen overlay menu today
3. **Footer** (`src/components/layout/Footer.tsx`, `Footer.module.css`)
4. **Shared patterns** (`src/styles/pages.module.css`, `src/styles/global.css`, `tokens.css`)
5. **Hub pages** (`src/components/public/HubPage.tsx`) — service/content pages
6. **Cost estimator** (`src/pages/public/CostEstimator.tsx`, `.module.css`)
7. **Portfolio** (`Portfolio.tsx`, `PortfolioDetail.tsx`)

## Do NOT change

- Route URLs (`src/router/index.tsx`)
- Supabase hooks, types, CMS data shapes (`src/types/index.ts`)
- Admin panel (`src/pages/admin/`, `src/components/admin/`)
- Business logic (forms, submissions, property filters, cost estimator calculations)
- File/folder structure unless necessary for layout

## Inspiration direction (from stakeholder doc)

- JayMarc — trust on every page, contextual CTAs
- Lochwood Lozier — hero video done well
- Mirikeen — promise/difference framing
- Avoid: generic AI aesthetic, overcrowded footers, stock "luxury" clichés

## Deliverables expected back

1. Updated CSS Module files and `tokens.css`
2. TSX markup changes only where layout/structure requires it
3. `DESIGN_CHANGELOG.md` listing every file modified and why
4. Keep all existing class names where possible; document renames

## Local dev

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

# Prompt for Claude (copy everything below this line)

You are redesigning the public marketing website for **John Buchan Homes**, a family-owned luxury custom home builder on the Seattle Eastside (Bellevue, Clyde Hill, Medina, Hunts Point, etc.). The codebase is React 19 + TypeScript + Vite with CSS Modules.

## Your goal

Create a **significantly better visual design** — typography, spacing, color refinement, component polish, and page rhythm — while keeping the site functional and integrable. The current design feels generic and underwhelming for a multi-million-dollar custom builder. Elevate it to compete with top-tier peers (JayMarc, Lochwood Lozier, Mirikeen) without copying them.

## Brand & feel

- Tagline: **"Build with Certainty."**
- Mood: Quiet luxury, craftsmanship, Eastside expertise, generational trust (since 1961)
- Avoid: Purple gradients, generic SaaS layouts, excessive rounded corners, stock photo aesthetics, cluttered tile grids
- Prefer: Strong editorial typography, generous whitespace, intentional asymmetry, subtle motion, dark rich backgrounds with warm gold accents (`#b0824c`)

## Scope — redesign these first

1. **Homepage** — hero (YouTube background video must still work), credibility strip, "Choose Your Starting Point" tiles, preconstruction block, process timeline, available homes spotlight, service area chips, testimonials, closing CTA
2. **Navigation** — currently a burger → full-screen overlay; improve hierarchy, hover states, and CTA prominence ("Start a Conversation" + phone)
3. **Footer** — three columns + badge rows; make credentials/social feel deliberate, not crowded
4. **Shared design system** — update `src/styles/tokens.css`, `global.css`, `pages.module.css` first, then page-specific modules
5. **Hub/content pages** — consistent hero + section rhythm via `HubPage.tsx`
6. **Cost estimator** — make the multi-step flow feel premium and trustworthy

## Hard constraints

- **Do not** change route paths, API hooks, Supabase integration, or admin code
- **Do not** remove CMS-driven content bindings — redesign around existing props/data
- **Do not** add new npm dependencies without explicit approval
- Keep **CSS Modules** (no Tailwind unless you replace consistently everywhere)
- Preserve **accessibility**: contrast, focus states, semantic HTML
- Hero must support **YouTube embed** (see `src/lib/youtube.ts` and `Home.tsx`) OR direct MP4 — do not break this
- Mobile-first responsive design is required

## Technical notes

- Fonts: Cormorant Garamond (serif headlines) + Inter (body) — you may suggest alternatives if justified
- Custom cursor exists (`CustomCursor.tsx`) — can keep or simplify
- `data-cursor` attributes are used for cursor hover — preserve if keeping custom cursor
- Placeholder images in `/public/assets/` — design for real photography later

## Output format

Return:

1. All modified files with full contents (or a clear zip structure)
2. `DESIGN_CHANGELOG.md` — file-by-file summary
3. Brief rationale for major decisions (type scale, color shifts, nav pattern)
4. Screenshots or description of homepage + one inner page at desktop and mobile widths

## Success criteria

A visitor should immediately feel: *"This is a serious Eastside custom builder worth a conversation"* — not *"This is a template."*

Start by proposing a refined design system (tokens + type scale + spacing), then apply it to the homepage and navigation before other pages.
