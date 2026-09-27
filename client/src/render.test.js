import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { projects, projectFlows, research } from './data/content.js';

/**
 * The site has to actually render.
 *
 * This test exists because the deployed site was a blank white page for an
 * unknown stretch of time, and every existing signal said it was fine. The
 * Lighthouse scores were 1.0 across the board, which is exactly what a blank page
 * scores, so the perfect report was evidence of the outage rather than evidence
 * of quality. Twelve unit tests passed the whole time, because none of them
 * mounted a component.
 *
 * The cause was five files importing named icon exports that icons.jsx does not
 * have. It exports ICONS and Icon, nothing else. A bundler does not catch a
 * missing named import used as a component; it becomes undefined, and React
 * throws "Element type is invalid" the first time that branch renders.
 *
 * So: render the whole app and assert on the output. A ReferenceError or an
 * invalid element type fails here, at the point of the commit, instead of on
 * someone's screen.
 */

let vite;
let App;
let html;

// The suite runs from the repository root, so nothing here may be relative to
// the cwd. Vite resolves configFile and root against the process directory, and
// "Cannot resolve entry module vite.config.js" is the error you get otherwise.
const CLIENT_ROOT = path.join(import.meta.dirname, '..');

before(async () => {
  vite = await createServer({
    root: CLIENT_ROOT,
    configFile: path.join(CLIENT_ROOT, 'vite.config.js'),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
    // One copy of React. Without this the Vite module graph and react-dom/server
    // each hold one, and every hook call fails with "more than one copy of
    // React", which is a thoroughly unhelpful way to learn that.
    resolve: { dedupe: ['react', 'react-dom'] },
  });

  const mod = await vite.ssrLoadModule('/src/App.jsx');
  App = mod.default;
  html = renderToString(createElement(App));
});

after(async () => {
  await vite?.close();
});

describe('the app renders', () => {
  test('produces a substantial document rather than an empty root', () => {
    // The regression this exists for. A blank page still passes a smoke check
    // that only asserts "no exception thrown", so the bar is a real document.
    assert.ok(html.length > 20_000, `rendered only ${html.length} characters, which is an empty page`);
  });

  test('every section is present', () => {
    for (const id of ['hero', 'about', 'projects', 'skills', 'education', 'contact']) {
      assert.ok(html.includes(`id="${id}"`), `section #${id} is missing from the render`);
    }
  });

  test('the page carries a real title and description', () => {
    // Content that only exists in the document head is invisible to a render
    // assertion, so this reads index.html.
    return (async () => {
      const indexHtml = await fs.readFile(path.join(CLIENT_ROOT, 'index.html'), 'utf8');
      assert.match(indexHtml, /<title>[^<]{10,}<\/title>/, 'a real, non-trivial title');
      assert.match(indexHtml, /name="description"\s+content="[^"]{40,}"/, 'a real meta description');
    })();
  });
});

describe('every project renders with a diagram and working links', () => {
  test('each project has a flow diagram', () => {
    // The diagram replaced stock photography, so a project without one is a
    // project that quietly regressed to a picture of nothing.
    for (const project of projects.items) {
      const flow = projectFlows[project.id];
      assert.ok(flow, `project ${project.id} has no ProjectFlow`);
      assert.ok(flow.steps.length >= 3, `project ${project.id} has a diagram with ${flow.steps.length} steps`);
      for (const step of flow.steps) {
        assert.ok(step.label && step.detail, `project ${project.id} has an incomplete step`);
      }
    }
  });

  test('every project link is a real absolute https URL', () => {
    // A relative or placeholder href in a portfolio is a dead CTA, and it looks
    // identical to a working one in the source.
    //
    // The domain list is an allowlist of places a project link may legitimately
    // point: his own repositories, the Pages site built from one of them, and the
    // journal that published the paper. jetir.org was added when the FoodForward
    // card linked to the actual PDF, which returns HTTP 200 and 1,010,538 bytes
    // of application/pdf. It is a named publisher rather than a wildcard, so a
    // link to some random host still fails.
    const ALLOWED = /^https:\/\/(github\.com|0535manideep\.github\.io|www\.jetir\.org)\//;

    for (const project of projects.items) {
      for (const link of project.links ?? []) {
        assert.match(
          link.href,
          ALLOWED,
          `project ${project.id} link "${link.label}" is not a real absolute URL: ${link.href}`,
        );
      }
    }
  });

  test('every other project link belongs to the same project as its source repo', () => {
    // Each project claims at most one repository. Every other link on the card
    // has to be traceable to that same project, so a card cannot point a reader
    // at a repo that does not contain the thing being described.
    //
    // "Under the repo" is not the whole rule any more. A download sits under the
    // repository's releases, but a deployed interface sits on Pages for that
    // repository and the paper sits with the publisher. Both are tied to the
    // project by name, which is the actual requirement, so the repository name
    // is checked rather than the URL prefix.
    for (const project of projects.items) {
      const links = project.links ?? [];
      const sources = links.filter((l) => /Source/i.test(l.label));
      if (sources.length === 0) continue;
      assert.equal(sources.length, 1, `project ${project.id} has ${sources.length} source links`);

      const repoUrl = sources[0].href.replace(/\/$/, '');
      // foodforward, blood-bank-android
      const repoName = repoUrl.split('/').filter(Boolean).pop();

      for (const other of links) {
        if (other === sources[0]) continue;

        const underRepo = other.href.startsWith(repoUrl);
        // A Pages site for this repository: .../foodforward/ for
        // .../0535MANIDEEP/foodforward. Case differs between the two, so this
        // compares lowercased.
        const pagesForRepo =
          other.href.toLowerCase().includes('0535manideep.github.io/') &&
          other.href.toLowerCase().includes('/' + repoName.toLowerCase() + '/');
        // The published paper, which is this project's own research output.
        const isPublishedPaper = other.href === research.paperUrl;

        assert.ok(
          underRepo || pagesForRepo || isPublishedPaper,
          `project ${project.id} link ${other.href} is not traceable to its source repo ${repoUrl}`,
        );
      }
    }
  });

  test('no project claims a technology it did not use', () => {
    // A guard on the copy rather than the code. Firebase and Google Maps were
    // claimed in an earlier draft of the Android card and were never used, so
    // they were removed. This keeps them from creeping back.
    for (const project of projects.items) {
      for (const banned of ['Firebase', 'Google Maps', 'Machine Learning', 'Blockchain']) {
        assert.ok(
          !project.stack.includes(banned),
          `project ${project.id} claims ${banned}, which is not in the code`,
        );
      }
    }
  });
});

describe('copy discipline', () => {
  test('no em dashes anywhere in the content', () => {
    // Stated as a rule for this site, so it is a rule with a test.
    const serialised = JSON.stringify({ projects, projectFlows });
    assert.ok(!serialised.includes('—'), 'an em dash is present in the content');
  });

  test('the boundary of the blood project is stated, not implied', () => {
    // The backend is the one project that could be mistaken for a clinical
    // service, so its card has to say what it is not.
    const blood = projects.items.find((p) => /blood-network/i.test(p.id) || /blood network/i.test(p.title ?? ''));
    if (!blood) return; // not added yet, nothing to assert
    const text = `${blood.body} ${blood.note ?? ''}`;
    assert.match(text, /not a blood bank|not a medical device/i, 'the blood project must state what it is not');
  });
});

