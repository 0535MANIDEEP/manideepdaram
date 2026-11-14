// ArrowDown is the details button's chevron. ArrowUpRight was the former
// secondary link's chevron and is no longer used here.
import { ArrowDown, Icon } from './icons.jsx';
import { projects } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { RevealGroup, RevealItem } from './Reveal.jsx';

/**
 * Layout family: a bento of three cells.
 *
 * Three projects, three cells, no filler. The order matches the evidence
 * strongest first: TaskFlow and DocVault are live and deployed on free tiers,
 * so they carry their links on the card, and the Android app carries its APK
 * so the detail page is what it always was, a readme you can click.
 */
const SPANS = ['lg:col-span-5', 'lg:col-span-4', 'lg:col-span-3'];

export function Projects({ onOpen }) {
  return (
    <section id="projects" className="border-y border-line bg-ink-raised py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          title={projects.heading}
          lede="Three projects, all live and public, from problem statement to a page that works."
          id="projects-heading"
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12" stagger={0.1}>
          {projects.items.map((p, i) => {
            return (
              <RevealItem key={p.id} className={SPANS[i]}>
                <article
                  data-testid={`project-card-${p.id}`}
                  className="edge-lit group flex h-full flex-col overflow-hidden rounded-surface bg-surface"
                >
                  {p.screenshot ? (
                    <div className="aspect-[16/10] overflow-hidden bg-ink">
                      <img
                        src={p.screenshot.src}
                        alt={p.screenshot.alt}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-7">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-70">
                      {p.kicker}
                    </p>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-primary sm:text-2xl">
                      {p.title}
                    </h3>

                    {/* The result, in one line. The whole card stands on this. */}
                    <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-secondary">
                      {p.result}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-surface border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onOpen(p.id)}
                        data-testid={`project-details-${p.id}`}
                        className="inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-2.5 text-sm font-bold text-ink transition-transform duration-200 hover:brightness-110 active:translate-y-[1px]"
                      >
                        Project details
                        <ArrowDown size={15} weight="bold" />
                      </button>

                      {p.live ? (
                        <a
                          href={p.live.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-testid={`project-live-${p.id}`}
                          className="inline-flex items-center gap-2 rounded-pill border border-accent-40 px-5 py-2.5 text-sm font-semibold text-accent transition-colors duration-200 hover:border-accent hover:bg-accent-12 active:translate-y-[1px]"
                        >
                          {p.live.label}
                          <Icon name="arrowUpRight" size={15} weight="bold" />
                        </a>
                      ) : null}

                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-testid={`project-repo-${p.id}`}
                        className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-5 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:border-accent-40 hover:bg-accent-12 active:translate-y-[1px]"
                      >
                        Code
                        <Icon name="githubLogo" size={15} weight="fill" />
                      </a>
                    </div>

                    {p.note ? (
                      <p className="mt-4 text-[11px] leading-relaxed text-muted">
                        {p.note}
                      </p>
                    ) : null}
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
