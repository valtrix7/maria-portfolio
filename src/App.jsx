import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Header from './components/Header';
import AnimationCanvas from './components/AnimationCanvas';
import SmoothCursor from './components/SmoothCursor';
import CinematicIntro from './components/CinematicIntro';
import Letterbox from './components/Letterbox';
import ViewfinderHUD from './components/ViewfinderHUD';
import Hero from './components/Hero';
import FrameSequence from './components/FrameSequence';
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
  // Play the film-leader intro once per session; returning views skip the gate.
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.sessionStorage.getItem('mi_intro_seen') === '1';
  });

  const handleIntroComplete = () => {
    window.sessionStorage.setItem('mi_intro_seen', '1');
    setIntroDone(true);
    // Pinned/scrubbed triggers were measured behind the scroll lock — re-measure.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

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
      {!introDone && <CinematicIntro onComplete={handleIntroComplete} />}
      <AnimationCanvas />
      <Letterbox active={introDone} />
      <ViewfinderHUD active={introDone} />
      <SmoothCursor />
      <Header />
      <main>
        <Hero />
        <FrameSequence />
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
