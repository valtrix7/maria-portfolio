import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/Header';
import AnimationCanvas from './components/AnimationCanvas';
import Hero from './components/Hero';
import About from './components/About';
import CreativeManifesto from './components/CreativeManifesto';
import SelectedWork from './components/SelectedWork';
import HowIWork from './components/HowIWork';
import Toolbox from './components/Toolbox';
import Recognition from './components/Recognition';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    // Custom cursor
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    let moveCursor = null;

    if (dot && ring && window.innerWidth > 768) {
      moveCursor = (e) => {
        gsap.to(dot, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1 });
        gsap.to(ring, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.3 });
      };
      window.addEventListener('mousemove', moveCursor);

      const handleHover = () => ring.classList.add('hovering');
      const handleUnhover = () => ring.classList.remove('hovering');
      document.querySelectorAll('a, button, .hover-target').forEach((el) => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleUnhover);
      });

      return () => {
        if (moveCursor) window.removeEventListener('mousemove', moveCursor);
        document.querySelectorAll('a, button, .hover-target').forEach((el) => {
          el.removeEventListener('mouseenter', handleHover);
          el.removeEventListener('mouseleave', handleUnhover);
        });
      };
    }
  }, []);

  return (
    <>
      <AnimationCanvas />
      <div className="cursor-dot" ref={cursorDotRef} />
      <div className="cursor-ring" ref={cursorRingRef} />
      <Header />
      <main>
        <Hero />
        <About />
        <CreativeManifesto />
        <SelectedWork />
        <HowIWork />
        <Toolbox />
        <Recognition />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

export default App;
