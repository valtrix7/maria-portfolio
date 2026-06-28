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
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
        }
      : {
          ease: 'power1.inOut',
        };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);
  const container = useRef<HTMLDivElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    const trigger = pinWrapRef.current;
    if (!trigger) return;

    // Place cards in stack
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    // Build the swap sequence for each card
    // Each card needs to: drop down (y += 500), then move to back slot
    const swapAnimations = [];

    for (let s = 0; s < total; s++) {
      const frontIdx = s;
      const elFront = refs[frontIdx]?.current;
      if (!elFront) continue;

      // Calculate where this card ends up after all swaps ahead of it
      // Front card drops, others promote, front goes to back
      swapAnimations.push({
        el: elFront,
        dropY: 500,
        finalSlot: makeSlot(total - 1, cardDistance, verticalDistance, total),
      });
    }

    // Stagger offsets for each promotion step
    const promoSlots: { idx: number; slot: Slot }[] = [];
    for (let i = 0; i < total; i++) {
      promoSlots.push({
        idx: i,
        slot: makeSlot(i, cardDistance, verticalDistance, total),
      });
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger,
        start: 'top top',
        end: () => `+=${total * 600}`,
        pin: container.current,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const segLen = 1 / total;

          // For each card, figure out which "swap" it's in and where it should be
          refs.forEach((r, cardIdx) => {
            const el = r.current;
            if (!el) return;

            // Which swap cycle is this card's "turn" to be in front?
            // Card at index 0 is front at progress 0, card at index 1 at segLen, etc.
            const cardFrontStart = (cardIdx / total);
            const cardFrontEnd = ((cardIdx + 1) / total);

            if (progress < cardFrontStart) {
              // This card is still stacked behind, waiting its turn
              const waitSlot = makeSlot(cardIdx, cardDistance, verticalDistance, total);
              gsap.set(el, {
                x: waitSlot.x,
                y: waitSlot.y,
                z: waitSlot.z,
                zIndex: waitSlot.zIndex,
                xPercent: -50,
                yPercent: -50,
                skewY: skewAmount,
                transformOrigin: 'center center',
              });
            } else if (progress >= cardFrontStart && progress < cardFrontEnd) {
              // This card is the front card — it's dropping
              const dropProgress = (progress - cardFrontStart) / segLen;
              const dropY = gsap.utils.interpolate(0, 500, dropProgress);
              gsap.set(el, {
                y: dropY,
                xPercent: -50,
                yPercent: -50,
                skewY: skewAmount,
                zIndex: total,
              });
            } else {
              // This card has already dropped — it's at the back
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
        ref={container}
        className="svc-cardswap"
        style={{ width, height }}
      >
        {rendered}
      </div>
    </div>
  );
};

export default CardSwap;
