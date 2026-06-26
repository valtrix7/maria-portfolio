import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from './Transitions';
import './HowIWork.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'Understanding your vision, goals, and audience. Every great motion piece starts with deep listening.',
  },
  {
    num: '02',
    title: 'Concept',
    desc: 'Developing the creative direction and narrative structure. Sketching the movement before it moves.',
  },
  {
    num: '03',
    title: 'Design',
    desc: 'Crafting each frame with intention. Typography, color, and composition working in harmony.',
  },
  {
    num: '04',
    title: 'Motion',
    desc: 'Breathing life into static designs. Timing, easing, and rhythm creating emotional resonance.',
  },
];

const HowIWork = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.process-header > *',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.process-header', start: 'top 75%' }
        }
      );

      // Steps with clip-path reveal
      gsap.utils.toArray('.process-step').forEach((step, i) => {
        gsap.fromTo(step,
          { clipPath: 'inset(0 0 100% 0)', y: 40 },
          {
            clipPath: 'inset(0 0 0% 0)', y: 0,
            duration: 1,
            delay: i * 0.15,
            ease: 'power4.out',
            scrollTrigger: { trigger: step, start: 'top 85%' }
          }
        );
      });

      // Line grow with scrub
      gsap.fromTo('.process-line-fill',
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // Step numbers counter animation
      gsap.utils.toArray('.process-step-num').forEach((num) => {
        gsap.fromTo(num,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: num, start: 'top 85%' }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="how-i-work" id="process" ref={sectionRef}>
      <div className="container">
        <div className="process-header">
          <div className="label">How I Work</div>
          <TextReveal as="h2" className="display-lg" split="words" stagger={0.1}>
            From concept to motion
          </TextReveal>
          <p className="body-lg">
            A refined process built on clarity, creativity, and collaboration.
          </p>
        </div>

        <div className="process-steps">
          <div className="process-line">
            <div className="process-line-fill"></div>
          </div>
          {steps.map((step) => (
            <div className="process-step" key={step.num}>
              <div className="process-step-num">{step.num}</div>
              <div className="process-step-content">
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
