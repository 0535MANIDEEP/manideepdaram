import { Icon } from './icons.jsx';
import { DataLabel } from './SectionHeading.jsx';

/**
 * A project's flow, drawn from the real project description.
 *
 * This is a diagram, not a picture of a product, and it is labelled as one. It
 * replaces stock photography, which said nothing about the actual work. The
 * steps are an ordered list so a screen reader announces them in order, and the
 * connecting spine carries the sequence without numbered step labels.
 */
export function ProjectFlow({ caption, steps, citation }) {
  return (
    <div className="mt-7 border-t border-line pt-6">
      <DataLabel>{caption}</DataLabel>

      <ol className="mt-5 space-y-0">
        {steps.map((step, i) => (
          <li key={step.label} className="relative flex gap-4 pb-5 last:pb-0">
            {/* Spine. Drawn for every item except the last, so the chain
                visibly terminates rather than trailing off. */}
            {i < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-px bg-line"
              />
            ) : null}

            <span className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border border-accent-20 bg-ink text-accent">
              <Icon name={step.icon} size={13} />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-primary">{step.label}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-secondary">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      {citation ? (
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-70">
            {citation.journal}
          </span>
          <span className="font-mono text-[11px] text-muted">{citation.detail}</span>
          <span className="font-mono text-[11px] text-muted">{citation.id}</span>
        </div>
      ) : null}
    </div>
  );
}
