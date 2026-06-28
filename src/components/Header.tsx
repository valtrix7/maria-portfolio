import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import MenuCard from './MenuCard';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo('.header-logo',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo('.menu-trigger',
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      0.4
    );
  }, []);

  // Build the expand/collapse timeline
  const buildTimeline = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.kill();
    }

    const header = headerRef.current;
    if (!header) return;

    const expandedWidth = Math.min(window.innerWidth * 0.9, 420);

    const tl = gsap.timeline({ paused: true });

    // Expand header width
    tl.to(header, {
      width: expandedWidth,
      maxWidth: expandedWidth,
      duration: 0.7,
      ease: 'back.out(1.4)',
    }, 0);

    // Hamburger → X morph (using GSAP attr)
    tl.to('.menu-burger-line--1', {
      attr: { y1: 7, y2: 7, x1: 3, x2: 13 },
      duration: 0.3,
      ease: 'power3.inOut',
    }, 0);
    tl.to('.menu-burger-line--2', {
      attr: { y1: 7, y2: 7, x1: 13, x2: 3 },
      duration: 0.3,
      ease: 'power3.inOut',
    }, 0);
    // Fade out middle line (add it dynamically)
    tl.to('.menu-burger-line-mid', {
      opacity: 0,
      scaleX: 0,
      duration: 0.15,
      ease: 'power2.in',
    }, 0);

    tlRef.current = tl;
  }, []);

  useEffect(() => {
    buildTimeline();
    return () => { tlRef.current?.kill(); };
  }, [buildTimeline]);

  // Body overflow lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;

    isOpenRef.current = !isOpenRef.current;
    const opening = isOpenRef.current;
    setMenuOpen(opening);

    if (opening) {
      tl.timeScale(1).play();
    } else {
      tl.eventCallback('onReverseComplete', () => {
        gsap.set(headerRef.current, { width: 'auto', maxWidth: 340 });
      });
      tl.timeScale(1).reverse();
    }
  }, []);

  const handleClose = useCallback(() => {
    const tl = tlRef.current;
    if (!tl || !isOpenRef.current) return;

    isOpenRef.current = false;
    setMenuOpen(false);

    tl.eventCallback('onReverseComplete', () => {
      gsap.set(headerRef.current, { width: 'auto', maxWidth: 340 });
    });
    tl.timeScale(1).reverse();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`header ${scrolled ? 'header--scrolled' : ''} ${menuOpen ? 'header--open' : ''}`}
      >
        <a href="#" className="header-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 20V4h3.5l4.5 7.5L15.5 4H19v16h-3v-9.5L12 18l-4-7.5V20H3z" fill="url(#logo-grad)" />
            <defs>
              <linearGradient id="logo-grad" x1="3" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E8611A" />
                <stop offset="1" stopColor="#ff8a56" />
              </linearGradient>
            </defs>
          </svg>
        </a>

        <button
          className="menu-trigger"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="menu-burger">
            <span className="menu-burger-line menu-burger-line--1" />
            <span className="menu-burger-line menu-burger-line-mid" />
            <span className="menu-burger-line menu-burger-line--2" />
          </span>
        </button>
      </header>

      {/* Backdrop */}
      <div
        className={`menu-backdrop ${menuOpen ? 'menu-backdrop--visible' : ''}`}
        onClick={handleClose}
      />

      <MenuCard isOpen={menuOpen} onClose={handleClose} />
    </>
  );
};

export default Header;
