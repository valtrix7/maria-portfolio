import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const services = [
  {
    num: '01',
    title: 'Motion Design',
    desc: 'Brand films, explainers, and title sequences animated with cinematic timing and rhythm.',
    tags: ['After Effects', 'Cinema 4D', 'Storyboarding'],
  },
  {
    num: '02',
    title: 'Brand in Motion',
    desc: 'Logo reveals, motion systems, and living guidelines that keep a brand alive in every frame.',
    tags: ['Identity', 'Motion Systems', 'Guidelines'],
  },
  {
    num: '03',
    title: '3D & Visual FX',
    desc: 'Dimensional storytelling through shading, lighting, and simulation that feels tactile and real.',
    tags: ['Cinema 4D', 'Octane', 'Houdini'],
  },
  {
    num: '04',
    title: 'Art Direction',
    desc: 'Concept, mood, and visual language shaped from the first frame to the final cut.',
    tags: ['Concept', 'Look Dev', 'Direction'],
  },
  {
    num: '05',
    title: 'Interaction Motion',
    desc: 'Microinteractions and interface choreography that make products feel inevitable.',
    tags: ['Prototyping', 'GSAP', 'Lottie'],
  },
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const marksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const n = services.length;

  // Jump to a service: on desktop scroll to its slot within the pinned
  // timeline; on mobile/reduced (no pin) just bring the row into view.
  const goToService = (i: number) => {
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: unknown, o?: object) => void } }).__lenis;
    const tl = tlRef.current;
    const st = tl?.scrollTrigger;

    if (tl && st && st.start != null && st.end != null) {
      // active === i once timeline time passes i + 0.25; aim past the midpoint.
      const target = Math.min(1, (i + 0.6) / tl.duration());
      const y = st.start + target * (st.end - st.start);
      if (lenis) lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }

    const row = rowsRef.current[i];
    if (!row) return;
    if (lenis) lenis.scrollTo(row, { offset: -80, duration: 0.8 });
    else row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const mobile = isMobile();

    const setRowActive = (i: number, active: boolean) => {
      const row = rowsRef.current[i];
      if (row) row.classList.toggle('is-active', active);
    };

    if (mobile) {
      detailsRef.current.forEach((detail) => {
        if (!detail) return;
        detail.style.height = 'auto';
        detail.style.opacity = '1';
      });
      marksRef.current.forEach((mark) => {
        if (!mark) return;
        mark.style.transform = 'scaleX(1)';
        mark.style.transformOrigin = 'left center';
      });
      rowsRef.current.forEach((_, i) => setRowActive(i, true));
      return;
    }

    const ctx = gsap.context(() => {
      // ── Header reveal ──────────────────────────────────────────────────
      gsap.fromTo('.services-header > *',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.services-header', start: 'top 80%' },
        }
      );

      // ── Reduced motion / mobile: open every detail, no pin ─────────────
      if (reduce) {
        detailsRef.current.forEach((d) => {
          if (d) gsap.set(d, { height: 'auto', opacity: 1 });
        });
        marksRef.current.forEach((m) => m && gsap.set(m, { scaleX: 1 }));
        rowsRef.current.forEach((_, i) => setRowActive(i, true));
        // Reduced-motion desktop still gets a gentle per-row fade-in.
        gsap.fromTo('.services-row',
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.services-list', start: 'top 75%' },
          }
        );
        return;
      }

      // ── Initial collapsed/expanded states ──────────────────────────────
      detailsRef.current.forEach((d, i) => {
        if (!d) return;
        gsap.set(d, i === 0
          ? { height: 'auto', opacity: 1 }
          : { height: 0, opacity: 0 });
      });
      marksRef.current.forEach((m, i) =>
        m && gsap.set(m, { scaleX: i === 0 ? 1 : 0, transformOrigin: 'left center' }));
      setRowActive(0, true);

      // ── Pinned, scrubbed focus-list accordion ──────────────────────────
      const tl = tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          // ~0.5 viewport of scroll per service — roughly one gesture per line.
          end: () => '+=' + window.innerHeight * n * 0.5,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Drive the number, the rail, the dots AND the active row from one
            // source — the timeline's own clock — so they all flip on the same
            // frame (each step occupies 1 time unit; switch at its midpoint).
            const active = Math.min(
              n - 1,
              Math.max(0, Math.floor(tl.time() - 0.25))
            );
            if (counterRef.current)
              counterRef.current.textContent = services[active].num;
            if (railRef.current)
              railRef.current.style.transform = `scaleY(${self.progress})`;
            dotsRef.current.forEach((dot, i) => {
              if (!dot) return;
              dot.style.background =
                i === active ? 'var(--accent)' : 'rgba(255,255,255,0.18)';
              dot.style.transform = i === active ? 'scale(1.6)' : 'scale(1)';
            });
            rowsRef.current.forEach((_, i) => setRowActive(i, i === active));
          },
        },
      });

      for (let i = 1; i < n; i++) {
        const prev = detailsRef.current[i - 1];
        const cur = detailsRef.current[i];
        tl.addLabel(`s${i}`, i);

        if (prev) tl.to(prev, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' }, `s${i}`);
        if (marksRef.current[i - 1]) tl.to(marksRef.current[i - 1], { scaleX: 0, duration: 0.5, ease: 'power2.inOut' }, `s${i}`);
        if (cur) tl.fromTo(cur,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.inOut' }, `s${i}`);
        if (marksRef.current[i]) tl.fromTo(marksRef.current[i],
          { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, `s${i}`);
      }

      // ── Background ring drifts as you scrub the section ─────────────────
      gsap.to('.services-deco-ring', {
        rotate: 90,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="services" id="services" data-section="services" ref={sectionRef}>
      <div className="container">
        <div className="services-header">
          <div className="label">What I Offer</div>
          <h2 className="display-lg">Services<br />in motion</h2>
          <p className="body-lg">
            A focused set of disciplines, each crafted to make brands move with intent.
          </p>
        </div>
      </div>

      <div className="services-stage" ref={stageRef}>
        <svg className="services-deco-ring" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <circle cx="200" cy="200" r="198" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="4 10" opacity="0.25" />
          <circle cx="200" cy="200" r="150" stroke="var(--accent)" strokeWidth="0.5" opacity="0.12" />
        </svg>

        <div className="container services-stage-inner">
          <aside className="services-aside" aria-hidden="true">
            <span className="services-counter" ref={counterRef}>01</span>
            <div className="services-rail">
              <div className="services-rail-fill" ref={railRef} />
            </div>
            <div className="services-dots">
              {services.map((_, i) => (
                <span key={i} className="services-dot" ref={(el) => (dotsRef.current[i] = el)} />
              ))}
            </div>
            <span className="services-total">{String(n).padStart(2, '0')}</span>
          </aside>

          <div className="services-list">
            {services.map((s, i) => (
              <div
                key={s.num}
                className="services-row"
                ref={(el) => (rowsRef.current[i] = el)}
              >
                <div className="services-row-head">
                  <span className="services-row-num">{s.num}</span>
                  <h3 className="services-row-title">
                    <button
                      type="button"
                      className="services-row-btn hover-target"
                      onClick={() => goToService(i)}
                      aria-label={`View ${s.title} service`}
                    >
                      {s.title}
                    </button>
                  </h3>
                  <span className="services-row-mark" ref={(el) => (marksRef.current[i] = el)} />
                </div>
                <div className="services-detail" ref={(el) => (detailsRef.current[i] = el)}>
                  <div className="services-detail-inner">
                    <p className="services-detail-desc">{s.desc}</p>
                    <ul className="services-tags">
                      {s.tags.map((t) => (
                        <li key={t} className="services-tag">{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <div className="services-cta">
              <p className="services-cta-text">Have a project in mind?</p>
              <a href="#contact" className="btn btn-primary hover-target">
                Start a project
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
