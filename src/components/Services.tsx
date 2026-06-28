import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardSwap, { Card } from './ui/card-swap';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SERVICES = [
  {
    title: 'Motion Design',
    description: 'Bringing brands to life with purposeful animation — from logo reveals to full campaign narratives.',
    backText: 'After Effects, Cinema 4D, Blender, Lottie, Rive — real-time and pre-rendered motion for web, social, and broadcast.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, rgba(232, 97, 26, 0.12), rgba(255, 106, 0, 0.04))',
  },
  {
    title: 'Brand Identity',
    description: 'Crafting cohesive visual systems — logos, typography, color, and guidelines that tell a complete story.',
    backText: 'Full brand packages including pitch decks, style guides, social templates, and animated brand assets.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.04))',
  },
  {
    title: 'Visual Design',
    description: 'Static and interactive design for web, apps, and print — pixel-perfect layouts with strategic intent.',
    backText: 'Landing pages, dashboards, pitch decks, social media kits, and print collateral — designed in Figma and delivered pixel-perfect.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.04))',
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
        <div className="svc-text">
          <div className="label">Services</div>
          <h2 className="display-lg">What I Do</h2>
          <p className="body-lg svc-sub">
            Three core disciplines, one unified approach — turning complex ideas into visual clarity.
          </p>
        </div>

        <div className="svc-content">
          <CardSwap
            width={420}
            height={480}
            cardDistance={60}
            verticalDistance={70}
            skewAmount={6}
            sectionRef={sectionRef}
          >
            {SERVICES.map((svc) => (
              <Card key={svc.title} customClass="svc-swap-card">
                <div className="svc-swap-inner" style={{ background: svc.gradient }}>
                  <div className="svc-swap-icon">{svc.icon}</div>
                  <h3 className="svc-swap-title">{svc.title}</h3>
                  <p className="svc-swap-desc">{svc.description}</p>
                  <div className="svc-swap-back">
                    <p>{svc.backText}</p>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
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
