import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import './LoadingScreen.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  const animateOut = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(containerRef.current, { display: 'none' });
        onComplete();
      },
    });

    // Tagline fades out
    tl.to(taglineRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
    });

    // Name letters scatter outward
    const letters = nameRef.current?.querySelectorAll('.ls-letter');
    if (letters) {
      tl.to(letters, {
        y: (i: number) => (i % 2 === 0 ? -120 : 120),
        x: (i: number) => (i - letters.length / 2) * 60,
        opacity: 0,
        rotation: (i: number) => (i % 2 === 0 ? -15 : 15),
        stagger: 0.03,
        duration: 0.5,
        ease: 'power3.in',
      }, '-=0.15');
    }

    // Line shrinks
    tl.to(lineRef.current, {
      scaleX: 0,
      duration: 0.3,
      ease: 'power3.in',
    }, '-=0.4');

    // Counter fades
    tl.to(counterRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.25,
      ease: 'power2.in',
    }, '-=0.35');

    // Curtain wipe — top and bottom halves slide apart
    tl.to('.ls-curtain-top', {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
    }, '-=0.1');

    tl.to('.ls-curtain-bottom', {
      yPercent: 100,
      duration: 0.8,
      ease: 'power4.inOut',
    }, '<');
  }, [onComplete]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(containerRef.current, { display: 'none' });
      onComplete();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Animate in
    const tl = gsap.timeline();

    // Name letters appear one by one
    const letters = nameRef.current?.querySelectorAll('.ls-letter');
    if (letters) {
      gsap.set(letters, { opacity: 0, y: 40 });
      tl.to(letters, {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power3.out',
      }, 0.2);
    }

    // Line draws in
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power4.inOut' },
      0.4
    );

    // Tagline fades in
    tl.fromTo(taglineRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0.7
    );

    // Counter appears
    tl.fromTo(counterRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      0.5
    );

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          progressRef.current = 100;
          // Start exit animation after a short delay
          setTimeout(animateOut, 400);
          return 100;
        }
        progressRef.current = next;
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update counter display
  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = String(Math.floor(progress)).padStart(3, '0');
    }
  }, [progress]);

  return (
    <div ref={containerRef} className="ls">
      {/* Curtains for reveal exit */}
      <div className="ls-curtain-top" />
      <div className="ls-curtain-bottom" />

      <div className="ls-content">
        {/* Counter */}
        <span ref={counterRef} className="ls-counter">000</span>

        {/* Name */}
        <div ref={nameRef} className="ls-name">
          {'MARIA'.split('').map((char, i) => (
            <span key={i} className="ls-letter">{char}</span>
          ))}
        </div>

        {/* Line */}
        <div ref={lineRef} className="ls-line" />

        {/* Tagline */}
        <div ref={taglineRef} className="ls-tagline">
          Motion Graphics Designer
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
