import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

/**
 * The header had no navigation at all above 1024px, and nothing said so.
 *
 * Header.jsx built its breakpoint classes through a constant:
 *
 *     const DESKTOP_FROM = 'lg';
 *     <nav className={`hidden ${DESKTOP_FROM}:flex ...`}>
 *
 * Tailwind finds classes by scanning source text for literal strings. It cannot
 * resolve a template literal, so that rule was never emitted into the CSS at
 * all. The nav kept display:none from the hidden utility at every width, and
 * lg:hidden on the toggle worked only by accident, because some other file used
 * that class literally and Tailwind emitted it once for the whole project.
 *
 * Nothing caught it. The build passed, the unit tests passed, the render test
 * passed, and the deployed site was a working page with no menu on it. A class
 * that is never generated looks exactly like a class that does nothing, unless
 * you read the generated stylesheet. So that is what this does.
 */

const CLIENT_ROOT = path.join(import.meta.dirname, '..');
const SOURCE_DIRS = ['components', 'data', 'lib'];
const SOURCE_EXT = /\.(jsx|js)$/;

/** Tailwind breakpoints, mapped to the rem values it emits. */
const VARIANT_WIDTHS = { sm: 40, md: 48, lg: 64, xl: 80, '2xl': 96 };

/**
 * Vite is run through node rather than through the npm script, because on
 * Windows npm is npm.cmd and execFile('npm', ...) fails with ENOENT. A test that
 * only runs on the machine it was written on is a test nobody ends up running.
 */
const VITE_BIN = path.join(CLIENT_ROOT, 'node_modules', 'vite', 'bin', 'vite.js');

let css = '';
let buildFailed = null;

before(async () => {
  // A fresh build, because a test run against a stale stylesheet proves nothing.
  try {
    await run(process.execPath, [VITE_BIN, 'build'], { cwd: CLIENT_ROOT, timeout: 180_000 });
  } catch (err) {
    buildFailed = err;
    return;
  }

  const assets = path.join(CLIENT_ROOT, 'dist', 'assets');
  const files = (await fs.readdir(assets)).filter((f) => f.startsWith('index-') && f.endsWith('.css'));
  assert.equal(files.length, 1, 'expected exactly one index stylesheet, found ' + files.length);
  css = await fs.readFile(path.join(assets, files[0]), 'utf8');
});

async function sourceFiles() {
  const out = [];
  for (const dir of SOURCE_DIRS) {
    let entries = [];
    try {
      entries = await fs.readdir(path.join(CLIENT_ROOT, 'src', dir));
    } catch {
      continue;
    }
    for (const f of entries) {
      if (SOURCE_EXT.test(f)) out.push(path.join('src', dir, f));
    }
  }
  return out;
}

async function readSource(rel) {
  return fs.readFile(path.join(CLIENT_ROOT, rel), 'utf8');
}

