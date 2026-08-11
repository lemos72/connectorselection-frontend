'use client';

import { useState } from 'react';
import { cmilToMm2, mm2ToCmil } from '../lib/wireGauge';

export default function CmilConverter() {
  const [mode, setMode] = useState('cmilToMm2');
  const [value, setValue] = useState('');

  const result =
    mode === 'cmilToMm2'
      ? cmilToMm2(parseFloat(value))
      : mm2ToCmil(parseFloat(value));

  return (
    <div className="cs-calculator cs-calculator-simple">
      <div className="cs-calc-mode-toggle">
        <button
          type="button"
          className={mode === 'cmilToMm2' ? 'cs-calc-mode-active' : ''}
          onClick={() => setMode('cmilToMm2')}
        >
          Circular Mils → mm²
        </button>
        <button
          type="button"
          className={mode === 'mm2ToCmil' ? 'cs-calc-mode-active' : ''}
          onClick={() => setMode('mm2ToCmil')}
        >
          mm² → Circular Mils
        </button>
      </div>

      <div className="cs-calc-inputs cs-calc-inputs-simple">
        <div className="cs-calc-field">
          <label htmlFor="cmil_input">
            {mode === 'cmilToMm2' ? 'Circular Mils (CM)' : 'Area (mm²)'}
          </label>
          <input
            id="cmil_input"
            type="number"
            min="0"
            step="0.01"
            placeholder={mode === 'cmilToMm2' ? 'e.g. 6530' : 'e.g. 3.31'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      <div className="cs-calc-results cs-calc-results-simple">
        {result ? (
          <div className="cs-calc-result-main">
            <span className="cs-calc-result-number">
              {result} {mode === 'cmilToMm2' ? 'mm²' : 'CM'}
            </span>
            <span className="cs-calc-result-label">Converted Value</span>
          </div>
        ) : (
          <p className="cs-calc-placeholder">Enter a value to convert.</p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Standard conversion: 1 circular mil = 0.0005067 mm². Circular mils
        are the standard unit for wire cross-sectional area in AWG/NEC
        references.
      </p>
    </div>
  );
}