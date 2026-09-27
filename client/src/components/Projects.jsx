import { ArrowUpRight } from './icons.jsx';
import { projects, images, identity } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { RevealGroup, RevealItem } from './Reveal.jsx';

/**
 * Layout family: a two cell bento, 7/5.
 *
 * skill 4.7 requires exactly as many bento cells as there are items. There are
 * two projects, so there are two cells and no filler tile.
 *
 * Both cells carry real photography, which satisfies the background diversity
 * rule. There are deliberately no repository links: none were supplied, and
 * inventing plausible URLs would be a fabrication. (skill 9.D)
 */
const SPANS = ['lg:col-span-7', 'lg:col-span-5'];
const RATIOS = ['aspect-[16/10]', 'aspect-[4/3]'];

export function Projects() {
  return (
    <section id="projects" className="border-y border-line bg-ink-raised py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          title={projects.heading}
          lede="Two projects taken from problem statement to working build."
          id="projects-heading"
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12" stagger={0.1}>
          {projects.items.map((p, i) => (
            <RevealItem key={p.id} className={SPANS[i]}>
              <article
                data-testid={`project-card-${p.id}`}
                className="edge-lit group flex h-full flex-col overflow-hidden rounded-surface bg-surface"
              >
                <div className={`relative overflow-hidden ${RATIOS[i]}`}>
                  <img
                    src={images[p.image]}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-7 pt-2">
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

                  <a
                    href={identity.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-primary"
                  >
                    More on GitHub
                    <ArrowUpRight size={15} weight="bold" />
                  </a>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
