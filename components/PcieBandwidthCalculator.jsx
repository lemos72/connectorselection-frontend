'use client';

import { useState } from 'react';
import { PCIE_GENERATIONS, LANE_OPTIONS, calculatePcieBandwidth } from '../lib/pcieBandwidth';

export default function PcieBandwidthCalculator() {
  const [generation, setGeneration] = useState('5');
  const [lanes, setLanes] = useState('16');
  const [target, setTarget] = useState('');

  const result = calculatePcieBandwidth({
    generation,
    lanes,
    targetGBps: parseFloat(target),
  });

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_gen">PCIe Generation</label>
          <select id="calc_pcie_gen" value={generation} onChange={(e) => setGeneration(e.target.value)}>
            {PCIE_GENERATIONS.map((gen) => (
              <option key={gen.value} value={gen.value}>{gen.label}</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_lanes">Lanes</label>
          <select id="calc_pcie_lanes" value={lanes} onChange={(e) => setLanes(e.target.value)}>
            {LANE_OPTIONS.map((n) => (
              <option key={n} value={n}>x{n}</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_target">Target Bandwidth, GB/s per direction (optional)</label>
          <input
            id="calc_pcie_target"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 50"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-number">{result.perDirection} GB/s</span>
              <span className="cs-calc-result-label">Per Direction</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Both Directions Combined</span>
              <strong>{result.bothDirections} GB/s</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Raw Rate per Lane</span>
              <strong>{result.rawRate}</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Line Encoding</span>
              <strong>{result.encoding}</strong>
            </div>
            {result.lanesNeeded && (
              <div className="cs-calc-result-row">
                <span>Lanes Needed for Target</span>
                <strong>{result.lanesNeeded}</strong>
              </div>
            )}
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Choose a PCIe generation and lane count to see the bandwidth.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Figures are theoretical link bandwidth after line encoding, before
        packet and protocol overhead, so real throughput is lower. Gen 6 and
        Gen 7 values are the headline rates (GT/s divided by 8). Estimates for
        general planning purposes — always verify against the PCI-SIG
        specification and your device and connector manufacturers&apos; data.
      </p>
    </div>
  );
}
