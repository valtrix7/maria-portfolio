import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HowIWork.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const steps = [
  { num: '01', title: 'Discovery', desc: 'Understanding your vision, goals, and audience. Every great motion piece starts with deep listening.', side: 'top' },
  { num: '02', title: 'Concept', desc: 'Developing the creative direction and narrative structure. Sketching the movement before it moves.', side: 'bottom' },
  { num: '03', title: 'Design', desc: 'Crafting each frame with intention. Typography, color, and composition working in harmony.', side: 'top' },
  { num: '04', title: 'Motion', desc: 'Breathing life into static designs. Timing, easing, and rhythm creating emotional resonance.', side: 'bottom' },
];

const HowIWork = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Header entrance
      gsap.fromTo('.process-header > *',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.process-header', start: 'top 80%' },
        }
      );

      // Horizontal scroll pin — the core mechanic
      const track = trackRef.current;
      const getScrollWidth = () => track.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(track, {
        x: () => -getScrollWidth(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${getScrollWidth()}`,
          invalidateOnRefresh: true,
        },
      });

      // Trail fill synced to scroll
      gsap.fromTo(trailRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getScrollWidth()}`,
            scrub: 0.3,
          },
        }
      );

      // Step reveals — tied to the main scroll tween via containerAnimation
      gsap.utils.toArray('.snake-step').forEach((step) => {
        gsap.fromTo(step,
          { x: 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: step,
              containerAnimation: scrollTween,
              start: 'left 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Dot pulses — tied to main scroll tween
      gsap.utils.toArray('.snake-dot').forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot,
              containerAnimation: scrollTween,
              start: 'left 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="how-i-work" id="process" data-section="how-i-work" ref={sectionRef}>
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

      <div className="snake-viewport">
        <div className="snake-track" ref={trackRef}>
          {/* Speed trail */}
          <div className="snake-trail">
            <div className="snake-trail-fill" ref={trailRef} />
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`snake-dot snake-dot--${step.side}`}
                style={{ left: `${(i / (steps.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          {/* Step cards */}
          {steps.map((step) => (
            <div key={step.num} className={`snake-step snake-step--${step.side}`}>
              <div className="snake-step-card">
                <span className="snake-step-num">{step.num}</span>
                <h3 className="snake-step-title">{step.title}</h3>
                <p className="snake-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
