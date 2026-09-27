/**
 * Resume request delivery.
 *
 * The site is static (GitHub Pages), so there is no server of our own to receive
 * submissions. Two delivery paths, in order of preference:
 *
 *  1. A hosted form endpoint, configured via VITE_FORM_ENDPOINT. Anything that
 *     accepts a JSON POST and emails you works. Formspree is the easiest:
 *     create a form, copy the https://formspree.io/f/xxxx id, put it in the env
 *     var. Submissions then arrive in your Gmail.
 *
 *  2. With no endpoint configured, the form composes a prefilled mailto: and
 *     hands off to the visitor's own mail client. The form is never dead: with
 *     zero configuration it still gets the request to your inbox.
 */

const ENDPOINT = (import.meta.env?.VITE_FORM_ENDPOINT ?? '').trim();
const OWNER_EMAIL = import.meta.env?.VITE_OWNER_EMAIL ?? '';

export const hasEndpoint = ENDPOINT.length > 0;

export class SubmitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SubmitError';
  }
}

/** Hands the request to the visitor's mail client. Always available. */
function openMailClient({ name, email, role, company, message }) {
  const subject = `Resume request: ${role}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Role: ${role}`,
    company ? `Company: ${company}` : null,
    '',
    message || '(no message)',
  ]
    .filter(Boolean)
    .join('\n');

  const href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
  return { delivered: 'mailto' };
}

export async function submitResumeRequest(payload) {
  if (!hasEndpoint) return openMailClient(payload);

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        role: payload.role,
        company: payload.company,
        message: payload.message,
      }),
    });
  } catch {
    throw new SubmitError('network');
  }

  if (!res.ok) throw new SubmitError('rejected');

  return { delivered: 'endpoint' };
}
