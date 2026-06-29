import React, { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
}) => (
  <div
    className={`scroll-stack-card relative w-full h-80 my-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.scroll-stack-card');

      cards.forEach((card, index) => {
        card.style.marginBottom = index < cards.length - 1 ? `${itemDistance}px` : '0';
        gsap.set(card, {
          transformOrigin: 'top center',
          force3D: true,
          zIndex: index + 1,
        });
      });

      if (prefersReducedMotion()) {
        gsap.set(cards, { clearProps: 'transform,filter' });
        return;
      }

      cards.forEach((card, index) => {
        const targetScale = Math.min(1, baseScale + index * itemScale);
        const targetY = index * itemStackDistance;
        const targetRotation = rotationAmount ? index * rotationAmount : 0;

        ScrollTrigger.create({
          trigger: card,
          start: `top ${stackPosition}`,
          endTrigger: '.scroll-stack-end',
          end: 'top center',
          pin: true,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(card, {
              y: targetY * progress,
              scale: 1 - (1 - targetScale) * progress,
              rotation: targetRotation * progress,
              filter: blurAmount ? `blur(${blurAmount * index * progress}px)` : '',
            });

            if (index === cards.length - 1 && progress > 0.98 && !completeRef.current) {
              completeRef.current = true;
              onStackComplete?.();
            } else if (index === cards.length - 1 && progress < 0.98) {
              completeRef.current = false;
            }
          },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [
    baseScale,
    blurAmount,
    itemDistance,
    itemScale,
    itemStackDistance,
    onStackComplete,
    rotationAmount,
    stackPosition,
  ]);

  return (
    <div className={`relative w-full overflow-x-visible ${className}`.trim()} ref={rootRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
