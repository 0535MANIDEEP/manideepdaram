import { motion, useReducedMotion } from 'motion/react';
import { metrics } from '../data/content.js';
import { RevealGroup, RevealItem } from './Reveal.jsx';

/**
 * Metrics sit in their own band directly under the hero.
 * skill 4.7 caps the hero at four text elements and bans trust micro-strips
 * inside it, so these cannot live in the hero.
 *
 * One divider family (left hairlines), sparse. No filled progress tracks.
 * (skill 9.F)
 */
export function MetricsBand() {
  return (
    <section aria-label="Key facts" className="border-y border-line bg-ink-raised">
      <RevealGroup className="container-page grid grid-cols-2 md:grid-cols-4">
        {metrics.map((m, i) => (
          <RevealItem
            key={m.label}
            className={`px-1 py-8 sm:px-6 ${i > 0 ? 'border-l border-line' : ''} ${
              i >= 2 ? 'border-t border-line md:border-t-0' : ''
            }`}
          >
            <p className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {m.value}
            </p>
            <p className="mt-2 text-sm font-medium text-primary">{m.label}</p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">{m.sub}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
