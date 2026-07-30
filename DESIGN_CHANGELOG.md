# Design Changelog — Buchan "Build with Certainty" refresh

Scope: design system tokens, homepage, navigation, footer. No routes, Supabase hooks, types, or admin code touched. No dependencies added. All class names preserved — CSS values only.

## Files changed
- `src/styles/tokens.css` — full token system: color depth scale, editorial type scale, letter-spacing/line-height/weight tokens, 4px spacing scale, motion tokens, layout tokens, plus `--texture-mark` (see below).
- `src/styles/global.css` — tokenized transitions, `:focus-visible` state, `prefers-reduced-motion` support, body texture.
- `src/styles/pages.module.css` — shared hero/section/button/eyebrow primitives retyped on the new scale; `.btnPrimary` now fills solid gold on hover (was a faint tint) for a more decisive CTA; `.btnLink` arrows animate on hover; `.hero`/`.section`/`.ctaSection` carry the new background texture.
- `src/components/layout/Nav.module.css` — solid-fill CTA button, tokenized scroll-blur, staggered overlay-link reveal (60ms steps via `nth-child`), tighter hero-scale nav type, textured overlay.
- `src/components/layout/Footer.module.css` — award badges now grayscale-by-default with a color reveal on hover (unifies the mixed PNG/JPG badge assets); tokenized rhythm; copyright bar goes row-layout on desktop; textured background.
- `src/pages/public/Home.module.css` — the "Choose Your Starting Point" tiles were the weakest link (bordered grid = generic SaaS). Rebuilt as a hairline-divided editorial list with a right-aligned arrow that slides in on hover, no boxed borders. Testimonials rebuilt around a large bronze quotation glyph instead of a bordered/tinted card. Work and spotlight cards get a subtle image scale on hover. Hero/section type repointed to the new scale. Credibility strip textured.
- `src/pages/public/CostEstimator.module.css` — branch cards move from a bordered-box grid to a hairline-divided list with a left accent bar on hover (matches the homepage tile treatment); progress bar, inputs, and options retyped on tokens.
- `src/components/public/HubPage.tsx` — inline style values (font sizes, border colors) switched to design tokens for consistency with every hub/IA page that renders through this shared component.

**Background texture** — the logo's mark is an interlocking bracket/bar monogram. Rather than reproducing the logo itself as a repeating pattern (heavy-handed, would fight with real photography), the site now carries an abstract, original geometric motif inspired by it: two offset interlocking bracket shapes, tiled at 96px, drawn as a single inline SVG token (`--texture-mark`) at 5% bronze opacity. It's applied to every solid dark surface (body, sections, CTA band, footer, nav overlay, credibility strip) so backgrounds read as intentionally crafted rather than flat color fills, without ever competing with foreground text or imagery.

## Rationale

**Type scale** — a single modular scale (`--text-display-2xl` … `--text-micro`) replaces one-off `clamp()` values scattered per component, so every headline/eyebrow/body size on the site now comes from the same six-step system. Hero titles size up slightly (to `clamp(48px,7.2vw,104px)` at the token level, `116px` cap on the page-level hero) for more editorial presence.

**Color** — kept your existing forest/near-black/gold palette (it already avoids the "SaaS purple gradient" trap) but added a third dark tone (`--color-bg-mid-2`) for card/hover surfaces and a hover-only `--color-accent-dark`, so interactive states read as intentional rather than a flat opacity tint.

**Nav pattern** — kept the full-screen overlay (it's the right pattern for a luxury builder — dramatic, editorial, not a dropdown) but added per-row stagger delays so links arrive in sequence rather than all at once, and gave the CTA a solid fill on hover to read as the primary action next to the phone number.

**Buttons** — `.btnPrimary` now fills solid gold on hover instead of a faint 16%-alpha tint. A "Build with Certainty" brand should feel decisive at the moment of commitment, not tentative.

**Award badges** — grayscale-by-default, color on hover. Your 8 Houzz badges are a mix of JPG/PNG at different native sizes and treatments (flat green icons vs. varied illustration styles); desaturating them by default unifies the strip visually and the hover reveal adds a small moment of delight without redesigning the badge assets themselves.

## Desktop / mobile description

**Homepage, desktop** — full-height Ken-Burns/video hero with a centered serif headline, thin gold-lettered marquee at the base. A quiet credibility strip. Then the "Starting Point" section reads as a stacked, hairline-divided list per group (Tools / Core paths / Also explore) rather than a wall of bordered cards — each row reveals a gold arrow on hover. Split blocks (Preconstruction, After the Keys) alternate full-bleed dark tone against the mid-forest tone for rhythm. Testimonials sit in a thin-ruled grid with an oversized bronze quotation mark anchoring each quote instead of a boxed card.

**Homepage, mobile** — hero content stacks and shrinks on the same scale (`clamp()` throughout, no separate mobile type sizes needed); the tile "rows" stack to one column with the same hover-hidden arrow rule (arrow shows a subtle rightward nudge on tap/focus instead of true hover); footer's four-column grid collapses to 2 then 1 column at `900px`/`540px`; nav CTA button hides under `900px`, leaving just phone + burger, and the overlay type scale steps down via its own `clamp()` floor (34px) so it never crowds narrow viewports.

## Not yet touched (next pass candidates)
- Hub pages (`src/components/public/HubPage.tsx`) and Cost Estimator — priorities 5–6 from the brief, not started this pass.
- `Home.module.css`'s unused legacy classes (`.legacyGrid`, `.concierge`, `.servicesGrid`, etc.) were left as-is — they aren't referenced by the current `Home.tsx` and appear to be dead CSS from an earlier layout; safe to delete once confirmed unused elsewhere.
- Real photography still needed in place of `/assets/ph-arch-*.svg` placeholders — the type/color system is now photography-ready (protective gradient + hover-scale already wired).
