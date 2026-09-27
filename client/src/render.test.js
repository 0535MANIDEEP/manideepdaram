import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { projects, projectFlows, research } from './data/content.js';
import * as content from './data/content.js';

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
let ProjectDetail;
let html;
let projectsHtml;

const noop = () => {};

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

  // Loaded through Vite rather than with a static import, because node --test
  // cannot parse JSX. A top level import of the component fails the whole file
  // with ERR_UNKNOWN_FILE_EXTENSION before a single assertion runs, which looks
  // like a broken test suite rather than a broken import.
  const detail = await vite.ssrLoadModule('/src/components/ProjectDetail.jsx');
  ProjectDetail = detail.ProjectDetail;

  // The projects section on its own, so assertions about a card are scoped to the
  // card. Checking the whole page instead produced a false failure, because the
  // research section links the same paper PDF the FoodForward detail page offers,
  // and that link is supposed to be there.
  const projectsMod = await vite.ssrLoadModule('/src/components/Projects.jsx');
  projectsHtml = renderToString(createElement(projectsMod.Projects, { onOpen: noop }));
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
      for (const link of [project.repo, ...project.actions.map((a) => a.href)]) {
        assert.match(
          link,
          ALLOWED,
          `project ${project.id} link ${link} is not a real absolute URL`,
        );
      }
    }
  });

  test('every project link belongs to the same project as its repository', () => {
    // Each project has exactly one repository. Every action on its detail page
    // has to be traceable to that same project, so a card cannot point a reader
    // at a repo that does not contain the thing being described.
    //
    // "Under the repo" is not the whole rule. A release download sits under the
    // repository's releases, but a deployed interface sits on Pages for that
    // repository and the paper sits with the publisher. All three are tied to the
    // project by name, which is the actual requirement, so the repository name is
    // checked rather than the URL prefix. That is stricter than a prefix match,
    // not looser.
    for (const project of projects.items) {
      const repoUrl = project.repo.replace(/\/$/, '');
      const repoName = repoUrl.split('/').filter(Boolean).pop();

      for (const action of project.actions) {
        const underRepo = action.href.startsWith(repoUrl);
        const pagesForRepo =
          action.href.toLowerCase().includes('0535manideep.github.io/') &&
          action.href.toLowerCase().includes('/' + repoName.toLowerCase() + '/');
        const isPublishedPaper = action.href === research.paperUrl;

        assert.ok(
          underRepo || pagesForRepo || isPublishedPaper,
          `project ${project.id} action ${action.href} is not traceable to its repository ${repoUrl}`,
        );
      }
    }
  });

  test('every project action says what a reader actually gets', () => {
    // A download link with no explanation is indistinguishable from a link to a
    // page describing a download, which is the exact confusion these replaced.
    for (const project of projects.items) {
      assert.ok(project.actions.length > 0, `project ${project.id} offers no action at all`);
      for (const action of project.actions) {
        assert.ok(action.label, `project ${project.id} has an action with no label`);
        assert.ok(
          (action.detail ?? '').length > 30,
          `project ${project.id} action "${action.label}" does not explain what it gives`,
        );
      }
      assert.ok(project.facts?.length >= 4, `project ${project.id} has too few facts`);
    }
  });

  test('a downloadable build is offered as a download, not as a description of one', () => {
    // The Android card's primary action has to be the release asset itself. A
    // link to the releases page is a page describing the download, and the note
    // on that card used to cover for exactly that.
    const bloodBank = projects.items.find((p) => p.id === 'android-blood-bank');
    const download = bloodBank.actions.find((a) => a.kind === 'download');

    assert.ok(download, 'the Android project offers no download');
    assert.match(
      download.href,
      /^https:\/\/github\.com\/0535MANIDEEP\/blood-bank-android\/releases\/download\/.+\.apk$/,
      `the download should be the release asset, got ${download.href}`,
    );
  });

  test('a project that has a live site offers it on the detail page', () => {
    const food = projects.items.find((p) => p.id === 'foodforward');
    const demo = food.actions.find((a) => a.kind === 'demo');
    assert.ok(demo, 'FoodForward has a deployed interface but does not link it');
    assert.equal(demo.href, 'https://0535manideep.github.io/foodforward/');
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

  test('no copy anywhere claims a feature or library that is not in the code', () => {
    // Wider than the test above, which only checked the stack chips. Checking the
    // prose is what matters, because that is where the claims actually drifted.
    //
    // All four of these were in the site and all four are absent from
    // blood-bank-android, which has no messaging code, no Firebase, no play
    // services dependency, and an AndroidManifest whose only permissions are
    // location. A description of a feature that was never built is worse than no
    // description, because a reader cannot tell it apart from a real one.
    const BANNED = [
      { term: /google maps/i, why: 'no play services dependency in the project' },
      { term: /firebase/i, why: 'not in the project, and there is no INTERNET permission' },
      { term: /\bchat\b/i, why: 'there is no messaging code in the project' },
      { term: /real[ -]?time/i, why: 'the app is fully offline, so nothing can be real time' },
      { term: /mongo/i, why: 'no shipped project uses it' },
    ];

    // The whole content module, not a hand picked list of exports.
    //
    // The first version of this test passed projects, projectFlows, about,
    // milestones and research, and so it missed a Firebase chip that was sitting
    // in the skills list the whole time. Enumerating exports is a list to forget
    // to update, and the thing being guarded is user-visible text, so the whole
    // module is what gets checked.
    const prose = JSON.stringify(content);

    for (const { term, why } of BANNED) {
      const match = prose.match(term);
      assert.equal(
        match,
        null,
        `the site still claims "${match?.[0]}", because ${why}`,
      );
    }
  });

  test('the Android app is described as offline, because it is', () => {
    // Verified in AndroidManifest: the only permissions are ACCESS_COARSE_LOCATION
    // and ACCESS_FINE_LOCATION. No INTERNET, no network code anywhere.
    const bloodBank = projects.items.find((p) => p.id === 'android-blood-bank');
    const text = JSON.stringify(bloodBank).toLowerCase();

    assert.ok(
      /offline|no network|none required/.test(text),
      'the Android project should state that it needs no network, because it does not',
    );
  });
});

