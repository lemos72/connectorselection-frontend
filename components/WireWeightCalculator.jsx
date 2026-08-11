'use client';

import { useState } from 'react';
import { AWG_OPTIONS, calculateWireWeight } from '../lib/wireGauge';

export default function WireWeightCalculator() {
  const [awg, setAwg] = useState('12');
  const [length, setLength] = useState('');
  const [lengthUnit, setLengthUnit] = useState('feet');
  const [material, setMaterial] = useState('copper');

  const weightKg = calculateWireWeight({
    awg,
    length: parseFloat(length),
    lengthUnit,
    material,
  });

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="ww_awg">Wire Gauge (AWG)</label>
          <select id="ww_awg" value={awg} onChange={(e) => setAwg(e.target.value)}>
            {AWG_OPTIONS.map((size) => (
              <option key={size} value={size}>{size} AWG</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="ww_material">Material</label>
          <select id="ww_material" value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="copper">Copper</option>
            <option value="aluminum">Aluminum</option>
          </select>
        </div>

        <div className="cs-calc-field cs-calc-field-length">
          <label htmlFor="ww_length">Length</label>
          <div className="cs-calc-length-row">
            <input
              id="ww_length"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 100"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
            <select aria-label="Length unit" value={lengthUnit} onChange={(e) => setLengthUnit(e.target.value)}>
              <option value="feet">ft</option>
              <option value="meters">m</option>
            </select>
          </div>
        </div>
      </div>

      <div className="cs-calc-results">
        {weightKg !== null ? (
          <div className="cs-calc-result-main">
            <span className="cs-calc-result-number">{weightKg} kg</span>
            <span className="cs-calc-result-label">Estimated Weight</span>
          </div>
        ) : (
          <p className="cs-calc-placeholder">
            Enter wire gauge, material, and length to estimate weight.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Based on solid conductor volume and standard material density
        (copper: 8.96 g/cm³, aluminum: 2.70 g/cm³). Stranded wire, insulation,
        and jacketing will add additional weight not included here.
      </p>
    </div>
  );
}