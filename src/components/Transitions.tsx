import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  stagger?: number;
  split?: 'chars' | 'words';
}

interface ImageRevealProps {
  src: string;
  alt?: string;
  className?: string;
}

interface LineRevealProps {
  className?: string;
}

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

/* Clip-path curtain reveal for any section */
export const SectionReveal: React.FC<SectionRevealProps> = ({ children, direction = 'up', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = direction === 'up'
      ? 'inset(100% 0 0 0)'
      : direction === 'down'
        ? 'inset(0 0 100% 0)'
        : direction === 'left'
          ? 'inset(0 100% 0 0)'
          : 'inset(0 0 0 100%)';

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { clipPath: from },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          delay,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, [direction, delay]);

  return <div ref={ref}>{children}</div>;
};

/* Text split reveal with character animation */
export const TextReveal: React.FC<TextRevealProps> = ({ children, className = '', as: Tag = 'div', delay = 0, stagger = 0.03, split = 'chars' }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (split === 'words') {
        const text = el.textContent;
        el.innerHTML = '';
        text?.split(' ').forEach((word, i, arr) => {
          const span = document.createElement('span');
          span.style.display = 'inline-block';
          span.style.overflow = 'hidden';
          span.style.verticalAlign = 'top';
          const inner = document.createElement('span');
          inner.className = 'reveal-inner';
          inner.textContent = word;
          inner.style.display = 'inline-block';
          inner.style.transform = 'translateY(110%)';
          span.appendChild(inner);
          el.appendChild(span);
          if (i < arr.length - 1) {
            el.appendChild(document.createTextNode(' '));
          }
        });

        gsap.to(el.querySelectorAll('.reveal-inner'), {
          y: '0%',
          duration: 1,
          stagger,
          delay,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });
      } else {
        const text = el.textContent;
        el.innerHTML = '';
        text?.split('').forEach((char) => {
          const span = document.createElement('span');
          span.style.display = 'inline-block';
          span.style.overflow = 'hidden';
          const inner = document.createElement('span');
          inner.className = 'reveal-inner';
          inner.textContent = char === ' ' ? '\u00A0' : char;
          inner.style.display = 'inline-block';
          inner.style.transform = 'translateY(110%)';
          span.appendChild(inner);
          el.appendChild(span);
        });

        gsap.to(el.querySelectorAll('.reveal-inner'), {
          y: '0%',
          duration: 1,
          stagger,
          delay,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });
      }
    });

    return () => ctx.revert();
  }, [delay, stagger, split]);

  return <Tag ref={ref} className={className}>{children}</Tag>;
};

/* Image reveal with scale + clip-path */
export const ImageReveal: React.FC<ImageRevealProps> = ({ src, alt = '', className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelector('.img-reveal-mask'),
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: el, start: 'top 75%' }
        }
      );

      gsap.fromTo(el.querySelector('.img-reveal-img'),
        { scale: 1.3 },
        {
          scale: 1,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%' }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`img-reveal ${className}`}>
      <div className="img-reveal-mask">
        <img className="img-reveal-img" src={src} alt={alt} />
      </div>
    </div>
  );
};

/* Horizontal line reveal */
export const LineReveal: React.FC<LineRevealProps> = ({ className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: ref.current, start: 'top 90%' }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={`line-reveal ${className}`}></div>;
};

/* Fade up with scale */
export const FadeUp: React.FC<FadeUpProps> = ({ children, className = '', delay = 0, duration = 1, stagger = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el.children,
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration, stagger, delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        }
      );
    });

    return () => ctx.revert();
  }, [delay, duration, stagger]);

  return <div ref={ref} className={className}>{children}</div>;
};
