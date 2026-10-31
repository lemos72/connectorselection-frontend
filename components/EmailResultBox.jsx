'use client';

import { useState } from 'react';
import { STRAPI_URL } from '../lib/strapi';

const API_PATH = '/api/result-requests';
const MAX_TEXT = 1500;

// "Email me this result" box for the tool pages. Same pattern as
// NewsletterSignup: the browser only posts a request into Strapi; a script on
// the server sends the email later, so no email key is ever exposed here.
export default function EmailResultBox({ tool, toolName, summary }) {
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  // Honeypot field, same pattern as NewsletterSignup — real users never see it.
  const [trap, setTrap] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  if (!summary) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (trap) {
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
            email,
            tool,
            result_text: summary.slice(0, MAX_TEXT),
            subscribe,
            sent: false,
            attempts: 0,
          },
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setStatus('success');
    } catch (err) {
      console.error('Email result request failed:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="cs-calc-email cs-calc-email-success">
        <h4>Result on its way</h4>
        <p>
          We&apos;ll email your {toolName} result to {email || 'you'} within a
          few minutes. If it doesn&apos;t arrive, check your spam folder.
        </p>
        <button
          type="button"
          className="cs-calc-email-again"
          onClick={() => {
            setStatus('idle');
            setEmail('');
            setSubscribe(false);
          }}
        >
          Email a different result
        </button>
      </div>
    );
  }

  return (
    <div className="cs-calc-email">
      <h4>Email me this result</h4>
      <p>
        Get these numbers in your inbox to keep or share. One email, sent
        once.
      </p>
      <form className="cs-calc-email-form" onSubmit={handleSubmit}>
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
          <label htmlFor={`cs_verify_result_${tool}`}>Leave this field empty</label>
          <input
            type="text"
            id={`cs_verify_result_${tool}`}
            name="cs_verify_field"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            tabIndex={-1}
            autoComplete="new-password"
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="you@company.com"
          required
          aria-label="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="cs-newsletter-input"
        />
        <button type="submit" className="cs-btn" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending...' : 'Email me this'}
        </button>

        <label className="cs-calc-email-check">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={(e) => setSubscribe(e.target.checked)}
          />
          Also send me new guides (optional)
        </label>
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