/** Tailwind escapes a class for a selector, so the colon becomes backslash-colon. */
function escapeForSelector(cls) {
  return cls.replace(/([:[\]%().,/#!])/g, '\\$1');
}

const QUOTES = /^[`'"]+|[`'",]+$/g;

/**
 * Pull class strings out of a source file.
 *
 * Conditional fragments are included on purpose, because a whole class name
 * spliced in from a ternary is exactly the shape that gets dropped. Quotes and
 * trailing punctuation are stripped, because splitting a template literal on
 * whitespace leaves the closing quote glued to the last class, and
 * "md:border-t-0'" is not a class name.
 */
function candidateClasses(source) {
  const found = new Set();
  const patterns = [
    /className\s*=\s*"([^"]*)"/g,
    /className\s*=\s*'([^']*)'/g,
    /className\s*=\s*\{`([^`]*)`\}/g,
    /className\s*=\s*\{'([^']*)'\}/g,
  ];

  for (const pattern of patterns) {
    for (const m of source.matchAll(pattern)) {
      for (const token of (m[1] ?? '').split(/\s+/)) {
        const cls = token.trim().replace(QUOTES, '');
        if (!cls) continue;
        if (cls.includes('${') || cls.includes('{') || cls.includes('}')) continue;
        found.add(cls);
      }
    }
  }
  return found;
}

/** Every breakpoint prefix the source actually references. */
async function breakpointsInUse() {
  const used = new Set();
  for (const rel of await sourceFiles()) {
    for (const cls of candidateClasses(await readSource(rel))) {
      const variant = cls.split(':')[0];
      if (Object.prototype.hasOwnProperty.call(VARIANT_WIDTHS, variant)) used.add(variant);
    }
  }
  return used;
}

describe('the build produced a stylesheet worth inspecting', () => {
  test('the client build succeeds', () => {
    assert.equal(buildFailed, null, 'the client build failed: ' + (buildFailed?.message ?? 'unknown'));
  });

  test('every breakpoint in use has a media query', async () => {
    // Only for breakpoints the source actually uses. Tailwind emits a variant's
    // media query when something uses it and omits it otherwise, so demanding
    // all five would fail a perfectly healthy build. What matters is that a
    // breakpoint in use is never inert.
    const used = await breakpointsInUse();
    assert.ok(used.size >= 3, 'expected several breakpoints in use, found ' + [...used].join(', '));

    for (const variant of used) {
      const rem = VARIANT_WIDTHS[variant];
      assert.ok(
        css.includes('@media (width>=' + rem + 'rem)'),
        'the source uses ' + variant + ': classes but there is no @media (width>=' + rem + 'rem) block',
      );
    }
  });
});

describe('every responsive class in the source exists in the stylesheet', () => {
  test('no referenced variant class was dropped at build time', async () => {
    const missing = [];
    let checked = 0;

    for (const rel of await sourceFiles()) {
      for (const cls of candidateClasses(await readSource(rel))) {
        const variant = cls.split(':')[0];
        if (!Object.prototype.hasOwnProperty.call(VARIANT_WIDTHS, variant)) continue;
        // Arbitrary values such as lg:w-[42px] are emitted differently and are
        // not worth reconstructing here.
        if (cls.includes('[')) continue;

        checked += 1;
        if (!css.includes('.' + escapeForSelector(cls))) {
          missing.push(rel + ' uses "' + cls + '" which is not in the built CSS');
        }
      }
    }

    assert.ok(checked > 20, 'expected many variant classes to check, only found ' + checked);
    assert.deepEqual(missing, [], missing.join('\n'));
  });

  test('a variant class built through a template literal is refused', async () => {
    // The precise cause. An interpolated variant prefix is invisible to
    // Tailwind, so it must not be allowed in source at all. This is the check
    // that would have stopped the header bug on the day it was written.
    const offenders = [];

    for (const rel of await sourceFiles()) {
      const source = await readSource(rel);
      for (const m of source.matchAll(/\$\{[^}]+\}\s*:\s*[a-z-]+/g)) {
        offenders.push(rel + ' contains "' + m[0] + '", which Tailwind cannot resolve into a class');
      }
    }

    assert.deepEqual(offenders, [], offenders.join('\n'));
  });

  test('a variant utility is emitted after the unprefixed rule it overrides', async () => {
    // Ordering matters as well as presence. hidden sits early in the stylesheet
    // and lg:flex has to come after it, or display:none wins at every width.
    const hiddenAt = css.indexOf('.hidden{');
    assert.ok(hiddenAt > 0, 'could not find .hidden in the stylesheet');

    for (const variant of ['lg:flex', 'sm:flex', 'md:grid', 'lg:grid']) {
      const at = css.indexOf('.' + escapeForSelector(variant));
      if (at < 0) continue;
      assert.ok(at > hiddenAt, variant + ' is emitted before .hidden, so the unprefixed rule wins');
    }
  });
});

describe('the header can be found, and it fits', () => {
  test('the desktop nav and the mobile toggle are literal classes', async () => {
    const header = await readSource('src/components/Header.jsx');
    assert.ok(header.includes('hidden lg:flex'), 'the desktop nav needs a literal lg:flex');
    assert.ok(header.includes('lg:hidden flex'), 'the toggle needs a literal lg:hidden');
    assert.ok(!header.includes('DESKTOP_FROM'), 'the indirection constant is gone');
  });

  test('the nav is physically unable to wrap onto a second line', async () => {
    const header = await readSource('src/components/Header.jsx');
    assert.ok(header.includes('lg:flex-nowrap'), 'the nav needs lg:flex-nowrap');
    assert.ok(header.includes('whitespace-nowrap'), 'each label needs whitespace-nowrap');
  });

  test('the nav is short enough to fit on one line at 1024px', async () => {
    const content = await readSource('src/data/content.js');
    const block = /export const nav = \[([\s\S]*?)\];/.exec(content);
    assert.ok(block, 'could not find the nav array');

    const labels = [...block[1].matchAll(/label:\s*'([^']+)'/g)].map((m) => m[1]);
    assert.ok(
      labels.length >= 4 && labels.length <= 6,
      'expected 4 to 6 nav items so they fit one line, found ' + labels.length + ': ' + labels.join(', '),
    );

    const plainChars = labels
      .filter((l) => l !== 'Request Resume')
      .reduce((n, l) => n + l.length, 0);
    assert.ok(plainChars <= 40, 'nav labels total ' + plainChars + ' characters, which will wrap at 1024px');
  });

  test('every nav target is a section that actually exists', async () => {
    // A nav link to a missing id scrolls nowhere, which reads as a dead link.
    // The ids live in the section components, not in App.jsx.
    const content = await readSource('src/data/content.js');
    const block = /export const nav = \[([\s\S]*?)\];/.exec(content);
    const targets = [...block[1].matchAll(/target:\s*'#([\w-]+)'/g)].map((m) => m[1]);
    assert.ok(targets.length > 0, 'no nav targets found at all');

    const components = (await fs.readdir(path.join(CLIENT_ROOT, 'src', 'components')))
      .filter((f) => f.endsWith('.jsx'))
      .map((f) => readSource(path.join('src', 'components', f)));
    const all = (await Promise.all(components)).join('\n');

    for (const id of targets) {
      assert.ok(all.includes('id="' + id + '"'), 'nav targets #' + id + ' but no section renders that id');
    }
  });
});
