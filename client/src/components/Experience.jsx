import { experience } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { Icon } from './icons.jsx';

/**
 * Layout family: a two column ledger, role on the left and the work on the
 * right, separated by hairlines. No cards. (skill 9.F)
 *
 * The internship is commercial work, so there is no repository behind it. What
 * the site can offer instead is an accurate description, and one bullet that
 * carries a public build of the same idea beside it, so the claim about access
 * control can be checked rather than taken on trust.
 */
export function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          title={experience.heading}
          lede="Seven months in a product team, and what I built after it."
          id="experience-heading"
        />

        <div className="mt-14">
          {experience.entries.map((entry) => (
            <article
              key={entry.id}
              data-testid={`experience-entry-${entry.id}`}
              className="border-t border-line pt-8 sm:grid sm:grid-cols-12 sm:gap-8"
            >
              <div className="sm:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-70">
                  {entry.period}
                </p>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-primary">
                  {entry.company}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-secondary">{entry.role}</p>
                <p className="mt-1 text-sm text-muted">{entry.location}</p>
              </div>

              <div className="mt-6 sm:col-span-8 sm:mt-0">
                <ul className="space-y-4">
                  {entry.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <div className="min-w-0">
                        <p className="max-w-[62ch] text-sm leading-relaxed text-secondary">
                          {bullet.label}
                        </p>

                        {bullet.proof ? (
                          <p className="mt-2.5 flex flex-wrap items-center gap-2">
                            <a
                              href={bullet.proof.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              data-testid={`experience-proof-${entry.id}`}
                              className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-accent-40 hover:bg-accent-12 active:translate-y-[1px]"
                            >
                              <Icon name="githubLogo" size={13} weight="fill" />
                              {bullet.proof.label}
                            </a>
                            <a
                              href={bullet.proof.live}
                              target="_blank"
                              rel="noreferrer noopener"
                              data-testid={`experience-live-${entry.id}`}
                              className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-accent-40 hover:bg-accent-12 active:translate-y-[1px]"
                            >
                              <Icon name="arrowUpRight" size={13} weight="bold" />
                              Live demo
                            </a>
                            <span className="text-[11px] leading-relaxed text-muted">
                              {bullet.proof.note}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <p className="max-w-[62ch] text-sm leading-relaxed text-muted">
            The internship code is proprietary and was never pushed, so there is no
            repository to link. Everything else on this site is public and can be
            opened.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
