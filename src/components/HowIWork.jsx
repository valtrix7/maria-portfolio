import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HowIWork.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const steps = [
  { num: '01', title: 'Discovery', desc: 'Understanding your vision, goals, and audience.', side: 'top' },
  { num: '02', title: 'Concept', desc: 'Developing the creative direction and narrative.', side: 'bottom' },
  { num: '03', title: 'Design', desc: 'Crafting each frame with intention and harmony.', side: 'top' },
  { num: '04', title: 'Motion', desc: 'Breathing life into static designs with rhythm.', side: 'bottom' },
];

const HowIWork = () => {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const pinRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const pathLength = path.getTotalLength();

      // Set initial state — path fully hidden
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Header entrance
      gsap.fromTo('.process-header > *',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.process-header', start: 'top 80%' },
        }
      );

      // Main timeline — pinned section with scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: pinRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1) Draw the SVG path
      tl.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        duration: 3,
      }, 0);

      // 2) Progress bar fill
      tl.fromTo(progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', duration: 3 },
        0
      );

      // 3) Step cards — bento flip-in staggered
      tl.fromTo('.bento-card',
        { y: 80, opacity: 0, rotateX: 25, scale: 0.9 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1,
          duration: 0.4,
          stagger: 0.3,
          ease: 'power3.out',
        },
        0.3
      );

      // 4) Step numbers — counter pop
      tl.fromTo('.bento-num',
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.3,
          stagger: 0.3,
          ease: 'back.out(2)',
        },
        0.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="how-i-work" id="process" data-section="how-i-work" ref={sectionRef}>
      <div className="pin-wrap" ref={pinRef}>
        <div className="container">
          <div className="process-header">
            <div className="label">How I Work</div>
            <h2 className="display-lg">
              From concept<br />to motion
            </h2>
            <p className="body-lg">
              A refined process built on clarity, creativity, and collaboration.
            </p>
          </div>
        </div>

        {/* SVG path overlay — the snake trail that draws on scroll */}
        <svg className="snake-svg" viewBox="0 0 1200 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6A00" />
              <stop offset="50%" stopColor="#FF3B1F" />
              <stop offset="100%" stopColor="#C53B0C" />
            </linearGradient>
            <filter id="snakeGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background path (faint) */}
          <path
            d="M 50,250 C 200,80 350,420 500,250 C 650,80 800,420 950,250 C 1050,150 1100,300 1150,250"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="2"
          />
          {/* Animated path */}
          <path
            ref={pathRef}
            d="M 50,250 C 200,80 350,420 500,250 C 650,80 800,420 950,250 C 1050,150 1100,300 1150,250"
            fill="none"
            stroke="url(#snakeGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#snakeGlow)"
          />
          {/* Step dots along path */}
          {[0.15, 0.4, 0.65, 0.9].map((offset, i) => {
            const x = 50 + offset * 1100;
            const y = 250 + Math.sin(offset * Math.PI * 2) * 120;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="8"
                fill="var(--accent, #E8611A)"
                className="snake-dot-svg"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            );
          })}
        </svg>

        {/* Bento grid of step cards */}
        <div className="bento-grid">
          {steps.map((step) => (
            <div key={step.num} className={`bento-card bento-card--${step.side}`}>
              <span className="bento-num">{step.num}</span>
              <h3 className="bento-title">{step.title}</h3>
              <p className="bento-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Progress rail */}
        <div className="process-progress">
          <div className="process-progress-fill" ref={progressRef} />
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
