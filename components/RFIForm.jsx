'use client';

import { useState, useEffect } from 'react';
import { STRAPI_URL } from '../lib/strapi';
import { RFI_FIELD_CONFIGS, TIMELINE_OPTIONS } from '../lib/rfiFieldConfigs';

// Strapi "RFI" content type: company_name*, contact_name*, contact_email*,
// contact_phone, category_slug (plain Text — deliberately NOT a relation,
// to keep this form's submit path independent of relation-ID formatting),
// application_industry, quantity_volume, timeline (enumeration),
// notes, spec_fields (JSON — category-specific answers), review_status
// (enumeration, admin-managed, defaults to "new" server-side — never set
// by this form), submitted_at.
const API_PATH = '/api/rfis';

function buildInitialState(category) {
  const config = RFI_FIELD_CONFIGS[category];
  const specDefaults = {};
  (config?.fields || []).forEach((f) => {
    specDefaults[f.name] = '';
  });
  return {
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    application_industry: '',
    country: '',
    quantity_volume: '',
    timeline: '',
    notes: '',
    spec: specDefaults,
    // Honeypot field, same pattern as ContactForm/AskEngineerForm — real
    // users never see or reach this. Bots that blindly fill every input
    // still get caught.
    cs_verify_field: '',
  };
}

// Where did this visitor come from? Captured from the landing URL (UTM tags,
// Microsoft/Google click IDs) and kept in sessionStorage for the visit, so the
// lead record shows which ad / keyword produced it. Stored inside the existing
// spec_fields JSON, so no Strapi schema change is needed. Fully defensive:
// any failure (private mode, blocked storage) just returns what it can.
const ATTR_KEY = 'cs_attribution';

function readAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'msclkid', 'gclid'];
    const attr = {};
    keys.forEach((k) => {
      const v = params.get(k);
      if (v) attr[k] = v;
    });
    if (document.referrer) attr.referrer = document.referrer;
    attr.landing_path = window.location.pathname;
    return attr;
  } catch (e) {
    return {};
  }
}

function getAttribution() {
  try {
    const saved = window.sessionStorage.getItem(ATTR_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore and fall through
  }
  return readAttribution();
}

// Fires conversion events on successful submission. Each one is safe to call
// even if its tool hasn't loaded (ad blockers, slow network, tag not installed
// yet) — it just no-ops, or queues until the tag loads.
function trackLeadConversion(category) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'rfi_form',
      event_label: `RFI Form Submission - ${category}`,
    });
  }

  // Microsoft Advertising (UET). Pushing to the queue is how UET works, even
  // before the tag has loaded. In Microsoft Ads, create an Event goal with
  // Action = rfi_submit to count these.
  window.uetq = window.uetq || [];
  window.uetq.push('event', 'rfi_submit', {
    event_category: 'rfi_form',
    event_label: category,
  });

  // Microsoft Clarity: tag the session so recordings can be filtered by it.
  if (typeof window.clarity === 'function') {
    window.clarity('event', 'rfi_submitted');
    window.clarity('set', 'rfi_category', category);
  }
}

