'use client';

import { useState } from 'react';
import { AWG_OPTIONS, calculateVoltageDrop } from '../lib/wireGauge';

const STATUS_LABELS = {
  good: { label: 'Good — under 3% drop', className: 'cs-calc-status-good' },
  caution: { label: 'Caution — 3-5% drop', className: 'cs-calc-status-caution' },
  poor: { label: 'High — over 5% drop', className: 'cs-calc-status-poor' },
};

export default function VoltageDropCalculator() {
  const [awg, setAwg] = useState('12');
  const [currentAmps, setCurrentAmps] = useState('');
  const [length, setLength] = useState('');
  const [lengthUnit, setLengthUnit] = useState('feet');
  const [systemVoltage, setSystemVoltage] = useState('');
  const [roundTrip, setRoundTrip] = useState(true);

  const result = calculateVoltageDrop({
    awg,
    currentAmps: parseFloat(currentAmps),
    length: parseFloat(length),
    lengthUnit,
    systemVoltage: parseFloat(systemVoltage),
    roundTrip,
  });

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_awg">Wire Gauge (AWG)</label>
          <select id="calc_awg" value={awg} onChange={(e) => setAwg(e.target.value)}>
            {AWG_OPTIONS.map((size) => (
              <option key={size} value={size}>{size} AWG</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_current">Current (Amps)</label>
          <input
            id="calc_current"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 10"
            value={currentAmps}
            onChange={(e) => setCurrentAmps(e.target.value)}
          />
        </div>

        <div className="cs-calc-field cs-calc-field-length">
          <label htmlFor="calc_length">Length (one-way)</label>
          <div className="cs-calc-length-row">
            <input
              id="calc_length"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 50"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
            <select
              aria-label="Length unit"
              value={lengthUnit}
              onChange={(e) => setLengthUnit(e.target.value)}
            >
              <option value="feet">ft</option>
              <option value="meters">m</option>
            </select>
          </div>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_voltage">System Voltage</label>
          <input
            id="calc_voltage"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 12"
            value={systemVoltage}
            onChange={(e) => setSystemVoltage(e.target.value)}
          />
        </div>

        <div className="cs-calc-field cs-calc-field-checkbox">
          <label htmlFor="calc_roundtrip">
            <input
              id="calc_roundtrip"
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
              <span className="cs-calc-result-number">{result.voltageDrop}V</span>
              <span className="cs-calc-result-label">Voltage Drop</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Percent Drop</span>
              <strong>{result.percentDrop}%</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Voltage at Load</span>
              <strong>{result.loadVoltage}V</strong>
            </div>
            <div className={`cs-calc-status ${STATUS_LABELS[result.statusLevel].className}`}>
              {STATUS_LABELS[result.statusLevel].label}
            </div>
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Enter your wire gauge, current, length, and voltage to see results.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Based on standard AWG copper wire values (NEC Chapter 9, Table 8). For
        DC circuits only. Estimates for general planning purposes — always
        verify against your specific application&apos;s standards and your
        wire/connector manufacturer&apos;s specifications.
      </p>
    </div>
  );
}