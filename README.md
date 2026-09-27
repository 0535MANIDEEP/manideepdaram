# Manideep Daram, portfolio

Static single page portfolio. Deployed to GitHub Pages. No server, no database.

**Live:** https://0535manideep.github.io/manideepdaram/

Recruiters request the resume through a form. Submissions arrive in Gmail.

## Stack

Vite 8, React 19, Tailwind CSS v4, Motion, Lenis, Phosphor icons. JavaScript with JSX,
no TypeScript. Deployed as static files by GitHub Actions.

## Local development

```bash
npm install
npm --prefix client install
npm run dev        # http://localhost:5173
```

## Gates

```bash
npm test           # 54 tests, node:test
npm run build      # static build into client/dist
```

Both run in CI before every deploy. A red gate blocks the publish.

The tests are worth reading rather than skimming, because several of them exist
because something was once wrong in a way that nothing else caught:

- **`render.test.js`** renders the whole app through Vite and asserts on the markup.
  A blank page scores 1.0 on Lighthouse, so a passing build and a passing unit suite
  are not evidence that the page renders.
- **`responsive.test.js`** reads the generated stylesheet and checks that every
  literal class in the source was actually emitted. Tailwind scans for literal
  strings and cannot resolve a variable, so a class assembled from fragments is
  silently never generated. The header lost its entire navigation this way: a
  breakpoint held in a constant, a rule that was never emitted, and a deployed
  page with no menu on it that every other test called healthy.
- Both also refuse copy that claims a feature or library the code does not have.
  Firebase, Google Maps, a chat thread and "real time" were all described on this
  site at some point and none of them exist in either project.

## The resume request form

There is no resume download button. The form is the only conversion path, so it has to
actually deliver. It has two delivery modes and picks the first one available.

**1. Hosted endpoint (preferred).** Set `VITE_FORM_ENDPOINT` and submissions are POSTed
there and emailed to you.

The quickest service is Formspree:

1. Create a free account at formspree.io and add a form.
2. Copy the endpoint it shows you, for example `https://formspree.io/f/abcdwxyz`.
3. Create `.env` in `client/` (or set the repository variable of the same name) with:

   ```
   VITE_FORM_ENDPOINT=https://formspree.io/f/abcdwxyz
   VITE_OWNER_EMAIL=manideepdaram@gmail.com
   ```

4. In the Formspree dashboard set the notification recipient to your address and turn on
   the "reply to sender" option so you can answer straight from the notification.

Anything that accepts a JSON POST and emails you will work. FormSubmit, Basin, Web3Forms
and a Cloudflare Worker all fit.

**2. Mail client fallback (works with zero config).** With no endpoint set, the form
composes a prefilled `mailto:` to `VITE_OWNER_EMAIL` and opens the visitor's mail app.
The form is never dead.

Because the site is static there is no server side validation. The same rules that used
to live in the Express API now run in the browser, in `client/src/lib/validation.js`, and
are covered by unit tests. A hidden honeypot field absorbs bots.

## Deployment

Push to `main`. `.github/workflows/deploy.yml` runs the tests, builds, and publishes to
GitHub Pages. The repository must have Pages set to **GitHub Actions** as the source, and
the environment must be created when first prompted.

To attach a domain later: add a `CNAME` file to `client/public/` containing the domain,
and enable **Enforce HTTPS** in the repository settings. Asset paths are relative, so no
rebuild or config change is needed.

## Content

Every string, figure and link lives in `client/src/data/content.js`. Nothing there is
invented. To change the site, edit that one file.

## Projects

Two, and only two. Each card carries exactly two controls, **Project details** and
**Visit repository**, and nothing else, so the card is a choice rather than a menu of
five equally weighted pills. Everything else lives on the detail page at
`#/project/<id>`, which is a real URL: linkable, reload safe, and closed by the
browser back button.

| Project | Stack | Where |
| --- | --- | --- |
| FoodForward | Node, Express, MySQL, React, Tailwind | [Live](https://0535manideep.github.io/foodforward/) · [Source](https://github.com/0535MANIDEEP/foodforward) · [Paper](https://www.jetir.org/papers/JETIR2404570.pdf) |
| Android Blood Bank | Java, XML, SQLite, Material 3 | [APK](https://github.com/0535MANIDEEP/blood-bank-android/releases/download/v1.0/BloodBank-v1.0.apk) · [Source](https://github.com/0535MANIDEEP/blood-bank-android) |

FoodForward is MySQL, not MongoDB, because the JETIR paper names MySQL and a
published paper cannot be edited to match a portfolio. The paper is
[JETIR2404570](https://www.jetir.org/papers/JETIR2404570.pdf), pp. f645-f647, April
2024, and the citation on the site carries its real ISSN, 2349-9162.

A download link has to point at the build itself, not at a page describing one. The
Android card's primary action is the release asset, and a test asserts the href ends
in `.apk` so it cannot quietly become a link to the releases page.

## Design constraints

Built to the `design-taste-frontend` skill. The rules that visibly shaped it:

- One accent colour (cyan `#00F0FF`) across the whole page. Emerald appears only as the
  "published" marker on the JETIR card.
- One corner-radius system, one type scale, dark theme locked page-wide.
- Zero em-dashes in any user-visible string.
- The hero holds at most four text elements. Metrics sit in their own band below it.
- At most one horizontal marquee.
- All motion honours `prefers-reduced-motion`.

Verified with Lighthouse against the deployed page: accessibility 1.0, best practices
1.0, SEO 1.0, no failing audits. Measured on a page with real content, which matters
here, because a blank page also scores 1.0 and this site shipped one for a while.
