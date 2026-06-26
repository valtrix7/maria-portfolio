import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const outlineRef = useRef(null);
  const badgeRef = useRef(null);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load sequence
      const tl = gsap.timeline({ delay: 0.1 });

      // Background text slide in
      tl.fromTo('.hero-bg-text',
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
        0
      );

      // Name letters with elastic feel
      const nameEl = nameRef.current;
      if (nameEl) {
        const lines = nameEl.querySelectorAll('.hero-name-line');
        lines.forEach((line, lineIndex) => {
          const text = line.textContent;
          line.innerHTML = '';
          text.split('').forEach((char) => {
            const wrap = document.createElement('span');
            wrap.style.display = 'inline-block';
            wrap.style.overflow = 'hidden';
            const span = document.createElement('span');
            span.className = 'hero-letter';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            wrap.appendChild(span);
            line.appendChild(wrap);
          });

          tl.fromTo(line.querySelectorAll('.hero-letter'),
            { y: '110%', opacity: 0 },
            {
              y: '0%', opacity: 1,
              duration: 1.2,
              stagger: 0.03,
              ease: 'power4.out',
            },
            0.2 + lineIndex * 0.12
          );
        });
      }

      // Outline text clip reveal
      if (outlineRef.current) {
        tl.fromTo(outlineRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power4.inOut' },
          0.4
        );
      }

      // Badge scale pop
      tl.fromTo(badgeRef.current,
        { scale: 0, opacity: 0, rotation: -20 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
        1.2
      );

      // CTA slide up
      tl.fromTo(ctaRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        1.4
      );

      // Floating images entrance
      const floats = gsap.utils.toArray('.hero-float');
      floats.forEach((el, i) => {
        tl.fromTo(el,
          { y: 120 + i * 30, opacity: 0, scale: 0.6, rotate: -15 + i * 8 },
          {
            y: 0, opacity: 1, scale: 1, rotate: 0,
            duration: 1.5,
            ease: 'power3.out'
          },
          0.5 + i * 0.1
        );
      });

      // Subtitle fade
      tl.fromTo('.hero-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        1.0
      );

      // Scroll-linked parallax
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      gsap.to('.hero-bg-text', {
        x: -300,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      // Mouse parallax
      const handleMouse = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        floats.forEach((el, i) => {
          const factor = (i + 1) * 20;
          gsap.to(el, { x: x * factor, y: y * factor, duration: 1.4, ease: 'power2.out' });
        });
      };
      window.addEventListener('mousemove', handleMouse);

      // Marquee
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { x: '-50%', duration: 25, repeat: -1, ease: 'none' });
      }

      // Orbit spin
      gsap.to('.hero-orbit', { rotation: 360, duration: 20, repeat: -1, ease: 'none' });

      return () => window.removeEventListener('mousemove', handleMouse);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="hero" data-section="hero" ref={heroRef}>
      {/* Giant background watermark text */}
      <div className="hero-bg-text">MOTION</div>

      {/* Floating elements */}
      <div className="hero-floats">
        <div className="hero-float hero-float-1">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=550&fit=crop" alt="" />
        </div>
        <div className="hero-float hero-float-2">
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=350&h=250&fit=crop" alt="" />
        </div>
        <div className="hero-float hero-float-3">
          <img src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=300&h=400&fit=crop" alt="" />
        </div>
        <div className="hero-float hero-float-4">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=280&h=350&fit=crop" alt="" />
        </div>
      </div>

      {/* Orbit badge */}
      <div className="hero-orbit-wrap">
        <div className="hero-orbit">
          <svg viewBox="0 0 100 100" width="100" height="100">
            <defs>
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text fill="#E8611A" fontSize="8" fontWeight="700" letterSpacing="3">
              <textPath href="#circlePath">AVAILABLE FOR WORK * DESIGN * MOTION * ANIMATION * </textPath>
            </text>
          </svg>
          <div className="hero-orbit-dot"></div>
        </div>
      </div>

      <div className="container hero-content" ref={contentRef}>
        <div className="hero-top-row">
          <div className="hero-label label" ref={badgeRef}>Motion Graphics & Design</div>
          <div className="hero-year">©2026</div>
        </div>

        <h1 className="hero-name" ref={nameRef}>
          <span className="hero-name-line">MARIA</span>
          <span className="hero-name-line hero-name-outline" ref={outlineRef}>ISLAM</span>
        </h1>

        <div className="hero-bottom">
          <p className="body-lg hero-subtitle">
            Crafting visual stories through motion, design, and strategic thinking.
            Bringing brands to life with purposeful animation.
          </p>
          <div className="hero-cta" ref={ctaRef}>
            <a href="#work" className="btn btn-primary">View Work</a>
            <a href="#contact" className="btn btn-outline">Get in Touch</a>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="hero-marquee">
        <div className="hero-marquee-track" ref={marqueeRef}>
          <span>MOTION DESIGN</span><span className="md"></span>
          <span>BRAND IDENTITY</span><span className="md"></span>
          <span>PITCH DECKS</span><span className="md"></span>
          <span>ANIMATION</span><span className="md"></span>
          <span>VISUAL STORYTELLING</span><span className="md"></span>
          <span>MOTION DESIGN</span><span className="md"></span>
          <span>BRAND IDENTITY</span><span className="md"></span>
          <span>PITCH DECKS</span><span className="md"></span>
          <span>ANIMATION</span><span className="md"></span>
          <span>VISUAL STORYTELLING</span><span className="md"></span>
        </div>
      </div>

      {/* Scroll */}
      <div className="hero-scroll">
        <div className="hero-scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;
