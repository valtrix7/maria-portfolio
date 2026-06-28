import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

// ── Marquee building blocks ───────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'CEO, Urban Explorer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=44&h=44&fit=crop&crop=face',
    quote: '"Maria transformed our pitch deck into a visual masterpiece. Her motion design brought our story to life."',
  },
  {
    name: 'Alex Rivera',
    role: 'Founder, Lumina Studio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=44&h=44&fit=crop&crop=face',
    quote: '"Incredible attention to detail. The animations she created perfectly captured our brand\'s energy."',
  },
  {
    name: 'Priya Sharma',
    role: 'Marketing Director, NexGen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=44&h=44&fit=crop&crop=face',
    quote: '"Working with Maria was seamless. She delivered stunning motion graphics on time and beyond expectations."',
  },
];

const MqChip = ({ children, href }: { children: React.ReactNode; href?: string }) =>
  href ? (
    <a href={href} className="hero-mq-chip hero-mq-chip--link">
      {children}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  ) : (
    <span className="hero-mq-chip">{children}</span>
  );

const MqTestimonialStack = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-mq-card hero-mq-card--t">
      {TESTIMONIALS.map((t, i) => (
        <div
          key={t.name}
          className={`hero-mq-t-slide ${i === active ? 'hero-mq-t-slide--active' : ''}`}
          style={{ '--i': i } as React.CSSProperties}
        >
          <div className="hero-mq-t-head">
            <img src={t.avatar} alt={t.name} className="hero-mq-t-avatar" loading="lazy" />
            <div>
              <span className="hero-mq-t-name">{t.name}</span>
              <span className="hero-mq-t-role">{t.role}</span>
            </div>
          </div>
          <p className="hero-mq-t-quote">{t.quote}</p>
          <span className="hero-mq-t-more">View more</span>
        </div>
      ))}
      <div className="hero-mq-t-dots">
        {TESTIMONIALS.map((_, i) => (
          <span key={i} className={`hero-mq-t-dot ${i === active ? 'hero-mq-t-dot--active' : ''}`} />
        ))}
      </div>
    </div>
  );
};

const MqSet = () => (
  <>
    <MqTestimonialStack />

    <div className="hero-mq-card hero-mq-card--proj">
      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=320&h=200&fit=crop"
        alt="Project preview"
        className="hero-mq-proj-img"
        loading="lazy"
      />
    </div>

    <div className="hero-mq-card hero-mq-card--work">
      <div>
        <p className="hero-mq-work-title">Selected Work</p>
        <p className="hero-mq-work-desc">Recent projects showcasing creativity, quality, and innovation.</p>
      </div>
      <a href="#work" className="hero-mq-work-cta">
        <span className="hero-mq-work-orb" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
        <span>See more</span>
      </a>
    </div>

    <a href="#contact" className="hero-mq-badge-wrap">
      <div className="hero-mq-badge">
        <svg className="hero-mq-badge-svg" viewBox="0 0 130 130" width="130" height="130" aria-hidden="true">
          <defs>
            <path id="mq-ring-path" d="M65,65 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text fill="currentColor" fontSize="10" fontWeight="600" letterSpacing="2.8" fontFamily="Space Grotesk, sans-serif">
            <textPath href="#mq-ring-path">GET IN TOUCH · GET IN TOUCH · </textPath>
          </text>
        </svg>
        <div className="hero-mq-badge-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
        </div>
      </div>
    </a>
  </>
);

const MqChips = () => (
  <div className="hero-mq-chips">
    <div className="hero-mq-skills-row">
      <MqChip>Animation</MqChip>
      <MqChip>Design</MqChip>
      <MqChip>Development</MqChip>
    </div>
    <div className="hero-mq-skills-row">
      <MqChip>User Interface</MqChip>
      <MqChip>GSAP</MqChip>
      <MqChip href="#contact">More</MqChip>
    </div>
  </div>
);

