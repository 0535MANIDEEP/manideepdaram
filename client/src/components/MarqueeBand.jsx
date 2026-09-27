import { marqueeItems } from '../data/content.js';

/**
 * The one marquee on the page. skill 5 allows at most one, and it must earn
 * its place: these are his actual subjects and stack, not decoration.
 *
 * A city name is deliberately absent. skill 9.F bans atmospheric locale strips
 * outside genuinely place-focused work. Location lives in the About section
 * and the footer.
 *
 * Under prefers-reduced-motion the track stops animating and the list wraps
 * into a readable static block (see .marquee rules in index.css).
 */
export function MarqueeBand() {
  const row = [...marqueeItems, ...marqueeItems];

  return (
    <section aria-label="Subjects and stack" className="marquee border-b border-line py-4">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= marqueeItems.length ? 'true' : undefined}
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent-70"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
