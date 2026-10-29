'use client';

import { useState } from 'react';
import { SOLID_OPTIONS, LIQUID_OPTIONS, decodeIpCode } from '../lib/ipCode';

export default function IpCodeDecoder() {
  const [solid, setSolid] = useState('6');
  const [liquid, setLiquid] = useState('7');

  const result = decodeIpCode({ solid, liquid });

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_ip_solid">First Digit (Solid Particles)</label>
          <select id="calc_ip_solid" value={solid} onChange={(e) => setSolid(e.target.value)}>
            {SOLID_OPTIONS.map((option) => (
              <option key={option} value={option}>{option === 'X' ? 'X (not rated)' : option}</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_ip_liquid">Second Digit (Water)</label>
          <select id="calc_ip_liquid" value={liquid} onChange={(e) => setLiquid(e.target.value)}>
            {LIQUID_OPTIONS.map((option) => (
              <option key={option} value={option}>{option === 'X' ? 'X (not rated)' : option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-number">{result.code}</span>
              <span className="cs-calc-result-label">IP Code</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Solid Particles</span>
              <strong>{result.solidText}</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Water</span>
              <strong>{result.liquidText}</strong>
            </div>
            {result.note && (
              <div className="cs-calc-result-row">
                <span>Check</span>
                <strong>{result.note}</strong>
              </div>
            )}
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Choose the two digits of the IP code to see what they mean.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Based on the IP code definitions in IEC 60529, with the 9K water level
        from ISO 20653 for road vehicles. For connectors, a rating normally
        applies only when the connector is fully mated and correctly assembled.
        The IP code does not cover corrosion, chemicals or salt spray. Always
        verify against the manufacturer&apos;s datasheet and test report.
      </p>
    </div>
  );
}