const Hero = () => {
  const heroRef    = useRef<HTMLElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const mouse      = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isMobile()) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouse.current = { x, y };
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(255, 106, 0, 0.08) 0%, transparent 60%)`;
    }
  }, []);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(['.hero-nav', '.hero-kicker', '.hero-name-word', '.hero-portrait', '.hero-headline-right', '.hero-desc-right', '.hero-marquee-rail'], {
          opacity: 1, y: 0, x: 0, scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({ delay: mobile ? 0.1 : 0.3 });

      tl.fromTo('.hero-nav', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0);
      tl.fromTo('.hero-kicker', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.15);

      tl.fromTo('.hero-name-word',
        { y: mobile ? 50 : 90, opacity: 0 },
        { y: 0, opacity: 1, duration: mobile ? 0.8 : 1.2, stagger: mobile ? 0.08 : 0.12, ease: 'power4.out' },
        0.2
      );

      tl.fromTo('.hero-portrait',
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: mobile ? 1 : 1.4, ease: 'power3.out' },
        0.3
      );

      tl.fromTo('.hero-headline-right', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, mobile ? 0.5 : 0.7);
      tl.fromTo('.hero-desc-right', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, mobile ? 0.6 : 0.85);

      tl.fromTo('.hero-marquee-rail',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        mobile ? 0.95 : 1.15
      );


      if (!mobile) {
        gsap.to('.hero-portrait', {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      if (mobile) {
        gsap.to('.hero-portrait', {
          y: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        });
        gsap.set('.hero-glow-spot', { opacity: 0.4 });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Separate effect — marquee scroll. Isolated so ctx.revert() never kills it.
  useEffect(() => {
    const track = marqueeRef.current;
    if (!track || prefersReducedMotion()) return;

    // Use pixel distance (half of total track width) for reliable looping
    let anim: gsap.core.Tween;
    const raf = requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      anim = gsap.to(track, {
        x: -halfWidth,
        duration: 35,
        repeat: -1,
        ease: 'none',
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      anim?.kill();
    };
  }, []);

  return (
    <section className="hero-wrapper" ref={heroRef} onMouseMove={handleMouseMove}>
      <div className="hero-container">
        <div className="hero-glow" ref={glowRef} />
        <div className="hero-glow-spot hero-glow-spot--1" />
        <div className="hero-glow-spot hero-glow-spot--2" />
        <div className="hero-glow-spot hero-glow-spot--3" />

        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-kicker">Hey, I&apos;m a</span>
            <h1 className="hero-name">
              <span className="hero-name-word">Creative</span>
              <span className="hero-name-word">Director</span>
            </h1>
          </div>

          <div className="hero-center">
            <div className="hero-portrait-glow" />
            <img
              src="/519d6047-eb12-4f96-8ea2-6b0d99e6b816.jpg"
              alt="Maria Islam — motion graphics designer"
              className="hero-portrait"
              loading="eager"
            />
          </div>

          <div className="hero-right">
            <p className="hero-headline-right">
              Great design should feel invisible.
            </p>
            <p className="hero-desc-right">
              From concept to screen, I craft visual stories through motion, design, and strategic thinking. Bringing brands to life with purposeful animation.
            </p>
            <a
              href="https://www.fiverr.com/mariaislam"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-fiverr-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.758-.958 3.984-2.376 6.672-1.476 2.796-2.868 4.188-4.176 4.188-.888 0-1.62-.828-2.196-2.484L7.32 10.2c-.384-1.104-.792-1.656-1.224-1.656-.096 0-.432.204-1.008.612l-.648-.828c.864-.756 1.716-1.308 2.556-1.656 1.248-.516 2.184-.264 2.808.756.672 1.08 1.368 2.628 2.088 4.644.768-3.144 1.572-5.592 2.412-7.344.72-1.488 1.524-2.244 2.412-2.244.696 0 1.428.588 2.196 1.764l.864 1.356z"/>
              </svg>
              Fiverr
            </a>
          </div>
        </div>

        {/* ── Card marquee strip ── */}
        <div className="hero-marquee-rail" aria-hidden="true">
          <div className="hero-mq-track" ref={marqueeRef}>
            <MqChips />
            <MqSet />
            <MqSet />
            <MqChips />
          </div>
        </div>

        <div className="hero-signature">
          <span className="hero-signature-text">Maria Islam</span>
          <span className="hero-signature-line" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
