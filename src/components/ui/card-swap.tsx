import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
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

interface Slot { x: number; y: number; z: number; zIndex: number; }

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
  children,
  sectionRef,
}) => {
  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<React.RefObject<HTMLDivElement | null>[]>(
    () => Array.from({ length: childArr.length }, () => React.createRef<HTMLDivElement>()),
    [childArr.length]
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    const section = sectionRef.current;
    if (!section || total === 0 || prefersReducedMotion()) return;

    // Place cards in initial stack
    const cards = refs.map((r) => r.current).filter(Boolean) as HTMLElement[];
    if (cards.length !== total) return;

    cards.forEach((el, i) => {
      const slot = makeSlot(i, cardDistance, verticalDistance, total);
      gsap.set(el, {
        x: slot.x, y: slot.y, z: slot.z,
        xPercent: -50, yPercent: -50,
        zIndex: slot.zIndex,
        skewY: skewAmount,
        transformOrigin: 'center center',
        force3D: true,
      });
    });

    // Build timeline: one swap segment per card
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${total * 800}`,
        pin: section,
        scrub: 1.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    for (let s = 0; s < total; s++) {
      const segment = gsap.timeline();

      // The visual order at the START of this segment
      // order[0] = front (will drop)
      const order = Array.from({ length: total }, (_, i) => (i + s) % total);

      // Front card drops upward
      const frontEl = refs[order[0]].current;
      if (frontEl) {
        segment.to(frontEl, { y: -600, duration: 0.7, ease: 'power3.out' }, 0);
      }

      // Other cards promote forward one slot
      for (let p = 1; p < total; p++) {
        const el = refs[order[p]].current;
        if (!el) continue;
        const toSlot = makeSlot(p - 1, cardDistance, verticalDistance, total);
        segment.to(el, {
          x: toSlot.x, y: toSlot.y, z: toSlot.z,
          zIndex: toSlot.zIndex,
          duration: 0.6, ease: 'power3.out',
        }, 0);
      }

      // The dropped card returns to back of stack
      // At end of segment, snap it to the back slot
      segment.call(() => {
        if (frontEl) {
          const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
          gsap.set(frontEl, {
            x: backSlot.x, y: backSlot.y, z: backSlot.z,
            zIndex: backSlot.zIndex,
            xPercent: -50, yPercent: -50,
            skewY: skewAmount,
            transformOrigin: 'center center',
          });
        }
      });

      tl.add(segment, s * 0.5);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
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
