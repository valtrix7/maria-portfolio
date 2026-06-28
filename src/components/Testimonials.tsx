import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from './animated-cards-stack';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Sarah Chen',
    initials: 'SC',
    profession: 'CEO, Urban Explorer',
    rating: 5,
    description:
      'Maria transformed our pitch deck into a visual masterpiece. The animations told our story better than words ever could.',
  },
  {
    id: 't2',
    name: 'James Miller',
    initials: 'JM',
    profession: 'Creative Director, Summit Finance',
    rating: 5,
    description:
      'Her motion design elevated our entire brand. Every frame feels intentional, every transition deeply meaningful.',
  },
  {
    id: 't3',
    name: 'Aisha Patel',
    initials: 'AP',
    profession: 'Founder, Verde Sustainability',
    rating: 4.5,
    description:
      'Working with Maria was effortless. She understood our vision instantly and delivered results far beyond expectations.',
  },
  {
    id: 't4',
    name: 'Marcus Webb',
    initials: 'MW',
    profession: 'Product Lead, Velocity Labs',
    rating: 5,
    description:
      'The quality of craft and communication throughout the project was outstanding. She is the rare designer who makes complex feel simple.',
  },
];

const Testimonials: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonials-header > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%' },
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="testimonials"
      id="testimonials"
      data-section="testimonials"
    >
      <ContainerScroll className="testimonials-scroll">
        <div className="testimonials-sticky">
          <div className="testimonials-header" ref={headerRef}>
            <div className="label">Client Love</div>
            <h2 className="testimonials-title">
              What they say
            </h2>
          </div>

          <CardsContainer className="testimonials-cards">
            {TESTIMONIALS.map((t, i) => (
              <CardTransformed
                key={t.id}
                arrayLength={TESTIMONIALS.length}
                index={i + 2}
                variant="dark"
                role="article"
                aria-label={`Testimonial from ${t.name}`}
              >
                <ReviewStars
                  className="testimonials-stars"
                  rating={t.rating}
                />
                <blockquote className="testimonials-quote">
                  "{t.description}"
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
        </div>
      </ContainerScroll>
    </section>
  );
};

export default Testimonials;
