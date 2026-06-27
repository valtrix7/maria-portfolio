import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SelectedWork.css';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&h=800&fit=crop',
    category: 'Brand Identity',
    title: 'Urban Explorer',
    subtitle: 'Brand Reveal Sequence',
    year: '2026',
  },
  {
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=800&fit=crop',
    category: 'Motion Design',
    title: 'Data Narrative',
    subtitle: 'Infographic Motion System',
    year: '2025',
  },
  {
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1400&h=800&fit=crop',
    category: '3D Animation',
    title: 'Product Film',
    subtitle: 'Morphing Transition Reel',
    year: '2025',
  },
  {
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=800&fit=crop',
    category: 'Pitch Deck',
    title: 'Summit Finance',
    subtitle: 'Investor Presentation',
    year: '2024',
  },
  {
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=800&fit=crop',
    category: 'Visual System',
    title: 'Aether Studio',
    subtitle: 'Brand Motion Language',
    year: '2024',
  },
];

const SelectedWork = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const counterRef = useRef(null);
  const progressRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.work-header > *',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.work-header', start: 'top 75%' }
        }
      );

      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const idx = Math.min(Math.floor(progress * slides.length), slides.length - 1);
            if (counterRef.current) counterRef.current.textContent = `0${idx + 1}`;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
            dotsRef.current.forEach((dot, i) => {
              if (dot) {
                dot.style.opacity = i === idx ? '1' : '0.3';
                dot.style.width = i === idx ? '24px' : '8px';
              }
            });
          }
        }
      });

      // Per-slide animations
      const slideEls = gsap.utils.toArray('.h-slide');
      slideEls.forEach((slide, i) => {
        const img = slide.querySelector('.h-slide-img');
        const info = slide.querySelector('.h-slide-info');

        if (img) {
          gsap.fromTo(img,
            { scale: 1.2 },
            {
              scale: 1, ease: 'none',
              scrollTrigger: {
                trigger: wrapper,
                start: () => `top+=${(i / slides.length) * getScrollAmount()} top`,
                end: () => `top+=${((i + 1) / slides.length) * getScrollAmount()} top`,
                scrub: 2,
              }
            }
          );
        }

        if (info) {
          gsap.fromTo(info.children,
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: wrapper,
                start: () => `top+=${(i / slides.length) * getScrollAmount() + getScrollAmount() * 0.03} top`,
                end: () => `top+=${(i / slides.length) * getScrollAmount() + getScrollAmount() * 0.12} top`,
                scrub: 1,
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="selected-work" id="my-project" data-section="my-project" ref={sectionRef}>
      <div className="container work-header">
        <div className="label">My Project</div>
        <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '20px' }}>
          Featured<br />Project
        </h2>
        <p className="body-lg">
          A deep dive into one of my recent motion design projects.
        </p>
      </div>

      <div className="h-wrapper" ref={wrapperRef}>
        <div className="h-hud">
          <div className="h-counter">
            <span ref={counterRef}>01</span>
            <span className="h-counter-sep">/</span>
            <span className="h-counter-total">0{slides.length}</span>
          </div>
          <div className="h-progress">
            <div className="h-progress-fill" ref={progressRef}></div>
          </div>
          <div className="h-dots">
            {slides.map((_, i) => (
              <div className="h-dot" key={i} ref={(el) => (dotsRef.current[i] = el)}></div>
            ))}
          </div>
        </div>

        <div className="h-track" ref={trackRef}>
          {slides.map((slide, i) => (
            <div className="h-slide" key={i}>
              <div className="h-slide-frame">
                <img className="h-slide-img" src={slide.img} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
              <div className="h-slide-info">
                <span className="h-slide-category">{slide.category}</span>
                <h3 className="h-slide-title">{slide.title}</h3>
                <p className="h-slide-subtitle">{slide.subtitle}</p>
                <span className="h-slide-year">{slide.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
