import { education } from '../data/content.js';
import { SectionHeading, DataLabel } from './SectionHeading.jsx';
import { RevealGroup, RevealItem } from './Reveal.jsx';
import { Icon } from './icons.jsx';

/**
 * Layout family: a single vertical spine with coursework as inline chips.
 * Deliberately unlike the About section's two column split.
 */
export function Education() {
  return (
    <section id="education" className="border-y border-line bg-ink-raised py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          title={education.heading}
          lede="One degree, six subjects that actually came up in the work below."
          id="education-heading"
        />

        <RevealGroup className="mt-14" stagger={0.1}>
          <RevealItem>
            <div className="relative border-l border-line pl-8 sm:pl-12">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-pill bg-accent" />

              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h3 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
                  {education.institution}
                </h3>
                <span className="font-mono text-xs text-accent">{education.timeline}</span>
              </div>

              <p className="mt-3 text-base text-primary">{education.degree}</p>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-10 gap-y-4">
                <p>
                  <DataLabel>CGPA</DataLabel>
                  <span className="ml-3 font-display text-2xl font-bold text-primary">
                    {education.cgpa}
                  </span>
                </p>
              </div>

              <div className="mt-8">
                <DataLabel>Coursework</DataLabel>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {education.coursework.map((course) => (
                    <li
                      key={course}
                      className="rounded-surface border border-line bg-surface px-3 py-1.5 font-mono text-xs text-secondary"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-8 flex items-center gap-2.5 text-sm text-muted">
                <Icon name="graduationCap" size={18} className="text-accent-70" />
                Final year project exhibited as the Android Blood Bank Management App.
              </p>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
