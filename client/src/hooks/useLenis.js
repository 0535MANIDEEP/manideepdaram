import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';

/**
 * Lenis smooth scrolling, wired once at the app root.
 *
 * Gated entirely on prefers-reduced-motion: skill 6.B requires scroll hijack to
 * collapse to native behaviour. There is no ScrollTrigger here, so no
 * lenis.on('scroll', ...) bridge is needed.
 *
 * `paused` stops the instance rather than tearing it down. Destroying and
 * recreating on every overlay open would restart the animation loop and drop the
 * scroll position, so the page behind would jump.
 */
export function useLenis(paused = false) {
  const reduce = useReducedMotion();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out. No bounce, no rubber band.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // In-page anchors must go through Lenis or the two fight each other.
    const onClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -88 });
      window.history.replaceState(null, '', id);
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [paused]);
}
