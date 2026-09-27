import { milestones } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { RevealGroup, RevealItem } from './Reveal.jsx';

/**
 * Layout family: a borderless two column list on a single hairline family.
 * No cards, no step numbers, no stage labels. (skill 9.F)
 */
export function Milestones() {
  return (
    <section id="milestones" className="border-y border-line bg-ink-raised py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading title={milestones.heading} id="milestones-heading" />

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2"
          stagger={0.08}
        >
          {milestones.items.map((m) => (
            <RevealItem key={m.title}>
              <div className="border-t border-line pt-6">
                <h3 className="text-lg font-semibold tracking-tight text-primary">{m.title}</h3>
                <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-secondary">
                  {m.detail}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
