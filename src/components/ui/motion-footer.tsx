"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(232, 97, 26, 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(232, 97, 26, 0.8)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(232, 97, 26, 0.15) 0%,
    rgba(119, 119, 119, 0.15) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
  box-shadow:
      0 10px 30px -10px rgba(0,0,0,0.5),
      inset 0 1px 1px rgba(255,255,255,0.1),
      inset 0 -1px 2px rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
  border-color: rgba(255,255,255,0.2);
  box-shadow:
      0 20px 40px -10px rgba(0,0,0,0.7),
      inset 0 1px 1px rgba(255,255,255,0.2);
  color: #ededed;
}

.footer-giant-bg-text {
  font-size: clamp(5rem, min(20vw, 22vh), 18rem);
  line-height: 0.82;
  font-weight: 900;
  letter-spacing: -0.035em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.05);
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
  white-space: nowrap;
  transition:
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    -webkit-text-stroke-color 0.35s ease,
    filter 0.35s ease,
    background 0.35s ease;
}

.footer-text-glow {
  background: linear-gradient(180deg, #ededed 0%, rgba(255,255,255,0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(255,255,255,0.15));
}

.footer-giant-bg-text:hover {
  transform: translateX(-50%) scale(1.03);
  -webkit-text-stroke: 1px rgba(255,255,255,0.14);
  background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(232,97,26,0.12) 55%, transparent 88%);
  filter: drop-shadow(0 0 26px rgba(232,97,26,0.16));
}

.footer-giant-bg-text:active {
  transform: translateX(-50%) scale(1.015);
  -webkit-text-stroke: 1px rgba(255,255,255,0.18);
  filter: drop-shadow(0 0 20px rgba(232,97,26,0.18));
}

@media (max-width: 768px) {
  .footer-giant-bg-text {
    font-size: clamp(4.8rem, min(31vw, 16vh), 9rem);
    line-height: 0.9;
    letter-spacing: -0.025em;
  }

  .animate-footer-scroll-marquee {
    animation-duration: 26s;
  }
}

@media (max-width: 420px) {
  .footer-giant-bg-text {
    font-size: clamp(4.2rem, min(34vw, 14vh), 7.2rem);
    line-height: 0.95;
  }
}
`;

export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Motion Design</span> <span className="text-primary/60">&#10022;</span>
    <span>Brand Identity</span> <span className="text-secondary/60">&#10022;</span>
    <span>3D Animation</span> <span className="text-primary/60">&#10022;</span>
    <span>Visual Storytelling</span> <span className="text-secondary/60">&#10022;</span>
    <span>Creative Direction</span> <span className="text-primary/60">&#10022;</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between bg-background text-foreground">

          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute bottom-[clamp(8rem,18vh,14rem)] md:bottom-[clamp(6rem,12vh,10rem)] left-1/2 -translate-x-1/2 w-full text-center z-0 select-none px-4"
          >
            MARIA
          </div>

          {/* Marquee */}
          <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-white/5 bg-background/60 backdrop-blur-md py-4 z-10 md:-rotate-2 md:scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-secondary uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-8xl font-black footer-text-glow tracking-tighter mb-12 text-center"
            >
              Let&apos;s create together
            </h2>

            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton as="a" href="mailto:mariadesigns0408@gmail.com" className="footer-glass-pill px-10 py-5 rounded-full text-foreground font-bold text-sm md:text-base flex items-center gap-3 group">
                  <svg className="w-6 h-6 text-secondary group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Get in Touch
                </MagneticButton>

                <MagneticButton as="a" href="https://www.behance.net/mariaislam" target="_blank" rel="noopener noreferrer" className="footer-glass-pill px-10 py-5 rounded-full text-foreground font-bold text-sm md:text-base flex items-center gap-3 group">
                  <svg className="w-6 h-6 text-secondary group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.5 11c1.38 0 2.5-1.12 2.5-2.5S8.88 6 7.5 6H3v5h4.5zm0-3.5c.55 0 1 .45 1 1s-.45 1-1 1H5V7.5h2.5zm0 5H3v5h4.5c1.38 0 2.5-1.12 2.5-2.5S8.88 12 7.5 12zm0 3.5H5V13.5h2.5c.55 0 1 .45 1 1s-.45 1-1 1zM15 6c-2.49 0-4.5 2.01-4.5 4.5S12.51 15 15 15c1.77 0 3.31-1.02 4.05-2.5h-2.33c-.44.58-1.13 1-1.72 1-1.1 0-2-.9-2-2h6.5c.03-.25.05-.5.05-.75C21.05 8.01 18.49 6 15 6zm-2.45 3.5c.24-1.17 1.25-2 2.45-2s2.21.83 2.45 2h-4.9z"/>
                  </svg>
                  Behance
                </MagneticButton>
              </div>

              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                <MagneticButton as="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-glass-pill px-6 py-3 rounded-full text-secondary font-medium text-xs md:text-sm hover:text-foreground">
                  Instagram
                </MagneticButton>
                <MagneticButton as="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-glass-pill px-6 py-3 rounded-full text-secondary font-medium text-xs md:text-sm hover:text-foreground">
                  LinkedIn
                </MagneticButton>
                <MagneticButton as="a" href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="footer-glass-pill px-6 py-3 rounded-full text-secondary font-medium text-xs md:text-sm hover:text-foreground">
                  Dribbble
                </MagneticButton>
              </div>
            </div>
          </div>

          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex justify-center md:justify-end">
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-secondary hover:text-foreground group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}

