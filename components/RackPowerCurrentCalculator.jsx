'use client';

import { useState } from 'react';
import EmailResultBox from './EmailResultBox';
import { BUS_VOLTAGES, calculateRackCurrent } from '../lib/rackPowerCurrent';

export default function RackPowerCurrentCalculator() {
  const [powerKw, setPowerKw] = useState('');
  const [voltageId, setVoltageId] = useState('48');
  const [paths, setPaths] = useState('1');
  const [resistance, setResistance] = useState('');

  const volts = BUS_VOLTAGES.find((v) => v.id === voltageId).volts;

  const result = calculateRackCurrent({
    powerKw: parseFloat(powerKw),
    volts,
    parallelPaths: parseFloat(paths),
    resistanceMohm: parseFloat(resistance),
  });

  const summary = result
    ? [
        `Rack power: ${powerKw} kW at ${volts} V DC`,
        `Total current: ${result.amps} A`,
        result.paths > 1
          ? `Current per path: ${result.ampsPerPath} A (${result.paths} parallel paths)`
          : 'Single path: all current flows through one path',
        result.hasLoss
          ? `Path loss: ${result.lossWatts} W (${result.lossPercent}% of rack power) at ${resistance} milliohms round trip`
          : 'Path loss: not calculated (no resistance entered)',
        'Planning estimate; DC only. Verify against your busbar and connector data.',
      ].join('\n')
    : '';

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_rack_power">Rack Power (kW)</label>
          <input
            id="calc_rack_power"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 33"
            value={powerKw}
            onChange={(e) => setPowerKw(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_rack_voltage">Bus Voltage</label>
          <select
            id="calc_rack_voltage"
            value={voltageId}
            onChange={(e) => setVoltageId(e.target.value)}
          >
            {BUS_VOLTAGES.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_rack_paths">Parallel Paths (optional)</label>
          <input
            id="calc_rack_paths"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 2"
            value={paths}
            onChange={(e) => setPaths(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_rack_resistance">Round-Trip Path Resistance (milliohms, optional)</label>
          <input
            id="calc_rack_resistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.2"
            value={resistance}
            onChange={(e) => setResistance(e.target.value)}
          />
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-number">{result.amps}A</span>
              <span className="cs-calc-result-label">Total Current</span>
            </div>
            {result.paths > 1 && (
              <div className="cs-calc-result-row">
                <span>Current per Path ({result.paths} paths)</span>
                <strong>{result.ampsPerPath} A</strong>
              </div>
            )}
            {result.hasLoss && (
              <>
                <div className="cs-calc-result-row">
                  <span>Path Loss (I²R)</span>
                  <strong>{result.lossWatts} W</strong>
                </div>
                <div className="cs-calc-result-row">
                  <span>Loss as Share of Rack Power</span>
                  <strong>{result.lossPercent}%</strong>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Enter the rack power and choose a bus voltage to see the current.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Planning estimate only. DC bus, unity power factor. Check the result against your busbar, cable and connector manufacturer data.
      </p>
      <EmailResultBox tool="rack-power-current-calculator" toolName="Rack Power to Current Calculator" summary={summary} />
    </div>
  );
}
