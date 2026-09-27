import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Static checks that would have caught the blank page before it deployed.
 *
 * The deployed portfolio rendered a blank white page because Projects.jsx used
 * <ArrowDown> while importing only { ArrowUpRight }. ArrowDown was undefined, so
 * the first project link to render threw a ReferenceError and took the entire
 * React tree with it.
 *
 * The existing twelve tests all passed the whole time, because none of them
 * looked at a component. The Lighthouse scores were 1.0 across the board, which
 * is exactly what a blank page scores, so the perfect report was evidence of the
 * outage rather than evidence of quality.
 *
 * Note which of these two checks actually catches this bug. ArrowDown is a real
 * export of icons.jsx, so "do the imports exist in the module" passes happily
 * while the file that renders it never imports it. The check that bites is the
 * second one, which walks the other direction: is every component-shaped element
 * used in this file bound in this file?
 */

const COMPONENT_DIR = path.join(import.meta.dirname, 'components');
const ICONS_PATH = path.join(COMPONENT_DIR, 'icons.jsx');

/** Everything icons.jsx exports, in both declaration and re-export form. */
async function iconsExports() {
  const source = await fs.readFile(ICONS_PATH, 'utf8');
  const names = new Set(
    [...source.matchAll(/export (?:function|const) ([A-Za-z0-9_]+)/g)].map((m) => m[1]),
  );

  // The `export { A, B }` block has to be read too. Matching only the first form
  // is how a checker can report ten perfectly good imports as missing, which is
  // worse than having no checker at all.
  for (const block of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const raw of block[1].split(',')) {
      const name = raw.trim().split(/\s+as\s+/)[0].trim();
      if (name) names.add(name);
    }
  }
  return names;
}

async function componentFiles() {
  return (await fs.readdir(COMPONENT_DIR)).filter((f) => f.endsWith('.jsx'));
}

/** Names a file binds: import specifiers plus local declarations. */
function bindingsIn(source) {
  const bound = new Set();

  for (const m of source.matchAll(/import\s*(?:\{([^}]+)\}|([A-Za-z0-9_$]+))\s*from/g)) {
    if (m[1]) {
      for (const raw of m[1].split(',')) {
        const name = raw.trim().split(/\s+as\s+/).pop()?.trim();
        if (name) bound.add(name);
      }
    }
    if (m[2]) bound.add(m[2]);
  }

  for (const m of source.matchAll(/(?:function|const|class)\s+([A-Za-z0-9_$]+)/g)) {
    bound.add(m[1]);
  }

  // Props destructured with a rename, e.g. `({ as: Tag = 'div' })`. Reveal.jsx
  // renders <Tag> exactly that way, and a binder that misses it reports a false
  // positive on correct code, which is how a checker earns itself an ignore.
  for (const m of source.matchAll(/([A-Za-z0-9_$]+)\s*:\s*([A-Z][A-Za-z0-9_]*)\s*[,}=]/g)) {
    bound.add(m[2]);
  }

  return bound;
}

/** React and library members that are legitimately capitalised but unbound here. */
const AMBIENT = new Set([
  'Fragment', 'Suspense', 'StrictMode', 'Profiler',
  'React', 'createElement', 'Fragment',
  'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
  'useLayoutEffect', 'useReducer', 'useContext', 'useId', 'useSyncExternalStore',
  'motion', 'AnimatePresence', 'useScroll', 'useTransform', 'useMotionValue',
  'useSpring', 'useReducedMotion', 'useInView',
  'Toaster', 'toast',
]);

