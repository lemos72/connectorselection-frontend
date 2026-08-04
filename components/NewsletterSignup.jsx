'use client';

import { useState } from 'react';
import { STRAPI_URL } from '../lib/strapi';

const API_PATH = '/api/newsletter-subscribers';

const initialFormState = {
  email: '',
  // Honeypot field, same pattern as ContactForm — real users never see or
  // reach this. Bots that blindly fill every input still get caught.
  cs_verify_field: '',
};

export default function NewsletterSignup({ source = 'unknown' }) {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot check — if this hidden field got filled in, silently
    // pretend success without actually submitting anything.
    if (formData.cs_verify_field) {
      setStatus('success');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch(`${STRAPI_URL}${API_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            email: formData.email,
            subscribed_at: new Date().toISOString(),
            source,
            synced_to_brevo: false,
          },
        }),
      });

      if (!res.ok) {
        // Strapi returns 400 with a ValidationError if the email already
        // exists (unique constraint) — treat that as a friendly "already
        // subscribed" success rather than a hard error.
        const body = await res.json().catch(() => null);
        const isDuplicate =
          res.status === 400 &&
          JSON.stringify(body || '').toLowerCase().includes('unique');

        if (isDuplicate) {
          setStatus('success');
          setFormData(initialFormState);
          return;
        }

        throw new Error(`Request failed: ${res.status}`);
      }

      setStatus('success');
      setFormData(initialFormState);
    } catch (err) {
      console.error('Newsletter signup failed:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="cs-newsletter cs-newsletter-success">
        <h3>You&apos;re subscribed</h3>
        <p>Thanks for signing up — we&apos;ll keep you posted on new guides and industry updates.</p>
      </div>
    );
  }

  return (
    <div className="cs-newsletter">
      <h3>Get new guides in your inbox</h3>
      <p>
        Occasional updates on connector selection, signal integrity, and
        interconnect design — no spam.
      </p>
      <form className="cs-newsletter-form" onSubmit={handleSubmit}>
        {/* Honeypot — hidden via inline styles so it's invisible to real
            users regardless of whether the site's CSS has been wired up
            yet. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          <label htmlFor={`cs_verify_field_${source}`}>Leave this field empty</label>
          <input
            type="text"
            id={`cs_verify_field_${source}`}
            name="cs_verify_field"
            value={formData.cs_verify_field}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="new-password"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          required
          value={formData.email}
          onChange={handleChange}
          className="cs-newsletter-input"
        />
        <button
          type="submit"
          className="cs-btn"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {status === 'error' && (
        <div className="cs-form-error">
          Something went wrong. Please try again, or email us at{' '}
          <a href="mailto:lemos@connectorselection.com">lemos@connectorselection.com</a>.
        </div>
      )}
    </div>
  );
}
