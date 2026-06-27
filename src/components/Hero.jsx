import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Hero = () => {
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const outlineRef = useRef(null);
  const badgeRef = useRef(null);
  const ctaRef = useRef(null);
  const contentRef = useRef(null);
  const orbitRef = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Reduced motion: show everything, no entrance choreography or scrub.
      if (reduce) {
        gsap.set(
          [
            '.hero-bg-text',
            nameRef.current,
            outlineRef.current,
            badgeRef.current,
            ctaRef.current,
            '.hero-subtitle',
            orbitRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 }
        );
        return;
      }

      // ---------- Entrance timeline ----------
      const tl = gsap.timeline({ delay: 0.1 });

      // Background watermark slide in
      tl.fromTo(
        '.hero-bg-text',
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.6, ease: 'power3.out' },
        0
      );

      // Name letters, masked rise with elastic settle
      const nameEl = nameRef.current;
      if (nameEl) {
        const lines = nameEl.querySelectorAll('.hero-name-line');
        lines.forEach((line, lineIndex) => {
          const text = line.textContent;
          line.innerHTML = '';
          text.split('').forEach((char) => {
            const wrap = document.createElement('span');
            wrap.className = 'hero-letter-mask';
            const span = document.createElement('span');
            span.className = 'hero-letter';
            span.textContent = char === ' ' ? '\u00A0' : char;
            wrap.appendChild(span);
            line.appendChild(wrap);
          });

          tl.fromTo(
            line.querySelectorAll('.hero-letter'),
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: 1.2,
              stagger: 0.035,
              ease: 'power4.out',
            },
            0.2 + lineIndex * 0.14
          );
        });
      }

      // Outline line clip reveal
      if (outlineRef.current) {
        tl.fromTo(
          outlineRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power4.inOut' },
          0.45
        );
      }

      // Badge scale pop
      tl.fromTo(
        badgeRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
        1.1
      );

      // Subtitle slide up
      tl.fromTo(
        '.hero-subtitle',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        1.0
      );

      // CTA slide up
      tl.fromTo(
        ctaRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        1.2
      );

      // Orbit badge drop in
      if (orbitRef.current) {
        tl.fromTo(
          orbitRef.current,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
          0.9
        );
      }

      // ---------- Scrubbed parallax (hands off into the pinned section) ----------
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero-bg-text', {
        x: -320,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Orbit continuous spin (independent of scroll)
      gsap.to('.hero-orbit', {
        rotation: 360,
        duration: 22,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="hero" data-section="hero" ref={heroRef}>
      {/* Giant background watermark */}
      <div className="hero-bg-text">MOTION</div>

      {/* Orbit badge */}
      <div className="hero-orbit-wrap" ref={orbitRef}>
        <div className="hero-orbit">
          <svg viewBox="0 0 100 100" width="110" height="110">
            <defs>
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fill="#E8611A" fontSize="7.5" fontWeight="700" letterSpacing="3">
              <textPath href="#circlePath">
                AVAILABLE FOR WORK * MOTION * DESIGN * ANIMATION *
              </textPath>
            </text>
          </svg>
          <div className="hero-orbit-dot"></div>
          <div className="hero-orbit-core">MI</div>
        </div>
      </div>

      <div className="container hero-content" ref={contentRef}>
        <div className="hero-top-row">
          <div className="hero-label label" ref={badgeRef}>
            Motion Graphics &amp; Design
          </div>
          <div className="hero-year">©2026</div>
        </div>

        <h1 className="hero-name" ref={nameRef}>
          <span className="hero-name-line">MARIA</span>
          <span className="hero-name-line hero-name-outline" ref={outlineRef}>
            ISLAM
          </span>
        </h1>

        <div className="hero-bottom">
          <p className="body-lg hero-subtitle">
            Crafting visual stories through motion, design, and strategic
            thinking. Bringing brands to life with purposeful animation.
          </p>
          <div className="hero-cta" ref={ctaRef}>
            <a href="#work" className="btn btn-primary">
              View Work
            </a>
            <a href="#contact" className="btn btn-outline">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll">
        <span className="hero-scroll-line"></span>
      </div>
    </section>
  );
};

export default Hero;
