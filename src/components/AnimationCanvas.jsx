import { useRef, useEffect } from 'react';
import useAnimationLoop from '../hooks/useAnimationLoop';

const TRAIL_LENGTH = 20;
const GRAIN_COUNT = 1500;
const ORB_COUNT = 3;

const SECTION_COLORS = {
  hero: { r: 232, g: 97, b: 26 },
  'frame-sequence': { r: 232, g: 97, b: 26 },
  about: { r: 177, g: 108, b: 234 },
  'creative-manifesto': { r: 255, g: 94, b: 105 },
  'selected-work': { r: 232, g: 97, b: 26 },
  gallery: { r: 177, g: 108, b: 234 },
  'how-i-work': { r: 255, g: 168, b: 75 },
  toolbox: { r: 177, g: 108, b: 234 },
  recognition: { r: 255, g: 94, b: 105 },
  contact: { r: 232, g: 97, b: 26 },
};

const DEFAULT_COLOR = { r: 232, g: 97, b: 26 };

const ORB_CONFIGS = [
  { baseR: 177, baseG: 108, baseB: 234, speed: 0.003, driftX: 0.7, driftY: 0.3, radius: 500, opacity: 0.1 },
  { baseR: 255, baseG: 94, baseB: 105, speed: 0.004, driftX: 0.3, driftY: 0.7, radius: 450, opacity: 0.08 },
  { baseR: 255, baseG: 168, baseB: 75, speed: 0.0025, driftX: 0.5, driftY: 0.5, radius: 400, opacity: 0.12 },
];

export default function AnimationCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dprRef = useRef(1);
  const sizeRef = useRef({ w: 0, h: 0 });

  const trailRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });

  const orbStateRef = useRef(
    ORB_CONFIGS.map((c) => ({
      x: 0,
      y: 0,
      r: c.baseR,
      g: c.baseG,
      b: c.baseB,
      targetR: c.baseR,
      targetG: c.baseG,
      targetB: c.baseB,
    }))
  );

  const activeSectionRef = useRef('hero');
  const sectionColorRef = useRef({ ...DEFAULT_COLOR });
  const targetColorRef = useRef({ ...DEFAULT_COLOR });

  const grainPreRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    dprRef.current = window.devicePixelRatio || 1;

    const resize = () => {
      const dpr = dprRef.current;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      sizeRef.current = { w: canvas.width, h: canvas.height };
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX * dprRef.current;
      mouseRef.current.y = e.clientY * dprRef.current;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const grainPositions = new Float32Array(GRAIN_COUNT * 2);
    for (let i = 0; i < GRAIN_COUNT; i++) {
      grainPositions[i * 2] = Math.random();
      grainPositions[i * 2 + 1] = Math.random();
    }
    grainPreRef.current = grainPositions;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute('data-section');
            if (section && SECTION_COLORS[section]) {
              activeSectionRef.current = section;
              const c = SECTION_COLORS[section];
              targetColorRef.current = { r: c.r, g: c.g, b: c.b };
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  useAnimationLoop(({ frame }) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { w, h } = sizeRef.current;
    const dpr = dprRef.current;

    ctx.clearRect(0, 0, w, h);

    // ——— Layer 1: Film Grain ———
    const grainPositions = grainPreRef.current;
    if (grainPositions) {
      ctx.save();
      for (let i = 0; i < GRAIN_COUNT; i++) {
        const x = grainPositions[i * 2] * w;
        const y = grainPositions[i * 2 + 1] * h;
        const opacity = 0.02 + Math.random() * 0.04;
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // ——— Layer 2: Ambient Gradient Orbs ———
    const orbStates = orbStateRef.current;
    const sc = sectionColorRef.current;
    const tc = targetColorRef.current;

    sc.r += (tc.r - sc.r) * 0.02;
    sc.g += (tc.g - sc.g) * 0.02;
    sc.b += (tc.b - sc.b) * 0.02;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < ORB_COUNT; i++) {
      const cfg = ORB_CONFIGS[i];
      const state = orbStates[i];

      const phase = frame * cfg.speed;
      const ox = Math.sin(phase) * cfg.driftX * w * 0.3 + w * 0.5;
      const oy = Math.cos(phase * 0.8) * cfg.driftY * h * 0.3 + h * 0.5;

      state.x += (ox - state.x) * 0.01;
      state.y += (oy - state.y) * 0.01;

      const mix = 0.6 + i * 0.15;
      state.r += (cfg.baseR * (1 - mix) + sc.r * mix - state.r) * 0.02;
      state.g += (cfg.baseG * (1 - mix) + sc.g * mix - state.g) * 0.02;
      state.b += (cfg.baseB * (1 - mix) + sc.b * mix - state.b) * 0.02;

      const gradient = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, cfg.radius * dpr);
      gradient.addColorStop(0, `rgba(${Math.round(state.r)},${Math.round(state.g)},${Math.round(state.b)},${cfg.opacity})`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(state.x - cfg.radius * dpr, state.y - cfg.radius * dpr, cfg.radius * 2 * dpr, cfg.radius * 2 * dpr);
    }
    ctx.restore();

    // ——— Layer 3: Cursor Trail ———
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const trail = trailRef.current;

    if (mx > 0 && my > 0) {
      trail.push({ x: mx, y: my });
      if (trail.length > TRAIL_LENGTH) trail.shift();
    }

    if (trail.length > 1) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        const progress = i / trail.length;
        const alpha = progress * 0.3;
        const radius = (2 + progress * 4) * dpr;

        const cr = Math.round(sc.r * progress + 255 * (1 - progress));
        const cg = Math.round(sc.g * progress + 255 * (1 - progress));
        const cb = Math.round(sc.b * progress + 255 * (1 - progress));

        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
