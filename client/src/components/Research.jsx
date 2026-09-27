import { research } from '../data/content.js';
import { SectionHeading, DataLabel } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { Icon } from './icons.jsx';

/**
 * Layout family: one wide feature panel with an oversized journal masthead.
 *
 * Colour discipline: this is the only place emerald appears on the entire site,
 * and only as the "published" semantic marker. Everywhere else the single
 * accent is cyan. (skill 4.2 colour consistency lock, 9.F semantic state)
 */
export function Research() {
  return (
    <section id="research" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading title={research.heading} id="research-heading" />

        <Reveal delay={0.05}>
          <article
            data-testid="research-paper-card"
            className="edge-lit mt-12 overflow-hidden rounded-surface bg-surface"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="border-b border-line p-8 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
                <p className="font-display text-2xl font-extrabold leading-tight tracking-tight text-primary sm:text-3xl">
                  JETIR
                </p>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{research.journal}</p>

                <p className="mt-6 inline-flex items-center gap-2 rounded-pill border border-verified/30 bg-verified/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-verified">
                  <Icon name="sealCheck" size={14} weight="fill" />
                  {research.approval}
                </p>

                <p className="mt-6 font-mono text-xs text-muted">
                  {research.volumeIssue}
                  <br />
                  {research.issn}
                </p>
              </div>

              <div className="p-8 sm:p-10 lg:col-span-7">
                <h3 className="text-xl font-bold leading-snug tracking-tight text-primary sm:text-2xl">
                  {research.paperTitle}
                </h3>
                <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-secondary">
                  {research.body}
                </p>

                {/* Plain elements, not <dl>. Wrapping <dt>/<dd> in a <div>
                    inside a <dl> fails the axe definition-list rule. */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <DataLabel>Paper ID</DataLabel>
                    <p className="mt-1.5 font-mono text-sm text-primary">{research.paperId}</p>
                  </div>
                  <div>
                    <DataLabel>Contribution</DataLabel>
                    <p className="mt-1.5 text-sm text-primary">{research.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
