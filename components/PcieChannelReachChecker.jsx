'use client';

import { useState } from 'react';
import Link from 'next/link';
import EmailResultBox from './EmailResultBox';
import {
  GENERATIONS,
  LOSS_PRESETS,
  RESERVE_OPTIONS,
  evaluateChannel,
  fmtDb,
  fmtIn,
  fmtMm,
} from '../lib/pcieChannel';

const REQUEST_URL =
  '/request-info/high-speed-connectors-signal-integrity/?utm_source=site&utm_medium=tool&utm_campaign=pcie-channel-reach-checker';

function defaultsFor(gen) {
  const g = GENERATIONS[gen];
  if (!g.hasSplit) return { pkg: '', cem: '', aic: '' };
  return { pkg: String(g.pkg), cem: String(g.cem), aic: String(g.aic) };
}

const VERDICTS = {
  fits: 'Fits the budget with margin to spare',
  tight: 'Tight: inside the budget, but into your reserve',
  over: 'Over budget: a retimer or lower-loss design is likely needed',
};

export default function PcieChannelReachChecker() {
  const [gen, setGen] = useState('5');
  const [seg, setSeg] = useState(defaultsFor('5'));
  const [lossChoice, setLossChoice] = useState('low');
  const [customDb, setCustomDb] = useState('');
  const [traceValue, setTraceValue] = useState('');
  const [otherValue, setOtherValue] = useState('');
  const [reservePct, setReservePct] = useState('15');

  const g = GENERATIONS[gen];
  const hasPresets = gen !== '4';
  const effectiveChoice = hasPresets ? lossChoice : 'custom';

  function changeGen(next) {
    setGen(next);
    setSeg(defaultsFor(next));
    if (next === '4') setLossChoice('custom');
    else if (lossChoice === 'custom' && customDb === '') setLossChoice('low');
  }

  const preset = LOSS_PRESETS.find((p) => p.id === effectiveChoice);
  const dbPerIn = preset ? preset.value : parseFloat(customDb);

  const num = (v) => (v === '' || Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v));
  const result =
    traceValue !== ''
      ? evaluateChannel({
          gen,
          pkg: num(seg.pkg),
          cem: num(seg.cem),
          aic: num(seg.aic),
          traceIn: parseFloat(traceValue),
          dbPerIn,
          otherDb: num(otherValue),
          reservePct: parseFloat(reservePct),
        })
      : null;

  const splitMissing = !g.hasSplit && seg.pkg === '' && seg.aic === '';

  const verdictText = result
    ? splitMissing
      ? 'Partial estimate: enter package and add-in card loss for a real verdict'
      : VERDICTS[result.status]
    : '';

  let summary = '';
  if (result) {
    summary = [
      `PCIe channel reach check: ${g.label}, ${traceValue} in of board trace at ${fmtDb(dbPerIn)} dB/in (Nyquist ${g.nyquist})`,
      `Estimated channel loss: ${fmtDb(result.estimated)} dB of a ${result.total} dB budget`,
      `Reserve held back: ${fmtDb(result.reserve)} dB (${reservePct}%)`,
      `Margin after reserve: ${fmtDb(result.margin)} dB`,
      `Result: ${verdictText}`,
      `Longest board trace that still fits at these settings: ${fmtIn(result.maxTraceIn)} in (${fmtMm(result.maxTraceIn)} mm)`,
      'Early-design estimate only. Confirm with channel simulation or measured S-parameters.',
    ].join('\n');
  }

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_gen">PCIe generation</label>
          <select id="calc_pcie_gen" value={gen} onChange={(e) => changeGen(e.target.value)}>
            {Object.keys(GENERATIONS).map((k) => (
              <option key={k} value={k}>
                {GENERATIONS[k].label}
              </option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_loss">Board material loss</label>
          <select
            id="calc_pcie_loss"
            value={effectiveChoice}
            onChange={(e) => setLossChoice(e.target.value)}
          >
            {hasPresets &&
              LOSS_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            <option value="custom">Enter my own (dB per inch)</option>
          </select>
        </div>

        {effectiveChoice === 'custom' && (
          <div className="cs-calc-field">
            <label htmlFor="calc_pcie_custom">
              Board loss at {g.nyquist} (dB per inch)
            </label>
            <input
              id="calc_pcie_custom"
              type="number"
              min="0"
              step="any"
              placeholder="From your laminate datasheet"
              value={customDb}
              onChange={(e) => setCustomDb(e.target.value)}
            />
          </div>
        )}

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_trace">Board trace length (inches)</label>
          <input
            id="calc_pcie_trace"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 8"
            value={traceValue}
            onChange={(e) => setTraceValue(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_other">Other loss in the path (dB)</label>
          <input
            id="calc_pcie_other"
            type="number"
            min="0"
            step="any"
            placeholder="Extra connectors, cable, vias (optional)"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_pkg">Root package loss (dB)</label>
          <input
            id="calc_pcie_pkg"
            type="number"
            min="0"
            step="any"
            placeholder={g.hasSplit ? '' : 'From your silicon vendor'}
            value={seg.pkg}
            onChange={(e) => setSeg({ ...seg, pkg: e.target.value })}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_cem">CEM connector loss (dB)</label>
          <input
            id="calc_pcie_cem"
            type="number"
            min="0"
            step="any"
            placeholder={g.hasSplit ? '' : 'From the connector datasheet'}
            value={seg.cem}
            onChange={(e) => setSeg({ ...seg, cem: e.target.value })}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_aic">Add-in card / endpoint loss (dB)</label>
          <input
            id="calc_pcie_aic"
            type="number"
            min="0"
            step="any"
            placeholder={g.hasSplit ? '' : 'From your card vendor'}
            value={seg.aic}
            onChange={(e) => setSeg({ ...seg, aic: e.target.value })}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_pcie_reserve">Margin to hold back</label>
          <select
            id="calc_pcie_reserve"
            value={reservePct}
            onChange={(e) => setReservePct(e.target.value)}
          >
            {RESERVE_OPTIONS.map((r) => (
              <option key={r} value={String(r)}>
                {r}% of the total budget
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-label">Estimated channel loss</span>
              <span className="cs-calc-result-number">
                {fmtDb(result.estimated)} dB of {result.total} dB
              </span>
            </div>
            <div className="cs-calc-result-row">
              <span>Result</span>
              <span
                style={
                  result.status === 'fits' && !splitMissing ? undefined : { color: 'var(--copper)' }
                }
              >
                {verdictText}
              </span>
            </div>
            <div className="cs-calc-result-row">
              <span>Margin held back ({reservePct}%)</span>
              <span>{fmtDb(result.reserve)} dB</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Margin left after that reserve</span>
              <span>{fmtDb(result.margin)} dB</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Board trace loss</span>
              <span>{fmtDb(result.traceLoss)} dB</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Longest board trace that still fits</span>
              <span>
                {fmtIn(result.maxTraceIn)} in ({fmtMm(result.maxTraceIn)} mm)
              </span>
            </div>
            {splitMissing && (
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 0' }}>
                No package or add-in card loss was entered, so this result counts only the board
                trace and the other loss you listed. Enter those values for a realistic total.
              </p>
            )}
          </>
        ) : (
          <p className="cs-calc-placeholder">
            Choose a generation, a board material and a trace length to see how much of the
            channel loss budget you use.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Early-design estimate only. Budgets are end-to-end (bump to bump) insertion loss at the
        Nyquist frequency, and real channels also depend on vias, breakouts, reflections,
        crosstalk and silicon equalization. Confirm with channel simulation or measured
        S-parameters before you commit to a design. Selecting a connector for a high-speed
        channel?{' '}
        <Link href={REQUEST_URL} prefetch={false}>
          Request high-speed connector pricing
        </Link>
        .
      </p>

      <EmailResultBox
        tool="pcie-channel-reach-retimer-checker"
        toolName="PCIe Channel Reach & Retimer Checker"
        summary={summary}
      />
    </div>
  );
}
