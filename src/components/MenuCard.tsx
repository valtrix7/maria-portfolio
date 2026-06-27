import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import AnimatedThemeToggler from './AnimatedThemeToggler';

interface NavItem {
  label: string;
  href: string;
}

const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'My Project', href: '#my-project' },
  { label: 'Services', href: '#toolbox' },
  { label: 'Contact', href: '#contact' },
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
      setTime(`${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="menu-clock">{time}</span>;
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BehanceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11c1.4 0 2.5-.6 2.5-2.2 0-1.6-1-2.3-2.4-2.3H3v9h4.7c1.6 0 2.9-.7 2.9-2.5 0-1.2-.7-2-1.8-2.2.7-.3 1.1-1 1.1-2zm-2.5-4h1.8c.7 0 1.2.3 1.2 1s-.5 1-1.2 1H5V7zm2 5.5H5v-2.5h2.7c.8 0 1.2.4 1.2 1.2s-.4 1.3-1.2 1.3zM15 7.5h5v-1h-5v1zm2.5 2c-2.5 0-4.5 1.8-4.5 4.5s2 4.5 4.5 4.5c2 0 3.5-1.2 4.2-3h-2.2c-.4.6-1 .9-1.8.9-1.2 0-2-.8-2-1.9h6.5c0-2.8-2-4.9-4.7-4.9zm-2.5 3.6c.2-1.1 1.1-1.9 2.3-1.9 1.3 0 1.9.8 2 1.9h-4.3zM15 14h4.5c-.1-1.1-.8-1.8-2-1.8-1.2 0-1.9.7-2.1 1.8z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.6-2.2 3.9 0 4.6 2.5 4.6 5.8V24h-4v-8.2c0-2 0-4.5-2.7-4.5-2.7 0-3.1 2.1-3.1 4.3V24h-4V8z" />
    </svg>
  );
}

interface MenuCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuCard({ isOpen, onClose }: MenuCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const animateIn = useCallback(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    gsap.set(card, { clipPath: 'inset(0 0 100% 0)', opacity: 0 });
    gsap.set(overlay, { opacity: 0 });
    gsap.set(navLinksRef.current, { x: -40, opacity: 0 });
    if (bottomRef.current) gsap.set(bottomRef.current, { opacity: 0 });

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    tl.to(card, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.05);
    tl.to(navLinksRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.07,
      ease: 'power3.out',
    }, 0.2);
    if (bottomRef.current) {
      tl.to(bottomRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.5);
    }
  }, []);

  const animateOut = useCallback(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(navLinksRef.current, { x: -30, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in' });
    tl.to(card, { clipPath: 'inset(0 0 100% 0)', opacity: 0, duration: 0.35, ease: 'power3.in' }, 0.05);
    tl.to(overlay, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.15);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) animateIn();
  }, [isOpen, animateIn]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') animateOut(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, animateOut]);

  const handleNavClick = (href: string, index: number) => {
    setActiveIndex(index);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    animateOut();
  };

  if (!isOpen) return null;

  return (
    <div className="menu-overlay" ref={overlayRef} onClick={animateOut}>
      <div className="menu-card" ref={cardRef} onClick={(e) => e.stopPropagation()}>

        {/* Header row */}
        <div className="menu-header">
          <div className="menu-header-left">
            <div className="menu-dot-grid">
              <span /><span /><span /><span />
            </div>
            <span className="menu-header-title">Navigation</span>
          </div>
          <div className="menu-header-right">
            <Clock />
            <button className="menu-close-btn" onClick={animateOut} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="menu-divider" />

        {/* Nav Links */}
        <nav className="menu-nav">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              ref={(el) => { navLinksRef.current[i] = el; }}
              href={link.href}
              className={`menu-nav-link ${i === activeIndex ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href, i);
              }}
            >
              <span className="menu-nav-index">0{i + 1}</span>
              <span className="menu-nav-label">{link.label}</span>
              <span className="menu-nav-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="menu-divider" />

        {/* Bottom */}
        <div className="menu-bottom" ref={bottomRef}>
          <div className="menu-socials">
            {[
              { icon: <InstagramIcon />, label: 'IG' },
              { icon: <BehanceIcon />, label: 'Be' },
              { icon: <LinkedInIcon />, label: 'In' },
            ].map((s) => (
              <a key={s.label} href="#" className="menu-social-btn" title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
          <AnimatedThemeToggler className="menu-theme-btn" variant="circle" fromCenter />
        </div>

      </div>
    </div>
  );
}
