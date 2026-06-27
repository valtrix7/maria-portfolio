import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useSpring } from 'motion/react';

const DESKTOP_POINTER_QUERY = '(any-hover: hover) and (any-pointer: fine)';

function isTrackablePointer(pointerType: string) {
  return pointerType !== 'touch';
}

function CursorSVG() {
  return (
    <svg width="40" height="44" viewBox="0 0 50 54" fill="none" style={{ scale: 0.5 }}>
      <g filter="url(#cursor-shadow)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="#E8611A"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth="2.25825"
        />
      </g>
      <defs>
        <filter id="cursor-shadow" x="0.602" y="0.952" width="49.058" height="52.428" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="2.25825" />
          <feGaussianBlur stdDeviation="2.25825" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

interface SmoothCursorProps {
  cursor?: ReactNode;
}

export default function SmoothCursor({ cursor = <CursorSVG /> }: SmoothCursorProps) {
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 45, stiffness: 400, mass: 1, restDelta: 0.001 };

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, { ...springConfig, damping: 60, stiffness: 300 });
  const scale = useSpring(1, { ...springConfig, stiffness: 500, damping: 35 });

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_POINTER_QUERY);
    const update = () => setIsEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;
    let rafId = 0;

    const updateVelocity = (pos: { x: number; y: number }) => {
      const now = Date.now();
      const dt = now - lastUpdateTime.current;
      if (dt > 0) {
        velocity.current = {
          x: (pos.x - lastMousePos.current.x) / dt,
          y: (pos.y - lastMousePos.current.y) / dt,
        };
      }
      lastUpdateTime.current = now;
      lastMousePos.current = pos;
    };

    const onMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) return;
      setIsVisible(true);

      const pos = { x: e.clientX, y: e.clientY };
      updateVelocity(pos);

      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);

      cursorX.set(pos.x);
      cursorY.set(pos.y);

      if (speed > 0.1) {
        const angle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) + 90;
        let diff = angle - previousAngle.current;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        accumulatedRotation.current += diff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = angle;

        scale.set(0.95);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => scale.set(1), 150);
      }
    };

    const throttled = (e: PointerEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        onMove(e);
        rafId = 0;
      });
    };

    document.body.style.cursor = 'none';
    window.addEventListener('pointermove', throttled, { passive: true });

    return () => {
      window.removeEventListener('pointermove', throttled);
      document.body.style.cursor = 'auto';
      if (rafId) cancelAnimationFrame(rafId);
      if (timeout) clearTimeout(timeout);
    };
  }, [cursorX, cursorY, rotation, scale, isEnabled]);

  if (!isEnabled) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: cursorX,
        top: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        rotate: rotation,
        scale,
        zIndex: 10002,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      {cursor}
    </motion.div>
  );
}
