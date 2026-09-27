# PLAN — Manideep Daram Portfolio

## Finish line

A recruiter opens the site, understands Manideep in 20 seconds, and requests his resume.
The request reaches his Gmail. The site is live on GitHub Pages. Tests and build are green
in CI before every deploy.

## Status: COMPLETE, deployed to GitHub Pages

## Architecture (final)

```
portfolio/
  client/     Vite 8 + React 19 + Tailwind v4 + Motion + Lenis + Phosphor + Sonner
  .github/workflows/deploy.yml   test -> build -> publish to Pages
  .env.example                  form endpoint + owner email
```

Static output in `client/dist`, served by GitHub Pages. Asset paths are relative, so the
same build works at a `github.io/repo/` path and at a custom domain root.

## Architecture history

This started as an Express + Mongoose + Resend app with a private `/admin` inbox and 23
passing API tests. That was reverted on request in favour of GitHub Pages, which cannot
run a server. The API layer and admin route were deleted rather than left as dead code.
They remain in git history if they are ever wanted back.

The server-side validation rules were ported to `client/src/lib/validation.js` so the
static form keeps the same guarantees, with tests.

## Copy decisions (from user, 2026-09-27)

- No "tailoring" / "curation" language anywhere.
- Contact heading: **"Want to hire me? Request my resume."**
- Achievements heading: **"Milestones I'm proud of"**
- All CTA labels: **"Request Resume"**
- Success message confirms Manideep will respond with his resume.
- No direct resume download.

## Dials

`DESIGN_VARIANCE: 8` · `MOTION_INTENSITY: 6` · `VISUAL_DENSITY: 4` · theme: **dark, locked**

---

## P0 Foundation — done

- [x] Tailwind v4 via `@tailwindcss/vite`
- [x] Tokens as CSS variables: 1 accent, 1 radius system, 1 type scale
- [x] Self-hosted fonts (`@fontsource`), latin subset only
- [x] `content.js` single source of truth
- [x] Dark theme lock, fixed grain overlay, global `prefers-reduced-motion`

## P1 Sections — done

- [x] Header: glass, MD monogram, 7 nav links one line, 72px, mobile menu
- [x] Hero: asymmetric split, masked line reveal, Canvas 2D particles, 4 text elements
- [x] Metrics band under the hero
- [x] Marquee ribbon, exactly one
- [x] About: asymmetric 2-col, strengths matrix
- [x] Education: timeline + coursework chips
- [x] Skills: asymmetric 7/5 then 5/7
- [x] Projects: 2-cell bento, real imagery
- [x] Research: JETIR panel, emerald only as the published marker
- [x] Milestones: "Milestones I'm proud of"
- [x] Contact: 5 fields, client-side validation, full states, Sonner toast, honeypot
- [x] Footer: socials, address only
- [x] 8+ distinct layout families

## P2 Form delivery — done

- [x] Hosted endpoint via `VITE_FORM_ENDPOINT`, POSTed as JSON
- [x] `mailto:` fallback so the form works with zero configuration
- [x] Validation ported to the client, pure and unit tested
- [x] Honeypot spam trap
- [x] Network and rejection error states surfaced to the visitor

## P3 Deployment — done

- [x] GitHub Actions workflow: test, build, publish to Pages
- [x] Relative asset base so project paths and custom domains both work
- [x] `robots.txt`
- [x] Public repo under `0535MANIDEEP`

## P4 Verification — done

- [x] `npm test` exit 0
- [x] `npm run build` exit 0
- [x] Lighthouse: accessibility 1.0, best practices 1.0, SEO 1.0, zero failing audits
- [x] Nav one line, 72px, no wrap (measured)
- [x] Em-dash scan = 0 across client source
- [x] Zero `h-screen` usages
- [x] Reduced-motion media blocks present and correct in the built stylesheet
- [ ] Responsive at 375 / 768 / 1440. No viewport-resize tool was available, so this was
      verified structurally, not by measurement.
- [ ] Live reduced-motion session. No media-emulation tool was available. The stylesheet
      rules were confirmed in the built output instead.

### Bugs found and fixed during verification

| Bug | Fix |
|---|---|
| Hero H1 rendered invisible, frozen at `translateY(110%)` | Replaced the JS-driven mask with a CSS keyframe |
| `text-muted` at 3.90:1, failed WCAG AA on 8 elements | Lightened to `#8294a8`, now 5.8:1 |
| `<dl>` containing `<div>` wrappers, axe failure | Replaced with plain elements |
| Brand link accessible name did not match visible text on mobile | Name always visible, derived from content |
| `robots.txt` served the SPA fallback | Added a real one |
| 60 font files, 605 KB | Latin subset only, 18 files, 300 KB |
| 501 KB single JS chunk | Vendor split into react, motion, app, toast, scroll |

---

## Remaining, needs the user

| Item | Why | Effect today |
| --- | --- | --- |
| `VITE_FORM_ENDPOINT` | Deliver submissions to Gmail | Form uses the `mailto:` fallback, which works but asks the recruiter to press send in their own mail app. |
| Custom domain | Their call, deferred | Live on the `github.io` address. A `CNAME` file plus Enforce HTTPS is all it takes later. |

The admin password supplied earlier is unused. There is no admin page on a static site,
so it was never stored and never committed.
