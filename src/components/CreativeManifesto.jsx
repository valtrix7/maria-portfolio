import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CreativeManifesto.css';

gsap.registerPlugin(ScrollTrigger);

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const CreativeManifesto = () => {
  const sectionRef = useRef(null);
  const marquee1 = useRef(null);
  const marquee2 = useRef(null);

  useEffect(() => {
    const mobile = isMobile();
    const ctx = gsap.context(() => {
      // Big text word reveal — faster on mobile
      gsap.fromTo('.manifesto-word',
        { y: mobile ? 60 : 120, opacity: 0, rotateX: mobile ? -30 : -60 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: mobile ? 0.8 : 1.2,
          stagger: mobile ? 0.05 : 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: mobile ? 'top 70%' : 'top 60%',
          }
        }
      );

      // Sub text
      gsap.fromTo('.manifesto-sub',
        { y: mobile ? 20 : 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: mobile ? 0.7 : 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.manifesto-sub',
            start: 'top 85%',
          }
        }
      );

      // Counter spin — skip on mobile
      if (!mobile) {
        gsap.fromTo('.manifesto-spin',
          { rotation: 0 },
          {
            rotation: 360,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            }
          }
        );
      }

      // Marquees — slower on mobile
      if (marquee1.current) {
        gsap.to(marquee1.current, { x: '-50%', duration: mobile ? 15 : 20, repeat: -1, ease: 'none' });
      }
      if (marquee2.current) {
        gsap.to(marquee2.current, { x: '0%', duration: mobile ? 18 : 25, repeat: -1, ease: 'none' });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto" data-section="creative-manifesto" ref={sectionRef}>
      <div className="manifesto-marquee manifesto-marquee-top">
        <div className="manifesto-marquee-track" ref={marquee1}>
          <span>MOTION</span><span className="mm-dot"></span>
          <span>DESIGN</span><span className="mm-dot"></span>
          <span>ANIMATION</span><span className="mm-dot"></span>
          <span>STORY</span><span className="mm-dot"></span>
          <span>CRAFT</span><span className="mm-dot"></span>
          <span>MOTION</span><span className="mm-dot"></span>
          <span>DESIGN</span><span className="mm-dot"></span>
          <span>ANIMATION</span><span className="mm-dot"></span>
          <span>STORY</span><span className="mm-dot"></span>
          <span>CRAFT</span><span className="mm-dot"></span>
        </div>
      </div>

      <div className="container manifesto-content">
        <div className="manifesto-main">
          <span className="manifesto-word">I</span>
          <span className="manifesto-word">don't</span>
          <span className="manifesto-word">just</span>
          <span className="manifesto-word accent">design.</span>
        </div>
        <div className="manifesto-main">
          <span className="manifesto-word">I</span>
          <span className="manifesto-word">make</span>
          <span className="manifesto-word accent">things</span>
          <span className="manifesto-word">move.</span>
        </div>
        <p className="manifesto-sub">
          Every frame is intentional. Every transition tells a story.
          Motion isn't decoration — it's communication.
        </p>
      </div>

      <div className="manifesto-spin-wrap">
        <div className="manifesto-spin">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <defs>
              <path id="mCircle" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text fill="#E8611A" fontSize="7" fontWeight="700" letterSpacing="2.5">
              <textPath href="#mCircle">MOTION * GRAPHICS * DESIGN * CREATIVE * </textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="manifesto-marquee manifesto-marquee-bottom">
        <div className="manifesto-marquee-track reverse" ref={marquee2}>
          <span>EXPERIENCE</span><span className="mm-dot"></span>
          <span>INTENTION</span><span className="mm-dot"></span>
          <span>NARRATIVE</span><span className="mm-dot"></span>
          <span>CINEMA</span><span className="mm-dot"></span>
          <span>RHYTHM</span><span className="mm-dot"></span>
          <span>EXPERIENCE</span><span className="mm-dot"></span>
          <span>INTENTION</span><span className="mm-dot"></span>
          <span>NARRATIVE</span><span className="mm-dot"></span>
          <span>CINEMA</span><span className="mm-dot"></span>
          <span>RHYTHM</span><span className="mm-dot"></span>
        </div>
      </div>
    </section>
  );
};

export default CreativeManifesto;
