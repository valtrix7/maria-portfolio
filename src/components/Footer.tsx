import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= 768;

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mobile = isMobile();
    const ctx = gsap.context(() => {
      // Name text reveal — faster on mobile
      gsap.fromTo('.ft-name',
        { y: mobile ? 40 : 80, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: mobile ? 0.8 : 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.ft-name', start: 'top 92%' },
        }
      );

      // Social links stagger
      gsap.fromTo('.ft-social',
        { y: mobile ? 10 : 20, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5, stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.ft-socials', start: 'top 95%' },
        }
      );

      // Copyright
      gsap.fromTo('.ft-copy',
        { opacity: 0 },
        {
          opacity: 0.6,
          duration: 0.8,
          scrollTrigger: { trigger: '.ft-copy', start: 'top 95%' },
        }
      );

      // SVG wave animation — slower on mobile
      const wave = footerRef.current?.querySelector<SVGPathElement>('.ft-wave-path');
      if (wave) {
        gsap.fromTo(wave,
          { attr: { d: 'M0,40 Q150,0 300,40 T600,40 T900,40 T1200,40 T1500,40 V80 H0 Z' } },
          {
            attr: { d: 'M0,40 Q150,80 300,40 T600,40 T900,40 T1200,40 T1500,40 V80 H0 Z' },
            duration: mobile ? 4 : 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="ft" ref={footerRef}>
      <svg className="ft-wave" viewBox="0 0 1500 80" preserveAspectRatio="none">
        <path
          className="ft-wave-path"
          d="M0,40 Q150,0 300,40 T600,40 T900,40 T1200,40 T1500,40 V80 H0 Z"
          fill="var(--accent)"
          opacity="0.06"
        />
      </svg>

      <div className="container">
        <div className="ft-content">
          <div className="ft-name">Maria Islam</div>

          <div className="ft-row">
            <span className="ft-role">Motion Graphics Designer</span>

            <div className="ft-socials">
              <a href="#" className="ft-social hover-target">Fiverr</a>
              <a href="#" className="ft-social hover-target">Dribbble</a>
              <a href="#" className="ft-social hover-target">LinkedIn</a>
            </div>
          </div>

          <div className="ft-copy">&copy; 2026 Maria Islam. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
