import React, { useEffect, useRef } from 'react';
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
const SCROLL_PER_FRAME = 280;

const FrameSequence = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const counterRef = useRef(null);
  const railRef = useRef(null);
  const stageRef = useRef(null);
  const headlineRef = useRef(null);
  const scanRef = useRef(null);
  const accentBarRef = useRef(null);
  const flickerRef = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduce) {
        if (counterRef.current) counterRef.current.textContent = String(TOTAL_FRAMES).padStart(3, '0');
        if (railRef.current) railRef.current.style.transform = 'scaleX(1)';
        if (stageRef.current) stageRef.current.textContent = FRAMES[FRAMES.length - 1].kicker;
        return;
      }

      // Scan line animation
      if (scanRef.current) {
        gsap.to(scanRef.current, {
          y: '100%',
          duration: 3,
          ease: 'none',
          repeat: -1,
        });
      }

      // Accent bar pulse
      if (accentBarRef.current) {
        gsap.to(accentBarRef.current, {
          opacity: 0.3,
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      // Build sentence layers
      const el = headlineRef.current;
      const layers = FRAMES.map((frame) => {
        const span = document.createElement('span');
        span.className = 'fs-headline-inner';
        span.dataset.color = frame.color;
        span.innerHTML = frame.headline
          .map((w, wi) => `<span class="fs-word" data-idx="${wi}"><span class="fs-word-text">${w}</span></span>`)
          .join('<span class="fs-word-sp"> </span>');
        el.appendChild(span);
        return span;
      });

      gsap.set(layers[0], { opacity: 1, y: '0em' });
      for (let i = 1; i < layers.length; i++) {
        gsap.set(layers[i], { opacity: 0, y: '0.6em' });
      }

      const totalScroll = SCROLL_PER_FRAME * (FRAMES.length - 1);
      let current = 0;

      const OUT_END = 0.38;
      const GAP_END = 0.52;

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Frame counter with flicker
          if (counterRef.current) {
            const frame = Math.min(Math.round(p * TOTAL_FRAMES), TOTAL_FRAMES);
            const txt = String(frame).padStart(3, '0');
            counterRef.current.textContent = txt;
          }

          // Counter flicker effect on fast scroll
          if (flickerRef.current && p > 0 && p < 1) {
            flickerRef.current.style.opacity = Math.random() > 0.92 ? '0.4' : '1';
          } else if (flickerRef.current) {
            flickerRef.current.style.opacity = '1';
          }

          // Rail
          if (railRef.current) railRef.current.style.transform = `scaleX(${p})`;

          // Accent bar color
          const raw = p * (FRAMES.length - 1);
          const displayIdx = Math.min(Math.round(raw), FRAMES.length - 1);
          if (stageRef.current) stageRef.current.textContent = FRAMES[displayIdx].kicker;
          if (accentBarRef.current) accentBarRef.current.style.background = FRAMES[displayIdx].color;

          // Word animations
          const idx = Math.min(Math.floor(raw), FRAMES.length - 2);
          if (idx === current && p < 1) return;

          if (idx > current + 1) {
            for (let i = 0; i < FRAMES.length; i++) {
              gsap.set(layers[i], { opacity: i === idx ? 1 : 0, y: i === idx ? '0em' : '0.6em' });
              const words = layers[i].querySelectorAll('.fs-word-text');
              words.forEach((w) => gsap.set(w, { opacity: 1, y: '0em', filter: 'blur(0px)', scale: 1 }));
            }
            current = idx;
            return;
          }

          const localP = raw - idx;
          const nextIdx = idx + 1;

          if (localP < OUT_END) {
            const t = localP / OUT_END;
            const oldWords = layers[idx].querySelectorAll('.fs-word-text');
            oldWords.forEach((w, i) => {
              const stagger = Math.max(0, Math.min(1, (t * 2) - (i * 0.1)));
              gsap.set(w, {
                opacity: 1 - stagger,
                y: `${-0.4 * stagger}em`,
                filter: `blur(${stagger * 3}px)`,
                scale: 1 - stagger * 0.05,
              });
            });
          } else if (localP < GAP_END) {
            gsap.set(layers[idx], { opacity: 0 });
            gsap.set(layers[nextIdx], { opacity: 0, y: '0.6em' });
          } else {
            const t = (localP - GAP_END) / (1 - GAP_END);
            const newWords = layers[nextIdx].querySelectorAll('.fs-word-text');
            newWords.forEach((w, i) => {
              const stagger = Math.max(0, Math.min(1, (t * 2.2) - (i * 0.1)));
              gsap.set(w, {
                opacity: stagger,
                y: `${0.5 * (1 - stagger)}em`,
                filter: `blur(${(1 - stagger) * 4}px)`,
                scale: 0.95 + stagger * 0.05,
              });
            });
            if (t >= 0.98) current = nextIdx;
          }
        },
      });

      // Entrance
      gsap.from(['.fs-hud', '.fs-rail-row', '.fs-bracket', '.fs-scanlines'], {
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
        {/* Scan lines overlay */}
        <div className="fs-scanlines" ref={scanRef} />

        {/* Film strip edges */}
        <div className="fs-filmstrip fs-filmstrip--left">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="fs-filmstrip-hole" />
          ))}
        </div>
        <div className="fs-filmstrip fs-filmstrip--right">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="fs-filmstrip-hole" />
          ))}
        </div>

        {/* Corner brackets */}
        <div className="fs-bracket fs-bracket--tl" />
        <div className="fs-bracket fs-bracket--tr" />
        <div className="fs-bracket fs-bracket--bl" />
        <div className="fs-bracket fs-bracket--br" />

        {/* Accent bar */}
        <div className="fs-accent-bar" ref={accentBarRef} />

        {/* Top HUD */}
        <div className="fs-hud">
          <div className="fs-counter" ref={flickerRef}>
            <span className="fs-counter-current" ref={counterRef}>000</span>
            <span className="fs-counter-sep">/</span>
            <span className="fs-counter-total">{String(TOTAL_FRAMES).padStart(3, '0')}</span>
          </div>
          <div className="fs-stage" ref={stageRef}>{FRAMES[0].kicker}</div>
        </div>

        {/* Headline stage */}
        <div className="fs-stage-area">
          <h2
            className="fs-headline"
            ref={headlineRef}
            aria-label={FRAMES.map((f) => f.headline.join(' ')).join('. ')}
          >
            <span className="fs-headline-inner">
              {FRAMES[0].headline.map((w, i) => (
                <React.Fragment key={i}>
                  <span className="fs-word"><span className="fs-word-text">{w}</span></span>
                  {i < FRAMES[0].headline.length - 1 && <span className="fs-word-sp"> </span>}
                </React.Fragment>
              ))}
            </span>
          </h2>
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
