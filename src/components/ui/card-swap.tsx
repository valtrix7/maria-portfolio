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
  children: ReactNode;
  sectionRef: React.RefObject<HTMLElement | null>;
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

interface Slot { x: number; y: number; z: number; zIndex: number; }

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const setCard = (el: HTMLElement, opts: { x: number; y: number; z: number; zIndex: number; skew: number }) => {
  gsap.set(el, {
    x: opts.x, y: opts.y, z: opts.z,
    xPercent: -50, yPercent: -50,
    zIndex: opts.zIndex,
    skewY: opts.skew,
    transformOrigin: 'center center',
    force3D: true,
  });
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  skewAmount = 6,
  children,
  sectionRef,
}) => {
  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    // Place initial stack
    refs.forEach((r, i) => {
      if (!r.current) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, total);
      setCard(r.current, { ...slot, skew: skewAmount });
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${total * 800}`,
        pin: section,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const segLen = 1 / total;
          const currentSeg = Math.min(Math.floor(progress * total), total - 1);
          const segP = (progress - currentSeg * segLen) / segLen;

          // Visual order: after currentSeg rotations
          // order[0] = front (drops), order[total-1] = back (returns from drop)
          const order = Array.from({ length: total }, (_, i) => (i + currentSeg) % total);

          refs.forEach((r, cardIdx) => {
            const el = r.current;
            if (!el) return;

            const posInOrder = order.indexOf(cardIdx);

            if (posInOrder === 0) {
              // FRONT CARD: drops upward
              const y = -600 * segP;
              gsap.set(el, {
                x: 0, y, z: 0,
                xPercent: -50, yPercent: -50,
                zIndex: total + 1,
                skewY: skewAmount,
                transformOrigin: 'center center',
              });
            } else if (posInOrder < total - 1 || currentSeg === 0) {
              // PROMOTE: shift forward one slot
              const fromSlot = makeSlot(posInOrder, cardDistance, verticalDistance, total);
              const toSlot = makeSlot(posInOrder - 1, cardDistance, verticalDistance, total);
              gsap.set(el, {
                x: lerp(fromSlot.x, toSlot.x, segP),
                y: lerp(fromSlot.y, toSlot.y, segP),
                z: lerp(fromSlot.z, toSlot.z, segP),
                zIndex: Math.round(lerp(fromSlot.zIndex, toSlot.zIndex, segP)),
                xPercent: -50, yPercent: -50,
                skewY: skewAmount,
                transformOrigin: 'center center',
              });
            } else {
              // RETURN: last card comes back from y=-600 to slot total-2
              const toSlot = makeSlot(total - 2, cardDistance, verticalDistance, total);
              gsap.set(el, {
                x: lerp(0, toSlot.x, segP),
                y: lerp(-600, toSlot.y, segP),
                z: lerp(0, toSlot.z, segP),
                zIndex: Math.round(lerp(total + 1, toSlot.zIndex, segP)),
                xPercent: -50, yPercent: -50,
                skewY: skewAmount,
                transformOrigin: 'center center',
              });
            }
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [cardDistance, verticalDistance, skewAmount, refs.length, sectionRef]);

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
    <div className="svc-cardswap-pinwrap">
      <div ref={containerRef} className="svc-cardswap" style={{ width, height }}>
        {rendered}
      </div>
    </div>
  );
};

export default CardSwap;
