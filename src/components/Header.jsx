import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import MenuCard from './MenuCard';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <button
          className="menu-trigger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="menu-burger">
            <span className="menu-burger-line menu-burger-line--1" />
            <span className="menu-burger-line menu-burger-line--2" />
          </span>
        </button>

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
      </header>

      <MenuCard isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
