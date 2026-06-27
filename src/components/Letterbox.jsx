import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Letterbox.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Letterbox = ({ active }) => {
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const bars = [topRef.current, bottomRef.current].filter(Boolean);
    if (!bars.length) return;

    if (prefersReducedMotion()) {
      gsap.set(bars, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.9, ease: 'power4.inOut', stagger: 0.05 }
      );
    });
    return () => ctx.revert();
  }, [active]);

  return (
    <div className="letterbox" aria-hidden="true">
      <div className="letterbox-bar letterbox-bar--top" ref={topRef} />
      <div className="letterbox-bar letterbox-bar--bottom" ref={bottomRef} />
    </div>
  );
};

export default Letterbox;
