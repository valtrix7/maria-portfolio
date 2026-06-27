import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useAnimationLoop from '../hooks/useAnimationLoop';
import './ViewfinderHUD.css';

const pad = (n) => String(n).padStart(2, '0');

const ViewfinderHUD = ({ active }) => {
  const rootRef = useRef(null);
  const tcRef = useRef(null);
  const startRef = useRef(null);

  // Fade the whole overlay in once the intro has handed off.
  useEffect(() => {
    if (!active || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, [active]);

  // Live SMPTE timecode (HH:MM:SS:FF at a 24fps cadence), written
  // straight to the DOM node — no per-frame React re-render.
  useAnimationLoop(({ time }) => {
    const node = tcRef.current;
    if (!node) return;
    if (startRef.current == null) startRef.current = time;

    const ms = time - startRef.current;
    const totalSeconds = Math.floor(ms / 1000);
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;
    const ff = Math.floor(((ms % 1000) / 1000) * 24);

    node.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
  });

  return (
    <div className="vf" ref={rootRef} aria-hidden="true">
      {/* Corner viewfinder brackets */}
      <span className="vf-corner vf-corner--tl" />
      <span className="vf-corner vf-corner--tr" />
      <span className="vf-corner vf-corner--bl" />
      <span className="vf-corner vf-corner--br" />

      {/* REC + timecode */}
      <div className="vf-rec">
        <span className="vf-rec-dot" />
        <span className="vf-rec-label">REC</span>
        <span className="vf-tc" ref={tcRef}>00:00:00:00</span>
      </div>

      {/* Camera readout */}
      <div className="vf-readout">
        MARIA ISLAM <span className="vf-readout-sep">·</span> 24 FPS{' '}
        <span className="vf-readout-sep">·</span> ISO 400
      </div>
    </div>
  );
};

export default ViewfinderHUD;
