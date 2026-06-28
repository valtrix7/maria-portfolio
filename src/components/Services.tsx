import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SERVICES = [
  {
    title: 'Motion Design',
    description: 'Bringing brands to life with purposeful animation — from logo reveals to full campaign narratives.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    backText: 'After Effects, Cinema 4D, Blender, Lottie, Rive — real-time and pre-rendered motion for web, social, and broadcast.',
  },
  {
    title: 'Brand Identity',
    description: 'Crafting cohesive visual systems — logos, typography, color, and guidelines that tell a complete story.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
    ),
    backText: 'Full brand packages including pitch decks, style guides, social templates, and animated brand assets.',
  },
  {
    title: 'Visual Design',
    description: 'Static and interactive design for web, apps, and print — pixel-perfect layouts with strategic intent.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    ),
    backText: 'Landing pages, dashboards, pitch decks, social media kits, and print collateral — designed in Figma and delivered pixel-perfect.',
  },
];

const TOOLS = [
  'After Effects', 'Premiere Pro', 'Photoshop', 'Illustrator',
  'Figma', 'Canva', 'PowerPoint', 'Blender', 'Cinema 4D', 'Lottie',
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Cards entrance
      gsap.fromTo('.svc-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.svc-grid', start: 'top 85%' }
        }
      );

      // Flip each card when it enters viewport
      document.querySelectorAll('.svc-card').forEach((card) => {
        const inner = card.querySelector('.svc-card-inner') as HTMLElement;
        if (!inner) return;

        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          onEnter: () => {
            gsap.to(inner, {
              rotateY: 180,
              duration: 0.7,
              ease: 'power3.inOut',
              delay: 0.2,
            });
            inner.dataset.flipped = 'true';
          },
          onLeaveBack: () => {
            gsap.to(inner, {
              rotateY: 0,
              duration: 0.7,
              ease: 'power3.inOut',
            });
            inner.dataset.flipped = 'false';
          },
        });
      });

      // Marquee scroll
      if (marqueeRef.current) {
        const track = marqueeRef.current.querySelector('.svc-mq-track') as HTMLElement;
        if (track) {
          gsap.to(track, {
            xPercent: -50,
            ease: 'none',
            duration: 20,
            repeat: -1,
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services" id="services" data-section="services" ref={sectionRef}>
      <div className="container">
        <div className="svc-header">
          <div className="label">Services</div>
          <h2 className="display-lg">What I Do</h2>
          <p className="body-lg svc-sub">
            Three core disciplines, one unified approach — turning complex ideas into visual clarity.
          </p>
        </div>

        <div className="svc-grid">
          {SERVICES.map((svc) => (
            <div key={svc.title} className="svc-card">
              <div className="svc-card-inner">
                <div className="svc-card-face svc-card-front">
                  <div className="svc-icon">{svc.icon}</div>
                  <h3 className="svc-title">{svc.title}</h3>
                  <p className="svc-desc">{svc.description}</p>
                </div>
                <div className="svc-card-face svc-card-back">
                  <div className="svc-icon svc-icon--accent">{svc.icon}</div>
                  <p className="svc-back-text">{svc.backText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool marquee */}
      <div className="svc-marquee" ref={marqueeRef}>
        <div className="svc-mq-track">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <span key={i} className="svc-mq-chip">{tool}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
