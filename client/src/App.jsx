import { useCallback, useEffect, useState } from 'react';

import { useLenis } from './hooks/useLenis.js';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { MetricsBand } from './components/MetricsBand.jsx';
import { MarqueeBand } from './components/MarqueeBand.jsx';
import { About } from './components/About.jsx';
import { Education } from './components/Education.jsx';
import { Skills } from './components/Skills.jsx';
import { Projects } from './components/Projects.jsx';
import { ProjectDetail } from './components/ProjectDetail.jsx';
import { Research } from './components/Research.jsx';
import { Milestones } from './components/Milestones.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';

/** The only deep link on the site. Matched strictly, so junk in the hash is ignored. */
const DETAIL_HASH = /^#\/project\/([a-z0-9-]+)$/;

function readProjectFromHash() {
  // Guarded because this runs as a useState initialiser, which means it runs
  // during render. The render suite SSRs the app, and a bare window reference
  // here takes the whole test file down with "window is not defined" before a
  // single assertion runs, which reads as a broken suite rather than a broken
  // line.
  if (typeof window === 'undefined') return null;
  return DETAIL_HASH.exec(window.location.hash)?.[1] ?? null;
}

export default function App() {
  const [openProject, setOpenProject] = useState(readProjectFromHash);

  // Smooth scroll is stopped while the detail overlay is up. Without this the
  // page behind scrolls under the overlay and the wheel does nothing useful.
  useLenis(openProject !== null);

  // The overlay lives at a real URL, so it is linkable, survives a reload and
  // closes with the browser back button. An overlay with no URL cannot do any
  // of those, and a reader who shared one would land on the top of the page.
  useEffect(() => {
    const onHashChange = () => setOpenProject(readProjectFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const open = useCallback((id) => {
    window.location.hash = `#/project/${id}`;
  }, []);

  const close = useCallback(() => {
    // replaceState rather than assigning an empty hash, which would leave a bare
    // "#" at the end of the URL and add a second entry to the back stack.
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search,
    );
    setOpenProject(null);
  }, []);

  return (
    <div className="grain min-h-[100dvh] bg-ink">
      <Header />
      <main id="top">
        <Hero />
        <MetricsBand />
        <MarqueeBand />
        <About />
        <Education />
        <Skills />
        <Projects onOpen={open} />
        <Research />
        <Milestones />
        <Contact />
      </main>
      <Footer />

      {openProject ? <ProjectDetail projectId={openProject} onClose={close} /> : null}
    </div>
  );
}
