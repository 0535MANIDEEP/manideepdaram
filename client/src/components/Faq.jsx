import { faq } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';

/**
 * Visible FAQ, mirrored by FAQPage JSON-LD in index.html. The structured data
 * and this markup must state the same seven questions and answers — Google
 * discounts FAQ rich results whose markup disagrees with the page, and an
 * answer that exists only in a <script> tag is treated as invisible content.
 *
 * Native <details>/<summary>: no JavaScript, keyboard accessible for free,
 * and the content is present in the delivered HTML.
 */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading title={faq.heading} lede={faq.lede} id="faq-heading" />
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-3">
              {faq.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-surface border border-line bg-surface open:border-line-strong"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-surface px-5 py-4 text-left text-[15px] font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span
                      aria-hidden="true"
                      className="faq-mark shrink-0 font-mono text-lg leading-none text-accent"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-line px-5 py-4">
                    <p className="text-sm leading-relaxed text-secondary">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
