import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal, ImageReveal, LineReveal } from './Transitions';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const mobile = isMobile();
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-text-block > *',
        { y: mobile ? 30 : 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: mobile ? 0.7 : 1, stagger: mobile ? 0.08 : 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about-text-block', start: 'top 80%' }
        }
      );

      gsap.fromTo('.about-stat',
        { y: mobile ? 20 : 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: mobile ? 0.6 : 0.8, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about-stats', start: 'top 88%' }
        }
      );

      // Parallax on portrait — lighter on mobile
      if (!mobile) {
        gsap.to('.about-portrait img', {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-portrait',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" data-section="about" ref={sectionRef}>
      <LineReveal />
      <div className="container">
        <div className="about-grid">
          <div className="about-text-block">
            <div className="label">About Me</div>
            <TextReveal
              as="h2"
              className="display-lg"
              split="words"
              stagger={0.08}
            >
              Designing the unseen motion
            </TextReveal>
            <p className="body-lg" style={{ marginBottom: '20px' }}>
              I'm Maria Islam, a motion graphics designer who believes every brand has a story
              waiting to move. With over 3 years of experience, I transform static ideas into
              compelling visual narratives.
            </p>
            <p className="body-lg" style={{ marginBottom: '48px' }}>
              From investor pitch decks to full brand identities, I bring strategic thinking
              and visual precision to every frame. My work lives at the intersection of
              design clarity and emotional impact.
            </p>
            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num">3+</span>
                <span className="about-stat-label">Years Experience</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">50+</span>
                <span className="about-stat-label">Projects Delivered</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">30+</span>
                <span className="about-stat-label">Happy Clients</span>
              </div>
            </div>
          </div>
          <div className="about-visual">
            <ImageReveal
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&h=900&fit=crop&crop=face"
              alt="Maria Islam"
              className="about-portrait"
            />
            <div className="about-accent-block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
