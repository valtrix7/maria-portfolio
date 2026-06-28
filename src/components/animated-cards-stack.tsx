import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Clamped linear remap — matches motion/react's useTransform default behavior.
function mapRange(iMin: number, iMax: number, oMin: number, oMax: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - iMin) / (iMax - iMin)));
  return oMin + t * (oMax - oMin);
}

const cardVariants = cva("absolute will-change-transform", {
  variants: {
    variant: {
      dark: [
        "flex size-full flex-col items-center justify-center gap-6",
        "rounded-2xl border border-white/8 bg-stone-900/80 p-6 backdrop-blur-md",
      ].join(" "),
      light: [
        "flex size-full flex-col items-center justify-center gap-6",
        "rounded-2xl border border-stone-200/50 bg-white/80 p-6 backdrop-blur-md",
      ].join(" "),
    },
  },
  defaultVariants: { variant: "dark" },
});

// ── Context ──────────────────────────────────────────────────────────────────

interface ContainerScrollCtx {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ContainerScrollContext = React.createContext<ContainerScrollCtx | null>(null);

function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext);
  if (!ctx) throw new Error("Card components must be nested inside <ContainerScroll>");
  return ctx;
}

// ── ContainerScroll ───────────────────────────────────────────────────────────

export const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, style, ...props }, forwardedRef) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <ContainerScrollContext.Provider value={{ containerRef }}>
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn("relative min-h-svh w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
});
ContainerScroll.displayName = "ContainerScroll";

// ── CardsContainer ────────────────────────────────────────────────────────────

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  style,
  ...props
}) => (
  <div
    className={cn("relative", className)}
    style={{ perspective: "1000px", ...style }}
    {...props}
  >
    {children}
  </div>
);
CardsContainer.displayName = "CardsContainer";

// ── CardTransformed ───────────────────────────────────────────────────────────

interface CardStickyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  arrayLength: number;
  index: number;
  incrementY?: number;
  incrementZ?: number;
  incrementRotation?: number;
}

export const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation,
      className,
      variant,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const { containerRef } = useContainerScrollContext();

    React.useEffect(() => {
      const card = cardRef.current;
      const trigger = containerRef.current;
      if (!card || !trigger) return;

      // Animation parameters (mirrors the original motion/react ranges).
      const initRot = incrementRotation ?? -index + 90;
      const start = index / (arrayLength + 1);
      const end = (index + 1) / (arrayLength + 1);
      const rotStart = start - 1.5;
      const rotEnd = end / 1.5;

      // Static positional styles (set once, never change).
      card.style.top = `${index * incrementY}px`;
      card.style.zIndex = String((arrayLength - index) * incrementZ);
      card.style.backfaceVisibility = "hidden";

      function applyTransform(progress: number) {
        const yPct = mapRange(start, end, 0, -180, progress);
        const rot = mapRange(rotStart, rotEnd, initRot, 0, progress);
        card!.style.transform = `translateZ(${index * incrementZ}px) translateY(${yPct}%) rotate(${rot}deg)`;

        if (variant !== "dark") {
          const dx = mapRange(rotStart, rotEnd, 4, 0, progress);
          const dy = mapRange(rotStart, rotEnd, 4, 12, progress);
          const blur = mapRange(rotStart, rotEnd, 2, 24, progress);
          const alpha = mapRange(rotStart, rotEnd, 0.15, 0.2, progress);
          card!.style.filter = `drop-shadow(${dx}px ${dy}px ${blur}px rgba(0,0,0,${alpha}))`;
        }
      }

      // Render the initial (progress = 0) state immediately so there's no flash.
      applyTransform(0);

      if (prefersReducedMotion()) {
        card.style.transform = `translateZ(${index * incrementZ}px) translateY(0%) rotate(0deg)`;
        return;
      }

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => applyTransform(self.progress),
        });
      });

      return () => ctx.revert();
      // Props are static for the lifetime of a card; run once on mount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn(cardVariants({ variant }), className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardTransformed.displayName = "CardTransformed";

// ── ReviewStars ───────────────────────────────────────────────────────────────

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
}

export const ReviewStars = React.forwardRef<HTMLDivElement, ReviewProps>(
  ({ rating, maxRating = 5, className, ...props }, ref) => {
    const filledStars = Math.floor(rating);
    const fractionalPart = rating - filledStars;
    const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0);

    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        <div className="flex items-center">
          {Array.from({ length: filledStars }, (_, i) => (
            <StarSvg key={`f-${i}`} />
          ))}
          {fractionalPart > 0 && <StarSvg partial={fractionalPart} />}
          {Array.from({ length: emptyStars }, (_, i) => (
            <StarSvg key={`e-${i}`} empty />
          ))}
        </div>
        <span className="sr-only">{rating} out of {maxRating}</span>
      </div>
    );
  }
);
ReviewStars.displayName = "ReviewStars";

function StarSvg({ empty, partial }: { empty?: boolean; partial?: number }) {
  const id = React.useId();
  return (
    <svg
      className={cn("size-4", empty ? "text-gray-600" : "text-inherit")}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      {partial !== undefined && (
        <defs>
          <linearGradient id={id}>
            <stop offset={`${partial * 100}%`} stopColor="currentColor" />
            <stop offset={`${partial * 100}%`} stopColor="rgb(75 85 99)" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={partial !== undefined ? `url(#${id})` : "currentColor"}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
      />
    </svg>
  );
}
