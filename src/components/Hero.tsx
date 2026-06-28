import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

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
