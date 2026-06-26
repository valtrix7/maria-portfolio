import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#selected-work' },
  { label: 'Process', href: '#how-i-work' },
  { label: 'Toolbox', href: '#toolbox' },
  { label: 'Contact', href: '#contact' },
];

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

    tl.fromTo('.header-nav-link',
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
      0.3
    );

    tl.fromTo('.header-right > *',
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
      0.4
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <a href="#" className="header-logo">M</a>

        <nav className="header-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="header-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-right">
          <a href="#contact" className="header-cta">
            Let's Talk
          </a>

          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="mobile-menu-link"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={closeMenu} className="mobile-menu-cta">
            Let's Talk
          </a>
        </div>
      )}
    </>
  );
};

export default Header;
