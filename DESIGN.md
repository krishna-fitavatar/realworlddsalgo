# Design System — realworlddsalgo

> **Memorable thing:** "This is engineering-grade and trustworthy."
> Every decision below serves that. The real-world references are the moat;
> the design earns the trust they require.

## Product Context
- **What this is:** A static reference site, one page per data structure / algorithm — description, complexity, a code-driven visualization, and curated real-world GitHub references (repos that *implement* it and repos that *use* it in production).
- **Who it's for:** Engineers and CS learners who want to see how textbook structures show up in real codebases.
- **Space/industry:** Developer reference / CS education (peers: VisuAlgo, algorithm-visualizer.org, MDN/devdocs).
- **Project type:** Static content site (Astro 5, GitHub Pages).

## Aesthetic Direction
- **Direction:** Technical-Editorial, monospace-signatured. Precise, typographic, restrained — reads like serious engineering reference material, not a marketing site.
- **Decoration level:** Minimal. Hairline rules and type do all the work; no ornament, no gradients, no decorative shapes.
- **Mood:** Calm, exact, credible. A printed technical manual with a terminal's honesty.
- **Anti-patterns (never):** purple/violet gradients, 3-column icon-circle feature grids, centered-everything, bubble border-radius on everything, gradient CTAs, `system-ui` as a display/body face, stock-hero vibes.

## Typography
One superfamily — **IBM Plex** (designed by IBM for technical material; carries engineering gravitas, distinct from the Inter/Roboto/Space-Grotesk convergence).
- **Display / Hero / structure names / section labels:** **IBM Plex Mono** (weights 500–600) — the signature move; monospace headings read instantly as "code reference."
- **Body / descriptions:** **IBM Plex Sans** (400/500) — readable at length, pairs natively with the mono.
- **UI / labels:** IBM Plex Mono, uppercase, letter-spacing 0.1em, small (0.7–0.78rem).
- **Code + complexity tables:** **IBM Plex Mono**, `font-variant-numeric: tabular-nums`.
- **Loading:** Google Fonts — `IBM+Plex+Mono:wght@400;500;600` + `IBM+Plex+Sans:wght@400;500;600`. Self-host later if FOUT matters.
- **Scale (rem):** label 0.72 · small 0.85 · body 1.0 · lead 1.05 · h2-label 0.78 (uppercased) · h1 2.1. Line-height 1.65 for body, ~1.1 for display.

## Color
- **Approach:** Restrained — near-black ink on warm paper, exactly one accent. Color is rare and meaningful.

**Light:**
- Paper (bg): `#FBFAF7` (warm off-white — "printed manual", not stark SaaS white)
- Ink (text): `#15181E` (near-black with a cool undertone — "the blue that's almost black")
- Muted: `#5B6470`
- Hairline (borders/rules): `#E6E3DC`
- Accent: `#1F4E79` (blueprint blue — links, highlighted viz node, current step; deliberately NOT the default `#2563eb`)

**Dark:**
- Paper: `#15181E` · Text: `#E8E6E1` · Muted: `#98A0AC` · Hairline: `#2A2F38`
- Accent: `#5B9BD5` (blueprint blue lifted ~for AA contrast on dark)

**Semantic:** success `#2E7D52` · warning `#B8860B` · error `#B23A3A` · info = accent.
**Dark-mode rule:** redesign surfaces (don't invert); accent lifted, not just lightened uniformly.

## Spacing
- **Base unit:** 4px.
- **Density:** Comfortable (reference reading, not data-dense dashboard).
- **Scale (px):** 2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64.

## Layout
- **Approach:** Grid-disciplined, single reading measure. Description / complexity / viz / code / references stack like a set manual page.
- **Max content width:** ~720px (reading measure). Header/footer share it.
- **Grid:** single column for content; index page groups structures by category.
- **Border radius:** hierarchical — sm 6px (controls, tags), md 8–10px (cards/viz/code), pill 999px (category tags). Never uniform bubble-radius.
- **Rules:** hairline (`--hairline`) top borders on `h2` section labels; no heavy dividers.

## Motion
- **Approach:** Minimal-functional. Only the visualization animates (stepping through algorithm state). Everything else is still — the stillness itself signals "serious tool, not a toy."
- **Easing:** enter ease-out · exit ease-in · move ease-in-out.
- **Duration:** micro 50–100ms · short 150–250ms · medium 250–400ms.
- **Reduced motion:** respect `prefers-reduced-motion` — viz still steps on click, no auto-play.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-31 | Initial design system created (/design-consultation) | Serve "engineering-grade and trustworthy"; work-from-knowledge (no research pass). |
| 2026-05-31 | IBM Plex superfamily; **monospace headings** | Signals "code reference" instantly; Plex carries engineering pedigree; dodges Inter/Space-Grotesk convergence. (Risk accepted.) |
| 2026-05-31 | Warm paper `#FBFAF7`, not stark white | "Printed technical manual" warmth. (Risk accepted.) |
| 2026-05-31 | Blueprint-blue accent `#1F4E79`, not `#2563eb` | Distinctive + credible; avoids the convergence-blue. (Risk accepted.) |
| 2026-05-31 | Preview approved (light + dark mockups of a structure page) | Visual confirmation before lock. |
