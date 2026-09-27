import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { List, X } from './icons.jsx';
import { Monogram } from './Monogram.jsx';
import { nav, identity } from '../data/content.js';

const DESKTOP_FROM = 'lg'; // 1024px, per skill 4.7

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  // Sticky-header elevation. This observes scroll position; it is not a
  // per-frame scroll handler, so it does not violate skill 5.D.
  useEffect(() => {
    const sentinel = document.getElementById('hero');
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled ? 'border-accent-20 bg-ink/85' : 'border-accent-20 bg-ink/85'
      }`}
    >
      <div className="container-page flex h-full items-center justify-between gap-6">
        <a
          href="#top"
          data-testid="nav-brand-logo"
          className="flex shrink-0 items-center gap-3"
        >
          <Monogram size={34} />
          {/* Always visible, not hidden below sm. When this was hidden on
              mobile the monogram glyphs were the only rendered text in the
              link, which broke the accessible-name-matches-visible-label rule
              and hid the brand from anyone reading the header on a phone. */}
          <span className="font-display text-[15px] font-bold tracking-tight text-primary">
            Manideep Daram
          </span>
        </a>

        {/* Desktop: must stay on one line and under 80px tall. */}
        <nav className={`hidden ${DESKTOP_FROM}:flex items-center gap-5`} aria-label="Primary">
          {nav.map((item) =>
            item.cta ? (
              <a
                key={item.label}
                href={item.target}
                data-testid={item.testId}
                className="rounded-pill border border-accent-40 bg-accent-12 px-4 py-2 text-sm font-semibold text-accent transition-colors duration-200 hover:border-accent hover:bg-accent-20 active:translate-y-[1px]"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={item.label}
                href={item.target}
                data-testid={item.testId}
                className="text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          data-testid="nav-toggle"
          className={`${DESKTOP_FROM}:hidden flex h-10 w-10 items-center justify-center rounded-surface border border-line text-primary transition-colors hover:border-accent-40 active:translate-y-[1px]`}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            key="mobile-nav"
            aria-label="Primary, mobile"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line bg-ink/95 backdrop-blur-md lg:hidden"
          >
            <ul className="container-page flex flex-col py-3">
              {nav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.target}
                    data-testid={`${item.testId}-mobile`}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-[15px] transition-colors ${
                      item.cta
                        ? 'font-semibold text-accent'
                        : 'font-medium text-secondary hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 border-t border-line pt-3">
                <a
                  href={`mailto:${identity.email}`}
                  className="block py-2 font-mono text-xs text-muted"
                >
                  {identity.email}
                </a>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
