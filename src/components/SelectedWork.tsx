import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SelectedWork.css';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1400&h=800&fit=crop',
    category: 'Fiverr Service',
    title: 'Morph PPT',
    subtitle: 'Animated PowerPoint presentations with morph transitions for fast, polished storytelling.',
    year: 'From $15',
  },
  {
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400&h=800&fit=crop',
    category: 'Fiverr Service',
    title: 'Slide To Video',
    subtitle: 'PowerPoint decks converted into YouTube-ready videos with voiceover and music.',
    year: 'From $15',
  },
  {
    img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&h=800&fit=crop',
    category: 'Specialty',
    title: 'Pitch Decks',
    subtitle: 'Investor decks built around clear narrative structure, modern layouts, and presentation flow.',
    year: '3+ years',
  },
  {
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=800&fit=crop',
    category: 'Profile Signal',
    title: 'Client Trust',
    subtitle: '4.6 rating across 12 Fiverr reviews with 1-hour average response time and repeat clients.',
    year: '4.6 / 12',
  },
];

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const SelectedWork = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mobile = isMobile();
    const ctx = gsap.context(() => {
      gsap.fromTo('.work-header > *',
        { y: mobile ? 30 : 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: mobile ? 0.7 : 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.work-header', start: 'top 80%' }
        }
      );

      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const refreshOnAssetsReady = () => ScrollTrigger.refresh();
      const images = Array.from(track.querySelectorAll('img'));
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', refreshOnAssetsReady, { once: true });
          img.addEventListener('error', refreshOnAssetsReady, { once: true });
        }
      });

      if (mobile) {
        gsap.set(track, { x: 0 });

        const updateMobileProgress = () => {
          const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
          const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
          const rawIndex = maxScroll > 0 ? Math.round(progress * (slides.length - 1)) : 0;
          const index = Math.min(Math.max(rawIndex, 0), slides.length - 1);

          if (counterRef.current) counterRef.current.textContent = `0${index + 1}`;
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.max(progress, 0.08)})`;

          dotsRef.current.forEach((dot, i) => {
            if (!dot) return;
            dot.style.opacity = i === index ? '1' : '0.3';
            dot.style.width = i === index ? '24px' : '8px';
          });
        };

        gsap.utils.toArray<HTMLElement>('.h-slide').forEach((slide) => {
          const targets = slide.querySelectorAll('.h-slide-frame, .h-slide-info > *');
          gsap.fromTo(targets,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: slide,
                start: 'top 88%',
              }
            }
          );
        });

        track.addEventListener('scroll', updateMobileProgress, { passive: true });
        window.addEventListener('resize', updateMobileProgress);
        updateMobileProgress();

        return () => {
          track.removeEventListener('scroll', updateMobileProgress);
          window.removeEventListener('resize', updateMobileProgress);
          images.forEach((img) => {
            img.removeEventListener('load', refreshOnAssetsReady);
            img.removeEventListener('error', refreshOnAssetsReady);
          });
        };
      }
      if (mobile) return;

      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const idx = Math.min(Math.floor(progress * slides.length), slides.length - 1);
            if (counterRef.current) counterRef.current.textContent = `0${idx + 1}`;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
            dotsRef.current.forEach((dot, i) => {
              if (dot) {
                dot.style.opacity = i === idx ? '1' : '0.3';
                dot.style.width = i === idx ? '24px' : '8px';
              }
            });
          }
        }
      });

      const slideEls = gsap.utils.toArray<HTMLElement>('.h-slide');
      slideEls.forEach((slide, i) => {
        const img = slide.querySelector('.h-slide-img') as HTMLElement;
        const info = slide.querySelector('.h-slide-info') as HTMLElement;

        if (img) {
          gsap.fromTo(img,
            { scale: 1.2 },
            {
              scale: 1, ease: 'none',
              scrollTrigger: {
                trigger: wrapper,
                start: () => `top+=${(i / slides.length) * getScrollAmount()} top`,
                end: () => `top+=${((i + 1) / slides.length) * getScrollAmount()} top`,
                scrub: 2,
              }
            }
          );
        }

        if (info) {
          gsap.fromTo(info.children as unknown as HTMLElement[],
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: wrapper,
                start: () => `top+=${(i / slides.length) * getScrollAmount() + getScrollAmount() * 0.03} top`,
                end: () => `top+=${(i / slides.length) * getScrollAmount() + getScrollAmount() * 0.12} top`,
                scrub: 1,
              }
            }
          );
        }
      });

      return () => {
        images.forEach((img) => {
          img.removeEventListener('load', refreshOnAssetsReady);
          img.removeEventListener('error', refreshOnAssetsReady);
        });
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="selected-work" id="my-project" data-section="my-project" ref={sectionRef}>
      <div className="container work-header">
        <div className="label">My Project</div>
        <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '20px' }}>
          Fiverr<br />Work
        </h2>
        <p className="body-lg">
          Services and focus areas pulled from the live Fiverr profile for Maria Islam, centered on animated presentations and slideshow video delivery.
        </p>
        <a
          className="work-link"
          href="https://www.fiverr.com/mriajtt"
          target="_blank"
          rel="noreferrer"
        >
          View Fiverr profile
        </a>
      </div>

      <div className="h-wrapper" ref={wrapperRef}>
        <div className="h-hud">
          <div className="h-counter">
            <span ref={counterRef}>01</span>
            <span className="h-counter-sep">/</span>
            <span className="h-counter-total">0{slides.length}</span>
          </div>
          <div className="h-progress">
            <div className="h-progress-fill" ref={progressRef}></div>
          </div>
          <div className="h-dots">
            {slides.map((_, i) => (
              <div className="h-dot" key={i} ref={(el) => { dotsRef.current[i] = el; }}></div>
            ))}
          </div>
        </div>

        <div className="h-track" ref={trackRef}>
          {slides.map((slide, i) => (
            <div className="h-slide" key={i}>
              <div className="h-slide-frame">
                <img className="h-slide-img" src={slide.img} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
              <div className="h-slide-info">
                <span className="h-slide-category">{slide.category}</span>
                <h3 className="h-slide-title">{slide.title}</h3>
                <p className="h-slide-subtitle">{slide.subtitle}</p>
                <span className="h-slide-year">{slide.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
