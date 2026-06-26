import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Recognition.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { num: '50+', label: 'Projects Delivered' },
  { num: '30+', label: 'Happy Clients' },
  { num: '3+', label: 'Years Experience' },
  { num: '100%', label: 'On-Time Delivery' },
];

const testimonials = [
  {
    quote: 'Maria transformed our pitch deck into a visual masterpiece. The animations told our story better than words ever could.',
    name: 'Sarah Chen',
    role: 'CEO, Urban Explorer',
  },
  {
    quote: 'Her motion design elevated our entire brand. Every frame feels intentional, every transition meaningful.',
    name: 'James Miller',
    role: 'Creative Director, Summit Finance',
  },
  {
    quote: 'Working with Maria was effortless. She understood our vision instantly and delivered beyond expectations.',
    name: 'Aisha Patel',
    role: 'Founder, Verde Sustainability',
  },
];

const Recognition = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.recognition-header > *',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.recognition-header', start: 'top 75%' }
        }
      );

      // Stats
      gsap.fromTo('.stat-item',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.stats-grid', start: 'top 80%' }
        }
      );

      // Testimonials
      gsap.fromTo('.testimonial-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%' }
        }
      );

      // Big display text
      gsap.fromTo('.recognition-display',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.recognition-display', start: 'top 80%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="recognition" id="recognition" data-section="recognition" ref={sectionRef}>
      <div className="container">
        <div className="recognition-header">
          <div className="label">Recognition</div>
          <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '20px' }}>
            Numbers that<br />speak
          </h2>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <span className="stat-num">{stat.num}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="recognition-divider"></div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-quote-mark">"</div>
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <span>{t.name.charAt(0)}</span>
                </div>
                <div className="testimonial-info">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="recognition-display">
          <span>Every project is a </span>
          <span className="accent">new story.</span>
        </div>
      </div>
    </section>
  );
};

export default Recognition;
