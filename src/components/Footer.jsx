import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CREDITS = [
  { role: 'Directed By', name: 'Maria Islam' },
  { role: 'Motion & Animation', name: 'Maria Islam' },
  { role: 'Art Direction', name: 'Maria Islam' },
  { role: 'Original Concept', name: 'Maria Islam' },
  { role: 'Sound Design', name: 'Silence & Rhythm' },
  { role: 'Filmed On Location', name: 'The Internet' },
];

const SOCIALS = [
  { label: 'Fiverr', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

const Footer = () => {
  const sectionRef = useRef(null);
  const rollRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const roll = rollRef.current;
    if (!roll) return;

    const ctx = gsap.context(() => {
      // Credits gently roll upward as the footer scrolls into frame.
      gsap.fromTo(
        roll,
        { y: 80 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        '.fc-line',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="film-credits" ref={sectionRef}>
      <div className="container fc-roll" ref={rollRef}>
        <div className="fc-list">
          {CREDITS.map((c) => (
            <div className="fc-line" key={c.role}>
              <span className="fc-role">{c.role}</span>
              <span className="fc-dotline" />
              <span className="fc-name">{c.name}</span>
            </div>
          ))}
        </div>

        <div className="fc-title fc-line">
          <span className="fc-title-kicker">Starring</span>
          <h2 className="fc-title-name">Maria Islam</h2>
          <span className="fc-title-sub">Motion Graphics Designer</span>
        </div>

        <div className="fc-socials fc-line">
          {SOCIALS.map((s) => (
            <a className="fc-social" href={s.href} key={s.label}>
              {s.label}
            </a>
          ))}
        </div>

        <div className="fc-fin fc-line">
          <span className="fc-fin-mark">FIN</span>
          <span className="fc-copy">&copy; 2026 Maria Islam — All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
