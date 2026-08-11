'use client';

import { useState } from 'react';
import { AWG_OPTIONS, awgToMm2, mm2ToNearestAwg } from '../lib/wireGauge';

export default function AwgConverter() {
  const [mode, setMode] = useState('awgToMm2'); // 'awgToMm2' | 'mm2ToAwg'
  const [awg, setAwg] = useState('12');
  const [mm2Input, setMm2Input] = useState('');

  const awgResult = mode === 'awgToMm2' ? awgToMm2(awg) : null;
  const mm2Result = mode === 'mm2ToAwg' ? mm2ToNearestAwg(parseFloat(mm2Input)) : null;

  return (
    <div className="cs-calculator cs-calculator-simple">
      <div className="cs-calc-mode-toggle">
        <button
          type="button"
          className={mode === 'awgToMm2' ? 'cs-calc-mode-active' : ''}
          onClick={() => setMode('awgToMm2')}
        >
          AWG → mm²
        </button>
        <button
          type="button"
          className={mode === 'mm2ToAwg' ? 'cs-calc-mode-active' : ''}
          onClick={() => setMode('mm2ToAwg')}
        >
          mm² → AWG
        </button>
      </div>

      {mode === 'awgToMm2' ? (
        <div className="cs-calc-inputs cs-calc-inputs-simple">
          <div className="cs-calc-field">
            <label htmlFor="conv_awg">Wire Gauge (AWG)</label>
            <select id="conv_awg" value={awg} onChange={(e) => setAwg(e.target.value)}>
              {AWG_OPTIONS.map((size) => (
                <option key={size} value={size}>{size} AWG</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="cs-calc-inputs cs-calc-inputs-simple">
          <div className="cs-calc-field">
            <label htmlFor="conv_mm2">Cross-Sectional Area (mm²)</label>
            <input
              id="conv_mm2"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 2.5"
              value={mm2Input}
              onChange={(e) => setMm2Input(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="cs-calc-results cs-calc-results-simple">
        {mode === 'awgToMm2' && awgResult && (
          <div className="cs-calc-result-main">
            <span className="cs-calc-result-number">{awgResult} mm²</span>
            <span className="cs-calc-result-label">{awg} AWG</span>
          </div>
        )}
        {mode === 'mm2ToAwg' && mm2Result && (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-number">{mm2Result.awg} AWG</span>
              <span className="cs-calc-result-label">Closest Standard Size</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Exact area for {mm2Result.awg} AWG</span>
              <strong>{mm2Result.mm2} mm²</strong>
            </div>
          </>
        )}
        {mode === 'mm2ToAwg' && !mm2Result && (
          <p className="cs-calc-placeholder">Enter a value in mm² to find the closest AWG size.</p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Based on standard AWG circular-mil values (NEC Chapter 9, Table 8).
        Results shown for the closest standard wire size — always confirm
        against manufacturer specifications for precision applications.
      </p>
    </div>
  );
}