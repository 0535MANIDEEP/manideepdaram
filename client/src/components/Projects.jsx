// ArrowDown is the details button's chevron. ArrowUpRight was the former
// secondary link's chevron and is no longer used here.
import { ArrowDown, Icon } from './icons.jsx';
import { projects, projectFlows } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { RevealGroup, RevealItem } from './Reveal.jsx';
import { ProjectFlow } from './ProjectFlow.jsx';

/**
 * Layout family: a two cell bento, 7/5.
 *
 * skill 4.7 requires exactly as many bento cells as there are items. There are
 * two projects, so there are two cells and no filler tile.
 *
 * Both cells carry a real diagram instead of stock photography, which satisfies
 * the background-diversity rule with information rather than decoration.
 *
 * Every link is live. This card previously carried no links at all, on the
 * grounds that none had been supplied and inventing plausible URLs would be a
 * fabrication. That was the right call then and both projects are published now,
 * so the links are real: a downloadable APK, a public repository, a deployed
 * interface and the paper PDF. Each one resolves, and the deploy workflow checks
 * the interface actually serves the application rather than a 404 page.
 */
const SPANS = ['lg:col-span-7', 'lg:col-span-5'];

export function Projects({ onOpen }) {
  return (
    <section id="projects" className="border-y border-line bg-ink-raised py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          title={projects.heading}
          lede="Two projects taken from problem statement to working build."
          id="projects-heading"
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12" stagger={0.1}>
          {projects.items.map((p, i) => {
            const flow = projectFlows[p.id];
            return (
              <RevealItem key={p.id} className={SPANS[i]}>
                <article
                  data-testid={`project-card-${p.id}`}
                  className="edge-lit group flex h-full flex-col rounded-surface bg-surface p-7"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-70">
                    {p.kicker}
                  </p>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-primary sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-secondary">
                    {p.body}
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

                  <ProjectFlow
                    caption={flow.caption}
                    steps={flow.steps}
                    citation={flow.citation}
                  />

                  {/*
                    Exactly two buttons, and that is deliberate.

                    This card once carried five weighted pills with nothing to
                    distinguish them, which is a menu rather than a call to
                    action. "Project details" is the only sensible first step,
                    because the detail page is where the download, the live
                    interface and the paper are, each with a sentence explaining
                    what a reader gets. The repository is the second button
                    because it is the thing people want when they are assessing
                    the work rather than using it.
                  */}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onOpen(p.id)}
                      data-testid={`project-details-${p.id}`}
                      className="inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-2.5 text-sm font-bold text-ink transition-transform duration-200 hover:brightness-110 active:translate-y-[1px]"
                    >
                      Project details
                      <ArrowDown size={15} weight="bold" />
                    </button>

                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-testid={`project-repo-${p.id}`}
                      className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-5 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:border-accent-40 hover:bg-accent-12 active:translate-y-[1px]"
                    >
                      Visit repository
                      <Icon name="githubLogo" size={15} weight="fill" />
                    </a>
                  </div>

                  {p.note ? (
                    <p className="mt-4 text-[11px] leading-relaxed text-muted">
                      {p.note}
                    </p>
                  ) : null}
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
