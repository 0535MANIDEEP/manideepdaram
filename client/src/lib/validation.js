/**
 * Client side validation for the resume request form.
 *
 * This used to live on the server. The site is static now, so the browser is
 * the only place validation can happen. It is kept pure, with no DOM access,
 * so it can be unit tested directly with node:test.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: 120,
  email: 200,
  role: 160,
  company: 160,
  message: 4000,
};

const str = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * @param {object} body
 * @returns {{ ok: true, value: object } | { ok: false, errors: Record<string,string> }}
 */
export function validateResumeRequest(body = {}) {
  const errors = {};

  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const role = str(body.role);
  const company = str(body.company);
  const message = str(body.message);

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;

  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  else if (email.length > LIMITS.email) errors.email = 'Email is too long.';

  // The role is the point of the form, so it is required.
  if (!role) errors.role = 'Please enter the role you are hiring for.';
  else if (role.length > LIMITS.role) errors.role = `Role must be under ${LIMITS.role} characters.`;

  if (company.length > LIMITS.company) errors.company = 'Company name is too long.';
  if (message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, value: { name, email, role, company, message } };
}

/** Spam trap. Bots fill every field they find; humans never see this one. */
export function isHoneypot(body = {}) {
  return Boolean(str(body.website));
}
