import { motion, useReducedMotion } from 'motion/react';

/**
 * Scroll-reveal wrapper. Uses Motion's whileInView rather than GSAP
 * ScrollTrigger: lighter, no pinning, no cleanup hazards. (skill 5.C)
 * Collapses to a plain div under prefers-reduced-motion. (skill 6.B)
 */
export function Reveal({ children, delay = 0, y = 24, className = '', as: Tag = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag] ?? motion.div;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Stagger container. Parent and children must live in the same tree for
 * staggerChildren to work. (skill 5.D)
 */
export function RevealGroup({ children, className = '', stagger = 0.08, delay = 0 }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = '', y = 20 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
