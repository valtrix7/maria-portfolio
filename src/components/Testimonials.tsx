import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReviewStars } from './animated-cards-stack';
import './animated-cards-stack.css';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CEO, Urban Explorer',
    rating: 5,
    quote: 'Maria transformed our pitch deck into a visual masterpiece. The animations told our story better than words ever could.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'James Miller',
    role: 'Creative Director, Summit Finance',
    rating: 5,
    quote: 'Her motion design elevated our entire brand. Every frame feels intentional, every transition meaningful.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'Founder, Verde Sustainability',
    rating: 4.5,
    quote: 'Working with Maria was effortless. She understood our vision instantly and delivered beyond expectations.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Product Lead, TechFlow',
    rating: 5,
    quote: 'The quality of work and communication throughout the project was outstanding. She delivered exactly what we needed.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
];

const CARD_COUNT = TESTIMONIALS.length;

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const mobile = isMobile();
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.test-header > *',
        { y: mobile ? 30 : 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: mobile ? 0.7 : 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.test-header', start: 'top 80%' },
        }
      );

      const pin = pinRef.current;
      if (!pin) return;

      // Set initial card states
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, {
          y: 0,
          rotateX: i < CARD_COUNT - 1 ? 30 : 0,
          scale: 1,
          opacity: 1,
          zIndex: (i + 1) * 10,
          transformOrigin: 'center bottom',
        });
      });

      // Single pinned ScrollTrigger drives all cards
      ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: () => `+=${(CARD_COUNT - 1) * window.innerHeight}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const progress = self.progress;
          const segment = 1 / (CARD_COUNT - 1);

          cardRefs.current.forEach((card, i) => {
            if (!card) return;

            const isLast = i === CARD_COUNT - 1;

            if (isLast) {
              const scale = 1 + progress * 0.03;
              gsap.set(card, { scale });
            } else {
              const exitStart = i * segment;
              const exitEnd = (i + 1) * segment;

              if (progress < exitStart) {
                gsap.set(card, {
                  y: 0,
                  rotateX: 30,
                  opacity: 1,
                  zIndex: (i + 1) * 10,
                });
              } else if (progress < exitEnd) {
                const localProgress = (progress - exitStart) / segment;
                const y = gsap.utils.interpolate(0, -120, localProgress);
                const rotateX = gsap.utils.interpolate(30, -15, localProgress);
                const opacity = gsap.utils.interpolate(1, 0, localProgress);
                gsap.set(card, {
                  y: `${y}%`,
                  rotateX,
                  opacity,
                  zIndex: (CARD_COUNT - i) * 10,
                });
              } else {
                gsap.set(card, {
                  y: '-120%',
                  rotateX: -15,
                  opacity: 0,
                  zIndex: 0,
                });
              }
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="testimonials" id="testimonials" data-section="testimonials" ref={sectionRef}>
      <div className="container">
        <div className="test-header">
          <div className="label">Testimonials</div>
          <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '20px' }}>
            Kind words from<br />clients
          </h2>
          <p className="body-lg">
            What people say about working with me.
          </p>
        </div>
      </div>

      <div className="test-pin" ref={pinRef}>
        <div className="test-cards-container">
          {TESTIMONIALS.map((t, index) => (
            <div
              className="acs-card acs-card--dark test-card"
              key={t.id}
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <ReviewStars className="test-stars" rating={t.rating} />
              <blockquote className="test-quote">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="test-author">
                <img
                  className="test-avatar"
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                />
                <div className="test-author-info">
                  <span className="test-name">{t.name}</span>
                  <span className="test-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
