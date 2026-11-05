'use client';

import { useState, useMemo } from 'react';
import EmailResultBox from './EmailResultBox';
import { MODES, calculateReflection, matchStatus, interpretMatch, fmt } from '../lib/returnLoss';

export default function ReturnLossVswrConverter() {
  const [mode, setMode] = useState('rl');
  const [value, setValue] = useState('');

  const parsed = useMemo(() => {
    const v = parseFloat(value);
    return v > 0 ? v : null;
  }, [value]);

  const result = useMemo(() => {
    if (parsed === null) return null;
    return calculateReflection(mode, parsed);
  }, [mode, parsed]);

  const ok = result && !result.error ? result : null;
  const status = ok ? matchStatus(ok.returnLossDb) : null;

  const STATUS_LABELS = {
    good:    { label: 'Good match',     className: 'cs-calc-status-good' },
    caution: { label: 'Moderate match', className: 'cs-calc-status-caution' },
    poor:    { label: 'Poor match',     className: 'cs-calc-status-poor' },
  };

  const summary = ok
    ? [
        `Return loss: ${fmt(ok.returnLossDb, 4)} dB`,
        `VSWR: ${fmt(ok.vswr, 4)} : 1`,
        `Reflection coefficient |Γ|: ${fmt(ok.gamma, 4)}`,
        `Reflected power: ${fmt(ok.reflectedPct, 3)} %`,
        `Transmitted power: ${fmt(ok.transmittedPct, 4)} %`,
        `Mismatch loss: ${fmt(ok.mismatchLossDb, 3)} dB`,
        `Status: ${STATUS_LABELS[status].label}`,
        `Input: ${value} (${MODES[mode].label})`,
        'General engineering reference; mismatch loss excludes cable and connector attenuation.',
      ].join('\n')
    : '';

  return (
    <div className="cs-calculator">

      {/* Left column — inputs */}
      <div className="cs-calc-inputs">

        <div className="cs-calc-field">
          <label htmlFor="calc_mode">I know the</label>
          <select
            id="calc_mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {Object.entries(MODES).map(([key, m]) => (
              <option key={key} value={key}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_value">Value</label>
          <input
            id="calc_value"
            type="number"
            min="0"
            step="any"
            placeholder={MODES[mode].placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

      </div>

      {/* Right column — results */}
      <div className="cs-calc-results">
        {result && result.error ? (
          <p className="cs-calc-placeholder">{result.error}</p>
        ) : ok ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-label">Return Loss</span>
              <span className="cs-calc-result-number">{fmt(ok.returnLossDb, 4)} dB</span>
            </div>
            <div className="cs-calc-result-row">
              <span>VSWR</span>
              <span>{fmt(ok.vswr, 4)} : 1</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Reflection coefficient |Γ|</span>
              <span>{fmt(ok.gamma, 4)}</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Reflected power</span>
              <span>{fmt(ok.reflectedPct, 3)} %</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Transmitted power</span>
              <span>{fmt(ok.transmittedPct, 4)} %</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Mismatch loss</span>
              <span>{fmt(ok.mismatchLossDb, 3)} dB</span>
            </div>
            <div className={`cs-calc-status ${STATUS_LABELS[status].className}`}>
              {STATUS_LABELS[status].label}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
              {interpretMatch(ok)}
            </p>
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Choose what you know and enter a value to convert.
          </p>
        )}
      </div>

      {/* Full-width disclaimer */}
      <p className="cs-calc-disclaimer">
        Return loss is shown as a positive number of dB (S11 in dB is its negative). Match bands are
        rules of thumb: 20 dB or better is good, 10–20 dB is moderate, below 10 dB is poor. Mismatch
        loss covers reflected power only. For general engineering reference only; verify against
        manufacturer specifications and measured data.
      </p>
      <EmailResultBox tool="return-loss-vswr-converter" toolName="Return Loss / VSWR Converter" summary={summary} />

    </div>
  );
}
