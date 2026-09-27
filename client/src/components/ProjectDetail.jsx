import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { projects, projectFlows } from '../data/content.js';
import { DataLabel } from './SectionHeading.jsx';
import { ProjectFlow } from './ProjectFlow.jsx';
import { Icon } from './icons.jsx';

/**
 * A project's detail page.
 *
 * Rendered as an overlay rather than as a new page in a router, because the site
 * has no router and adding one for two projects would be a dependency and a
 * routing layer to maintain in exchange for two URLs. It does get a real URL,
 * `#/project/foodforward`, so it is linkable and the browser back button closes
 * it, which is the part that actually matters.
 *
 * Everything actionable lives here. The card carries exactly two buttons, so a
 * reader is never choosing between five equally weighted pills with no idea which
 * is the real one.
 */

const ACTION_ICON = {
  download: 'arrowDown',
  demo: 'arrowUpRight',
  paper: 'arrowUpRight',
};

export function ProjectDetail({ projectId, onClose }) {
  const project = projects.items.find((p) => p.id === projectId);
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  // Escape closes, and focus moves into the panel so the keyboard is not left
  // behind on the card that opened it.
  useEffect(() => {
    if (!project) return undefined;

    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      // Focus trap. Without it, tabbing walks out of the overlay into the page
      // behind, which is still visible around the edges on a wide screen and is
      // being read out by a screen reader as if it were next.
      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  if (!project) return null;

  const flow = projectFlows[project.id];

  const panel = (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      data-testid={`project-detail-${project.id}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-70">
          Project details
        </p>
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          data-testid="project-detail-close"
          aria-label="Close project details"
          className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-accent-40 hover:bg-accent-12"
        >
          Close
          <span aria-hidden="true" className="font-mono text-xs">
            Esc
          </span>
        </button>
      </div>

      {/*
        data-lenis-prevent is load bearing, and it is the reason this panel
        scrolls at all. Lenis listens for wheel and touch on the window and
        preventDefaults anything it believes it owns, so an inner overflow
        container silently stops responding to the wheel. Marking the panel as a
        prevented region hands those events back to the browser and the native
        scroll runs.

        Without it this panel looked correct and scrolled with a script:
        scrollHeight was 1482 in a 600px box and assigning scrollTop moved it, so
        every automated check passed. Only a real wheel or a real finger found
        it, because setting scrollTop bypasses event handling entirely.

        overscroll-contain then stops the panel handing the gesture to the
        document at either end, which would slide the site up underneath.
      */}
      <div
        ref={panelRef}
        data-lenis-prevent
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-70">
            {project.kicker}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {project.title}
          </h2>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-secondary">
            {project.body}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-surface border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ProjectFlow caption={flow.caption} steps={flow.steps} citation={flow.citation} />
            </div>

            <div className="lg:col-span-5">
              <DataLabel>Get it</DataLabel>

              {/* The actions come first, because a reader who came here to
                  download something should not have to read a diagram to find
                  the link. */}
              <ul className="mt-4 space-y-3">
                {project.actions.map((action) => (
                  <li key={action.href}>
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-testid={`project-action-${project.id}-${action.kind}`}
                      className="block rounded-surface border border-line bg-surface p-4 transition-colors hover:border-accent-40"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                        <Icon name={ACTION_ICON[action.kind] ?? 'arrowUpRight'} size={16} weight="bold" />
                        {action.label}
                      </span>
                      <span className="mt-2 block text-[13px] leading-relaxed text-secondary">
                        {action.detail}
                      </span>
                    </a>
                  </li>
                ))}

                <li>
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-testid={`project-action-${project.id}-repo`}
                    className="block rounded-surface border border-line bg-surface p-4 transition-colors hover:border-accent-40"
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                      <Icon name="githubLogo" size={16} weight="fill" />
                      Visit the repository
                    </span>
                    <span className="mt-2 block break-all font-mono text-[11px] text-muted">
                      {project.repo}
                    </span>
                  </a>
                </li>
              </ul>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7">
                {project.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-snug text-primary">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              {project.note ? (
                <p className="mt-7 border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
                  {project.note}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Portalled so the overlay escapes any ancestor stacking or overflow context.
  // React's server renderer has no portal support and no document, so where
  // there is no DOM the same markup is returned inline instead. That keeps the
  // component renderable under the test suite's SSR pass, which is the only way
  // to assert that it renders at all rather than merely that it compiles.
  return typeof document === 'undefined' ? panel : createPortal(panel, document.body);
}
