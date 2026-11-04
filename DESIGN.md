# Design System: John Buchan Homes — Editorial Architectural

Single source of truth for the public website (and for prompting Google Stitch / Cursor).
Brand rules from the JBH Brand Book always win; this file adds layout, rhythm and motion on top.

## 1. Visual Theme & Atmosphere
A quiet, gallery-airy interface that reads like a high-end architecture monograph. Large, honest
photography does the selling; type is set in confident, tracked capitals; thin Buchan Gold rules
and numbered labels give it the order of a set of drawings. Layouts are offset and asymmetric
(7/5 and 5/7 splits, images that break the column), never stacked boxes of equal weight.
Motion is slow and weighty: images settle into place, never bounce.

- Density: 3 / 10 — Art Gallery Airy. Big section spacing, few elements per screen.
- Variance: 6 / 10 — Offset Asymmetric. Split heroes, staggered image pairs, left-aligned text.
- Motion: 4 / 10 — Fluid, restrained CSS. Opacity + transform only, long eases, one perpetual
  element per screen at most (the heritage marquee, the hotspot pulse).

## 2. Color Palette & Roles (JBH Brand Book — exact values only)
- **Warm White** (#F7F5F0) — Primary page canvas.
- **Pure Surface** (#FFFFFF) — Alternate band for rhythm between Warm White sections.
- **Architectural Stone** (#D6D0C5) — 1px rules, borders, dividers, image placeholders, quiet panels.
- **Stone Wash** (#EEEAE2) — Stone tinted into Warm White for the occasional calm band (FAQ, trust).
- **Buchan Green** (#213B31) — Headlines, dark grounds (hero panel, closing CTA, footer), photo overlays.
- **Deep Green** (#1B3229) — Shade of Buchan Green for layering on dark grounds only.
- **Soft Charcoal** (#2F3430) — Body copy.
- **Charcoal Mute** (#5E615A) — Secondary text and metadata (AA on Warm White).
- **Buchan Gold** (#B88A4B) — The single accent: hairline rules, numerals, primary CTA fill, active
  states, focus rings, display emphasis on dark grounds. Use sparingly.
- **Gold Ink** (#8A6334) — Darker shade of Buchan Gold for small text and display emphasis on light
  grounds where #B88A4B fails contrast (AA). Not a new color; a value of the brand gold.

Rules: one accent only (gold). Never pure black. Photo overlays are tinted Buchan Green, never
neutral black. No gradients other than photo scrims. No new colors (no blue, red, terracotta).

## 3. Typography Rules
Two families max (brand rule). Codec Pro / Aileron are licensed; until the files are self-hosted
(`src/styles/fonts.css`) every role falls back to **Montserrat**, as the brand book allows.

- **Display (H1/H2):** Codec Pro → Montserrat 500, ALL CAPS, tracking +0.04em, line-height 1.08.
  Hierarchy comes from weight and color, not size: H1 `clamp(34px, 4.6vw, 64px)`, H2
  `clamp(26px, 3vw, 44px)`. Keep headlines short (2–8 words).
- **Display emphasis** (the second line of a headline): same caps, weight 300, Buchan Gold on dark
  grounds, Gold Ink on light grounds. Never italic.
- **Subheads / card titles (H3):** Aileron → Montserrat 500, sentence case, tracking −0.01em,
  `clamp(19px, 1.6vw, 24px)`.
- **Labels / eyebrows:** Montserrat 600, 11–12px, ALL CAPS, tracking +0.2em, Gold Ink, preceded by
  a 32px gold hairline or a two-digit index ("01 —").
- **Body:** Montserrat 400, 16–19px, line-height 1.7, max 62ch, Soft Charcoal. No 300-weight body.
- **Numerals:** lining, tabular figures for stats, years and step numbers.
- **Script:** Felicity Bonham only for the tagline "Integrity in Every Layer", supplied as an image.
- **Banned:** Inter, generic serifs, italics as emphasis in headlines, light (300) body copy,
  more than two families.

## 4. Component Stylings
- **Primary button:** Buchan Gold fill, Buchan Green text, sharp corners (0–2px), 15px × 30px,
  12px caps tracked +0.16em. Hover: Gold Ink fill, white text. Active: translateY(1px). No glow.
- **Secondary button:** 1px Buchan Green outline (white on dark), same type. Hover fills.
- **Text link CTA:** caps label + a 28px gold rule that extends to 44px on hover (no arrow glyphs
  stacked with chevrons).
- **Image tiles:** no grey wash. Photo at full color; a short Buchan Green gradient only at the
  bottom 45% to carry white caption text. Hover: image scales 1.03 over 900ms.
- **Cards:** avoided. Use hairline top borders (1px Stone) and whitespace to group content.
  Elevation is never used on the public site.
- **Inputs:** label above (caps label style), 1px Stone border, 48px tall, gold focus ring,
  error text below in Gold Ink + message. No floating labels.
- **Loaders:** Stone skeleton blocks matching the final layout. No spinners.
- **Nav:** transparent over the hero, Warm White with a hairline once scrolled. Logo full color on
  light, all-white on dark, never boxed.

## 5. Layout Principles
- Containment: content max-width 1360px, gutters `clamp(20px, 6vw, 96px)`.
- 12-column CSS grid mindset. Default splits are 7/5 and 5/7, not 6/6.
- Hero: split screen. Buchan Green text panel (5 cols) + full-height photography (7 cols). The
  text never sits on top of the photo. Height `min(100dvh, 920px)`.
- Section rhythm: `clamp(80px, 12vw, 168px)` vertical padding; alternate Warm White / White / one
  dark Buchan Green band per page.
- Section headers: index label ("02 — What we build") + caps headline on the left, a short
  intro paragraph offset to the right columns.
- No equal three-up card rows. Use a large lead tile + smaller tiles, a two-column zig-zag, or a
  numbered list with hairlines.
- Below 900px every multi-column layout collapses to one column; no horizontal scroll; touch
  targets ≥ 44px; headlines scale with `clamp()`.

## 6. Motion & Interaction
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like settle). Durations 600–1100ms for reveals,
  200–350ms for hover.
- Reveals: fade + 24px rise, staggered 80–120ms per item. Images additionally un-mask (clip-path
  inset) once on entry.
- Perpetual: the heritage marquee and the active quality-layer hotspot pulse only.
- Animate `transform`, `opacity` and `clip-path` only. Respect `prefers-reduced-motion`.

## 7. Anti-Patterns (Banned)
- Emojis; Inter; generic serif fonts; italic headline emphasis; 300-weight body copy.
- Pure black; neutral-black photo overlays; grey washes over photography.
- Neon glows, drop shadows on the logo, boxed logos, recolored logos.
- Off-palette colors; gradient text; more than one accent.
- Centered hero; text overlapping photography in the hero; "Scroll to explore", bouncing chevrons.
- Equal three-column card rows; elevated cards with shadows.
- Hype copy ("Elevate", "Seamless", "Unleash", "Next-gen"), superlatives without proof,
  fake round numbers, "since 1961" more than once per page, buyer-agent commission.
- Region written as "Seattle Eastside" (always "Bellevue & the Greater Eastside").
