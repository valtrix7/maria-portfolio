import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Header from './components/Header';
import AnimationCanvas from './components/AnimationCanvas';
import SmoothCursor from './components/SmoothCursor';
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
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      <AnimationCanvas />
      <SmoothCursor />
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
