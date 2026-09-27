import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/**
 * Canvas 2D lattice for the hero.
 *
 * Chosen over R3F because skill 10 forbids mixing Three.js with Motion in one
 * tree, and because a 2D canvas costs a fraction of the bundle.
 *
 * Pointer parallax is driven by Motion values, never React state, so pointer
 * movement does not re-render the tree. (skill 3.B)
 * Under prefers-reduced-motion the loop never starts and a static frame is
 * painted once. (skill 6.B)
 */
export function ParticleField({ className = '' }) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const py = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduceMotion =
      reduce ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let nodes = [];
    let disposed = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area but stays capped, so a 4K display does not
      // quietly cost ten times the frame budget of a laptop.
      const target = Math.min(78, Math.max(26, Math.round((width * height) / 16000)));
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.4 + 0.5,
      }));
    };

    const LINK_DIST = 132;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // Links first, so dots sit on top of them.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.2;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.55)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion && !disposed) raf = requestAnimationFrame(draw);
    };

    build();
    draw();

    const onResize = () => {
      build();
      if (reduceMotion) draw();
    };

    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [reduce]);

  const onPointerMove = (event) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(nx * 26);
    my.set(ny * 18);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ x: px, y: py }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </motion.div>
  );
}
