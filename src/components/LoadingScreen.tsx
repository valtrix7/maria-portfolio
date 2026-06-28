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
  const svgRef = useRef<SVGSVGElement>(null);
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

    // SVG shapes scatter
    const shapes = svgRef.current?.querySelectorAll('.ls-shape');
    if (shapes) {
      tl.to(shapes, {
        scale: 0,
        opacity: 0,
        rotation: () => gsap.utils.random(-180, 180),
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-200, 200),
        stagger: 0.02,
        duration: 0.6,
        ease: 'power3.in',
      }, '-=0.4');
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

    // Curtain wipe
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

    const tl = gsap.timeline();

    // SVG shapes animate in
    const shapes = svgRef.current?.querySelectorAll('.ls-shape');
    if (shapes) {
      gsap.set(shapes, { opacity: 0, scale: 0, rotation: -90 });
      tl.to(shapes, {
        opacity: 0.15,
        scale: 1,
        rotation: 0,
        stagger: { each: 0.08, from: 'random' },
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, 0);
    }

    // Floating rotation for shapes
    if (shapes) {
      shapes.forEach((shape, i) => {
        gsap.to(shape, {
          rotation: i % 2 === 0 ? 360 : -360,
          duration: gsap.utils.random(8, 14),
          repeat: -1,
          ease: 'none',
        });
      });
    }

    // Name letters appear
    const letters = nameRef.current?.querySelectorAll('.ls-letter');
    if (letters) {
      gsap.set(letters, { opacity: 0, y: 40, rotationX: -90 });
      tl.to(letters, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: 'back.out(1.4)',
      }, 0.3);
    }

    // Line draws in
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power4.inOut' },
      0.5
    );

    // Tagline fades in
    tl.fromTo(taglineRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      0.8
    );

    // Counter appears
    tl.fromTo(counterRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      0.6
    );

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          progressRef.current = 100;
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

      {/* Background SVG shapes */}
      <svg ref={svgRef} className="ls-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        {/* Triangle */}
        <polygon className="ls-shape" points="500,100 600,300 400,300" fill="none" stroke="#E8611A" strokeWidth="1.5" />
        {/* Circle */}
        <circle className="ls-shape" cx="200" cy="400" r="60" fill="none" stroke="#E8611A" strokeWidth="1.5" />
        {/* Diamond */}
        <polygon className="ls-shape" points="800,500 850,600 800,700 750,600" fill="none" stroke="#E8611A" strokeWidth="1.5" />
        {/* Cross */}
        <g className="ls-shape">
          <line x1="150" y1="700" x2="150" y2="800" stroke="#E8611A" strokeWidth="1.5" />
          <line x1="100" y1="750" x2="200" y2="750" stroke="#E8611A" strokeWidth="1.5" />
        </g>
        {/* Small circles */}
        <circle className="ls-shape" cx="750" cy="200" r="20" fill="none" stroke="#E8611A" strokeWidth="1" />
        <circle className="ls-shape" cx="300" cy="600" r="15" fill="none" stroke="#E8611A" strokeWidth="1" />
        {/* Dots */}
        <circle className="ls-shape" cx="600" cy="150" r="4" fill="#E8611A" />
        <circle className="ls-shape" cx="850" cy="350" r="4" fill="#E8611A" />
        <circle className="ls-shape" cx="100" cy="250" r="4" fill="#E8611A" />
        {/* Lines */}
        <line className="ls-shape" x1="900" y1="100" x2="950" y2="180" stroke="#E8611A" strokeWidth="1" />
        <line className="ls-shape" x1="50" y1="500" x2="120" y2="450" stroke="#E8611A" strokeWidth="1" />
        {/* Plus */}
        <g className="ls-shape">
          <line x1="680" y1="750" x2="680" y2="810" stroke="#E8611A" strokeWidth="1" />
          <line x1="650" y1="780" x2="710" y2="780" stroke="#E8611A" strokeWidth="1" />
        </g>
        {/* Squares */}
        <rect className="ls-shape" x="400" y="700" width="40" height="40" fill="none" stroke="#E8611A" strokeWidth="1" transform="rotate(45 420 720)" />
        <rect className="ls-shape" x="600" y="400" width="25" height="25" fill="none" stroke="#E8611A" strokeWidth="1" transform="rotate(15 612 412)" />
        {/* Arc */}
        <path className="ls-shape" d="M 200 150 A 40 40 0 0 1 280 150" fill="none" stroke="#E8611A" strokeWidth="1.5" />
        {/* Triangle 2 */}
        <polygon className="ls-shape" points="700,850 740,920 660,920" fill="none" stroke="#E8611A" strokeWidth="1" />
        {/* Dashed line */}
        <line className="ls-shape" x1="350" y1="200" x2="500" y2="180" stroke="#E8611A" strokeWidth="1" strokeDasharray="4 4" />
        {/* Hexagon */}
        <polygon className="ls-shape" points="150,850 180,830 210,850 210,880 180,900 150,880" fill="none" stroke="#E8611A" strokeWidth="1" />
      </svg>

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
