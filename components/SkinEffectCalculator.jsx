'use client';

import { useState, useMemo } from 'react';
import { calculateSkinDepth, interpretSkinDepth, toHz, MATERIALS } from '@/lib/skinEffect';

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

  // Determine result status for color indicator
  const status = useMemo(() => {
    if (!result) return null;
    if (result.skinDepthMm >= 10) return 'good';
    if (result.skinDepthMm >= 1) return 'warn';
    return 'bad';
  }, [result]);

  const statusLabel = { good: 'Negligible', warn: 'Moderate', bad: 'Severe' };
  const statusClass = { good: 'cs-calc-badge--good', warn: 'cs-calc-badge--warn', bad: 'cs-calc-badge--bad' };

  return (
    <div className="cs-calculator">
      <div className="cs-calc-grid">
        {/* Inputs */}
        <div className="cs-calc-inputs">
          <div className="cs-calc-field">
            <label className="cs-calc-label" htmlFor="freq-value">
              Frequency
            </label>
            <div className="cs-calc-input-row">
              <input
                id="freq-value"
                className="cs-calc-input"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 1"
                value={freqValue}
                onChange={(e) => setFreqValue(e.target.value)}
              />
              <select
                className="cs-calc-select"
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
            <label className="cs-calc-label" htmlFor="material">
              Conductor Material
            </label>
            <select
              id="material"
              className="cs-calc-select cs-calc-select--full"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {Object.entries(MATERIALS).map(([key, mat]) => (
                <option key={key} value={key}>{mat.label}</option>
              ))}
            </select>
          </div>

          <div className="cs-calc-reference">
            <p>Based on standard resistivity values (copper: 1.68×10⁻⁸ Ω·m, aluminum: 2.82×10⁻⁸ Ω·m at 20°C).</p>
          </div>
        </div>

        {/* Results */}
        <div className="cs-calc-results">
          {result ? (
            <>
              <div className="cs-calc-result-primary">
                <span className="cs-calc-result-label">Skin Depth</span>
                <span className="cs-calc-result-value">
                  {result.skinDepthMm >= 1
                    ? `${result.skinDepthMm.toFixed(3)} mm`
                    : `${result.skinDepthUm.toFixed(2)} μm`}
                </span>
              </div>

              <div className="cs-calc-result-secondary">
                <span className="cs-calc-result-label">Skin Effect</span>
                <span className={`cs-calc-badge ${statusClass[status]}`}>
                  {statusLabel[status]}
                </span>
              </div>

              <div className="cs-calc-result-secondary">
                <span className="cs-calc-result-label">Effective conductor diameter</span>
                <span className="cs-calc-result-value cs-calc-result-value--sm">
                  {result.skinDepthMm >= 1
                    ? `≤ ${(result.skinDepthMm * 2).toFixed(3)} mm`
                    : `≤ ${(result.skinDepthUm * 2).toFixed(1)} μm`}
                </span>
              </div>

              <p className="cs-calc-interpretation">{interpretation}</p>
            </>
          ) : (
            <p className="cs-calc-placeholder">Enter a frequency to calculate skin depth.</p>
          )}
        </div>
      </div>

      <p className="cs-calc-disclaimer">
        For general engineering reference only. Assumes non-magnetic conductor at 20°C.
        Actual skin depth varies with temperature and material purity — verify against
        manufacturer specifications for safety-critical or high-power applications.
      </p>
    </div>
  );
}
