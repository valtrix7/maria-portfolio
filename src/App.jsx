import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Header from './components/Header';
import AnimationCanvas from './components/AnimationCanvas';
import SmoothCursor from './components/SmoothCursor';
import Hero from './components/Hero';
import FrameSequence from './components/FrameSequence';
import About from './components/About';
import CreativeManifesto from './components/CreativeManifesto';
import SelectedWork from './components/SelectedWork';
import ShaderGallery from './components/ShaderGallery';
import HowIWork from './components/HowIWork';
import Toolbox from './components/Toolbox';
import Recognition from './components/Recognition';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // lerp-based smoothing gives consistent inertia across wheel + touch,
    // syncTouch mirrors native touch scroll while staying in sync with Lenis.
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis off GSAP's ticker (single RAF source, no double-stepping).
    const tickerCb = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Re-measure all pinned / scrubbed triggers once fonts + images settle,
    // so the FrameSequence pin length and scrub offsets are correct.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <AnimationCanvas />
      <SmoothCursor />
      <Header />
      <main>
        <Hero />
        <FrameSequence />
        <About />
        <CreativeManifesto />
        <SelectedWork />
        <ShaderGallery />
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
