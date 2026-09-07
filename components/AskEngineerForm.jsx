'use client';

import { useState } from 'react';
import { STRAPI_URL } from '../lib/strapi';

// Strapi "Question" content type: question_text*, asker_name, asker_email*,
// category (relation, optional at submission), review_status (enumeration —
// defaults to "pending" server-side, NEVER set from this form; see
// ask-the-engineer-strapi-setup.md for why that matters).
const API_PATH = '/api/questions';

const initialFormState = {
  question_text: '',
  asker_name: '',
  asker_email: '',
  // Honeypot field, same pattern as ContactForm/NewsletterSignup — real
  // users never see or reach this. Bots that blindly fill every input
  // still get caught.
  cs_verify_field: '',
};

export default function AskEngineerForm() {
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
            question_text: formData.question_text,
            asker_name: formData.asker_name,
            asker_email: formData.asker_email,
            // review_status is intentionally NOT sent — the Strapi schema
            // default ("pending") is what governs this, not the client.
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      setStatus('success');
      setFormData(initialFormState);
    } catch (err) {
      console.error('Ask the Engineer submission failed:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="cs-form-success">
        <h3>Question sent</h3>
        <p>
          Thanks — I read every question personally. If yours gets answered,
          I&apos;ll feature it here (and email you if you left an address).
          There&apos;s no guaranteed timeline, and not every question makes
          it to a public answer.
        </p>
      </div>
    );
  }

  return (
    <form className="cs-form cs-ask-engineer-form" onSubmit={handleSubmit}>
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
        <label htmlFor="cs_verify_field_ask">Leave this field empty</label>
        <input
          type="text"
          id="cs_verify_field_ask"
          name="cs_verify_field"
          value={formData.cs_verify_field}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="new-password"
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="question_text">Your question</label>
        <textarea
          id="question_text"
          name="question_text"
          rows={5}
          required
          maxLength={1000}
          placeholder="Ask anything about connector selection, signal integrity, wire/cable design..."
          value={formData.question_text}
          onChange={handleChange}
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="asker_name">Name (optional)</label>
        <input
          type="text"
          id="asker_name"
          name="asker_name"
          placeholder="Shown with your question if answered — leave blank to stay anonymous"
          value={formData.asker_name}
          onChange={handleChange}
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="asker_email">Email</label>
        <input
          type="email"
          id="asker_email"
          name="asker_email"
          required
          placeholder="Never shown publicly — only used if we follow up"
          value={formData.asker_email}
          onChange={handleChange}
        />
      </div>

      {status === 'error' && (
        <div className="cs-form-error">
          Something went wrong sending your question. Please try again, or
          email us directly at{' '}
          <a href="mailto:lemos@connectorselection.com">
            lemos@connectorselection.com
          </a>
          .
        </div>
      )}

      <button
        type="submit"
        className="cs-btn"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending...' : 'Submit Question'}
      </button>
    </form>
  );
}