describe('the project card offers exactly two things', () => {
  // Asserted on the rendered markup rather than on the data, because the failure
  // this guards is a layout one: five weighted pills on a card is a menu, and
  // reading content.js would not reveal that.
  test('each card has one details button and one repository link', () => {
    for (const project of projects.items) {
      const details = projectsHtml.match(
        new RegExp(`data-testid="project-details-${project.id}"`, 'g'),
      );
      const repo = projectsHtml.match(new RegExp(`data-testid="project-repo-${project.id}"`, 'g'));

      assert.equal(details?.length, 1, `project ${project.id} has ${details?.length ?? 0} details buttons`);
      assert.equal(repo?.length, 1, `project ${project.id} has ${repo?.length ?? 0} repository links`);
    }
  });

  test('the card links nowhere else', () => {
    // The downloads and the live site moved to the detail page on purpose. If a
    // direct link reappears here, the card is back to being a menu and the
    // detail page has no reason to exist.
    for (const project of projects.items) {
      for (const action of project.actions) {
        assert.ok(
          !projectsHtml.includes(`href="${action.href}"`),
          `project ${project.id} still links its detail action ${action.href} from the card`,
        );
      }
    }
  });

  test('the repository link on the card is the project repository', () => {
    for (const project of projects.items) {
      assert.ok(
        projectsHtml.includes(`href="${project.repo}"`),
        `project ${project.id} does not link its repository`,
      );
    }
  });

  test('every card names both actions in text, not only in an aria label', () => {
    for (const project of projects.items) {
      assert.ok(projectsHtml.includes('Project details'), 'the details button has no visible label');
      assert.ok(projectsHtml.includes('Visit repository'), 'the repository button has no visible label');
    }
  });

  test('the whole section offers no more buttons than there are projects', () => {
    // Two per project, so four in total. Anything more is a control that crept
    // back onto a card without anybody deciding to put it there.
    const buttons = projectsHtml.match(/<button/g) ?? [];
    assert.equal(
      buttons.length,
      projects.items.length,
      `the projects section renders ${buttons.length} buttons for ${projects.items.length} projects`,
    );
  });
});

