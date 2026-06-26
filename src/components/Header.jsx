import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRADIENT = "linear-gradient(90deg, #b16cea, #ff5e69, #ff8a56, #ffa84b)";
const BG_DARK = "#0d1117";
const BG_LIGHT = "#f5f5f5";
const TEXT_DARK = "#f0f0f0";
const TEXT_LIGHT = "#1a1a1a";
const BORDER_DARK = "rgba(255,255,255,0.08)";
const BORDER_LIGHT = "rgba(0,0,0,0.1)";

const NAV_LINKS = ["About", "Services", "Projects", "Experience", "Contact"];

const Header = () => {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const bg = dark ? BG_DARK : BG_LIGHT;
  const text = dark ? TEXT_DARK : TEXT_LIGHT;
  const border = dark ? BORDER_DARK : BORDER_LIGHT;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lerp cursor
  useEffect(() => {
    if (isMobile) return;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 20}px, ${cursorPos.current.y - 20}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  // GSAP page load animation
  useEffect(() => {
    const load = async () => {
      const gsap = (await import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm')).default;

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
    };

    load();
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* Custom cursor */}
      {!isMobile && (
        <div
          ref={cursorRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `1.5px solid ${dark ? 'rgba(177,108,234,0.5)' : 'rgba(177,108,234,0.4)'}`,
            pointerEvents: 'none',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mixBlendMode: 'difference',
            willChange: 'transform',
          }}
        >
          <span
            ref={labelRef}
            style={{
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            CLICK
          </span>
        </div>
      )}

      {/* Navbar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 72,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(24px, 4vw, 64px)',
          background: scrolled
            ? `${bg}ee`
            : bg,
          backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          borderBottom: `1px solid ${border}`,
          transition: 'background 0.4s ease, border-color 0.4s ease',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          className="header-logo"
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          M
        </a>

        {/* Center nav */}
        <nav
          className="header-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="header-nav-link"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: text,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                position: 'relative',
                padding: '4px 0',
                transition: 'color 0.3s ease',
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>{link}</span>
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: '100%',
                  height: 1.5,
                  borderRadius: 2,
                  background: GRADIENT,
                  transform: 'scaleX(0)',
                  transformOrigin: 'right',
                  transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="nav-underline"
              />
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div
          className="header-right"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexShrink: 0,
          }}
        >
          {/* Let's Talk button */}
          <a
            href="#contact"
            className="talk-btn"
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: 100,
              textDecoration: 'none',
              position: 'relative',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {/* Gradient border */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 100,
                padding: 1.5,
                background: GRADIENT,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none',
              }}
            />
            {/* Gradient text */}
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                background: GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Let's Talk
            </span>
          </a>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="theme-toggle"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: `1px solid ${border}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                position: 'absolute',
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                transform: dark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)',
                opacity: dark ? 1 : 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffa84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </span>
            <span
              style={{
                position: 'absolute',
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                transform: dark ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
                opacity: dark ? 0 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b16cea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
          </button>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              width: 36,
              height: 36,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              background: 'transparent',
              border: `1px solid ${border}`,
              borderRadius: 8,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <span style={{
              width: 16, height: 1.5, background: text, borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'translateY(3.25px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              width: 16, height: 1.5, background: text, borderRadius: 2,
              transition: 'all 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              width: 16, height: 1.5, background: text, borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'translateY(-3.25px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: bg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            animation: 'menuSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={closeMenu}
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: text,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                opacity: 0,
                animation: `menuItemIn 0.4s ease ${0.1 + i * 0.05}s forwards`,
              }}
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            style={{
              marginTop: 24,
              fontSize: 16,
              fontWeight: 600,
              padding: '14px 40px',
              borderRadius: 100,
              textDecoration: 'none',
              position: 'relative',
              opacity: 0,
              animation: `menuItemIn 0.4s ease ${0.35}s forwards`,
            }}
          >
            <span style={{
              position: 'absolute', inset: 0, borderRadius: 100, padding: 1.5,
              background: GRADIENT,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor', maskComposite: 'exclude',
            }} />
            <span style={{
              position: 'relative', zIndex: 1,
              background: GRADIENT,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Let's Talk
            </span>
          </a>
        </div>
      )}

      {/* CSS for hover states */}
      <style>{`
        .header-nav-link:hover .nav-underline {
          transform: scaleX(1);
          transform-origin: left;
        }
        .talk-btn:hover {
          background: rgba(177, 108, 234, 0.08);
        }
        .theme-toggle:hover {
          border-color: rgba(177, 108, 234, 0.4) !important;
          background: rgba(177, 108, 234, 0.08);
        }
        .hamburger-btn:hover {
          border-color: rgba(177, 108, 234, 0.4) !important;
          background: rgba(177, 108, 234, 0.08);
        }
        @keyframes menuSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes menuItemIn {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .header-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .talk-btn { display: none !important; }
          .theme-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Header;
