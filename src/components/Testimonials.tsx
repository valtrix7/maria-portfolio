import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from './animated-cards-stack';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const BLOBS = [
  'M250,68 C348,68 432,152 432,250 C432,348 348,432 250,432 C152,432 68,348 68,250 C68,152 152,68 250,68 Z',
  'M205,62 C325,40 452,128 448,244 C444,360 344,455 218,450 C92,445 46,352 54,233 C62,114 85,84 205,62 Z',
  'M148,118 C272,54 412,78 452,196 C492,314 422,422 278,440 C134,458 38,378 52,260 C66,142 24,182 148,118 Z',
  'M258,44 C362,44 438,118 442,226 C446,334 392,444 256,450 C120,456 56,380 66,270 C76,160 154,44 258,44 Z',
  'M250,72 C306,28 414,88 436,196 C458,304 418,426 306,446 C194,466 70,422 62,308 C54,194 86,32 250,72 Z',
  'M295,62 C418,82 456,168 448,270 C440,372 360,458 232,452 C104,446 44,360 60,250 C76,140 172,42 295,62 Z',
];

const MORPH_CFG = [
  { cx: 0.26, cy: 0.4, sf: 0.8, alpha: 0.13, seq: [0, 1, 2, 0], dur: 5 },
  { cx: 0.74, cy: 0.6, sf: 0.7, alpha: 0.1, seq: [3, 4, 5, 3], dur: 7 },
  { cx: 0.52, cy: 0.5, sf: 0.58, alpha: 0.07, seq: [1, 4, 2, 5, 1], dur: 9.5 },
] as const;

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#&';

function scrambleEl(el: HTMLElement, text: string, delay = 0) {
  const obj = { p: 0 };
  gsap.to(obj, {
    p: 1,
    duration: text.replace(/ /g, '').length * 0.055 + 0.4,
    delay,
    ease: 'none',
    onUpdate() {
      const settled = Math.floor(obj.p * text.length);
      el.textContent = text
        .split('')
        .map((c, i) => {
          if (c === ' ') return ' ';
          if (i < settled) return c;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');
    },
    onComplete() {
      el.textContent = text;
    },
  });
}

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'zaniquep',
    initials: 'ZA',
    profession: 'South Africa',
    rating: 4.3,
    description:
      'Maria did an amazing job on my project. She demonstrated strong creative expertise, and the level of creativity and effort she put into the work was truly impressive.',
  },
  {
    id: 't2',
    name: 'm_m004',
    initials: 'AE',
    profession: 'United Arab Emirates',
    rating: 5,
    description:
      'She was great and she make everything that I want even when I ask her multiple time.',
  },
  {
    id: 't3',
    name: 'vincentc754',
    initials: 'PH',
    profession: 'Philippines',
    rating: 5,
    description:
      'Content is well executed, professional communication, very creative and punctual.',
  },
  {
    id: 't4',
    name: 'mohamedhafez554',
    initials: 'AE',
    profession: 'United Arab Emirates',
    rating: 5,
    description:
      'Amazing as usual and very professional.',
  },
];

