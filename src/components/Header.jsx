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
        <a href="#" className="header-logo">M</a>

        <button
          className="menu-trigger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="menu-trigger-text">MENU</span>
        </button>
      </header>

      <MenuCard isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
