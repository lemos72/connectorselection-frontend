'use client';

import { useState } from 'react';
import EmailResultBox from './EmailResultBox';
import { COOLANTS, calculateCoolantFlow } from '../lib/coolantFlow';

export default function CoolantFlowCalculator() {
  const [heatKw, setHeatKw] = useState('');
  const [deltaT, setDeltaT] = useState('10');
  const [coolantId, setCoolantId] = useState('water');
  const [racks, setRacks] = useState('1');

  const result = calculateCoolantFlow({
    heatKw: parseFloat(heatKw),
    deltaT: parseFloat(deltaT),
    coolantId,
    racks: parseFloat(racks),
  });

  const coolant = COOLANTS.find((c) => c.id === coolantId);

  const summary = result
    ? [
        `Heat load: ${heatKw} kW, coolant temperature rise: ${deltaT} °C`,
        `Coolant: ${coolant.label}`,
        `Flow rate: ${result.lpm} L/min (${result.gpm} US gpm), ${result.massKgS} kg/s`,
        result.racks > 1
          ? `Total for ${result.racks} racks: ${result.totalLpm} L/min (${result.totalGpm} US gpm)`
          : 'Single rack or loop',
        'Planning estimate; typical fluid properties near 30 °C. Verify against your coolant datasheet and CDU specification.',
      ].join('\n')
    : '';

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_flow_heat">Heat Load (kW)</label>
          <input
            id="calc_flow_heat"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={heatKw}
            onChange={(e) => setHeatKw(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_flow_dt">Coolant Temperature Rise (°C)</label>
          <input
            id="calc_flow_dt"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={deltaT}
            onChange={(e) => setDeltaT(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_flow_coolant">Coolant</label>
          <select
            id="calc_flow_coolant"
            value={coolantId}
            onChange={(e) => setCoolantId(e.target.value)}
          >
            {COOLANTS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_flow_racks">Number of Racks (optional)</label>
          <input
            id="calc_flow_racks"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 4"
            value={racks}
            onChange={(e) => setRacks(e.target.value)}
          />
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-number">{result.lpm}</span>
              <span className="cs-calc-result-label">Litres per Minute</span>
            </div>
            <div className="cs-calc-result-row">
              <span>US Gallons per Minute</span>
              <strong>{result.gpm} gpm</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Mass Flow</span>
              <strong>{result.massKgS} kg/s</strong>
            </div>
            {result.racks > 1 && (
              <div className="cs-calc-result-row">
                <span>Total for {result.racks} Racks</span>
                <strong>{result.totalLpm} L/min ({result.totalGpm} gpm)</strong>
              </div>
            )}
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Enter the heat load and coolant temperature rise to see the flow rate.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Planning estimate only. Uses typical fluid properties near 30 °C. Check the result against your coolant datasheet and your CDU and cold plate requirements.
      </p>
      <EmailResultBox tool="coolant-flow-rate-calculator" toolName="Liquid Cooling Flow Rate Calculator" summary={summary} />
    </div>
  );
}
