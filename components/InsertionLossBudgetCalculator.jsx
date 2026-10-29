'use client';

import { useState } from 'react';
import { calculateLossBudget } from '../lib/insertionLoss';

const STATUS_LABELS = {
  good: { label: 'Within budget — margin of 10% or more', className: 'cs-calc-status-good' },
  caution: { label: 'Tight — under 10% margin', className: 'cs-calc-status-caution' },
  poor: { label: 'Over budget', className: 'cs-calc-status-poor' },
};

export default function InsertionLossBudgetCalculator() {
  const [budgetDb, setBudgetDb] = useState('');
  const [traceLengthIn, setTraceLengthIn] = useState('');
  const [traceLossPerIn, setTraceLossPerIn] = useState('');
  const [connectorCount, setConnectorCount] = useState('');
  const [connectorLossDb, setConnectorLossDb] = useState('');
  const [cableLengthM, setCableLengthM] = useState('');
  const [cableLossPerM, setCableLossPerM] = useState('');
  const [otherLossDb, setOtherLossDb] = useState('');

  const result = calculateLossBudget({
    budgetDb,
    traceLengthIn,
    traceLossPerIn,
    connectorCount,
    connectorLossDb,
    cableLengthM,
    cableLossPerM,
    otherLossDb,
  });

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_loss_budget">Loss Budget (dB)</label>
          <input
            id="calc_loss_budget"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 28"
            value={budgetDb}
            onChange={(e) => setBudgetDb(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_loss_trace_len">PCB Trace Length (inches)</label>
          <input
            id="calc_loss_trace_len"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 8"
            value={traceLengthIn}
            onChange={(e) => setTraceLengthIn(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_loss_trace_rate">Trace Loss (dB per inch)</label>
          <input
            id="calc_loss_trace_rate"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 1.2"
            value={traceLossPerIn}
            onChange={(e) => setTraceLossPerIn(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_loss_conn_count">Number of Connectors</label>
          <input
            id="calc_loss_conn_count"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 2"
            value={connectorCount}
            onChange={(e) => setConnectorCount(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_loss_conn_loss">Loss per Connector (dB)</label>
          <input
            id="calc_loss_conn_loss"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 1.5"
            value={connectorLossDb}
            onChange={(e) => setConnectorLossDb(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_loss_cable_len">Cable Length (meters)</label>
          <input
            id="calc_loss_cable_len"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 0.5"
            value={cableLengthM}
            onChange={(e) => setCableLengthM(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_loss_cable_rate">Cable Loss (dB per meter)</label>
          <input
            id="calc_loss_cable_rate"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 10"
            value={cableLossPerM}
            onChange={(e) => setCableLossPerM(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_loss_other">Other Losses (dB, optional)</label>
          <input
            id="calc_loss_other"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 2"
            value={otherLossDb}
            onChange={(e) => setOtherLossDb(e.target.value)}
          />
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-number">{result.margin} dB</span>
              <span className="cs-calc-result-label">Margin</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Total Channel Loss</span>
              <strong>{result.total} dB</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>PCB Traces</span>
              <strong>{result.trace} dB</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Connectors</span>
              <strong>{result.connectors} dB</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Cable</span>
              <strong>{result.cable} dB</strong>
            </div>
            <div className="cs-calc-result-row">
              <span>Other</span>
              <strong>{result.other} dB</strong>
            </div>
            <div className={`cs-calc-status ${STATUS_LABELS[result.statusLevel].className}`}>
              {STATUS_LABELS[result.statusLevel].label}
            </div>
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Enter your loss budget and at least one loss source to see the margin.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Simple addition of the values you enter; it does not model reflections,
        crosstalk or frequency-dependent effects, and the budget is your own
        number. The 10% margin guide is a rule of thumb for this tool, not a
        standard. Estimates for general planning purposes — always verify
        against your interface specification and your connector and cable
        manufacturers&apos; data.
      </p>
    </div>
  );
}
