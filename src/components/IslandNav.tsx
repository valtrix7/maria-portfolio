import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AnimatedThemeToggler from './AnimatedThemeToggler';
import './IslandNav.css';

type Lenis = { scrollTo: (target: unknown, opts?: object) => void };
const getLenis = () =>
  (window as Window & { __lenis?: Lenis }).__lenis;

const LINKS = [
  { label: 'Work', href: '#my-project', num: '01' },
  { label: 'About', href: '#about', num: '02' },
  { label: 'Services', href: '#services', num: '03' },
  { label: 'Process', href: '#process', num: '04' },
  { label: 'Contact', href: '#contact', num: '05' },
];

// Edit these hrefs to your real profiles.
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
      </>
    ),
  },
  {
    label: 'Dribbble',
    href: 'https://dribbble.com',
    path: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72M2.4 13.4c4.94 0 12.3-.5 15.6-3.5M21.3 15c-3.5-1.2-8.4-1.5-12.5 0" />
      </>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    path: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com',
    path: <path d="M4 4l16 16M20 4L4 20" />,
  },
];

const IslandNav: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);

  // Build the open/close timeline (scoped to the root) — mirrors the GreenSock
  // "dynamic island" pen: expand width, reveal logo, morph burger → X, drop the
  // panel in with a bouncy back.out, stagger the links.
  const build = useCallback(() => {
    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      // Pill is already at full size (logo + burger visible); clicking just
      // morphs the burger to an X and drops the menu panel in.
      tlRef.current = gsap
        .timeline({ paused: true })
        .to('.inav-logo', { rotation: 180, duration: 0.5, ease: 'back.out(1.7)' }, 0)
        .to('.inav-bar-mid', { opacity: 0, duration: 0.15, ease: 'power2.in' }, 0)
        .to('.inav-bar-top', { attr: { x1: 3, y1: 3, x2: 13, y2: 13 }, duration: 0.28, ease: 'power3.inOut' }, 0)
        .to('.inav-bar-bot', { attr: { x1: 13, y1: 3, x2: 3, y2: 13 }, duration: 0.28, ease: 'power3.inOut' }, 0)
        .to('.inav-backdrop', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
        .from('.inav-panel', { autoAlpha: 0, yPercent: -10, scale: 0.6, duration: 0.8, transformOrigin: 'top center', ease: 'back.out(2)' }, 0.05)
        .from('.inav-panel-top', { autoAlpha: 0, y: -6, duration: 0.3, ease: 'power2.out' }, 0.16)
        .from('.inav-link', { opacity: 0, y: 8, duration: 0.32, ease: 'power2.out', stagger: 0.05 }, 0.2)
        .from('.inav-panel-foot', { autoAlpha: 0, y: 10, duration: 0.4, ease: 'power2.out' }, 0.34);
      if (openRef.current) tlRef.current.progress(1);
    }, rootRef);
  }, []);

  useEffect(() => {
    build();
    // Subtle entrance for the collapsed pill. fromTo + clearProps so it can't
    // get stuck at opacity:0 if StrictMode tears the effect down mid-tween.
    const intro = gsap.fromTo('.inav-island',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.7, ease: 'power3.out', delay: 0.2, clearProps: 'opacity,visibility' }
    );

    // Gentle float — animate `top` (not transform) so centering is preserved.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bob = reduce
      ? null
      : gsap.to('.inav-island', {
          top: '+=9', duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.9,
        });

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      intro.revert();
      bob?.revert();
      ctxRef.current?.revert();
    };
  }, [build]);

  const setOpenState = useCallback((next: boolean) => {
    const tl = tlRef.current;
    if (!tl) return;
    openRef.current = next;
    setOpen(next);
    if (next) tl.timeScale(1).play();
    else tl.timeScale(1.25).reverse();
  }, []);

  const toggle = useCallback(() => setOpenState(!openRef.current), [setOpenState]);

  const handleLink = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      if (openRef.current) setOpenState(false);
      const lenis = getLenis();

      // Logo / home → top of page (there is no #hero element).
      if (href === '#hero' || href === '#') {
        if (lenis) lenis.scrollTo(0, { duration: 1 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1 });
      else (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    },
    [setOpenState]
  );

  // Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openRef.current) setOpenState(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setOpenState]);

  // The pill background doubles as a page scroll-progress bar — write the
  // fill scale straight to the DOM (no state) so it stays in sync with scroll.
  useEffect(() => {
    const onScroll = () => {
      const el = progressRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="inav" ref={rootRef}>
      <div className="inav-island">
        <div className="inav-progress" ref={progressRef} aria-hidden="true" />
        <div className="inav-logo-cont">
          <a href="#" className="inav-logo" onClick={(e) => handleLink(e, '#hero')} aria-label="Back to top">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 20V4h3.5l4.5 7.5L15.5 4H19v16h-3v-9.5L12 18l-4-7.5V20H3z" fill="url(#inav-logo-grad)" />
              <defs>
                <linearGradient id="inav-logo-grad" x1="3" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--accent, #E8611A)" />
                  <stop offset="1" stopColor="#ff8a56" />
                </linearGradient>
              </defs>
            </svg>
          </a>
        </div>

        <button
          className="inav-btn"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="inav-overlay"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="inav-btn-cont">
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <line className="inav-bar inav-bar-top" x1="2" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line className="inav-bar inav-bar-mid" x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line className="inav-bar inav-bar-bot" x1="2" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>

      <div
        className={`inav-overlay ${open ? 'is-open' : ''}`}
        id="inav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="inav-backdrop" onClick={() => setOpenState(false)} />
        <div className="inav-panel">
          <div className="inav-panel-top">
            <span className="inav-eyebrow">Navigation</span>
            <span className="inav-status">
              <span className="inav-status-dot" />
              Available for work
            </span>
          </div>

          <nav className="inav-nav">
            {LINKS.map((l) => (
              <a
                key={l.href}
                className="inav-link"
                href={l.href}
                onClick={(e) => handleLink(e, l.href)}
              >
                <span className="inav-link-num">{l.num}</span>
                <span className="inav-link-label">{l.label}</span>
                <span className="inav-link-arrow" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
            ))}
          </nav>

          <div className="inav-panel-foot">
            <div className="inav-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  className="inav-social"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>

            <div className="inav-theme-wrap">
              <span className="inav-theme-label">Theme</span>
              <AnimatedThemeToggler className="inav-theme-btn" variant="circle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslandNav;
