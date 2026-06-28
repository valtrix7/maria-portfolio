import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  skewAmount = 6,
  easing = 'elastic',
  children,
}) => {
  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    const trigger = pinWrapRef.current;
    if (!trigger || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Pin the section and scrub progress
      ScrollTrigger.create({
        trigger,
        start: 'top top',
        end: () => `+=${total * 700}`,
        pin: containerRef.current,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const segLen = 1 / total;

          refs.forEach((r, cardIdx) => {
            const el = r.current;
            if (!el) return;

            // When this card is the front card
            const frontStart = cardIdx * segLen;
            const frontEnd = (cardIdx + 1) * segLen;

            if (progress < frontStart) {
              // Waiting in stack
              const slot = makeSlot(cardIdx, cardDistance, verticalDistance, total);
              gsap.set(el, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                zIndex: slot.zIndex,
                xPercent: -50,
                yPercent: -50,
                skewY: skewAmount,
                transformOrigin: 'center center',
              });
            } else if (progress >= frontStart && progress < frontEnd) {
              // Dropping — front card
              const dropP = (progress - frontStart) / segLen;
              const dropY = dropP * 600;

              // Other cards promote forward
              refs.forEach((other, otherIdx) => {
                if (otherIdx === cardIdx || !other.current) return;
                const otherSlot = makeSlot(
                  otherIdx < cardIdx ? otherIdx : otherIdx - 1,
                  cardDistance,
                  verticalDistance,
                  total
                );
                gsap.set(other.current, {
                  x: otherSlot.x,
                  y: otherSlot.y,
                  z: otherSlot.z,
                  zIndex: otherSlot.zIndex,
                  xPercent: -50,
                  yPercent: -50,
                  skewY: skewAmount,
                  transformOrigin: 'center center',
                });
              });

              gsap.set(el, {
                y: dropY,
                xPercent: -50,
                yPercent: -50,
                skewY: skewAmount,
                zIndex: total + 1,
              });
            } else {
              // Already dropped — at the back
              const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
              gsap.set(el, {
                x: backSlot.x,
                y: backSlot.y,
                z: backSlot.z,
                zIndex: backSlot.zIndex,
                xPercent: -50,
                yPercent: -50,
                skewY: skewAmount,
                transformOrigin: 'center center',
              });
            }
          });
        },
      });
    });

    return () => ctx.revert();
  }, [cardDistance, verticalDistance, skewAmount, easing, refs.length]);

  // Place cards in initial stack
  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (!r.current) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, total);
      gsap.set(r.current, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        zIndex: slot.zIndex,
        xPercent: -50,
        yPercent: -50,
        skewY: skewAmount,
        transformOrigin: 'center center',
        force3D: true,
      });
    });
  }, [cardDistance, verticalDistance, skewAmount, refs.length]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div ref={pinWrapRef} className="svc-cardswap-pinwrap">
      <div
        ref={containerRef}
        className="svc-cardswap"
        style={{ width, height }}
      >
        {rendered}
      </div>
    </div>
  );
};

export default CardSwap;
