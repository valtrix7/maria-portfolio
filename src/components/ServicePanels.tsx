import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicePanels.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const PANELS = [
  {
    num: '01',
    category: 'Brand Motion',
    title: ['Stories that', 'move'],
    desc: 'Bringing brand identities to life through purposeful animation. Every frame crafted to communicate, every transition designed to convert.',
    accent: '#E8611A',
    tags: ['Brand Identity', 'Logo Animation', 'Style Frames'],
  },
  {
    num: '02',
    category: 'Visual Narratives',
    title: ['Cinematic', 'by nature'],
    desc: 'From investor pitch decks to product launches — visual stories engineered to hold attention and drive action at scale.',
    accent: '#A86CF0',
    tags: ['Pitch Decks', 'Product Films', 'Explainers'],
  },
  {
    num: '03',
    category: '3D & Dimension',
    title: ['Depth without', 'limits'],
    desc: 'Three-dimensional design that transforms flat concepts into immersive brand worlds. Cinema 4D meets creative strategy.',
    accent: '#FF5E6A',
    tags: ['3D Renders', 'Product Viz', 'Environment Design'],
  },
  {
    num: '04',
    category: 'Editorial Motion',
    title: ['Type as', 'art form'],
    desc: 'Typography-forward motion where letters and layouts become the centrepiece. Precision meets personality in every frame.',
    accent: '#FFa84B',
    tags: ['Kinetic Type', 'Social Content', 'Print to Motion'],
  },
];

const ServicePanels: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const mobile = isMobile();
    const vh = () => window.innerHeight;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.sp-panel');
      const n = panels.length;

      // Put panels 1–(n-1) off-screen below the stack
      panels.forEach((p, i) => { if (i > 0) gsap.set(p, { yPercent: 100 }); });

      if (reduce) {
        panels.forEach((p) => {
          gsap.set(p, { yPercent: 0, scale: 1, filter: 'none' });
          gsap.set(p.querySelectorAll('.sp-anim'), { y: 0, opacity: 1 });
        });
        return;
      }

      // ── First panel content fades in when section enters view ────────────
      gsap.fromTo('.sp-panel:first-child .sp-anim',
        { y: 44, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.09, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        }
      );

      // ── Master scrubbed timeline ─────────────────────────────────────────
      //  Pin the section for (n-1) × 100vh of overscroll distance.
      //  Each panel transition: 45% dwell → 55% animated slide.
      const step       = 1 / (n - 1);
      const dwellFrac  = 0.45;
      const transFrac  = 0.55;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${(n - 1) * vh()}`,
          scrub: 1.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;

        const stepStart  = (i - 1) * step;
        const transAt    = stepStart + step * dwellFrac;
        const transDur   = step * transFrac;

        // Incoming panel slides up from below
        tl.fromTo(panel,
          { yPercent: 100 },
          { yPercent: 0, ease: 'power2.inOut', duration: transDur },
          transAt
        );

        // Outgoing panel shrinks + dims → overscroll depth illusion
        tl.to(panels[i - 1],
          {
            scale: mobile ? 0.93 : 0.88,
            filter: 'brightness(0.3)',
            ease: 'power2.inOut',
            duration: transDur,
          },
          transAt
        );

        // Content of incoming panel staggers in mid-transition
        tl.fromTo(
          panel.querySelectorAll('.sp-anim'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, ease: 'power3.out', duration: transDur * 0.55 },
          transAt + transDur * 0.28
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="sp"
      id="services"
      data-section="services"
      ref={sectionRef}
    >
      <div className="sp-stack">
        {PANELS.map((panel, i) => (
          <article
            key={panel.num}
            className="sp-panel"
            style={{ '--sp-accent': panel.accent, zIndex: i + 1 } as React.CSSProperties}
            aria-label={`${panel.num} of ${PANELS.length}: ${panel.category}`}
          >
            {/* Accent radial glow */}
            <div className="sp-glow" aria-hidden="true" />

            {/* Giant decorative number */}
            <span className="sp-deco-num" aria-hidden="true">{panel.num}</span>

            {/* Content grid */}
            <div className="container sp-body">
              <div className="sp-content">
                <div className="sp-bar sp-anim" />
                <span className="label sp-cat sp-anim" style={{ color: panel.accent }}>
                  {panel.category}
                </span>
                <h2 className="sp-title">
                  {panel.title.map((line, j) => (
                    <span key={j} className="sp-title-line sp-anim">{line}</span>
                  ))}
                </h2>
                <p className="sp-desc sp-anim">{panel.desc}</p>
                <div className="sp-tags sp-anim">
                  {panel.tags.map((tag) => (
                    <span key={tag} className="sp-tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Floating panel index */}
              <div className="sp-index sp-anim" aria-hidden="true">
                <span className="sp-index-num" style={{ color: panel.accent }}>{panel.num}</span>
                <span className="sp-index-total">/ {String(PANELS.length).padStart(2, '0')}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ServicePanels;
