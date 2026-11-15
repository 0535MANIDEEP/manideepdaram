# Security Policy

## Reporting a vulnerability

Email manideepdaram@gmail.com with the subject `Security report — this repository`.
Include what you found, how to reproduce it, and the impact you believe it has.
You will get an acknowledgement within 72 hours. Please give 90 days for a fix
and coordinated disclosure before publishing.

Do not open a public issue for a vulnerability that exposes data or access.

## Scope

This is a portfolio project. The deployment is static (GitHub Pages); there is
no backend, database or user data to reach through this repository. Still in
scope, and still worth reporting: the build pipeline, dependencies, and anything
that could meaningfully harm the people who reuse this code.

## What this project does to reduce risk

- CI on every push and pull request
- `npm ci` from a committed lockfile, never ad hoc installs in CI
- Dependencies monitored with Dependabot
- No secrets in the repository — none are needed for a static site
