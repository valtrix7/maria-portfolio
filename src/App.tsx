import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import AnimationCanvas from './components/AnimationCanvas';
import SmoothCursor from './components/SmoothCursor';
import Hero from './components/Hero';
import About from './components/About';
import CreativeManifesto from './components/CreativeManifesto';
import SelectedWork from './components/SelectedWork';
import HowIWork from './components/HowIWork';
import Toolbox from './components/Toolbox';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import { CinematicFooter } from './components/ui/motion-footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

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
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
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
        <Testimonials />
        <Contact />
      </main>
      <CinematicFooter />
    </>
  );
}

export default App;
