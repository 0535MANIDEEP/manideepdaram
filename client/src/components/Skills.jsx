import { skills } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { RevealGroup, RevealItem } from './Reveal.jsx';

/**
 * Layout family: an asymmetric two by two, deliberately NOT a row of equal
 * cards. skill 9.C bans three identical cards side by side, and skill 4.7
 * requires layout rhythm, so the cells alternate 7/5 then 5/7.
 */
const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

export function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          title={skills.heading}
          lede="Languages I write, systems I understand, and the tooling I work in."
          id="skills-heading"
        />

        <RevealGroup
          className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12"
          stagger={0.08}
        >
          {skills.categories.map((cat, i) => (
            <RevealItem key={cat.name} className={SPANS[i]}>
              <div className="edge-lit h-full rounded-surface bg-surface p-7">
                <h3 className="text-base font-semibold text-primary">{cat.name}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-surface border border-line px-3 py-1.5 font-mono text-xs text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
