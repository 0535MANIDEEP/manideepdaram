import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateResumeRequest, isHoneypot } from './validation.js';

const valid = {
  name: 'Priya Sharma',
  email: 'Priya@Company.com',
  role: 'Software Engineer Trainee',
  company: 'Acme',
  message: 'Looking for a fresher who knows Java.',
};

describe('validateResumeRequest', () => {
  test('accepts a complete request and normalises the email', () => {
    const r = validateResumeRequest(valid);
    assert.equal(r.ok, true);
    assert.equal(r.value.email, 'priya@company.com');
  });

  test('trims whitespace', () => {
    const r = validateResumeRequest({ ...valid, name: '  Priya Sharma  ' });
    assert.equal(r.ok, true);
    assert.equal(r.value.name, 'Priya Sharma');
  });

  test('treats company and message as optional', () => {
    const r = validateResumeRequest({ name: 'A B', email: 'a@b.co', role: 'Dev' });
    assert.equal(r.ok, true);
    assert.equal(r.value.company, '');
    assert.equal(r.value.message, '');
  });

  test('role is required, because it is the point of the form', () => {
    const r = validateResumeRequest({ name: 'A B', email: 'a@b.co' });
    assert.equal(r.ok, false);
    assert.ok(r.errors.role);
    assert.ok(!r.errors.company, 'company must stay optional');
  });

  test('rejects a missing name', () => {
    const r = validateResumeRequest({ ...valid, name: '' });
    assert.equal(r.ok, false);
    assert.ok(r.errors.name);
  });

  test('rejects malformed emails', () => {
    for (const bad of ['nope', 'a@b', 'a b@c.com', '@b.com', 'a@.com']) {
      const r = validateResumeRequest({ ...valid, email: bad });
      assert.equal(r.ok, false, `expected "${bad}" to be rejected`);
      assert.ok(r.errors.email);
    }
  });

  test('rejects overlong fields', () => {
    const r = validateResumeRequest({ ...valid, message: 'x'.repeat(4001) });
    assert.equal(r.ok, false);
    assert.ok(r.errors.message);
  });

  test('reports every invalid field at once', () => {
    const r = validateResumeRequest({ name: '', email: 'bad', role: '' });
    assert.equal(r.ok, false);
    assert.deepEqual(Object.keys(r.errors).sort(), ['email', 'name', 'role']);
  });

  test('survives non-string values without throwing', () => {
    const r = validateResumeRequest({ name: 42, email: {}, role: [] });
    assert.equal(r.ok, false);
  });

  test('handles an entirely empty body', () => {
    const r = validateResumeRequest({});
    assert.equal(r.ok, false);
    assert.ok(r.errors.name && r.errors.email && r.errors.role);
  });
});

describe('isHoneypot', () => {
  test('ignores a human who left the hidden field empty', () => {
    assert.equal(isHoneypot(valid), false);
    assert.equal(isHoneypot({ website: '   ' }), false);
  });

  test('flags a bot that filled the hidden field', () => {
    assert.equal(isHoneypot({ website: 'http://spam.example' }), true);
  });
});
