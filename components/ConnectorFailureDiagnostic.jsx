'use client';

import { useState } from 'react';
import Link from 'next/link';
import EmailResultBox from './EmailResultBox';
import { SYMPTOMS, FAMILIES, CONDITIONS, diagnose } from '../lib/connectorDiagnostic';

const UTM = '?utm_source=site&utm_medium=tool&utm_campaign=connector-failure-diagnostic';

function nextStep(family, topId) {
  if (family === 'ffc') {
    return {
      href: `/request-info/fpc-ffc-connectors/${UTM}`,
      label: 'Request FFC/FPC pricing',
      lead: 'Need a replacement or a better-matched FFC/FPC connector?',
    };
  }
  if (family === 'io' || topId === 'si') {
    return {
      href: `/request-info/high-speed-connectors-signal-integrity/${UTM}`,
      label: 'Request high-speed connector pricing',
      lead: 'Need a connector rated for your data rate?',
    };
  }
  return {
    href: '/tools/connector-selector-wizard/',
    label: 'Try the Connector Selector Wizard',
    lead: 'Looking for a more robust replacement?',
  };
}

const HEAT_WARNING =
  'Safety: a hot, discolored or melted connector can be a fire hazard. Power it down and let it cool before inspecting or using it again.';
const GENERAL_NOTE =
  'Provided for general information only, with no warranty. Always follow your own design, safety and test requirements.';

const ROW_STYLE = { flexWrap: 'wrap', columnGap: '12px', rowGap: '2px' };
const VALUE_STYLE = { marginLeft: 'auto', textAlign: 'right' };

export default function ConnectorFailureDiagnostic() {
  const [symptom, setSymptom] = useState('');
  const [family, setFamily] = useState('');
  const [conditions, setConditions] = useState([]);

  function toggle(id) {
    setConditions((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]));
  }

  const ranked = diagnose({ symptom, family, conditions });
  const top = ranked ? ranked[0] : null;
  const step = top ? nextStep(family, top.id) : null;

  let summary = '';
  if (ranked) {
    const sym = SYMPTOMS.find((s) => s.id === symptom).label;
    const fam = FAMILIES.find((f) => f.id === family).label;
    const cond = conditions.length
      ? conditions.map((c) => CONDITIONS.find((x) => x.id === c).label).join('; ')
      : 'none selected';
    summary = [
      `Connector failure diagnostic`,
      `Symptom: ${sym}`,
      `Connector type: ${fam}`,
      `Conditions: ${cond}`,
      '',
      ...ranked.map(
        (c, i) =>
          `${i + 1}. ${c.name} (${c.level})\n   Why: ${c.why}\n   Check: ${c.check}\n   Fix: ${c.fix}`
      ),
      '',
      ...(symptom === 'heat' ? [HEAT_WARNING, ''] : []),
      'Rule-based checklist, not a root-cause analysis. Confirm with measurements and inspection.',
      GENERAL_NOTE,
    ].join('\n');
  }

  return (
    <div className="cs-calculator cs-diag-calc">
      <style>{`.cs-diag-calc .cs-calc-inputs { grid-template-columns: minmax(0, 1fr); }
.cs-diag-calc .cs-calc-inputs select { min-width: 0; max-width: 100%; }
.cs-diag-checks { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px 16px; }
.cs-diag-checks label { display: flex; align-items: center; gap: 8px; font-weight: 400; cursor: pointer; }
.cs-diag-checks input { width: auto; margin: 0; }
.cs-diag-detail { grid-column: 1 / -1; border-top: 1px solid var(--line, #d9dee6); padding-top: 1.25rem; }
.cs-diag-detail h3 { margin: 0 0 4px; font-size: 1.05rem; }
.cs-diag-detail p { margin: 0 0 8px; font-size: 0.95rem; }
.cs-diag-item { margin-bottom: 1.1rem; }
.cs-diag-detail a { color: var(--copper); text-decoration: underline; text-underline-offset: 2px; }
.cs-diag-detail a:hover { color: var(--copper-600); }
@media (min-width: 701px) {
  .cs-diag-calc { grid-template-columns: minmax(0, 1.2fr) minmax(280px, 1fr); }
}`}</style>

      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="diag_symptom">What is happening?</label>
          <select id="diag_symptom" value={symptom} onChange={(e) => setSymptom(e.target.value)}>
            <option value="">Choose a symptom</option>
            {SYMPTOMS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="diag_family">What kind of connector?</label>
          <select id="diag_family" value={family} onChange={(e) => setFamily(e.target.value)}>
            <option value="">Choose a connector type</option>
            {FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <span style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            What applies? (optional, tick any)
          </span>
          <div className="cs-diag-checks">
            {CONDITIONS.map((c) => (
              <label key={c.id} htmlFor={`diag_c_${c.id}`}>
                <input
                  id={`diag_c_${c.id}`}
                  type="checkbox"
                  checked={conditions.includes(c.id)}
                  onChange={() => toggle(c.id)}
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="cs-calc-results">
        {ranked ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-label">Most likely cause</span>
              <span className="cs-calc-result-number" style={{ fontSize: '1.6rem', lineHeight: 1.2 }}>
                {top.name}
              </span>
            </div>
            <div className="cs-calc-status cs-calc-status-caution" style={{ marginTop: 0 }}>
              <strong>Check first</strong>
              <br />
              {top.check}
            </div>
            {ranked.slice(1).map((c) => (
              <div key={c.id} className="cs-calc-result-row" style={ROW_STYLE}>
                <span>{c.name}</span>
                <span style={VALUE_STYLE}>{c.level}</span>
              </div>
            ))}
            {symptom === 'heat' && (
              <div className="cs-calc-status cs-calc-status-poor" style={{ marginTop: '12px' }}>
                {HEAT_WARNING}
              </div>
            )}
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Choose a symptom and a connector type to see the most likely causes and what to check
            first.
          </p>
        )}
      </div>

      {ranked && (
        <div className="cs-diag-detail">
          {ranked.map((c) => (
            <div key={c.id} className="cs-diag-item">
              <h3>
                {c.name} <span style={{ fontWeight: 400, color: 'var(--muted)' }}>({c.level})</span>
              </h3>
              <p>
                <strong>Why:</strong> {c.why}
              </p>
              <p>
                <strong>Check:</strong> {c.check}
              </p>
              <p>
                <strong>Fix:</strong> {c.fix}
              </p>
              {c.tool && (
                <p>
                  <strong>Related tool:</strong> <Link href={c.tool.href}>{c.tool.label}</Link>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="cs-calc-disclaimer">
        This is a rule-based checklist built from common connector failure modes, not a root-cause
        analysis. Confirm with inspection and measurement, such as contact resistance, temperature
        rise and continuity under movement. {GENERAL_NOTE}
        {step && (
          <>
            {' '}
            {step.lead}{' '}
            <Link href={step.href} prefetch={false}>
              {step.label}
            </Link>
            .
          </>
        )}
      </p>

      <EmailResultBox
        tool="connector-failure-diagnostic"
        toolName="Why Is My Connector Failing? Diagnostic"
        summary={summary}
      />
    </div>
  );
}
