import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SERVICES = [
  { num: '01', label: 'Motion Design' },
  { num: '02', label: 'Brand Identity' },
  { num: '03', label: 'Visual Direction' },
  { num: '04', label: 'Creative Strategy' },
];

const Hero = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.hero-kicker', '.hero-headline-word', '.hero-subtext', '.hero-service', '.hero-visual'], {
          opacity: 1, y: 0, x: 0, scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({ delay: 0.2 });

      // Kicker
      tl.fromTo('.hero-kicker',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0
      );

      // Headline words stagger
      tl.fromTo('.hero-headline-word',
        { y: 80, opacity: 0, rotateX: 40 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.12, ease: 'power4.out' },
        0.15
      );

      // Subtext
      tl.fromTo('.hero-subtext',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        0.6
      );

      // Description
      tl.fromTo('.hero-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        0.8
      );

      // Services stagger
      tl.fromTo('.hero-service',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
        0.9
      );

      // Visual image
      tl.fromTo('.hero-visual',
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' },
        0.3
      );

      // Parallax on scroll
      gsap.to(contentRef.current, {
        y: -60,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero-visual', {
        y: -40,
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
    <section className="hero" id="hero" data-section="hero" ref={heroRef}>
      {/* Warm gradient overlay */}
      <div className="hero-gradient" />

      <div className="container hero-layout" ref={contentRef}>
        {/* Left column: text */}
        <div className="hero-text-col">
          <span className="hero-kicker">Hey, I'm a</span>

          <h1 className="hero-headline" ref={headlineRef}>
            <span className="hero-headline-word">Motion</span>
            <span className="hero-headline-word">Designer</span>
          </h1>

          <div className="hero-right-text">
            <p className="hero-subtext">
              Great design should feel invisible.
            </p>
            <p className="hero-desc">
              From concept to screen, I craft visual stories through motion, design, and strategic thinking.
            </p>
          </div>
        </div>

        {/* Services row */}
        <div className="hero-services">
          {SERVICES.map((s) => (
            <div key={s.num} className="hero-service">
              <span className="hero-service-num">{s.num}</span>
              <span className="hero-service-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual: warm gradient portrait placeholder */}
      <div className="hero-visual">
        <div className="hero-visual-inner" />
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll">
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
