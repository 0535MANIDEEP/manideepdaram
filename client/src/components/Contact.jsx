import { useState } from 'react';
import { toast } from 'sonner';
import { CircleNotch } from './icons.jsx';
import { contact, identity } from '../data/content.js';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { submitResumeRequest, SubmitError } from '../lib/api.js';
import { validateResumeRequest, isHoneypot } from '../lib/validation.js';

const EMPTY = { name: '', email: '', role: '', company: '', message: '', website: '' };

function Field({ id, label, value, onChange, error, type = 'text', placeholder, required, testId, autoComplete }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-primary">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        data-testid={testId}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`rounded-control border bg-ink px-4 py-3 text-sm text-primary transition-colors duration-200 placeholder:text-muted focus:outline-none ${
          error ? 'border-red-400/70' : 'border-line hover:border-line-strong focus:border-accent'
        }`}
      />
      {/* Error text sits below the input. (skill 4.6) */}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | sent

  const update = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    // A filled honeypot gets a success response so the bot learns nothing.
    if (isHoneypot(values)) {
      setStatus('sent');
      setValues(EMPTY);
      return;
    }

    const checked = validateResumeRequest(values);
    if (!checked.ok) {
      setErrors(checked.errors);
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      const result = await submitResumeRequest(checked.value);

      setStatus('sent');
      setValues(EMPTY);

      if (result.delivered === 'mailto') {
        // No form endpoint configured, so the visitor's mail app took over.
        toast.success(contact.successTitle, {
          description: 'Your email app should now be open with the request ready to send.',
        });
      } else {
        toast.success(contact.successTitle, { description: contact.successBody });
      }
    } catch (error) {
      setStatus('idle');

      if (error instanceof SubmitError && error.status === 422) {
        setErrors({ ...error.fields });
        return;
      }
      toast.error('Not sent', {
        description:
          error instanceof SubmitError && error.status === 'network'
            ? contact.errors.network
            : contact.errors.generic,
      });
    }
  };

  const busy = status === 'submitting';

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading title={contact.heading} lede={contact.body} id="contact-heading" />

          <Reveal delay={0.08}>
            {/* Plain elements, not <dl>: a <div> wrapper between <dl> and
                <dt>/<dd> fails the axe definition-list rule. */}
            <div className="mt-10 space-y-4">
              {[
                ['Email', identity.email, `mailto:${identity.email}`],
                ['Phone', identity.phone, identity.phoneHref],
                ['Location', identity.location, null],
                ['LinkedIn', 'linkedin.com/in/manideep-daram', identity.linkedin],
              ].map(([label, value, href]) => (
                <div key={label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                  <p className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {label}
                  </p>
                  <p className="text-sm text-primary">
                    {href ? (
                      // py-1 with -my-1 adds 8px of tap height and cancels the
                      // layout growth, so the hit box goes from a measured 18px to
                      // 28px without moving anything. 18px fails the WCAG 2.2 target
                      // size minimum of 24 by six, on the links a reader is most
                      // likely to press: email, phone and LinkedIn. Negative margin
                      // rather than padding alone, because these sit in a 16px gap
                      // and padding without the cancellation would overlap the
                      // neighbouring row's hit area.
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className="inline-block py-1 -my-1 transition-colors hover:text-accent"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              noValidate
              data-testid="contact-form"
              className="rounded-surface border border-line bg-surface p-7 sm:p-9"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  id="name"
                  label={contact.fields.name.label}
                  placeholder={contact.fields.name.placeholder}
                  testId={contact.fields.name.testId}
                  autoComplete="name"
                  value={values.name}
                  onChange={update('name')}
                  error={errors.name}
                  required
                />
                <Field
                  id="email"
                  type="email"
                  label={contact.fields.email.label}
                  placeholder={contact.fields.email.placeholder}
                  testId={contact.fields.email.testId}
                  autoComplete="email"
                  value={values.email}
                  onChange={update('email')}
                  error={errors.email}
                  required
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  id="role"
                  label={contact.fields.role.label}
                  placeholder={contact.fields.role.placeholder}
                  testId={contact.fields.role.testId}
                  value={values.role}
                  onChange={update('role')}
                  error={errors.role}
                  required
                />
                <Field
                  id="company"
                  label={contact.fields.company.label}
                  placeholder={contact.fields.company.placeholder}
                  testId={contact.fields.company.testId}
                  autoComplete="organization"
                  value={values.company}
                  onChange={update('company')}
                  error={errors.company}
                />
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-primary">
                  {contact.fields.message.label}
                  <span className="ml-2 font-mono text-[11px] font-normal text-muted">
                    optional
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={update('message')}
                  placeholder={contact.fields.message.placeholder}
                  data-testid={contact.fields.message.testId}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`resize-y rounded-control border bg-ink px-4 py-3 text-sm text-primary transition-colors duration-200 placeholder:text-muted focus:outline-none ${
                    errors.message ? 'border-red-400/70' : 'border-line hover:border-line-strong focus:border-accent'
                  }`}
                />
                {errors.message ? (
                  <p id="message-error" className="text-xs text-red-300">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {/* Spam trap. Off screen but not display:none, so bots still fill it. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={update('website')}
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={busy}
                  data-testid="contact-form-submit-btn"
                  className="inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-3 text-sm font-bold text-ink transition-all duration-200 hover:brightness-110 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? <CircleNotch size={16} weight="bold" className="animate-spin" /> : null}
                  {busy ? 'Sending' : contact.submitLabel}
                </button>

                <p className="font-mono text-[11px] text-muted">
                  Fields marked * are required
                </p>
              </div>

              {status === 'sent' ? (
                <p
                  role="status"
                  data-testid="contact-form-success"
                  className="mt-6 rounded-surface border border-verified/30 bg-verified/10 px-4 py-3 text-sm text-primary"
                >
                  {contact.successBody}
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
