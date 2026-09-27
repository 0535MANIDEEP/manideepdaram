# Manideep Daram, portfolio

Static single page portfolio. Deployed to GitHub Pages. No server, no database.

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
npm test           # 18 unit tests, node:test
npm run build      # static build into client/dist
```

Both run in CI before every deploy. A red gate blocks the publish.

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

## Design constraints

Built to the `design-taste-frontend` skill. The rules that visibly shaped it:

- One accent colour (cyan `#00F0FF`) across the whole page. Emerald appears only as the
  "published" marker on the JETIR card.
- One corner-radius system, one type scale, dark theme locked page-wide.
- Zero em-dashes in any user-visible string.
- The hero holds at most four text elements. Metrics sit in their own band below it.
- At most one horizontal marquee.
- All motion honours `prefers-reduced-motion`.

Verified with Lighthouse: accessibility 1.0, best practices 1.0, SEO 1.0.
