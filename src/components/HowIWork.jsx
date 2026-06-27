import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HowIWork.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const steps = [
  { num: '01', title: 'Discovery', desc: 'Understanding your vision, goals, and audience.', offset: 0.15 },
  { num: '02', title: 'Concept', desc: 'Developing the creative direction and narrative.', offset: 0.4 },
  { num: '03', title: 'Design', desc: 'Crafting each frame with intention and harmony.', offset: 0.65 },
  { num: '04', title: 'Motion', desc: 'Breathing life into static designs with rhythm.', offset: 0.9 },
];

const PATH_D = 'M 80,350 C 280,100 480,600 700,350 C 920,100 1120,600 1350,350 C 1500,180 1550,450 1580,350';

const HowIWork = () => {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const pinRef = useRef(null);
  const progressRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const pathLength = path.getTotalLength();

      // Position cards at the dot coordinates along the path
      const svgWidth = 1600;
      const svgHeight = 700;
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const point = path.getPointAtLength(pathLength * steps[i].offset);
        const xPct = (point.x / svgWidth) * 100;
        const yPct = (point.y / svgHeight) * 100;
        card.style.left = `${xPct}%`;
        card.style.top = `${yPct}%`;
      });

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

      // 3) Step cards — appear as path reaches them
      tl.fromTo('.path-card',
        { opacity: 0, scale: 0.6, y: 30 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.3,
          stagger: 0.5,
          ease: 'back.out(1.4)',
        },
        0.15
      );

      // 4) Dot pulses
      tl.fromTo('.path-dot',
        { scale: 0 },
        {
          scale: 1,
          duration: 0.2,
          stagger: 0.5,
          ease: 'back.out(2)',
        },
        0.2
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

        {/* SVG path + cards container */}
        <div className="path-container">
          <svg className="snake-svg" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6A00" />
                <stop offset="50%" stopColor="#FF3B1F" />
                <stop offset="100%" stopColor="#C53B0C" />
              </linearGradient>
              <filter id="snakeGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background path */}
            <path d={PATH_D} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            {/* Animated path */}
            <path
              ref={pathRef}
              d={PATH_D}
              fill="none"
              stroke="url(#snakeGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#snakeGlow)"
            />
            {/* Dots */}
            {steps.map((step, i) => {
              const x = 80 + step.offset * 1500;
              const y = 350 + Math.sin(step.offset * Math.PI * 2) * 200;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="7"
                  fill="var(--accent, #E8611A)"
                  className="path-dot"
                />
              );
            })}
          </svg>

          {/* Cards positioned at dot coordinates */}
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="path-card"
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <span className="path-card-num">{step.num}</span>
              <h3 className="path-card-title">{step.title}</h3>
              <p className="path-card-desc">{step.desc}</p>
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
