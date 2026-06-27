import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const EXPERTISE = [
  { num: '01', label: 'Motion Design' },
  { num: '02', label: 'UI/UX Design' },
  { num: '03', label: 'Visual Direction' },
  { num: '04', label: 'Creative Strategy' },
];

const NAV_LINKS = ['Home', 'About', 'Projects'];

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const Hero = () => {
  const heroRef = useRef(null);
  const glowRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouse.current = { x, y };
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(255, 106, 0, 0.08) 0%, transparent 60%)`;
    }
  }, []);

  useEffect(() => {
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.hero-nav', '.hero-kicker', '.hero-name-word', '.hero-portrait', '.hero-headline-right', '.hero-desc-right', '.hero-cta-btn', '.hero-expertise-item'], {
          opacity: 1, y: 0, x: 0, scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({ delay: 0.3 });

      // Nav
      tl.fromTo('.hero-nav', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);

      // Kicker
      tl.fromTo('.hero-kicker', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);

      // Name words stagger
      tl.fromTo('.hero-name-word', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'power4.out' }, 0.3);

      // Portrait
      tl.fromTo('.hero-portrait', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }, 0.4);

      // Right column
      tl.fromTo('.hero-headline-right', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.7);
      tl.fromTo('.hero-desc-right', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.85);
      tl.fromTo('.hero-cta-btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.95);

      // Expertise stagger
      tl.fromTo('.hero-expertise-item', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, 1.0);

      // Portrait parallax
      gsap.to('.hero-portrait', {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-wrapper" ref={heroRef} onMouseMove={handleMouseMove}>
      <div className="hero-container">
        {/* Cursor-reactive glow */}
        <div className="hero-glow" ref={glowRef} />

        {/* Ambient glow spots */}
        <div className="hero-glow-spot hero-glow-spot--1" />
        <div className="hero-glow-spot hero-glow-spot--2" />
        <div className="hero-glow-spot hero-glow-spot--3" />

        {/* Navigation */}
        <nav className="hero-nav">
          <a href="#" className="hero-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 20V4h3.5l4.5 7.5L15.5 4H19v16h-3v-9.5L12 18l-4-7.5V20H3z" fill="url(#hlogo)" />
              <defs>
                <linearGradient id="hlogo" x1="3" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF6A00" />
                  <stop offset="1" stopColor="#FF3B1F" />
                </linearGradient>
              </defs>
            </svg>
          </a>
          <div className="hero-nav-links">
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hero-nav-link">{link}</a>
            ))}
          </div>
          <a href="#contact" className="hero-cta-pill">
            <span>Get in Touch</span>
            <span className="hero-cta-arrow"><ArrowIcon /></span>
          </a>
        </nav>

        {/* Main content */}
        <div className="hero-content">
          {/* Left: Name */}
          <div className="hero-left">
            <span className="hero-kicker">Hey, I'm a</span>
            <h1 className="hero-name">
              <span className="hero-name-word">Creative</span>
              <span className="hero-name-word">Director</span>
            </h1>
          </div>

          {/* Center: Portrait */}
          <div className="hero-center">
            <div className="hero-portrait">
              <div className="hero-portrait-inner" />
              <div className="hero-portrait-glow" />
            </div>
          </div>

          {/* Right: Headline + Desc */}
          <div className="hero-right">
            <p className="hero-headline-right">
              Great design should feel invisible.
            </p>
            <p className="hero-desc-right">
              From concept to screen, I craft visual stories through motion, design, and strategic thinking. Bringing brands to life with purposeful animation.
            </p>
            <a href="#work" className="hero-cta-btn">
              <span>View Work</span>
              <ArrowIcon />
            </a>
          </div>
        </div>

        {/* Bottom expertise */}
        <div className="hero-expertise">
          {EXPERTISE.map((item) => (
            <div key={item.num} className="hero-expertise-item">
              <span className="hero-expertise-num">{item.num}</span>
              <span className="hero-expertise-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
