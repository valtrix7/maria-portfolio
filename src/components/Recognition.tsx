import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Recognition.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const stats = [
  { num: 50, suffix: '+', label: 'Projects Delivered', icon: '◆' },
  { num: 30, suffix: '+', label: 'Happy Clients', icon: '●' },
  { num: 3, suffix: '+', label: 'Years Experience', icon: '▲' },
  { num: 100, suffix: '%', label: 'On-Time Delivery', icon: '■' },
];

const Recognition: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const mobile = isMobile();
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.rec-bento-item', { opacity: 1, y: 0, clipPath: 'none' });
        gsap.set('.rec-display', { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo('.rec-header > *',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.rec-header', start: 'top 80%' },
        }
      );

      const tiles = gsap.utils.toArray<HTMLElement>('.rec-bento-item');
      tiles.forEach((tile, i) => {
        const depth = i % 3;
        const startY = 80 + depth * 60;
        const scale = 0.92 - depth * 0.04;

        gsap.fromTo(tile,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            y: startY,
            opacity: 0,
            scale,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tile,
              start: 'top 90%',
              end: 'top 55%',
              scrub: 1,
            },
          }
        );
      });

      countersRef.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].num;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: mobile ? 1.5 : 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + stats[i].suffix;
          },
        });
      });

      gsap.fromTo('.rec-display',
        { y: 80, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.rec-display', start: 'top 88%' },
        }
      );

      if (!mobile) {
        gsap.fromTo('.rec-deco',
          { scale: 0.5, opacity: 0 },
          {
            scale: 1, opacity: 0.05,
            duration: 1.5, ease: 'power2.out', stagger: 0.2,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
          }
        );

        gsap.to('.rec-deco-1', {
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 },
        });
        gsap.to('.rec-deco-2', {
          y: 50,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2.5 },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="rec" id="recognition" data-section="recognition" ref={sectionRef}>
      <svg className="rec-deco rec-deco-1" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="180" stroke="var(--accent)" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="120" stroke="var(--accent)" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="60" stroke="var(--accent)" strokeWidth="0.5" />
      </svg>
      <svg className="rec-deco rec-deco-2" viewBox="0 0 300 300" fill="none">
        <path d="M150,10 L280,100 L280,200 L150,290 L20,200 L20,100 Z" stroke="var(--accent)" strokeWidth="0.5" />
      </svg>

      <div className="container">
        <div className="rec-header">
          <div className="label">Recognition</div>
          <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '20px' }}>
            Numbers that<br />speak
          </h2>
        </div>

        <div className="rec-bento">
          <div className="rec-bento-item rec-bento-stat rec-bento-stat--wide">
            <span className="rec-stat-icon">{stats[0].icon}</span>
            <span className="rec-stat-num" ref={(el) => (countersRef.current[0] = el)}>0{stats[0].suffix}</span>
            <span className="rec-stat-label">{stats[0].label}</span>
            <div className="rec-stat-glow" />
          </div>

          <div className="rec-bento-item rec-bento-stat">
            <span className="rec-stat-icon">{stats[1].icon}</span>
            <span className="rec-stat-num" ref={(el) => (countersRef.current[1] = el)}>0{stats[1].suffix}</span>
            <span className="rec-stat-label">{stats[1].label}</span>
          </div>

          <div className="rec-bento-item rec-bento-stat">
            <span className="rec-stat-icon">{stats[2].icon}</span>
            <span className="rec-stat-num" ref={(el) => (countersRef.current[2] = el)}>0{stats[2].suffix}</span>
            <span className="rec-stat-label">{stats[2].label}</span>
          </div>

          <div className="rec-bento-item rec-bento-stat rec-bento-stat--wide">
            <span className="rec-stat-icon">{stats[3].icon}</span>
            <span className="rec-stat-num" ref={(el) => (countersRef.current[3] = el)}>0{stats[3].suffix}</span>
            <span className="rec-stat-label">{stats[3].label}</span>
            <div className="rec-stat-glow" />
          </div>
        </div>

        <div className="rec-display">
          <span>Every project is a </span>
          <span className="accent">new story.</span>
        </div>
      </div>
    </section>
  );
};

export default Recognition;