const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  const n = TESTIMONIALS.length;
  const cardEnds = Array.from({ length: n }, (_, i) => (i + 3) / (n + 1));

  function getActiveIdx(p: number) {
    let idx = 0;
    for (let i = 0; i < n; i++) if (p >= cardEnds[i]) idx = i + 1;
    return Math.min(idx, n - 1);
  }

  function updateHUD(p: number) {
    const active = getActiveIdx(p);
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      dot.style.background = i <= active ? 'var(--accent)' : 'rgba(255,255,255,0.18)';
      dot.style.transform = i === active ? 'scale(1.5)' : 'scale(1)';
      dot.style.opacity = i < active ? '0.5' : '1';
    });
    if (counterRef.current) {
      counterRef.current.textContent = String(active + 1).padStart(2, '0');
    }
  }

  useEffect(() => {
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { opacity: 0, y: 20 });
      gsap.set('.testimonials-label-el', { opacity: 0, y: 12 });

      ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 80%',
        once: true,
        onEnter() {
          gsap.to('.testimonials-label-el', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.01,
            onComplete() {
              if (!reduce && titleRef.current) {
                scrambleEl(titleRef.current, 'Fiverr reviews');
              } else if (titleRef.current) {
                titleRef.current.textContent = 'Fiverr reviews';
              }
            },
          });
        },
      });

      gsap.set('.testimonials-hud', { opacity: 0, y: 10 });
      ScrollTrigger.create({
        trigger: scrollRef.current,
        start: 'top center',
        once: true,
        onEnter() {
          gsap.to('.testimonials-hud', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
          updateHUD(0);
        },
      });

      if (!reduce) {
        ScrollTrigger.create({
          trigger: scrollRef.current,
          start: 'top center',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => updateHUD(self.progress),
        });
      }
    });

    const canvas = canvasRef.current;
    let morphCtx: gsap.Context | null = null;
    let ro: ResizeObserver | null = null;
    let drawFn: (() => void) | null = null;

    if (canvas && !reduce) {
      const c = canvas.getContext('2d');
      if (!c) {
        return () => ctx.revert();
      }

      const resize = () => {
        const parent = canvas.parentElement;
        const w = canvas.offsetWidth || parent?.offsetWidth || window.innerWidth;
        const h = canvas.offsetHeight || parent?.offsetHeight || window.innerHeight;
        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
        }
      };

      requestAnimationFrame(() => {
        resize();
        ro = new ResizeObserver(resize);
        ro.observe(canvas);
        if (canvas.parentElement) ro.observe(canvas.parentElement);
      });

      const svgNS = 'http://www.w3.org/2000/svg';
      const pathEls = MORPH_CFG.map((cfg) => {
        const el = document.createElementNS(svgNS, 'path') as SVGPathElement;
        el.setAttribute('d', BLOBS[cfg.seq[0]]);
        return el;
      });

      drawFn = () => {
        const W = canvas.width;
        const H = canvas.height;
        if (W === 0 || H === 0) return;
        c.clearRect(0, 0, W, H);

        MORPH_CFG.forEach((cfg, i) => {
          const d = pathEls[i].getAttribute('d');
          if (!d) return;

          const sx = cfg.cx * W;
          const sy = cfg.cy * H;
          const s = (cfg.sf * Math.min(W, H)) / 500;

          c.save();
          c.filter = `blur(${Math.round(60 * s)}px)`;
          c.fillStyle = `rgba(232,97,26,${cfg.alpha})`;
          c.translate(sx - 250 * s, sy - 250 * s);
          c.scale(s, s);
          c.fill(new Path2D(d));
          c.restore();
        });
      };

      morphCtx = gsap.context(() => {
        MORPH_CFG.forEach((cfg, i) => {
          const tl = gsap.timeline({ repeat: -1 });
          cfg.seq.forEach((blobIdx) => {
            tl.to(pathEls[i], {
              morphSVG: BLOBS[blobIdx],
              duration: cfg.dur,
              ease: 'sine.inOut',
            });
          });
        });
      });

      gsap.ticker.add(drawFn);
    }

    return () => {
      ctx.revert();
      if (drawFn) gsap.ticker.remove(drawFn);
      if (morphCtx) morphCtx.revert();
      if (ro) ro.disconnect();
    };
    // updateHUD only reads stable refs and derived constants for this mount lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className="testimonials"
      id="testimonials"
      data-section="testimonials"
    >
      <ContainerScroll ref={scrollRef} className="testimonials-scroll">
        <div className="testimonials-sticky">
          <canvas
            ref={canvasRef}
            className="testimonials-canvas"
            aria-hidden="true"
          />

          <div className="testimonials-header">
            <div className="label testimonials-label-el">Client Love</div>
            <h2 className="testimonials-title" ref={titleRef}>
              Fiverr reviews
            </h2>
            <p className="testimonials-summary">
              12 reviews, 4.6 overall rating, and a 4.7 value-of-delivery score pulled from the public Fiverr profile.
            </p>
          </div>

          <CardsContainer className="testimonials-cards">
            {TESTIMONIALS.map((t, i) => (
              <CardTransformed
                key={t.id}
                arrayLength={n}
                index={i + 2}
                variant="dark"
                role="article"
                aria-label={`Testimonial from ${t.name}`}
              >
                <ReviewStars className="testimonials-stars" rating={t.rating} />
                <blockquote className="testimonials-quote">
                  &quot;{t.description}&quot;
                </blockquote>
                <div className="testimonials-author">
                  <div className="testimonials-avatar" aria-hidden="true">
                    {t.initials}
                  </div>
                  <div>
                    <span className="testimonials-name">{t.name}</span>
                    <span className="testimonials-role">{t.profession}</span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>

          <div className="testimonials-hud" aria-hidden="true">
            <div className="testimonials-hud-dots">
              {TESTIMONIALS.map((_, i) => (
                <span
                  key={i}
                  className="testimonials-hud-dot"
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                />
              ))}
            </div>
            <div className="testimonials-hud-counter">
              <span ref={counterRef}>01</span>
              <span className="testimonials-hud-sep">
                {' / '}
                {String(n).padStart(2, '0')}
              </span>
            </div>
          </div>

          <a
            className="testimonials-link"
            href="https://www.fiverr.com/mriajtt"
            target="_blank"
            rel="noreferrer"
          >
            Read on Fiverr
          </a>
        </div>
      </ContainerScroll>
    </section>
  );
};

export default Testimonials;

