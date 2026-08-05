# JBH Design Spec — Return (Aug 3, 2026 pass)

Maps the design updates made in the Claude prototype back onto `current-source/` files, per `component-map.md`. Confirmed working against the CURRENT IA (10-section Home, dropdown Nav, 4-column Footer) — not the outdated README.

---

## 1. `src/pages/public/Home.tsx` / `Home.module.css`

No section order/copy changes — structure confirmed correct as-is. Visual additions layered on top:

### Hero
- Video is a **YouTube background**, not a square embed: absolutely positioned iframe at `width: max(100%, 177.78vh); height: max(100%, 56.25vw); transform: translate(-50%,-50%)` inside a `position:relative; overflow:hidden` container — this is the standard "fill 16:9 into any box" formula. Confirm `.heroYoutube iframe` in `Home.module.css` already matches this (it does) — no change needed there, just confirming the prototype uses the identical technique.

### Texture additions (new)
Three sections that were flat white now carry a subtle bronze dot/grid texture (echoes `--texture-mark-square`/logo mark direction, kept very low-opacity so it reads as paper texture, not pattern):

```css
/* ClientConcerns.module.css — .section */
background-color: var(--color-bg-white);
background-image: radial-gradient(rgba(176,130,76,0.09) 1.2px, transparent 1.2px);
background-size: 22px 22px;

/* QualityLayersInteractive.module.css — .section */
background-color: var(--color-bg-white);
background-image:
  linear-gradient(rgba(176,130,76,0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(176,130,76,0.05) 1px, transparent 1px);
background-size: 40px 40px;

/* PickYourPath.module.css — .section */
background-color: var(--color-bg-white);
background-image: radial-gradient(rgba(176,130,76,0.09) 1.2px, transparent 1.2px);
background-size: 22px 22px;
```

`BetterPlannedPath.module.css` already has `.textureBand` — no change there.

### Scroll animation (enhanced)
`RevealOnScroll` currently does a single fade-up. Recommend extending it with:
1. **Per-sibling stagger** — when multiple `RevealOnScroll` instances share a parent, delay each by `min(index * 90ms, 360ms)`.
2. **Variant prop** — `<RevealOnScroll variant="scale">` (opacity + `scale(0.94)→1`) and `variant="left"` (opacity + `translateX(-32px)→0`), default remains `translateY(28px)→0`.

Suggested prop-driven `RevealOnScroll.tsx` signature:
```tsx
type Variant = 'up' | 'scale' | 'left';
export function RevealOnScroll({ children, variant = 'up', index = 0 }: { children: ReactNode; variant?: Variant; index?: number }) { ... }
```
Apply `variant="scale"` to `FeaturedWorkGrid`'s small-grid cards, `variant="left"` to `WhatWeDo`'s two primary cards — both read noticeably more dynamic without changing layout.

---

## 2. `src/components/public/home/QualityLayersInteractive.tsx`

**Replace the placeholder SVG house diagram with a real photo** (`/assets/quality-layers-house.jpg` — included in this package, a cutaway architectural photo showing green roof, structural framing, stone base, and glazing in one frame).

- Swap `<svg>` block for `<img src="/assets/quality-layers-house.jpg" className={styles.elevationPhoto} />` inside `.elevationPanel` (keep `position: relative` on the panel).
- **Reposition the 6 hotspots** to sit on real features instead of arbitrary schematic coordinates — update `QUALITY_LAYERS` in `iaContent.ts`:

```ts
export const QUALITY_LAYERS: QualityLayerHotspot[] = [
  { id: 'durability', label: 'Long-term durability', benefit: '...', x: 24, y: 32 },   // green roof edge
  { id: 'structure',  label: 'Structural planning',   benefit: '...', x: 84, y: 34 },   // exposed frame, right bay
  { id: 'windows',    label: 'Window & door integration', benefit: '...', x: 33, y: 50 }, // glazing wall
  { id: 'water',      label: 'Water management',      benefit: '...', x: 22, y: 66 },   // stone base
  { id: 'comfort',    label: 'Indoor comfort',         benefit: '...', x: 56, y: 62 },   // entry door
  { id: 'sound',      label: 'Sound control',          benefit: '...', x: 90, y: 60 },   // far wall assembly
];
```

- Active-hotspot treatment: solid bronze dot (`#B0824C`) with a `4px` off-white ring (`box-shadow: 0 0 0 4px rgba(245,240,232,0.55)`), inactive dots off-white at 85% opacity so they read against the photo. Active dot gets a looping pulse ring:

```css
@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.9); opacity: 0; } }
.hotspotPulse { animation: pulse 1.8s ease-out infinite; border: 1.5px solid var(--color-accent); }
```

- Add a bottom-to-top dark gradient over the photo (`linear-gradient(0deg, rgba(13,21,18,0.28) 0%, rgba(13,21,18,0) 32%)`) so the off-white dots stay legible over light parts of the image (sky, siding).

**Asset needed:** `public/assets/quality-layers-house.jpg` — included in this zip under `assets/`.

---

## 3. Nav / Footer

Confirmed matching `current-source/components/layout/Nav.tsx` and `Footer.tsx` — desktop dropdown groups (Custom Homes / Renovations / Services / Portfolio / About), CTA + phone, mobile-only fullscreen overlay, no custom cursor. Footer confirmed 4 columns (Company / Services / Resources / Utility) + award badge row + social row. No further changes proposed this pass.

---

## Assets included in this package
- `assets/quality-layers-house.jpg` — new photo for Quality in Every Layer (replaces SVG diagram)
- `assets/logo.png`, `logo-reverse.png` — unchanged, for reference

## Desktop / mobile description

**Homepage, desktop:** Light cream hero with serif "Build with *Certainty.*" above a 16:9 YouTube video band, single credibility line, then alternating white/cream sections down to a single dark-forest testimonial band and dark closing CTA. Quality section now shows a real cutaway home photo with 6 glowing hotspots instead of a line-drawing.

**Homepage, mobile:** Nav collapses to burger → fullscreen dark overlay with grouped links. Hero video is hidden below 768px per existing CSS (`.heroMediaLarge video { display:none }`, falls back to a static image) — recommend doing the same fallback for the YouTube iframe path if not already handled. Sections stack full-width; Quality panel photo and callout list stack vertically.
