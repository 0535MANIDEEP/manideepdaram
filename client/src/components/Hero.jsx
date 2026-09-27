import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowDown } from './icons.jsx';
import { ParticleField } from './ParticleField.jsx';
import { hero, identity, images } from '../data/content.js';

const EASE = [0.16, 1, 0.3, 1];

/**
 * One line of the headline, revealed from behind a mask.
 *
 * Driven by a CSS keyframe (.mask-line in index.css) rather than a JS
 * animation. The library-driven version using a string-percentage transform
 * left this frozen at translateY(110%), which rendered the H1 invisible.
 * The delay is passed through as a CSS custom property.
 */
function MaskedLine({ children, delay }) {
  return (
    <span className="mask-line" style={{ '--line-delay': `${delay}s` }}>
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100dvh] items-center overflow-hidden pt-24"
    >
      {/* Real photography as the base layer, dimmed so type stays dominant. */}
      <div className="absolute inset-0 -z-20">
        <img
          src={images.hero}
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
      </div>

      {/* Asymmetric split: text left, live canvas right. variance 8 forbids a
          centred hero. (skill 4.3) */}
      <div className="container-page relative grid grid-cols-1 items-center gap-12 pb-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 xl:col-span-6">
          <motion.p
            {...rise(0.1)}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent"
          >
            {hero.eyebrow}
          </motion.p>

          <h1
            data-testid="hero-headline"
            className="mt-5 font-display text-5xl font-extrabold leading-none tracking-tighter text-primary sm:text-6xl lg:text-7xl"
          >
            {hero.headlineLines.map((line, i) => (
              <MaskedLine key={line} delay={0.18 + i * 0.11}>
                {line}
              </MaskedLine>
            ))}
          </h1>

          <motion.p
            {...rise(0.5)}
            className="mt-7 max-w-[46ch] text-base leading-relaxed text-secondary sm:text-lg"
          >
            {hero.subtext}
          </motion.p>

          <motion.div {...rise(0.62)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={hero.primaryCta.target}
              data-testid="hero-request-resume-btn"
              className="inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-3 text-sm font-bold text-ink transition-transform duration-200 hover:brightness-110 active:translate-y-[1px]"
            >
              {hero.primaryCta.label}
              <ArrowRight size={16} weight="bold" />
            </a>
            <a
              href={hero.secondaryCta.target}
              data-testid="hero-explore-work-btn"
              className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-6 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:border-accent-40 hover:bg-accent-12 active:translate-y-[1px]"
            >
              {hero.secondaryCta.label}
              <ArrowDown size={16} weight="bold" />
            </a>
          </motion.div>

          <motion.p
            {...rise(0.74)}
            className="mt-8 font-mono text-xs text-muted"
          >
            {identity.location} &nbsp;/&nbsp; {identity.email}
          </motion.p>
        </div>

        <div className="relative hidden lg:col-span-5 lg:block xl:col-span-6">
          <ParticleField className="h-[540px] w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-ink/80" />
        </div>
      </div>
    </section>
  );
}
