'use client';

import { useState } from 'react';
import { AWG_OPTIONS, calculatePowerDissipation } from '../lib/wireGauge';

export default function PowerDissipationCalculator() {
  const [awg, setAwg] = useState('12');
  const [currentAmps, setCurrentAmps] = useState('');
  const [length, setLength] = useState('');
  const [lengthUnit, setLengthUnit] = useState('feet');
  const [roundTrip, setRoundTrip] = useState(true);

  const result = calculatePowerDissipation({
    awg,
    currentAmps: parseFloat(currentAmps),
    length: parseFloat(length),
    lengthUnit,
    roundTrip,
  });

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="pd_awg">Wire Gauge (AWG)</label>
          <select id="pd_awg" value={awg} onChange={(e) => setAwg(e.target.value)}>
            {AWG_OPTIONS.map((size) => (
              <option key={size} value={size}>{size} AWG</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="pd_current">Current (Amps)</label>
          <input
            id="pd_current"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 10"
            value={currentAmps}
            onChange={(e) => setCurrentAmps(e.target.value)}
          />
        </div>

        <div className="cs-calc-field cs-calc-field-length">
          <label htmlFor="pd_length">Length (one-way)</label>
          <div className="cs-calc-length-row">
            <input
              id="pd_length"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 50"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
            <select aria-label="Length unit" value={lengthUnit} onChange={(e) => setLengthUnit(e.target.value)}>
              <option value="feet">ft</option>
              <option value="meters">m</option>
            </select>
          </div>
        </div>

        <div className="cs-calc-field cs-calc-field-checkbox">
          <label htmlFor="pd_roundtrip">
            <input
              id="pd_roundtrip"
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
            />
            Round-trip circuit (out and back)
          </label>
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-number">{result.powerWatts}W</span>
              <span className="cs-calc-result-label">Power Dissipated</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Wire Resistance</span>
              <strong>{result.resistanceOhms} Ω</strong>
            </div>
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Enter wire gauge, current, and length to calculate power loss.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Based on standard copper AWG resistance values and P = I²R. This is
        the power lost as heat in the wire itself — always verify total
        thermal load against your enclosure and insulation ratings.
      </p>
    </div>
  );
}