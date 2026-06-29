import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import './HowIWork.css';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const steps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'Deep-dive into your vision, audience, and goals. Every great motion piece starts with understanding.',
    detail: 'Research & Strategy',
  },
  {
    num: '02',
    title: 'Concept',
    desc: 'Crafting the narrative arc and visual language that will carry your story forward.',
    detail: 'Creative Direction',
  },
  {
    num: '03',
    title: 'Design',
    desc: 'Building each frame with typographic precision and compositional harmony.',
    detail: 'Visual Execution',
  },
  {
    num: '04',
    title: 'Motion',
    desc: 'Breathing life into static designs. Timing, easing, and rhythm that feels inevitable.',
    detail: 'Animation & Polish',
  },
];

const HowIWork: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      const path = pathRef.current;

      if (reduce) {
        gsap.set('.hw-card', { opacity: 1, clipPath: 'none', y: 0 });
        if (path) gsap.set(path, { drawSVG: '100%' });
        return;
      }

      // ---------- DrawSVG: the connector path draws itself as you scroll ----------
      // Desktop uses the SVG curve; mobile uses a vertical line fallback.
      if (path && !mobile) {
        gsap.fromTo(path,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: '.hw-timeline',
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 1,
            },
          }
        );
      } else if (path && mobile) {
        gsap.fromTo(path,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: '.hw-timeline',
              start: 'top 80%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }

      // ---------- Cards reveal alongside their drawn segment ----------
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const isLeft = i % 2 === 0;

        gsap.fromTo(card,
          {
            clipPath: isLeft
              ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
              : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            opacity: 0,
            x: isLeft ? -60 : 60,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 0.8,
            },
          }
        );

        // DrawSVG progress number inside each card (mini stroke draw on enter)
        const numEl = card.querySelector('.hw-card-num');
        if (numEl) {
          gsap.fromTo(numEl,
            { opacity: 0, y: 10 },
            {
              opacity: 0.12, y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: card, start: 'top 75%' },
            }
          );
        }
      });

      // ---------- Timeline dots pop as the path reaches them ----------
      gsap.utils.toArray<HTMLElement>('.hw-dot').forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // ---------- Decorative shapes drift in with parallax ----------
      if (!mobile) {
        gsap.fromTo('.hw-deco-circle',
          { scale: 0.8 },
          {
            scale: 1,
            opacity: 0.12,
            duration: 1.5,
            ease: 'power2.out',
            stagger: 0.2,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
          }
        );

        // Parallax layers: each decorative element moves at different speed
        gsap.to('.hw-deco-1', {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
        gsap.to('.hw-deco-2', {
          y: 50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hw" id="process" data-section="how-i-work" ref={sectionRef}>
      <div className="container">
        <div className="hw-header">
          <div className="label">How I Work</div>
          <h2 className="display-lg">From concept<br />to motion</h2>
          <p className="body-lg">
            A refined process built on clarity, creativity, and collaboration.
          </p>
        </div>

        <div className="hw-timeline">
          <svg
            className="hw-line-svg"
            viewBox="0 0 400 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="hw-line-base"
              d={isMobile()
                ? 'M200,30 L200,760'
                : 'M200,0 C200,100 80,180 80,260 C80,340 320,420 320,500 C320,580 80,660 80,740'}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1.5"
            />
            <path
              ref={pathRef}
              d={isMobile()
                ? 'M200,30 L200,760'
                : 'M200,0 C200,100 80,180 80,260 C80,340 320,420 320,500 C320,580 80,660 80,740'}
              fill="none"
              stroke="url(#hwGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="hwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8611A" />
                <stop offset="50%" stopColor="#FF7A33" />
                <stop offset="100%" stopColor="#E8611A" />
              </linearGradient>
            </defs>
          </svg>

          {steps.map((_, i) => (
            <div key={i} className="hw-dot" style={{ top: `${10 + i * 26}%` }} />
          ))}

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`hw-card ${i % 2 === 0 ? 'hw-card--left' : 'hw-card--right'}`}
              ref={(el) => (cardsRef.current[i] = el)}
              style={{ top: `${4 + i * 25}%` }}
            >
              <div className="hw-card-inner">
                <div className="hw-card-num">{step.num}</div>
                <div className="hw-card-content">
                  <span className="hw-card-detail">{step.detail}</span>
                  <h3 className="hw-card-title">{step.title}</h3>
                  <p className="hw-card-desc">{step.desc}</p>
                </div>
                <div className="hw-card-line" />
              </div>
            </div>
          ))}

          <svg className="hw-deco-circle hw-deco-1" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="60" stroke="var(--accent)" strokeWidth="0.5" opacity="0.2" />
            <circle cx="100" cy="100" r="30" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
          </svg>
          <svg className="hw-deco-circle hw-deco-2" viewBox="0 0 150 150" fill="none">
            <rect x="15" y="15" width="120" height="120" rx="4" stroke="var(--accent)" strokeWidth="0.5" opacity="0.15" transform="rotate(45 75 75)" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
