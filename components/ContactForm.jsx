'use client';

import { useState } from 'react';
import { STRAPI_URL } from '../lib/strapi';

// Confirmed Strapi "Inquiry" schema: name*, email*, company, phone,
// message, product_interest, lead_status (enumeration, admin-managed —
// not set by this form). This form sends name, email, phone, company,
// and message.
const API_PATH = '/api/inquiries';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  // Honeypot field: real users never see or reach this (hidden
  // off-screen, unreachable via Tab). Named deliberately meaningless
  // so browser autofill heuristics don't recognize and fill it —
  // "company_website" was too autofill-friendly a name in practice.
  cs_verify_field: '',
};

// Fires a GA4 event for the contact form submission. Safe to call even
// if gtag hasn't loaded (ad blockers, slow network, etc.) — just no-ops.
function trackLeadConversion() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'contact_form',
      event_label: 'Contact Form Submission',
    });
  }
}

export default function ContactForm() {
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
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            message: formData.message,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      setStatus('success');
      setFormData(initialFormState);
      trackLeadConversion();
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="cs-form-success">
        <h3>Message sent</h3>
        <p>
          Thanks for reaching out — we&apos;ll get back to you as soon as
          possible.
        </p>
      </div>
    );
  }

  return (
    <form className="cs-form" onSubmit={handleSubmit}>
      {/* Honeypot — hidden via inline styles so it's invisible to real
          users regardless of whether the site's CSS has been wired up
          yet. Bots that blindly fill every input still get caught. */}
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
        <label htmlFor="cs_verify_field">Leave this field empty</label>
        <input
          type="text"
          id="cs_verify_field"
          name="cs_verify_field"
          value={formData.cs_verify_field}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="new-password"
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="phone">Phone (optional)</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="company">Company (optional)</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      {status === 'error' && (
        <div className="cs-form-error">
          Something went wrong sending your message. Please try again, or
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
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
