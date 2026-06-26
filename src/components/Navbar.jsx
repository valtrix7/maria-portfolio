import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#hero" className="navbar-logo">MI</a>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>Process</a>
          <a href="#tools" onClick={() => setMenuOpen(false)}>Tools</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
        <a href="#contact" className="btn btn-primary navbar-cta">Let's Talk</a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
