'use client';

import { useState } from 'react';
import { calculateOhmsLaw } from '../lib/ohmsLaw';

export default function OhmsLawCalculator() {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('');

  const parsedVoltage = voltage === '' ? '' : parseFloat(voltage);
  const parsedCurrent = current === '' ? '' : parseFloat(current);
  const parsedResistance = resistance === '' ? '' : parseFloat(resistance);

  const result = calculateOhmsLaw({
    voltage: parsedVoltage,
    current: parsedCurrent,
    resistance: parsedResistance,
  });

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="ohm_v">Voltage (V)</label>
          <input
            id="ohm_v"
            type="number"
            step="0.01"
            placeholder="Leave blank to solve"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="ohm_i">Current (A)</label>
          <input
            id="ohm_i"
            type="number"
            step="0.01"
            placeholder="Leave blank to solve"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="ohm_r">Resistance (Ω)</label>
          <input
            id="ohm_r"
            type="number"
            step="0.01"
            placeholder="Leave blank to solve"
            value={resistance}
            onChange={(e) => setResistance(e.target.value)}
          />
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <div className="cs-calc-result-main">
            <span className="cs-calc-result-number">
              {result.solvedFor === 'voltage' && `${result.voltage}V`}
              {result.solvedFor === 'current' && `${result.current}A`}
              {result.solvedFor === 'resistance' && `${result.resistance}Ω`}
            </span>
            <span className="cs-calc-result-label">
              Solved for {result.solvedFor}
            </span>
          </div>
        ) : (
          <p className="cs-calc-placeholder">
            Enter any two values — Voltage, Current, or Resistance — to
            solve for the third.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Based on Ohm&apos;s Law (V = I × R), the foundational relationship
        between voltage, current, and resistance in a DC circuit.
      </p>
    </div>
  );
}