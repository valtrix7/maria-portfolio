import { useEffect, useRef } from 'react';

export default function useAnimationLoop(callback) {
  const rafRef = useRef(null);
  const callbackRef = useRef(callback);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);

  callbackRef.current = callback;

  useEffect(() => {
    const loop = (time) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 16.666 : 1;
      lastTimeRef.current = time;
      frameRef.current += 1;

      callbackRef.current({
        frame: frameRef.current,
        time,
        delta: Math.min(delta, 3),
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
}
