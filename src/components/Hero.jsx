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

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const Hero = () => {
  const heroRef = useRef(null);
  const glowRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (isMobile()) return;
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
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.hero-nav', '.hero-kicker', '.hero-name-word', '.hero-portrait', '.hero-headline-right', '.hero-desc-right', '.hero-cta-btn', '.hero-expertise-item'], {
          opacity: 1, y: 0, x: 0, scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({ delay: mobile ? 0.1 : 0.3 });

      // Nav
      tl.fromTo('.hero-nav', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0);

      // Kicker
      tl.fromTo('.hero-kicker', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.15);

      // Name words — faster on mobile
      tl.fromTo('.hero-name-word',
        { y: mobile ? 50 : 90, opacity: 0 },
        { y: 0, opacity: 1, duration: mobile ? 0.8 : 1.2, stagger: mobile ? 0.08 : 0.12, ease: 'power4.out' },
        0.2
      );

      // Portrait — scale up with spring feel
      tl.fromTo('.hero-portrait',
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: mobile ? 1 : 1.4, ease: 'power3.out' },
        0.3
      );

      // Right column
      tl.fromTo('.hero-headline-right', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, mobile ? 0.5 : 0.7);
      tl.fromTo('.hero-desc-right', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, mobile ? 0.6 : 0.85);
      tl.fromTo('.hero-cta-btn', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, mobile ? 0.7 : 0.95);

      // Expertise — stagger faster on mobile
      tl.fromTo('.hero-expertise-item',
        { y: mobile ? 15 : 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: mobile ? 0.05 : 0.07, ease: 'power3.out' },
        mobile ? 0.8 : 1.0
      );

      // Portrait parallax — lighter on mobile
      if (!mobile) {
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
      }

      // Mobile: subtle gyroscope-inspired tilt on scroll
      if (mobile) {
        gsap.to('.hero-portrait', {
          y: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        });

        // Fade glow spots on mobile for performance
        gsap.set('.hero-glow-spot', { opacity: 0.4 });
      }
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
            <div className="hero-portrait-glow" />
            <img
              src="/519d6047-eb12-4f96-8ea2-6b0d99e6b816.jpg"
              alt="Maria Islam — motion graphics designer"
              className="hero-portrait"
              loading="eager"
            />
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
