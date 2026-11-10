'use client';

import { useState } from 'react';
import Link from 'next/link';
import EmailResultBox from './EmailResultBox';
import {
  PITCH_OPTIONS,
  calculateFromPositions,
  calculateMaxPositions,
  compareAcrossPitches,
  formatMm,
  formatInch,
} from '../lib/ffcPitch';

const REQUEST_URL =
  '/request-info/fpc-ffc-connectors/?utm_source=site&utm_medium=tool&utm_campaign=ffc-fpc-pitch-calculator';

export default function FfcFpcPitchCalculator() {
  const [mode, setMode] = useState('positions'); // positions | space
  const [pitch, setPitch] = useState('0.5');
  const [positionsValue, setPositionsValue] = useState('');
  const [widthValue, setWidthValue] = useState('');

  const pitchNum = parseFloat(pitch);
  const positionsNum = parseInt(positionsValue, 10);
  const widthNum = parseFloat(widthValue);

  const fromPositions =
    mode === 'positions' && positionsValue !== ''
      ? calculateFromPositions(pitchNum, positionsNum)
      : null;
  const fromSpace =
    mode === 'space' && widthValue !== '' ? calculateMaxPositions(pitchNum, widthNum) : null;
  const comparison =
    mode === 'positions' && fromPositions ? compareAcrossPitches(positionsNum) : [];

  let summary = '';
  if (fromPositions) {
    summary = [
      `FFC/FPC pitch and positions: ${fromPositions.positions} positions at ${pitch} mm pitch`,
      `Conductor span (first to last center): ${formatMm(fromPositions.span)} mm (${formatInch(fromPositions.span)} in)`,
      `Nominal width (positions x pitch): ${formatMm(fromPositions.nominalWidth)} mm (${formatInch(fromPositions.nominalWidth)} in)`,
      'Geometry only; real cable widths add an edge margin. Check the manufacturer datasheet.',
    ].join('\n');
  } else if (fromSpace && fromSpace.positions > 0) {
    summary = [
      `FFC/FPC positions that fit: ${fromSpace.positions} positions at ${pitch} mm pitch in ${widthValue} mm`,
      `Conductor span: ${formatMm(fromSpace.span)} mm`,
      `Nominal width: ${formatMm(fromSpace.nominalWidth)} mm`,
      'Geometry only; real cable widths add an edge margin. Check the manufacturer datasheet.',
    ].join('\n');
  }

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_ffc_mode">What do you want to find?</label>
          <select id="calc_ffc_mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="positions">Width from number of positions</option>
            <option value="space">Positions that fit in a given width</option>
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_ffc_pitch">Pitch (mm)</label>
          <select id="calc_ffc_pitch" value={pitch} onChange={(e) => setPitch(e.target.value)}>
            {PITCH_OPTIONS.map((p) => (
              <option key={p} value={String(p)}>
                {p} mm
              </option>
            ))}
          </select>
        </div>

        {mode === 'positions' ? (
          <div className="cs-calc-field">
            <label htmlFor="calc_ffc_positions">Number of positions (conductors)</label>
            <input
              id="calc_ffc_positions"
              type="number"
              min="2"
              step="1"
              placeholder="e.g. 24"
              value={positionsValue}
              onChange={(e) => setPositionsValue(e.target.value)}
            />
          </div>
        ) : (
          <div className="cs-calc-field">
            <label htmlFor="calc_ffc_width">Available width (mm)</label>
            <input
              id="calc_ffc_width"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 12"
              value={widthValue}
              onChange={(e) => setWidthValue(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="cs-calc-results">
        {fromPositions ? (
          <>
            <div className="cs-calc-result-main">
              <span className="cs-calc-result-label">Conductor span</span>
              <span className="cs-calc-result-number">{formatMm(fromPositions.span)} mm</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Span in inches</span>
              <span>{formatInch(fromPositions.span)} in</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Nominal width (positions &times; pitch)</span>
              <span>{formatMm(fromPositions.nominalWidth)} mm</span>
            </div>
            <div className="cs-calc-result-row">
              <span>Nominal width in inches</span>
              <span>{formatInch(fromPositions.nominalWidth)} in</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 0' }}>
              Same {positionsNum} positions at other pitches (span / nominal width):
            </p>
            {comparison.map((c) => (
              <div className="cs-calc-result-row" key={c.pitch}>
                <span>{c.pitch} mm pitch</span>
                <span>
                  {formatMm(c.span)} / {formatMm(c.nominalWidth)} mm
                </span>
              </div>
            ))}
          </>
        ) : fromSpace ? (
          fromSpace.positions > 0 ? (
            <>
              <div className="cs-calc-result-main">
                <span className="cs-calc-result-label">Positions that fit</span>
                <span className="cs-calc-result-number">{fromSpace.positions}</span>
              </div>
              <div className="cs-calc-result-row">
                <span>Conductor span</span>
                <span>{formatMm(fromSpace.span)} mm</span>
              </div>
              <div className="cs-calc-result-row">
                <span>Nominal width (positions &times; pitch)</span>
                <span>{formatMm(fromSpace.nominalWidth)} mm</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 0' }}>
                This is a theoretical maximum. Real cables need an edge margin on each side, so
                the usable count is often a few positions lower. Check the datasheet.
              </p>
            </>
          ) : (
            <p className="cs-calc-placeholder">
              That width is smaller than a single position at this pitch.
            </p>
          )
        ) : (
          <p className="cs-calc-placeholder">
            {mode === 'positions'
              ? 'Enter a pitch and number of positions to see the conductor span and width.'
              : 'Enter a pitch and available width to see how many positions fit.'}
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Geometry only: span = (positions &minus; 1) &times; pitch, and nominal width = positions
        &times; pitch. Actual FFC/FPC cable widths include an edge margin that varies by
        manufacturer and series, and connector body length and tolerances differ by part. For
        general planning only &mdash; confirm against the manufacturer&rsquo;s datasheet before
        finalizing a design. Need pricing or availability for a specific requirement?{' '}
        <Link href={REQUEST_URL} prefetch={false}>
          Request FFC/FPC pricing
        </Link>
        .
      </p>

      <EmailResultBox
        tool="ffc-fpc-pitch-calculator"
        toolName="FFC/FPC Pitch & Positions Calculator"
        summary={summary}
      />
    </div>
  );
}
