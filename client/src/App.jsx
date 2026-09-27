import { useLenis } from './hooks/useLenis.js';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { MetricsBand } from './components/MetricsBand.jsx';
import { MarqueeBand } from './components/MarqueeBand.jsx';
import { About } from './components/About.jsx';
import { Education } from './components/Education.jsx';
import { Skills } from './components/Skills.jsx';
import { Projects } from './components/Projects.jsx';
import { Research } from './components/Research.jsx';
import { Milestones } from './components/Milestones.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  useLenis();

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
        <Projects />
        <Research />
        <Milestones />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
