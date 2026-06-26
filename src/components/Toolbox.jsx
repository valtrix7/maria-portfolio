import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Toolbox.css';

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { name: 'After Effects', icon: 'AE', color: '#9999FF' },
  { name: 'Cinema 4D', icon: 'C4D', color: '#00A3E0' },
  { name: 'Premiere Pro', icon: 'PR', color: '#9999FF' },
  { name: 'Illustrator', icon: 'AI', color: '#FF9A00' },
  { name: 'Photoshop', icon: 'PS', color: '#31A8FF' },
  { name: 'Figma', icon: 'FG', color: '#A259FF' },
  { name: 'Blender', icon: 'BL', color: '#E87D0D' },
  { name: 'DaVinci Resolve', icon: 'DR', color: '#FF6B6B' },
];

const Toolbox = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.toolbox-header > *',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.toolbox-header', start: 'top 75%' }
        }
      );

      // Tool cards stagger
      gsap.fromTo('.tool-card',
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.toolbox-grid', start: 'top 80%' }
        }
      );

      // Bottom marquee
      const marquee = sectionRef.current?.querySelector('.toolbox-marquee-track');
      if (marquee) {
        gsap.to(marquee, { x: '-50%', duration: 30, repeat: -1, ease: 'none' });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="toolbox" id="tools" ref={sectionRef}>
      <div className="container">
        <div className="toolbox-header">
          <div className="label">Toolbox</div>
          <h2 className="display-lg" style={{ marginTop: '16px', marginBottom: '20px' }}>
            My creative<br />arsenal
          </h2>
          <p className="body-lg">
            The software and tools I use to bring ideas to life.
          </p>
        </div>

        <div className="toolbox-grid">
          {tools.map((tool) => (
            <div className="tool-card hover-target" key={tool.name}>
              <div className="tool-icon" style={{ borderColor: tool.color + '40' }}>
                <span className="tool-icon-text" style={{ color: tool.color }}>{tool.icon}</span>
              </div>
              <div className="tool-info">
                <h4 className="tool-name">{tool.name}</h4>
                <div className="tool-bar">
                  <div className="tool-bar-fill" style={{ background: tool.color, width: `${60 + Math.random() * 35}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="toolbox-marquee">
        <div className="toolbox-marquee-track">
          <span>MOTION GRAPHICS</span><span className="tm-dot"></span>
          <span>3D ANIMATION</span><span className="tm-dot"></span>
          <span>BRAND DESIGN</span><span className="tm-dot"></span>
          <span>VFX</span><span className="tm-dot"></span>
          <span>VIDEO EDITING</span><span className="tm-dot"></span>
          <span>TYPOGRAPHY</span><span className="tm-dot"></span>
          <span>MOTION GRAPHICS</span><span className="tm-dot"></span>
          <span>3D ANIMATION</span><span className="tm-dot"></span>
          <span>BRAND DESIGN</span><span className="tm-dot"></span>
          <span>VFX</span><span className="tm-dot"></span>
          <span>VIDEO EDITING</span><span className="tm-dot"></span>
          <span>TYPOGRAPHY</span><span className="tm-dot"></span>
        </div>
      </div>
    </section>
  );
};

export default Toolbox;
