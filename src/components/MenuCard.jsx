import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { num: '1', label: 'HOME', href: '#hero' },
  { num: '2', label: 'WORK', href: '#selected-work' },
  { num: '3', label: 'SERVICES', href: '#toolbox' },
  { num: '4', label: 'CONTACT', href: '#contact' },
];

function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      let h = now.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${String(h).padStart(2, '0')} : ${m} : ${s} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="menu-clock">{time}</span>;
}

function GridLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="6" cy="6" r="2.5" fill="white" />
      <circle cx="14" cy="6" r="2.5" fill="white" />
      <circle cx="6" cy="14" r="2.5" fill="white" />
      <circle cx="14" cy="14" r="2.5" fill="white" />
      <circle cx="22" cy="6" r="2.5" fill="white" opacity="0.4" />
      <circle cx="22" cy="14" r="2.5" fill="white" opacity="0.4" />
      <circle cx="6" cy="22" r="2.5" fill="white" opacity="0.4" />
      <circle cx="14" cy="22" r="2.5" fill="white" opacity="0.4" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BehanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11c1.4 0 2.5-.6 2.5-2.2 0-1.6-1-2.3-2.4-2.3H3v9h4.7c1.6 0 2.9-.7 2.9-2.5 0-1.2-.7-2-1.8-2.2.7-.3 1.1-1 1.1-2zm-2.5-4h1.8c.7 0 1.2.3 1.2 1s-.5 1-1.2 1H5V7zm2 5.5H5v-2.5h2.7c.8 0 1.2.4 1.2 1.2s-.4 1.3-1.2 1.3zM15 7.5h5v-1h-5v1zm2.5 2c-2.5 0-4.5 1.8-4.5 4.5s2 4.5 4.5 4.5c2 0 3.5-1.2 4.2-3h-2.2c-.4.6-1 .9-1.8.9-1.2 0-2-.8-2-1.9h6.5c0-2.8-2-4.9-4.7-4.9zm-2.5 3.6c.2-1.1 1.1-1.9 2.3-1.9 1.3 0 1.9.8 2 1.9h-4.3zM15 14h4.5c-.1-1.1-.8-1.8-2-1.8-1.2 0-1.9.7-2.1 1.8z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.6-2.2 3.9 0 4.6 2.5 4.6 5.8V24h-4v-8.2c0-2 0-4.5-2.7-4.5-2.7 0-3.1 2.1-3.1 4.3V24h-4V8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  );
}

export default function MenuCard({ isOpen, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dark, setDark] = useState(true);

  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const navLinksRef = useRef([]);
  const socialsRef = useRef(null);
  const bottomRef = useRef(null);
  const footerRef = useRef(null);

  const animateIn = useCallback(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    gsap.set(card, { scale: 0.9, opacity: 0 });
    gsap.set(overlay, { opacity: 0 });
    gsap.set(navLinksRef.current, { y: 30, opacity: 0 });
    if (socialsRef.current) gsap.set(socialsRef.current, { y: 20, opacity: 0 });
    if (bottomRef.current) gsap.set(bottomRef.current, { y: 10, opacity: 0 });
    if (footerRef.current) gsap.set(footerRef.current, { y: 10, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    tl.to(card, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }, 0);
    tl.to(navLinksRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.out',
    }, 0.15);
    if (socialsRef.current) {
      tl.to(socialsRef.current, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.5);
    }
    if (bottomRef.current) {
      tl.to(bottomRef.current, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.55);
    }
    if (footerRef.current) {
      tl.to(footerRef.current, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.55);
    }
  }, []);

  const animateOut = useCallback(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(navLinksRef.current, { y: 20, opacity: 0, duration: 0.2, stagger: 0.03, ease: 'power2.in' });
    tl.to(card, { scale: 0.95, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.05);
    tl.to(overlay, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.1);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      animateIn();
    }
  }, [isOpen, animateIn]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') animateOut(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, animateOut]);

  const handleNavClick = (href, index) => {
    setActiveIndex(index);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    animateOut();
  };

  if (!isOpen) return null;

  return (
    <div className="menu-overlay" ref={overlayRef} onClick={animateOut}>
      <div
        className="menu-card"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="menu-topbar">
          <GridLogo />
          <Clock />
          <button className="menu-close" onClick={animateOut} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Menu Label */}
        <div className="menu-label">MENU</div>

        {/* Nav Links */}
        <nav className="menu-nav">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.num}
              ref={(el) => { navLinksRef.current[i] = el; }}
              href={link.href}
              className={`menu-nav-link ${i === activeIndex ? 'menu-nav-link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href, i);
              }}
            >
              <span className="menu-nav-num">{link.num}.</span>
              <span className="menu-nav-text">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Bottom Row */}
        <div className="menu-bottom" ref={bottomRef}>
          <div className="menu-socials">
            <span className="menu-bottom-label">SOCIALS</span>
            <div className="menu-icon-row">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="menu-icon-btn">
                <InstagramIcon />
              </a>
              <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="menu-icon-btn">
                <BehanceIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="menu-icon-btn">
                <LinkedInIcon />
              </a>
            </div>
          </div>
          <div className="menu-theme">
            <span className="menu-bottom-label">THEME</span>
            <div className="menu-icon-row">
              <button className="menu-icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
                {dark ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="menu-footer" ref={footerRef}>
          <span>Version 1.14</span>
        </div>
      </div>
    </div>
  );
}
