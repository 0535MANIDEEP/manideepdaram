import { identity, footer } from '../data/content.js';
import { Icon } from './icons.jsx';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink-raised">
      <div className="container-page flex flex-col gap-10 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold tracking-tight text-primary">
            {identity.name}
          </p>
          <p className="mt-1.5 text-sm text-secondary">{identity.role}</p>
          {/* A single contact address in the footer is allowed. An atmospheric
              locale strip in the nav or hero is not. (skill 9.F) */}
          <p className="mt-4 font-mono text-xs text-muted">{identity.location}</p>
        </div>

        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap items-center gap-3">
            {footer.socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  data-testid={s.testId}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  aria-label={s.name}
                  title={s.name}
                  className="flex h-11 w-11 items-center justify-center rounded-surface border border-line text-secondary transition-colors duration-200 hover:border-accent-40 hover:bg-accent-12 hover:text-accent active:translate-y-[1px]"
                >
                  <Icon name={s.icon} size={19} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-muted">
            {year} {identity.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-muted">{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