describe('icons module', () => {
  test('the export parser sees the names the components actually import', async () => {
    // Guards the guard. If this drifts, every import check below passes
    // vacuously, which is worse than having no check.
    const exported = await iconsExports();
    assert.ok(exported.has('ICONS'), 'ICONS should be exported');
    assert.ok(exported.has('Icon'), 'Icon should be exported');
    assert.ok(exported.has('ArrowDown'), 'ArrowDown should be exported via the re-export block');
    assert.ok(exported.has('ArrowUpRight'), 'ArrowUpRight should be exported via the re-export block');
    assert.ok(exported.size >= 12, `expected at least 12 exports, parsed only ${exported.size}`);
  });

  test('every ICONS key resolves to an imported component', async () => {
    // A registry entry pointing at nothing renders as null and looks like a
    // deliberate empty state, so it is never noticed.
    const source = await fs.readFile(ICONS_PATH, 'utf8');
    const block = /export const ICONS = \{([\s\S]*?)\n\};/.exec(source);
    assert.ok(block, 'could not parse the ICONS registry');

    const keys = [...block[1].matchAll(/^\s{2}([A-Za-z0-9_]+):/gm)].map((m) => m[1]);
    const values = [...block[1].matchAll(/^\s{2}[A-Za-z0-9_]+:\s*([A-Za-z0-9_]+),/gm)].map((m) => m[1]);

    assert.equal(keys.length, values.length, 'every registry key should have a value');
    const unbound = values.filter((v) => !bindingsIn(source).has(v));
    assert.deepEqual(unbound, [], `ICONS entries referencing nothing: ${unbound.join(', ')}`);
  });
});

describe('no component uses a component it never imported', () => {
  test('every PascalCase JSX element is bound in its own file', async () => {
    // This is the check that catches the blank page. For every component-shaped
    // element in every file, is that name bound in that file? ArrowDown was a
    // legitimate export of icons.jsx and was still undefined here.
    const offenders = [];

    for (const file of await componentFiles()) {
      const source = await fs.readFile(path.join(COMPONENT_DIR, file), 'utf8');
      const bound = bindingsIn(source);

      for (const m of source.matchAll(/<([A-Z][A-Za-z0-9_]*)[\s/>]/g)) {
        const name = m[1];
        if (AMBIENT.has(name)) continue;
        if (bound.has(name)) continue;
        offenders.push(`${file} renders <${name}> but never imports or defines it`);
      }
    }

    assert.deepEqual(offenders, [], offenders.join('\n'));
  });

  test('every named icon import is actually exported by icons.jsx', async () => {
    const exported = await iconsExports();
    const offenders = [];

    for (const file of await componentFiles()) {
      const source = await fs.readFile(path.join(COMPONENT_DIR, file), 'utf8');
      for (const m of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*'\.\/icons\.jsx'/g)) {
        for (const raw of m[1].split(',')) {
          const name = raw.trim();
          if (name && !exported.has(name)) {
            offenders.push(`${file} imports { ${name} }, which icons.jsx does not export`);
          }
        }
      }
    }

    assert.deepEqual(offenders, [], offenders.join('\n'));
  });

  test('every <Icon name> is a key in the ICONS registry', async () => {
    // Icon returns null for an unknown name, so a typo is invisible at runtime.
    // That is correct behaviour and exactly why it needs a test.
    const source = await fs.readFile(ICONS_PATH, 'utf8');
    const block = /export const ICONS = \{([\s\S]*?)\n\};/.exec(source);
    const keys = new Set([...block[1].matchAll(/^\s{2}([A-Za-z0-9_]+):/gm)].map((m) => m[1]));

    // Icon names also live in data files, not just components.
    const searchDirs = [COMPONENT_DIR, path.join(import.meta.dirname, 'data')];
    const used = new Set();
    const origin = new Map();

    for (const dir of searchDirs) {
      const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.jsx') || f.endsWith('.js'));
      for (const file of files) {
        const text = await fs.readFile(path.join(dir, file), 'utf8');
        for (const m of text.matchAll(/name:\s*['"]([A-Za-z0-9_]+)['"]/g)) {
          // Only icon-shaped names; data files hold plenty of other name fields.
          if (keys.has(m[1])) continue;
          if (!/^[a-z][A-Za-z0-9]*$/.test(m[1])) continue;
          used.add(m[1]);
          origin.set(m[1], `${path.basename(dir)}/${file}`);
        }
        for (const m of text.matchAll(/<Icon\s+[^>]*name="([A-Za-z0-9_]+)"/g)) {
          used.add(m[1]);
          origin.set(m[1], `${path.basename(dir)}/${file}`);
        }
      }
    }

    // Filter down to names that look like they were meant to be icons: the real
    // signal is a name that is close to a registry key but misspelled.
    const nearMisses = [...used].filter(
      (name) => !keys.has(name) && [...keys].some((k) => k.toLowerCase() === name.toLowerCase()),
    );

    assert.deepEqual(
      [...nearMisses].map((n) => `${n} in ${origin.get(n)}`),
      [],
      'icon names that differ from a registry key only by case',
    );
  });
});
