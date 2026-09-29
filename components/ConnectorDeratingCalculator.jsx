'use client';

import { useState, useMemo } from 'react';
import { calculateDerating, interpretDerating } from '../lib/connectorDerating';

export default function ConnectorDeratingCalculator() {
  const [iRatedValue, setIRatedValue] = useState('');
  const [tRefValue, setTRefValue] = useState('25');
  const [tMaxValue, setTMaxValue] = useState('105');
  const [tAmbientValue, setTAmbientValue] = useState('');

  const result = useMemo(() => {
    const iRated = parseFloat(iRatedValue);
    const tRef = parseFloat(tRefValue);
    const tMax = parseFloat(tMaxValue);
    const tAmbient = parseFloat(tAmbientValue);

    if (!iRated || iRated <= 0 || Number.isNaN(tRef) || Number.isNaN(tMax) || Number.isNaN(tAmbient)) {
      return null;
    }

    return calculateDerating(iRated, tRef, tMax, tAmbient);
  }, [iRatedValue, tRefValue, tMaxValue, tAmbientValue]);

  const status = useMemo(() => {
    if (!result || result.error) return null;
    if (result.ratioPct >= 90) return 'good';
    if (result.ratioPct >= 60) return 'caution';
    return 'poor';
  }, [result]);

  const STATUS_LABELS = {
    good:    { label: 'Minimal derating required',  className: 'cs-calc-status-good' },
    caution: { label: 'Moderate derating required',  className: 'cs-calc-status-caution' },
    poor:    { label: 'Severe derating required',    className: 'cs-calc-status-poor' },
  };

  return (
    <div className="cs-calculator">

      {/* Left column — inputs */}
      <div className="cs-calc-inputs">

        <div className="cs-calc-field">
          <label htmlFor="calc_irated">Rated Current at Reference Ambient (A)</label>
          <input
            id="calc_irated"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={iRatedValue}
            onChange={(e) => setIRatedValue(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_tref">Reference Ambient Temperature (°C)</label>
          <input
            id="calc_tref"
            type="number"
            step="any"
            value={tRefValue}
            onChange={(e) => setTRefValue(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_tmax">Connector Max Rated Temperature (°C)</label>
          <input
            id="calc_tmax"
            type="number"
            step="any"
            value={tMaxValue}
            onChange={(e) => setTMaxValue(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_tambient">Your Operating Ambient Temperature (°C)</label>
          <input
            id="calc_tambient"
            type="number"
            step="any"
            placeholder="e.g. 65"
            value={tAmbientValue}
            onChange={(e) => setTAmbientValue(e.target.value)}
          />
        </div>

      </div>

      {/* Right column — results */}
      <div className="cs-calc-results">
        {result && !result.error ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-label">Derated Current</span>
              <span className="cs-calc-result-number">
                {result.deratedCurrent.toFixed(2)} A
              </span>
            </div>
            <div className="cs-calc-result-row">
              <span>Percent of rated current</span>
              <span>{result.ratioPct.toFixed(0)}%</span>
            </div>
            <div className={`cs-calc-status ${STATUS_LABELS[status].className}`}>
              {STATUS_LABELS[status].label}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
              {interpretDerating(result.ratioPct)}
            </p>
          </>
        ) : result && result.error ? (
          <p className="cs-calc-placeholder">{result.error}</p>
        ) : (
          <p className="cs-calc-placeholder">
            Enter values to estimate derated current.
          </p>
        )}
      </div>

      {/* Full-width disclaimer */}
      <p className="cs-calc-disclaimer">
        Based on the standard square-root derating approximation (I<sub>derated</sub> = I<sub>rated</sub> &times;
        &radic;[(T<sub>max</sub> &minus; T<sub>ambient</sub>) / (T<sub>max</sub> &minus; T<sub>ref</sub>)]), the same
        relationship most manufacturer derating curves are built on. For general engineering reference
        only &mdash; verify against the manufacturer&rsquo;s published derating curve for your specific part
        number before finalizing a design.
      </p>

    </div>
  );
}
