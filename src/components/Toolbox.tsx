import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import './Toolbox.css';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const tools = [
  { name: 'After Effects', icon: 'AE', color: '#9999FF', level: 95 },
  { name: 'Cinema 4D', icon: 'C4D', color: '#00A3E0', level: 88 },
  { name: 'Premiere Pro', icon: 'PR', color: '#9999FF', level: 90 },
  { name: 'Illustrator', icon: 'AI', color: '#FF9A00', level: 85 },
  { name: 'Photoshop', icon: 'PS', color: '#31A8FF', level: 92 },
  { name: 'Figma', icon: 'FG', color: '#A259FF', level: 80 },
  { name: 'Blender', icon: 'BL', color: '#E87D0D', level: 78 },
  { name: 'DaVinci Resolve', icon: 'DR', color: '#FF6B6B', level: 82 },
];

const Toolbox: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const dragInstRef = useRef<ReturnType<typeof Draggable.create>[number] | null>(null);

  useEffect(() => {
    const mobile = isMobile();
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const cards = track ? Array.from(track.querySelectorAll<HTMLElement>('.tb-card')) : [];

      // Helper: card step width (card + gap).
      const getStep = () => {
        if (!cards[0]) return 300;
        const style = window.getComputedStyle(track!);
        const gap = parseFloat(style.columnGap || style.gap || '24');
        return cards[0].offsetWidth + gap;
      };

      const getMax = () => {
        if (!track || !cards[0]) return 0;
        return Math.max(0, track.scrollWidth - track.parentElement!.offsetWidth);
      };

      // ---------- Card entrance ----------
      if (!reduce) {
        gsap.fromTo('.tb-card',
          { y: 80, opacity: 0, scale: 0.92 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: mobile ? 0.6 : 0.8, stagger: mobile ? 0.05 : 0.07,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.tb-carousel', start: 'top 85%' },
          }
        );
      }

      // ---------- Skill bar fills ----------
      gsap.utils.toArray<HTMLElement>('.tb-level-fill').forEach((fill) => {
        const width = fill.dataset.level;
        gsap.fromTo(fill,
          { width: '0%' },
          {
            width: `${width}%`,
            duration: mobile ? 0.8 : 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: fill, start: 'top 88%', toggleActions: 'play none none reverse' },
          }
        );
      });

      // ---------- Swipe Slider: Draggable + Inertia + snap ----------
      // Active card scales up; neighbors dim down. Drag/flick to advance; snaps
      // to the nearest card on release. Progress rail + index reflect position.
      const updateHUD = (x: number) => {
        const step = getStep();
        const max = getMax();
        if (progressRef.current) {
          const pct = max > 0 ? Math.min(1, Math.abs(x) / max) : 0;
          progressRef.current.style.transform = `scaleX(${pct})`;
        }
        if (indexRef.current) {
          const idx = Math.min(tools.length, Math.max(1, Math.round(Math.abs(x) / step) + 1));
          indexRef.current.textContent = String(idx).padStart(2, '0');
        }
      };

      const applyCardStates = (x: number) => {
        const step = getStep();
        const containerCenter = track!.parentElement!.offsetWidth / 2;
        cards.forEach((card) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2 + x;
          const dist = Math.abs(cardCenter - containerCenter);
          // Closer to center = bigger + brighter. Falls off with distance.
          const closeness = Math.max(0, 1 - dist / (step * 1.6));
          const scale = 0.9 + closeness * 0.1;
          const opacity = 0.5 + closeness * 0.5;
          gsap.to(card, { scale, opacity, duration: 0.3, overwrite: 'auto' });
        });
      };

      if (track && !reduce) {
        // Start at the first card.
        applyCardStates(0);
        updateHUD(0);

        dragInstRef.current = Draggable.create(track, {
          type: 'x',
          bounds: { minX: -getMax(), maxX: 0 },
          inertia: true,
          edgeResistance: 0.85,
          throwResistance: 2500,
          cursor: 'grab',
          activeCursor: 'grabbing',
          onDrag(this: { x: number }) {
            applyCardStates(this.x);
            updateHUD(this.x);
          },
          onThrowUpdate(this: { x: number }) {
            applyCardStates(this.x);
            updateHUD(this.x);
          },
          onDragEnd(this: { x: number }) {
            // Snap to nearest card on release.
            const step = getStep();
            const target = Math.max(-getMax(), Math.min(0, Math.round(this.x / step) * step));
            gsap.to(track!, {
              x: target,
              duration: 0.5,
              ease: 'power3.out',
              onUpdate() {
                applyCardStates(gsap.getProperty(track!, 'x') as number);
                updateHUD(gsap.getProperty(track!, 'x') as number);
              },
            });
          },
        })[0];

        // Keep active-card scale when scrolling past (no scroll hijack, just
        // a subtle parallax tie so the slider feels alive on scroll).
        gsap.to(track, {
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.tb-carousel',
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: false,
            onEnter: () => applyCardStates(gsap.getProperty(track, 'x') as number),
          },
        });

        // Recompute bounds on resize.
        const onResize = () => {
          if (!dragInstRef.current) return;
          dragInstRef.current.applyBounds({ minX: -getMax(), maxX: 0 });
          applyCardStates(gsap.getProperty(track, 'x') as number);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }

      // ---------- Marquee ----------
      const marquee = sectionRef.current?.querySelector<HTMLElement>('.tb-marquee-track');
      if (marquee && !reduce) {
        gsap.to(marquee, { x: '-50%', duration: mobile ? 20 : 30, repeat: -1, ease: 'none' });
      }

      // ---------- Parallax layers for decorative SVGs ----------
      if (!mobile && !reduce) {
        gsap.fromTo('.tb-deco',
          { scale: 0.8 },
          {
            scale: 1, opacity: 0.1,
            duration: 1.5, ease: 'power2.out', stagger: 0.2,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
          }
        );

        gsap.to('.tb-deco-1', {
          y: -60,
          rotation: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
        gsap.to('.tb-deco-2', {
          y: 50,
          rotation: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
        gsap.to('.tb-deco-3', {
          y: -40,
          rotation: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.5,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      if (dragInstRef.current) dragInstRef.current.kill();
    };
  }, []);

  return (
    <section className="tb" id="tools" data-section="toolbox" ref={sectionRef}>
      <svg className="tb-deco tb-deco-1" viewBox="0 0 300 300" fill="none">
        <polygon points="150,30 270,240 30,240" stroke="var(--accent)" strokeWidth="0.5" />
        <polygon points="150,70 230,210 70,210" stroke="var(--accent)" strokeWidth="0.5" />
      </svg>
      <svg className="tb-deco tb-deco-2" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="80" stroke="var(--accent)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="50" stroke="var(--accent)" strokeWidth="0.5" />
      </svg>
      <svg className="tb-deco tb-deco-3" viewBox="0 0 250 250" fill="none">
        <rect x="25" y="25" width="200" height="200" rx="8" stroke="var(--accent)" strokeWidth="0.5" transform="rotate(15 125 125)" />
      </svg>

      <div className="container">
        <div className="tb-header">
          <div className="label">Toolbox</div>
          <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '20px' }}>
            My creative<br />arsenal
          </h2>
          <p className="body-lg">
            The software and tools I use to bring ideas to life. Drag to explore.
          </p>
        </div>
      </div>

      <div className="tb-carousel">
        <div className="tb-carousel-viewport">
          <div className="tb-track" ref={trackRef}>
            {tools.map((tool) => (
              <div className="tb-card" key={tool.name}>
                <div className="tb-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color}22 0%, transparent 70%)` }} />
                <div className="tb-card-top">
                  <div
                    className="tb-card-icon"
                    style={{ borderColor: tool.color + '40', boxShadow: `0 0 30px ${tool.color}15` }}
                  >
                    <span className="tb-card-icon-text" style={{ color: tool.color }}>{tool.icon}</span>
                  </div>
                  <div className="tb-card-level">
                    <span className="tb-card-level-num" style={{ color: tool.color }}>{tool.level}%</span>
                  </div>
                </div>
                <h4 className="tb-card-name">{tool.name}</h4>
                <div className="tb-card-bar">
                  <div
                    className="tb-level-fill"
                    style={{ background: `linear-gradient(90deg, ${tool.color}, ${tool.color}80)` }}
                    data-level={tool.level}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tb-slider-hud">
          <div className="tb-slider-index">
            <span ref={indexRef}>01</span>
            <span className="tb-slider-sep">/</span>
            <span className="tb-slider-total">{String(tools.length).padStart(2, '0')}</span>
          </div>
          <div className="tb-slider-rail">
            <div className="tb-slider-fill" ref={progressRef} />
          </div>
          <span className="tb-slider-hint">Drag or flick</span>
        </div>
      </div>

      <div className="tb-marquee">
        <div className="tb-marquee-track">
          <span>MOTION GRAPHICS</span><span className="tb-dot" />
          <span>3D ANIMATION</span><span className="tb-dot" />
          <span>BRAND DESIGN</span><span className="tb-dot" />
          <span>VFX</span><span className="tb-dot" />
          <span>VIDEO EDITING</span><span className="tb-dot" />
          <span>TYPOGRAPHY</span><span className="tb-dot" />
          <span>MOTION GRAPHICS</span><span className="tb-dot" />
          <span>3D ANIMATION</span><span className="tb-dot" />
          <span>BRAND DESIGN</span><span className="tb-dot" />
          <span>VFX</span><span className="tb-dot" />
          <span>VIDEO EDITING</span><span className="tb-dot" />
          <span>TYPOGRAPHY</span><span className="tb-dot" />
        </div>
      </div>
    </section>
  );
};

export default Toolbox;
