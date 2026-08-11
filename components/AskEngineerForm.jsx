'use client';

import { useState } from 'react';
import { STRAPI_URL } from '../lib/strapi';

const API_PATH = '/api/questions';

const initialFormState = {
  question_text: '',
  asker_name: '',
  asker_email: '',
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
            asker_name: formData.asker_name || null,
            asker_email: formData.asker_email,
            submitted_at: new Date().toISOString(),
            review_status: 'pending',
          },
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setStatus('success');
      setFormData(initialFormState);
    } catch (err) {
      console.error('Ask the Engineer submission failed:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="cs-newsletter cs-newsletter-success">
        <h3>Thanks — question received</h3>
        <p>
          I read every question personally. If yours gets answered,
          I&apos;ll feature it here (and email you if you left a real
          address).
        </p>
      </div>
    );
  }

  return (
    <div className="cs-newsletter">
      <h3>Ask the Engineer</h3>
      <p>Ask below — I read every question.</p>

      <form className="cs-ask-form" onSubmit={handleSubmit}>
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

        <div className="cs-ask-field">
          <label htmlFor="cs_ask_question">Your Question</label>
          <textarea
            id="cs_ask_question"
            name="question_text"
            placeholder="e.g. What connector type handles 40A continuous in a compact automotive housing?"
            required
            rows={4}
            value={formData.question_text}
            onChange={handleChange}
            className="cs-newsletter-input"
          />
        </div>

        <div className="cs-ask-field">
          <label htmlFor="cs_ask_name">Your Name (optional)</label>
          <input
            type="text"
            id="cs_ask_name"
            name="asker_name"
            placeholder="Jane Smith"
            value={formData.asker_name}
            onChange={handleChange}
            className="cs-newsletter-input"
          />
        </div>

        <div className="cs-ask-field">
          <label htmlFor="cs_ask_email">Your Email</label>
          <input
            type="email"
            id="cs_ask_email"
            name="asker_email"
            placeholder="you@company.com"
            required
            value={formData.asker_email}
            onChange={handleChange}
            className="cs-newsletter-input"
          />
        </div>

        <button
          type="submit"
          className="cs-btn"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending...' : 'Ask Question'}
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