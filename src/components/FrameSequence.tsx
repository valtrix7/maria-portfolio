import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FrameSequence.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FRAMES = [
  { kicker: 'FRAME 001', headline: ['Static', 'is', 'the', 'start.'], color: '#E8611A' },
  { kicker: 'FRAME 045', headline: ['Then', 'it', 'learns', 'to', 'move.'], color: '#ff5e69' },
  { kicker: 'FRAME 090', headline: ['Timing', 'becomes', 'feeling.'], color: '#b16cea' },
  { kicker: 'FRAME 135', headline: ['Feeling', 'becomes', 'memory.'], color: '#ff8a56' },
  { kicker: 'FRAME 180', headline: ['Motion', 'is', 'the', 'craft.'], color: '#E8611A' },
];

const TOTAL_FRAMES = 180;
const SCROLL_PER_FRAME = 300;

const FrameSequence = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const accentBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const el = headlineRef.current;
    if (!el) return;

    // Clear any existing content
    el.innerHTML = '';

    const ctx = gsap.context(() => {
      if (reduce) {
        if (counterRef.current) counterRef.current.textContent = String(TOTAL_FRAMES).padStart(3, '0');
        if (railRef.current) railRef.current.style.transform = 'scaleX(1)';
        if (stageRef.current) stageRef.current.textContent = FRAMES[FRAMES.length - 1].kicker;
        el.innerHTML = FRAMES[FRAMES.length - 1].headline.map((w) => `<span class="fs-word"><span class="fs-word-text">${w}</span></span>`).join('<span class="fs-word-sp"> </span>');
        return;
      }

      if (accentBarRef.current) {
        gsap.to(accentBarRef.current, {
          opacity: 0.3,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      // Build all layers via DOM — React won't touch headlineRef children
      const layers = FRAMES.map((frame) => {
        const span = document.createElement('span');
        span.className = 'fs-headline-layer';
        span.innerHTML = frame.headline
          .map((w) => `<span class="fs-word"><span class="fs-word-text">${w}</span></span>`)
          .join('<span class="fs-word-sp"> </span>');
        el.appendChild(span);
        return span;
      });

      // Position all layers absolutely, first one visible
      gsap.set(layers[0], { opacity: 1, y: 0 });
      for (let i = 1; i < layers.length; i++) {
        gsap.set(layers[i], { opacity: 0, y: 50 });
      }

      const totalScroll = SCROLL_PER_FRAME * (FRAMES.length - 1);
      let currentIdx = 0;

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress;

          // Counter
          if (counterRef.current) {
            const frame = Math.min(Math.round(p * TOTAL_FRAMES), TOTAL_FRAMES);
            counterRef.current.textContent = String(frame).padStart(3, '0');
          }

          // Rail
          if (railRef.current) railRef.current.style.transform = `scaleX(${p})`;

          // Which frame pair are we between?
          const raw = p * (FRAMES.length - 1);
          const idx = Math.min(Math.floor(raw), FRAMES.length - 2);
          const localP = raw - idx;

          // Update stage label & accent color
          const displayIdx = Math.min(Math.round(raw), FRAMES.length - 1);
          if (stageRef.current) stageRef.current.textContent = FRAMES[displayIdx].kicker;
          if (accentBarRef.current) accentBarRef.current.style.background = FRAMES[displayIdx].color;

          // If we jumped ahead (fast scroll), snap all layers
          if (idx > currentIdx + 1) {
            for (let i = 0; i < layers.length; i++) {
              if (i === idx) {
                gsap.set(layers[i], { opacity: 1, y: 0 });
                layers[i].querySelectorAll('.fs-word-text').forEach((w) => {
                  gsap.set(w, { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 });
                });
              } else if (i === idx + 1) {
                gsap.set(layers[i], { opacity: 0, y: 50 });
              } else {
                gsap.set(layers[i], { opacity: 0, y: 50 });
              }
            }
            currentIdx = idx;
            return;
          }

          // Phase 1: old text exits (0 -> 0.45)
          if (localP < 0.45) {
            const t = localP / 0.45;
            const oldWords = layers[idx].querySelectorAll('.fs-word-text');
            oldWords.forEach((w, wi) => {
              const stagger = Math.max(0, Math.min(1, t * 2 - wi * 0.12));
              gsap.set(w, {
                opacity: 1 - stagger,
                y: -40 * stagger,
                filter: `blur(${stagger * 4}px)`,
                scale: 1 - stagger * 0.06,
              });
            });
            // Keep next layer hidden
            gsap.set(layers[idx + 1], { opacity: 0, y: 50 });

          // Phase 2: gap (0.45 -> 0.55)
          } else if (localP < 0.55) {
            gsap.set(layers[idx], { opacity: 0 });
            gsap.set(layers[idx + 1], { opacity: 0, y: 50 });

          // Phase 3: new text enters (0.55 -> 1)
          } else {
            const t = (localP - 0.55) / 0.45;
            const newWords = layers[idx + 1].querySelectorAll('.fs-word-text');
            newWords.forEach((w, wi) => {
              const stagger = Math.max(0, Math.min(1, t * 2.2 - wi * 0.12));
              gsap.set(w, {
                opacity: stagger,
                y: 50 * (1 - stagger),
                filter: `blur(${(1 - stagger) * 5}px)`,
                scale: 0.92 + stagger * 0.08,
              });
            });
            // Show the container
            gsap.set(layers[idx + 1], {
              opacity: Math.min(1, t * 3),
              y: 50 * (1 - Math.min(1, t * 2)),
            });

            if (t >= 0.98) currentIdx = idx + 1;
          }
        },
      });

      // Entrance
      gsap.from(['.fs-hud', '.fs-rail-row', '.fs-bracket', '.fs-accent-bar'], {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: pinRef.current, start: 'top 75%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="frame-sequence"
      id="frames"
      data-section="frame-sequence"
      ref={sectionRef}
    >
      <div className="fs-pin" ref={pinRef}>
        {/* Corner brackets */}
        <div className="fs-bracket fs-bracket--tl" />
        <div className="fs-bracket fs-bracket--tr" />
        <div className="fs-bracket fs-bracket--bl" />
        <div className="fs-bracket fs-bracket--br" />

        {/* Accent bar */}
        <div className="fs-accent-bar" ref={accentBarRef} />

        {/* Top HUD */}
        <div className="fs-hud">
          <div className="fs-counter">
            <span className="fs-counter-current" ref={counterRef}>000</span>
            <span className="fs-counter-sep">/</span>
            <span className="fs-counter-total">{String(TOTAL_FRAMES).padStart(3, '0')}</span>
          </div>
          <div className="fs-stage" ref={stageRef}>{FRAMES[0].kicker}</div>
        </div>

        {/* Headline stage — GSAP builds all layers here */}
        <div className="fs-stage-area">
          <h2
            className="fs-headline"
            ref={headlineRef}
            aria-label={FRAMES.map((f) => f.headline.join(' ')).join('. ')}
          />
        </div>

        {/* Bottom HUD */}
        <div className="fs-rail-row">
          <span className="fs-rail-label">SCROLL</span>
          <div className="fs-rail-track">
            <div className="fs-rail-ticks">
              {FRAMES.map((_, i) => (
                <div key={i} className="fs-rail-tick" style={{ left: `${(i / (FRAMES.length - 1)) * 100}%` }} />
              ))}
            </div>
            <div className="fs-rail-fill" ref={railRef} />
          </div>
          <span className="fs-rail-label">FRAME-BY-FRAME</span>
        </div>
      </div>
    </section>
  );
};

export default FrameSequence;
