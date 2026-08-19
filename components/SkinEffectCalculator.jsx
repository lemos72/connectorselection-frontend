'use client';

import { useState, useMemo } from 'react';
import { calculateSkinDepth, interpretSkinDepth, toHz, MATERIALS } from '../lib/skinEffect';

export default function SkinEffectCalculator() {
  const [freqValue, setFreqValue] = useState('');
  const [freqUnit, setFreqUnit] = useState('MHz');
  const [material, setMaterial] = useState('copper');

  const frequencyHz = useMemo(() => {
    const parsed = parseFloat(freqValue);
    if (!parsed || parsed <= 0) return null;
    return toHz(parsed, freqUnit);
  }, [freqValue, freqUnit]);

  const result = useMemo(() => {
    if (!frequencyHz) return null;
    return calculateSkinDepth(frequencyHz, material);
  }, [frequencyHz, material]);

  const interpretation = useMemo(() => {
    if (!result) return null;
    return interpretSkinDepth(result.skinDepthMm, material);
  }, [result, material]);

  const status = useMemo(() => {
    if (!result) return null;
    if (result.skinDepthMm >= 10) return 'good';
    if (result.skinDepthMm >= 1) return 'caution';
    return 'poor';
  }, [result]);

  const STATUS_LABELS = {
    good:    { label: 'Negligible skin effect', className: 'cs-calc-status-good' },
    caution: { label: 'Moderate skin effect',   className: 'cs-calc-status-caution' },
    poor:    { label: 'Severe skin effect',      className: 'cs-calc-status-poor' },
  };

  return (
    <div className="cs-calculator">

      {/* Left column — inputs */}
      <div className="cs-calc-inputs">

        <div className="cs-calc-field">
          <label htmlFor="calc_freq">Frequency</label>
          <div className="cs-calc-length-row">
            <input
              id="calc_freq"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 1"
              value={freqValue}
              onChange={(e) => setFreqValue(e.target.value)}
            />
            <select
              value={freqUnit}
              onChange={(e) => setFreqUnit(e.target.value)}
              aria-label="Frequency unit"
            >
              <option value="Hz">Hz</option>
              <option value="kHz">kHz</option>
              <option value="MHz">MHz</option>
              <option value="GHz">GHz</option>
            </select>
          </div>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_material">Conductor Material</label>
          <select
            id="calc_material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            {Object.entries(MATERIALS).map(([key, mat]) => (
              <option key={key} value={key}>{mat.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Right column — results */}
      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-label">Skin Depth</span>
              <span className="cs-calc-result-number">
                {result.skinDepthMm >= 1
                  ? `${result.skinDepthMm.toFixed(3)} mm`
                  : `${result.skinDepthUm.toFixed(2)} μm`}
              </span>
            </div>
            <div className="cs-calc-result-row">
              <span>Effective conductor diameter</span>
              <span>
                {result.skinDepthMm >= 1
                  ? `≤ ${(result.skinDepthMm * 2).toFixed(3)} mm`
                  : `≤ ${(result.skinDepthUm * 2).toFixed(1)} μm`}
              </span>
            </div>
            <div className={`cs-calc-status ${STATUS_LABELS[status].className}`}>
              {STATUS_LABELS[status].label}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
              {interpretation}
            </p>
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Enter a frequency to calculate skin depth.
          </p>
        )}
      </div>

      {/* Full-width disclaimer */}
      <p className="cs-calc-disclaimer">
        Based on standard resistivity values (copper: 1.68×10⁻⁸ Ω·m, aluminum: 2.82×10⁻⁸ Ω·m at 20°C).
        For general engineering reference only. Assumes non-magnetic conductor — verify against
        manufacturer specifications for safety-critical or high-power applications.
      </p>

    </div>
  );
}
