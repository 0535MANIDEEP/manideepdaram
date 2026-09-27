/**
 * Section heading.
 *
 * `eyebrow` is deliberately opt-in and rationed: skill 4.7 allows at most
 * ceil(sectionCount / 3) eyebrows across the page, and the hero counts as one.
 * The whole page uses two. If you add a third section, do not add a fourth
 * eyebrow.
 *
 * Headings are stacked vertically, never split into a left-headline /
 * right-explainer row. (skill 4.7 split-header ban)
 */
export function SectionHeading({ eyebrow, title, lede, align = 'left', id }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <header className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-70">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-primary">
        {title}
      </h2>
      {lede ? <p className="mt-4 text-base leading-relaxed text-secondary max-w-[62ch]">{lede}</p> : null}
    </header>
  );
}

/** Small mono data label. Not an eyebrow: this labels a value inline. */
export function DataLabel({ children, className = '' }) {
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.18em] text-muted ${className}`}>
      {children}
    </span>
  );
}
