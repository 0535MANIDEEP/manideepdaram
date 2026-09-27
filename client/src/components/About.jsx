import { about, identity } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { Icon } from './icons.jsx';

const STRENGTH_ICONS = ['code', 'trendUp', 'sealCheck', 'buildings'];

/**
 * Asymmetric two column: narrative left, capability matrix right.
 * A 4-item matrix in one column, not a row of equal cards. (skill 9.C)
 */
export function About() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading title={about.heading} id="about-heading" />

          <Reveal delay={0.05} className="mt-8 space-y-5">
            {about.body.map((paragraph, i) => (
              <p key={i} className="max-w-[62ch] text-base leading-relaxed text-secondary">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.12} className="mt-10 flex flex-wrap gap-3">
            <a
              href={`mailto:${identity.email}`}
              className="rounded-pill border border-line-strong px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent-40 hover:bg-accent-12 active:translate-y-[1px]"
            >
              {identity.email}
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-pill border border-line-strong px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-accent-40 hover:bg-accent-12 active:translate-y-[1px]"
            >
              LinkedIn
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <ul className="space-y-3">
              {about.strengths.map((s, i) => (
                <li
                  key={s.label}
                  className="edge-lit flex gap-4 rounded-surface bg-surface p-5"
                >
                  <span className="mt-0.5 shrink-0 text-accent">
                    <Icon name={STRENGTH_ICONS[i]} size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary">{s.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-secondary">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
