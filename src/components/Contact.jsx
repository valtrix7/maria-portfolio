import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LineReveal } from './Transitions';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big text word-by-word reveal with clip
      gsap.fromTo('.contact-display-text .c-word',
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          }
        }
      );

      gsap.fromTo('.contact-sub > *',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-sub', start: 'top 80%' }
        }
      );

      // Email button scale
      gsap.fromTo('.contact-email-btn',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '.contact-email-btn', start: 'top 85%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" data-section="contact" ref={sectionRef}>
      <LineReveal />
      <div className="container">
        <div className="contact-display-text">
          <span className="c-word-wrap"><span className="c-word">Let's</span></span>
          <span className="c-word-wrap"><span className="c-word accent">create</span></span>
          <span className="c-word-wrap"><span className="c-word">something</span></span>
          <span className="c-word-wrap"><span className="c-word accent">extraordinary</span></span>
        </div>

        <div className="contact-sub">
          <p className="body-lg">
            Ready to bring your vision to life? I'm always open to new projects
            and creative collaborations.
          </p>
          <div className="contact-links">
            <a href="mailto:hello@mariaislam.com" className="btn btn-primary contact-email-btn glow-hover">
              hello@mariaislam.com
            </a>
            <div className="contact-socials">
              <a href="#" className="contact-social hover-target">
                <span>Fiverr</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1v8" stroke="currentColor" strokeWidth="1.5"/></svg>
              </a>
              <a href="#" className="contact-social hover-target">
                <span>Dribbble</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1v8" stroke="currentColor" strokeWidth="1.5"/></svg>
              </a>
              <a href="#" className="contact-social hover-target">
                <span>LinkedIn</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1v8" stroke="currentColor" strokeWidth="1.5"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
