import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SectionDivider = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, scaleX: 0.3 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(el, { opacity: self.progress, scaleX: 0.3 + self.progress * 0.7 });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="section-divider"
      aria-hidden="true"
    />
  );
};

export default SectionDivider;
