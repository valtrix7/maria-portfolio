# AGENTS.md

## Commands

```bash
npm run dev      # Vite dev server with HMR (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint (config in .oxlintrc.json; react/rules-of-hooks is an error)
```

There is **no test framework** — do not assume `npm test` exists. Verification is `npm run build` + `npm run lint`.

## What this is

Single-page motion-graphics designer portfolio. React 19 + Vite 8 + TypeScript (`.tsx`, strict mode) + Tailwind CSS v4. No router, no data fetching — all content inline in components. `src/App.tsx` renders every section in a fixed vertical order inside `<main>`.

## Scroll system (read before touching scroll/animation)

The whole site shares **one scroll engine**, set up once in `src/App.tsx`:

- A single **Lenis** instance provides smooth scroll, driven off **GSAP's ticker** (`gsap.ticker.add` + `lenis.raf`) so there is exactly one `requestAnimationFrame` source.
- `lenis.on('scroll', ScrollTrigger.update)` keeps GSAP ScrollTrigger in sync.
- `ScrollTrigger.refresh()` runs on `document.fonts.ready` and `window.load` so pinned/scrubbed triggers re-measure after layout settles.

Do **not** create a second Lenis instance or a competing RAF loop. New scroll-driven sections should register their own `ScrollTrigger` and rely on this shared setup.

## Animation conventions

- GSAP work is wrapped in `gsap.context(() => { ... }, ref)` and cleaned up with `return () => ctx.revert()` inside the `useEffect`.
- Each component defines a local `prefersReducedMotion()` helper and **must** provide a reduced-motion branch (skip choreography, show the final state, or render a static DOM fallback).
- **Per-frame values are written directly to DOM nodes via refs, never React state** — e.g. frame counters, progress rails, timecodes. This avoids re-renders during scroll.
- Pinned storytelling sections use `ScrollTrigger.create({ pin, scrub, invalidateOnRefresh, onUpdate })` and compute layout lengths in functions (`end: () => ...`) so they survive `refresh()`.
- React 19 / `StrictMode` means effects run twice in dev — ensure cleanup is correct (revert context, remove event listeners).

## Background canvas + section theming

`src/components/AnimationCanvas.tsx` is a fixed full-viewport `<canvas>` (z-index `-1`) running its own loop via `src/hooks/useAnimationLoop.js` — it draws film grain, ambient color orbs, and a cursor trail. It tints toward the **active section's accent color** using an `IntersectionObserver` keyed on each section's `data-section` attribute.

New section that should drive background color needs **both**:
1. `data-section="<key>"` on the `<section>`, and
2. a matching entry in the `SECTION_COLORS` map in `AnimationCanvas.tsx`.

## Styling

- Global design tokens, typography, and utility classes live in `src/index.css` as CSS custom properties (`--bg`, `--accent`, `--ease`, `--container-px`, etc.) and classes (`display-xl/lg`, `heading-*`, `body-*`, `label`, `btn-*`, `container`). Reuse these rather than hardcoding colors/sizes.
- Each component has a co-located `ComponentName.css` imported from its `.tsx`.
- Fonts: **Outfit** (display) and **Space Grotesk** (body/mono), loaded via Google Fonts `@import` at the top of `index.css`.
- **z-index ladder**: canvas `-1`, content sections low, header `1000`, menu overlay `10001`, `SmoothCursor` `10002`.

## Component structure

- `src/components/` — section components (`.tsx` + co-located `.css`)
- `src/components/ui/` — reusable UI pieces: `liquid-button.tsx`, `metal-button.tsx`, `motion-footer.tsx`
- `src/components/ui/motion-footer.tsx` — exports `CinematicFooter`, used as the site footer
- `src/components/animated-cards-stack.tsx` — GSAP ScrollTrigger + cva card stack (used by Testimonials)
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

## Path alias

`@/` resolves to `./src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

## Other things worth knowing

- `SmoothCursor.tsx` replaces the native cursor with a `motion/react` spring cursor, but only on true desktop pointers (`(any-hover: hover) and (any-pointer: fine)`) — it returns `null` on touch.
- Heavy dependencies are **dynamically imported** to stay out of the main bundle. Keep large libs lazy; the production build warns near the 500 kB chunk limit.
- `gsap/MorphSVGPlugin` is available (gsap bonus) — used by Testimonials canvas blobs.
- `@gsap/react` is installed (provides `useGSAP` hook) — not currently used in any active component.
- `lib: lucide-react`, `three` (lazy), `motion` (imported as `motion/react`).
- `old_index.html` is legacy and not part of the build (`index.html` is the Vite entry).
- Lint warning `react/only-export-components` on `liquid-button.tsx` is expected (exports both component and variant config) — not an error.
