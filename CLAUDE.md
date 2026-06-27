# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server with HMR (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint (config in .oxlintrc.json; react/rules-of-hooks is an error)
```

There is **no test framework** configured — do not assume `npm test` exists.

## What this is

A single-page motion-graphics designer portfolio (React 19 + Vite, plain `.jsx`, no
TypeScript, no router). `src/App.jsx` renders every section in a fixed vertical order inside
`<main>`. There are no routes and no data fetching — all content lives inline in components.

## Scroll system (read before touching scroll/animation)

The whole site shares **one scroll engine**, set up once in `src/App.jsx`:

- A single **Lenis** instance provides smooth scroll, driven off **GSAP's ticker**
  (`gsap.ticker.add` + `lenis.raf`) so there is exactly one `requestAnimationFrame` source.
  `lenis.on('scroll', ScrollTrigger.update)` keeps GSAP ScrollTrigger in sync.
- `ScrollTrigger.refresh()` runs on `document.fonts.ready` and `window.load` so pinned/scrubbed
  triggers re-measure after layout settles.

Do **not** create a second Lenis instance or a competing RAF loop. New scroll-driven sections
should register their own `ScrollTrigger` and rely on this shared setup.

## Animation conventions (followed by every animated component)

- GSAP work is wrapped in `gsap.context(() => { ... }, ref)` and cleaned up with
  `return () => ctx.revert()` inside the `useEffect`.
- Each component defines a local `prefersReducedMotion()` helper and **must** provide a reduced-
  motion branch (skip choreography, show the final state, or render a static DOM fallback).
- **Per-frame values are written directly to DOM nodes via refs, never React state** — e.g.
  frame counters, progress rails, timecodes. This avoids re-renders during scroll. Follow this
  pattern; do not lift scroll/animation progress into state.
- Pinned storytelling sections (`FrameSequence`, `SelectedWork`, `ShaderGallery`) use
  `ScrollTrigger.create({ pin, scrub, invalidateOnRefresh, onUpdate })` and compute layout
  lengths in functions (`end: () => ...`) so they survive `refresh()`.

## Background canvas + section theming

`src/components/AnimationCanvas.jsx` is a fixed full-viewport `<canvas>` (z-index `-1`) running
its own loop via `src/hooks/useAnimationLoop.js` — it draws film grain, ambient color orbs, and
a cursor trail. It tints toward the **active section's accent color** using an
`IntersectionObserver` keyed on each section's `data-section` attribute.

Consequence: a new section that should drive the background color needs **both**:
1. `data-section="<key>"` on the `<section>`, and
2. a matching entry in the `SECTION_COLORS` map in `AnimationCanvas.jsx`.

## Styling

- Global design tokens, typography, and utility classes live in `src/index.css` as CSS custom
  properties (`--bg`, `--accent`, `--ease`, `--container-px`, etc.) and classes
  (`display-xl/lg`, `heading-*`, `body-*`, `label`, `btn-*`, `container`). Reuse these rather
  than hardcoding colors/sizes.
- Each component has a co-located `ComponentName.css` imported from its `.jsx`.
- Fonts: **Outfit** (display) and **Space Grotesk** (body/mono), loaded via Google Fonts
  `@import` at the top of `index.css`.
- **z-index ladder** (keep new overlays consistent): canvas `-1`, content sections low,
  header `1000`, menu overlay `10001`, `SmoothCursor` `10002`.

## Other things worth knowing

- `SmoothCursor.jsx` replaces the native cursor with a `motion/react` spring cursor, but only on
  true desktop pointers (`(any-hover: hover) and (any-pointer: fine)`) — it returns `null` on
  touch and sets `document.body.style.cursor = 'none'`.
- Heavy dependencies are **dynamically imported** to stay out of the main bundle — `ShaderGallery`
  does `await import('three')` inside its effect and renders a DOM-grid fallback if WebGL is
  unavailable. Keep large libs lazy like this; the production build already warns near the
  500 kB chunk limit.
- Libraries in use: `gsap` + `gsap/ScrollTrigger`, `lenis`, `motion` (imported as `motion/react`),
  `three`, `lucide-react`. React 19 / `StrictMode` (effects run twice in dev — ensure cleanup is
  correct).
- `old_index.html` is legacy and not part of the build (`index.html` is the Vite entry).