describe('no link in the content is smaller than a thumb can hit', () => {
  // Measured, not guessed. Rendering the app inside a 320px wide iframe and
  // reading every anchor out of it showed the email, phone and LinkedIn links in
  // the contact block sitting at 18px tall. WCAG 2.2 asks for 24 by 24 as a
  // minimum, so those three were six pixels short, on the three links a reader is
  // most likely to press on a phone.
  //
  // A browser is not available in this suite, so the rule is enforced where it
  // can be: on the markup. Any anchor with no padding and no explicit size is a
  // bare text link whose hit area is exactly its line box, which is what made the
  // measurement come out at 18px in the first place.
  const HAS_HIT_AREA = /(^|\s)(p[trblxy]?-[0-9.]|px-[0-9.]|py-[0-9.]|h-[0-9.]|min-h-[0-9.]|size-[0-9.]|leading-\[)/;

  /**
   * Scoped to <main>, and deliberately so.
   *
   * The header and footer are excluded because the things flagged in them are
   * not touch targets in practice. The four desktop nav links are inside a
   * `hidden lg:flex` container, so they only exist from 1024px up where the
   * pointer is a mouse, and the mobile menu they are duplicated in uses `py-3`
   * for roughly 46px. The brand monogram is 34px, which clears the 24px
   * minimum. Padding the desktop nav would have grown the header, and there is
   * already a test holding the header to one row at 1024px.
   *
   * Checking chrome here would mean either failing on things that are fine or
   * teaching the test to guess at breakpoints, and a test that guesses is worse
   * than no test.
   *
   * Computed by a function rather than once at describe scope. A describe body
   * runs while the module is being evaluated, which is before the async before
   * hook has assigned html, so a constant here captures undefined and every
   * assertion below quietly passes or throws against nothing.
   */
  const mainRegion = () => /<main\b[\s\S]*?<\/main>/.exec(html)?.[0] ?? html;

  test('every anchor in the content has padding or an explicit size', () => {
    const main = mainRegion();
    const anchors = [...main.matchAll(/<a\b([^>]*)>/g)];

    const bare = [];
    for (const [, attrs] of anchors) {
      const cls = /class="([^"]*)"/.exec(attrs)?.[1] ?? '';
      if (!cls) {
        bare.push('<a> with no class at all');
        continue;
      }
      if (!HAS_HIT_AREA.test(cls)) bare.push(cls.slice(0, 80));
    }

    assert.equal(
      bare.length,
      0,
      `${bare.length} anchor(s) in the content have neither padding nor a size, so the tap ` +
        `target is the line box and nothing else:\n${bare.map((b) => '  ' + b).join('\n')}`,
    );
  });

  test('the scope is not empty, so the checks above are not vacuous', () => {
    // Guards the guard. A regex that failed to match would fall back to the whole
    // document, and a future edit that emptied <main> would turn this into a
    // check over nothing at all while still reporting success.
    const main = mainRegion();
    assert.ok(main.length > 5000, `the main region matched only ${main.length} characters`);
    assert.ok(main.includes('mailto:'), 'the main region does not contain the contact links');
  });

  test('the contact links carry a hit area that cancels its own layout', () => {
    // py-1 alone would grow the row and overlap the next row's link, because the
    // gap between rows is 16px. The negative margin is what makes the padding
    // safe, so the two have to stay together.
    assert.ok(
      /class="[^"]*py-1[^"]*-my-1[^"]*"/.test(mainRegion()),
      'the inline contact links lost their py-1 -my-1 pair',
    );
  });
});

describe('a nested scroller is exempted from the smooth scroll layer', () => {
  // The detail panel did not scroll, and every automated check said it did.
  // Its scrollHeight was 1482 in a 600px box, and assigning scrollTop moved it,
  // so the render test and the measurement both passed. Only a real wheel found
  // it, because setting scrollTop bypasses event handling entirely.
  //
  // The cause: Lenis listens for wheel and touch on the window and
  // preventDefaults anything it thinks it owns, so an inner overflow container
  // never received a native scroll. There was no way to see that from markup
  // alone except the marker Lenis itself provides, so the marker is the assertion.
  //
  // Verified in a real browser that a wheel over the panel is not consumed while
  // one over the page behind is, which is the behaviour that is actually wanted:
  // the panel scrolls and the page underneath does not.

  test('the detail panel carries data-lenis-prevent', () => {
    const detail = renderToString(
      createElement(ProjectDetail, { projectId: 'foodforward', onClose: noop }),
    );
    assert.ok(
      /data-lenis-prevent/.test(detail),
      'the detail panel has no data-lenis-prevent, so Lenis will eat every wheel event over it',
    );
  });

  test('the panel is a scroll container that can actually overflow', () => {
    // Guarding the guard. If the panel stopped being the scroller, the marker
    // would be harmless and this test would still pass while the original bug
    // came back through a different route.
    const detail = renderToString(
      createElement(ProjectDetail, { projectId: 'foodforward', onClose: noop }),
    );
    assert.ok(/overflow-y-auto/.test(detail), 'the detail panel is no longer the scroll container');
    assert.ok(/min-h-0/.test(detail), 'without min-h-0 the flex child cannot shrink, so it cannot scroll');
  });
});

describe('the project detail page', () => {  for (const project of projects.items) {
    test(`${project.id} detail renders its actions and repository`, () => {
      const detail = renderToString(
        createElement(ProjectDetail, { projectId: project.id, onClose: noop }),
      );

      for (const action of project.actions) {
        assert.ok(
          detail.includes(action.href),
          `detail page for ${project.id} is missing ${action.href}`,
        );
      }
      assert.ok(detail.includes(project.repo), `detail page for ${project.id} is missing its repository`);
      assert.ok(detail.includes('Visit the repository'), 'the repository action has no label');
      assert.match(detail, /role="dialog"/, 'the detail page is not a dialog, so it is not announced as one');
    });
  }

  test('an unknown project id renders nothing rather than an empty shell', () => {
    // Without this guard a stale or mistyped hash produces a blank overlay with
    // no way out, because the close button is inside the thing that failed.
    const detail = renderToString(
      createElement(ProjectDetail, { projectId: 'does-not-exist', onClose: noop }),
    );
    assert.equal(detail, '');
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