export default function RFIForm({ category }) {
  const config = RFI_FIELD_CONFIGS[category];
  const [formData, setFormData] = useState(() => buildInitialState(category));
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  // Remember where the visitor came from as soon as the form page loads.
  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(ATTR_KEY)) {
        window.sessionStorage.setItem(ATTR_KEY, JSON.stringify(readAttribution()));
      }
    } catch (e) {
      // storage unavailable: attribution will be read from the URL at submit time
    }
  }, []);

  // No config for this category slug — render nothing rather than a
  // broken/empty form. Keeps this component safe to reuse on a category
  // that hasn't been given a spec-field config yet.
  if (!config) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSpecChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      spec: { ...prev.spec, [name]: value },
    }));
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
            company_name: formData.company_name,
            contact_name: formData.contact_name,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            category_slug: category,
            application_industry: formData.application_industry,
            quantity_volume: formData.quantity_volume,
            timeline: formData.timeline,
            notes: formData.notes,
            spec_fields: {
              ...formData.spec,
              country: formData.country,
              _attribution: getAttribution(),
            },
            submitted_at: new Date().toISOString(),
            // review_status is intentionally NOT sent — the Strapi schema
            // default ("new") is what governs this, not the client.
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      setStatus('success');
      setFormData(buildInitialState(category));
      trackLeadConversion(category);
    } catch (err) {
      console.error('RFI submission failed:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="cs-form-success">
        <h3>Request received</h3>
        <p>
          Thanks — I&apos;ll review your details and follow up with
          information within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="cs-rfi-form-wrap">
      <div className="cs-section-head">
        <h2>{config.label}</h2>
        <p>
          Share your requirements below and I&apos;ll personally follow up
          with pricing and availability info — no obligation.
        </p>
      </div>

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
          <label htmlFor={`cs_verify_field_rfi_${category}`}>
            Leave this field empty
          </label>
          <input
            type="text"
            id={`cs_verify_field_rfi_${category}`}
            name="cs_verify_field"
            value={formData.cs_verify_field}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="new-password"
          />
        </div>

        <div className="cs-form-group">
          <label htmlFor={`company_name_${category}`}>Company Name</label>
          <input
            type="text"
            id={`company_name_${category}`}
            name="company_name"
            required
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        <div className="cs-form-group">
          <label htmlFor={`contact_name_${category}`}>Contact Name</label>
          <input
            type="text"
            id={`contact_name_${category}`}
            name="contact_name"
            required
            value={formData.contact_name}
            onChange={handleChange}
          />
        </div>

        <div className="cs-form-group">
          <label htmlFor={`contact_email_${category}`}>Email</label>
          <input
            type="email"
            id={`contact_email_${category}`}
            name="contact_email"
            required
            value={formData.contact_email}
            onChange={handleChange}
          />
        </div>

        <div className="cs-form-group">
          <label htmlFor={`contact_phone_${category}`}>
            Phone (optional)
          </label>
          <input
            type="tel"
            id={`contact_phone_${category}`}
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
          />
        </div>

        <div className="cs-form-group">
          <label htmlFor={`application_industry_${category}`}>
            Application / Industry
          </label>
          <input
            type="text"
            id={`application_industry_${category}`}
            name="application_industry"
            placeholder="e.g. automotive infotainment, industrial sensor, EV battery management"
            value={formData.application_industry}
            onChange={handleChange}
          />
        </div>

        <div className="cs-form-group">
          <label htmlFor={`country_${category}`}>Country</label>
          <select
            id={`country_${category}`}
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select one (optional)</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="cs-form-group">
          <label htmlFor={`quantity_volume_${category}`}>
            Quantity / Volume
          </label>
          <input
            type="text"
            id={`quantity_volume_${category}`}
            name="quantity_volume"
            placeholder="e.g. 5,000/month, or a one-time 200 units"
            value={formData.quantity_volume}
            onChange={handleChange}
          />
        </div>

        <div className="cs-form-group">
          <label htmlFor={`timeline_${category}`}>Timeline</label>
          <select
            id={`timeline_${category}`}
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
          >
            <option value="">Select one (optional)</option>
            {TIMELINE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category-specific spec fields, driven entirely by config. */}
        {config.fields.map((f) => (
          <div className="cs-form-group" key={f.name}>
            <label htmlFor={`spec_${f.name}_${category}`}>{f.label}</label>
            {f.type === 'select' ? (
              <select
                id={`spec_${f.name}_${category}`}
                name={f.name}
                value={formData.spec[f.name]}
                onChange={handleSpecChange}
              >
                <option value="">Select one (optional)</option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={`spec_${f.name}_${category}`}
                name={f.name}
                value={formData.spec[f.name]}
                onChange={handleSpecChange}
              />
            )}
          </div>
        ))}

        <div className="cs-form-group">
          <label htmlFor={`notes_${category}`}>
            Additional Notes (optional)
          </label>
          <textarea
            id={`notes_${category}`}
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {status === 'error' && (
          <div className="cs-form-error">
            Something went wrong sending your request. Please try again, or
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
          {status === 'submitting' ? 'Sending...' : 'Request Info & Pricing'}
        </button>
      </form>
    </div>
  );
}
