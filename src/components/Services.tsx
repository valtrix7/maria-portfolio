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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    backContent: 'Specializing in After Effects, Cinema 4D, and real-time motion graphics for web, social, and broadcast.',
  },
  {
    title: 'Brand Identity',
    description: 'Crafting cohesive visual systems — logos, typography, color, and guidelines that tell a complete story.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
    ),
    backContent: 'Full brand packages including pitch decks, style guides, social templates, and animated brand assets.',
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.svc-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8, stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.svc-grid', start: 'top 85%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const card = e.currentTarget;
    const inner = card.querySelector('.svc-card-inner') as HTMLElement;
    if (!inner) return;

    const isFlipped = inner.dataset.flipped === 'true';
    gsap.to(inner, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: 'power3.inOut',
    });
    inner.dataset.flipped = isFlipped ? 'false' : 'true';
  };

  return (
    <section className="services" id="services" data-section="services" ref={sectionRef}>
      <div className="container">
        <div className="svc-header">
          <div className="label">Services</div>
          <h2 className="display-lg">What I Do</h2>
          <p className="body-lg svc-sub">
            Two core disciplines, one unified approach — turning complex ideas into visual clarity.
          </p>
        </div>

        <div className="svc-grid">
          {SERVICES.map((svc) => (
            <div
              key={svc.title}
              className="svc-card"
              onClick={handleFlip}
            >
              <div className="svc-card-inner">
                {/* Front */}
                <div className="svc-card-face svc-card-front">
                  <div className="svc-icon">{svc.icon}</div>
                  <h3 className="svc-title">{svc.title}</h3>
                  <p className="svc-desc">{svc.description}</p>
                  <span className="svc-hint">Click to learn more</span>
                </div>
                {/* Back */}
                <div className="svc-card-face svc-card-back">
                  <div className="svc-icon svc-icon--accent">{svc.icon}</div>
                  <p className="svc-back-text">{svc.backContent}</p>
                  <span className="svc-hint svc-hint--back">Click to flip back</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
