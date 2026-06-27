import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CinematicIntro.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COUNT = [3, 2, 1];

const CinematicIntro = ({ onComplete }) => {
  const rootRef = useRef(null);
  const sweepRef = useRef(null);
  const numberRef = useRef(null);
  const flashRef = useRef(null);
  const leaderRef = useRef(null);
  const titleRef = useRef(null);
  const reelRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const root = rootRef.current;
    if (!root) return;

    // Lock scroll while the leader plays.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let masterTl;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      document.body.style.overflow = prevOverflow;
      onComplete?.();
    };

    const ctx = gsap.context(() => {
      // ---- Reduced motion: quick fade, no countdown ----
      if (reduce) {
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.4,
          delay: 0.2,
          ease: 'power2.out',
          onComplete: finish,
        });
        return;
      }

      const numEl = numberRef.current;

      const setNumber = (n) => {
        if (numEl) numEl.textContent = String(n);
      };

      masterTl = gsap.timeline();

      // Reel fades in with a film flicker.
      masterTl
        .set(reelRef.current, { opacity: 0 })
        .to(reelRef.current, { opacity: 1, duration: 0.25, ease: 'power1.in' })
        .fromTo(
          leaderRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
          '<'
        );

      // Per-second countdown: each number gets a full sweep rotation,
      // a punch-in, a frame jitter, and a white flash on the tick.
      COUNT.forEach((n, i) => {
        const label = `c${i}`;
        masterTl.add(label);

        masterTl.call(setNumber, [n], label);

        // Sweep hand makes one full rotation across the second.
        masterTl.fromTo(
          sweepRef.current,
          { rotation: 0, svgOrigin: '100 100' },
          { rotation: 360, svgOrigin: '100 100', duration: 0.9, ease: 'none' },
          label
        );

        // Number punches in then settles.
        masterTl.fromTo(
          numEl,
          { scale: 1.6, opacity: 0, filter: 'blur(8px)' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' },
          label
        );

        // Tick flash near the end of each second.
        masterTl.fromTo(
          flashRef.current,
          { opacity: 0 },
          { opacity: 0.5, duration: 0.06, ease: 'power1.in' },
          label + '+=0.82'
        );
        masterTl.to(flashRef.current, { opacity: 0, duration: 0.18, ease: 'power2.out' });

        // Subtle frame jitter on the whole reel at the tick.
        masterTl.fromTo(
          reelRef.current,
          { x: 0, y: 0 },
          {
            x: 'random(-6, 6)',
            y: 'random(-4, 4)',
            duration: 0.05,
            repeat: 3,
            yoyo: true,
            ease: 'none',
          },
          label + '+=0.8'
        );
        masterTl.set(reelRef.current, { x: 0, y: 0 });
      });

      // ---- Title card ----
      masterTl.add('title', '+=0.05');
      masterTl.to(leaderRef.current, { opacity: 0, scale: 1.1, duration: 0.5, ease: 'power2.in' }, 'title');
      masterTl.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        'title+=0.25'
      );
      masterTl.to(titleRef.current, { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.9');

      // ---- Iris reveal out ----
      masterTl.to(
        root,
        {
          clipPath: 'circle(0% at 50% 50%)',
          duration: 1.0,
          ease: 'power3.inOut',
          onComplete: finish,
        },
        '-=0.1'
      );
    }, rootRef);

    // Allow skipping at any time.
    const skip = () => {
      if (doneRef.current) return;
      if (masterTl) masterTl.kill();
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: finish,
      });
    };

    root.addEventListener('click', skip);
    window.addEventListener('keydown', skip);

    return () => {
      root.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div className="ci-root" ref={rootRef} role="presentation">
      <div className="ci-grain" />

      <div className="ci-reel" ref={reelRef}>
        {/* SMPTE / Academy leader */}
        <div className="ci-leader" ref={leaderRef}>
          <svg className="ci-leader-svg" viewBox="0 0 200 200" aria-hidden="true">
            <circle className="ci-ring ci-ring--outer" cx="100" cy="100" r="94" />
            <circle className="ci-ring ci-ring--inner" cx="100" cy="100" r="70" />
            {/* crosshair */}
            <line className="ci-cross" x1="100" y1="6" x2="100" y2="194" />
            <line className="ci-cross" x1="6" y1="100" x2="194" y2="100" />
            {/* sweep hand wedge */}
            <g ref={sweepRef} style={{ transformOrigin: '100px 100px' }}>
              <path className="ci-sweep" d="M100 100 L100 8 A92 92 0 0 1 158 38 Z" />
            </g>
          </svg>
          <span className="ci-number" ref={numberRef}>3</span>
        </div>

        {/* Title card */}
        <div className="ci-title" ref={titleRef}>
          <span className="ci-title-kicker">A FILM BY</span>
          <span className="ci-title-name">MARIA ISLAM</span>
          <span className="ci-title-sub">MOTION · DESIGN · ANIMATION</span>
        </div>
      </div>

      <div className="ci-flash" ref={flashRef} />

      <button className="ci-skip" type="button" aria-label="Skip intro">
        SKIP INTRO →
      </button>
    </div>
  );
};

export default CinematicIntro;
