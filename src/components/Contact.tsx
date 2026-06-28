import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const BLOB_PATHS = [
  'M430,250 C430,340 350,430 250,430 C150,430 70,340 70,250 C70,160 150,70 250,70 C350,70 430,160 430,250 Z',
  'M440,230 C440,360 360,440 250,440 C140,440 50,360 60,240 C70,120 150,60 260,60 C370,60 440,120 440,230 Z',
  'M420,260 C420,370 340,420 250,420 C160,420 80,360 80,250 C80,140 170,80 260,80 C350,80 420,150 420,260 Z',
  'M450,250 C450,360 360,440 240,440 C130,440 50,360 50,250 C50,140 140,50 250,50 C360,50 450,140 450,250 Z',
  'M415,235 C420,345 345,425 245,425 C145,425 75,345 80,245 C85,145 165,75 255,80 C345,85 410,135 415,235 Z',
];

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const morphPathRef = useRef<SVGPathElement>(null);
  const morphPath2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const mobile = isMobile();
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const path = morphPathRef.current;
      const path2 = morphPath2Ref.current;

      if (reduce) {
        gsap.set('.ct-word', { y: '0%', opacity: 1 });
        gsap.set('.ct-sub > *', { y: 0, opacity: 1 });
        return;
      }

      // ---------- Dynamic Morphing: cycle through the blob shapes ----------
      if (path) {
        const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
        BLOB_PATHS.slice(1).forEach((d) => {
          tl.to(path, { morphSVG: { shape: d, smooth: true }, duration: 6, ease: 'power1.inOut' });
        });
        tl.to(path, { morphSVG: { shape: BLOB_PATHS[0], smooth: true }, duration: 6, ease: 'power1.inOut' });
      }
      if (path2) {
        const tl2 = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
        const cycle = [...BLOB_PATHS.slice(2), ...BLOB_PATHS.slice(0, 2)];
        cycle.forEach((d) => {
          tl2.to(path2, { morphSVG: { shape: d, smooth: true }, duration: 8, ease: 'power1.inOut' });
        });
        tl2.to(path2, { morphSVG: { shape: cycle[0], smooth: true }, duration: 8, ease: 'power1.inOut' });
      }

      gsap.to('.ct-morph', { rotation: 360, duration: 60, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('.ct-morph-2', { rotation: -360, duration: 80, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

      // ---------- Word reveal (scrub-driven) ----------
      gsap.fromTo('.ct-word',
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: mobile ? 'top 70%' : 'top 60%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );

      // ---------- Sub content ----------
      gsap.fromTo('.ct-sub > *',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ct-sub', start: 'top 85%', end: 'top 50%', scrub: 1 },
        }
      );

      // ---------- Email button ----------
      gsap.fromTo('.ct-email-btn',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.6, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '.ct-email-btn', start: 'top 88%' },
        }
      );

      // ---------- Social links ----------
      gsap.fromTo('.ct-social',
        { x: -20, y: mobile ? 15 : 0, opacity: 0 },
        {
          x: 0, y: 0, opacity: 1,
          duration: 0.5, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: '.ct-socials', start: 'top 88%' },
        }
      );

      // ---------- Scrubbed parallax on the morph layers ----------
      if (!mobile) {
        gsap.to('.ct-morph', {
          y: -80,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 },
        });
        gsap.to('.ct-morph-2', {
          y: 60,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2.5 },
        });
      }

      // ---------- Radial pulse ----------
      gsap.to('.ct-radial', {
        scale: 1.2,
        opacity: 0.08,
        duration: mobile ? 6 : 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Magnetic email button (desktop only) ──────────────────────────────────
  useEffect(() => {
    if (isMobile() || prefersReducedMotion()) return;

    const btn = sectionRef.current?.querySelector<HTMLElement>('.ct-email-btn');
    if (!btn) return;

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.32;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
      gsap.to(btn, { x: dx, y: dy, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
    };

    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1.1, 0.5)' });
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);

    return () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
      gsap.set(btn, { x: 0, y: 0 });
    };
  }, []);

  return (
    <section className="ct" id="contact" data-section="contact" ref={sectionRef}>
      <div className="ct-blobs">
        <svg className="ct-morph" viewBox="0 0 500 500">
          <path
            ref={morphPathRef}
            d={BLOB_PATHS[0]}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.8"
            opacity="0.18"
          />
        </svg>

        <svg className="ct-morph ct-morph-2" viewBox="0 0 500 500">
          <path
            ref={morphPath2Ref}
            d={BLOB_PATHS[2]}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.5"
            opacity="0.1"
          />
        </svg>

        <div className="ct-radial" />
      </div>

      <div className="container">
        <div className="ct-display">
          <span className="ct-word-wrap"><span className="ct-word">Let&apos;s</span></span>
          <span className="ct-word-wrap"><span className="ct-word ct-accent">create</span></span>
          <span className="ct-word-wrap"><span className="ct-word">something</span></span>
          <span className="ct-word-wrap"><span className="ct-word ct-accent">extraordinary</span></span>
        </div>

        <div className="ct-sub">
          <p className="body-lg">
            Ready to bring your vision to life? I&apos;m always open to new projects
            and creative collaborations.
          </p>
          <div className="ct-links">
            <a href="mailto:hello@mariaislam.com" className="btn btn-primary ct-email-btn glow-hover">
              hello@mariaislam.com
            </a>
            <div className="ct-socials">
              <a href="#" className="ct-social hover-target">
                <span>Fiverr</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1v8" stroke="currentColor" strokeWidth="1.5" /></svg>
              </a>
              <a href="#" className="ct-social hover-target">
                <span>Dribbble</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1v8" stroke="currentColor" strokeWidth="1.5" /></svg>
              </a>
              <a href="#" className="ct-social hover-target">
                <span>LinkedIn</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1v8" stroke="currentColor" strokeWidth="1.5" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
