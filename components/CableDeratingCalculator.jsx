'use client';

import { useState } from 'react';
import EmailResultBox from './EmailResultBox';
import { INSULATION_RATINGS, calculateCableDerating } from '../lib/cableDerating';

const STATUS_LABELS = {
  good: { label: 'Light derating — 80% or more of rated current', className: 'cs-calc-status-good' },
  caution: { label: 'Moderate derating — 50-80% of rated current', className: 'cs-calc-status-caution' },
  poor: { label: 'Heavy derating — under 50% of rated current', className: 'cs-calc-status-poor' },
};

export default function CableDeratingCalculator() {
  const [ratedCurrent, setRatedCurrent] = useState('');
  const [conductors, setConductors] = useState('1');
  const [insulationRating, setInsulationRating] = useState('105');
  const [ambient, setAmbient] = useState('');

  const result = calculateCableDerating({
    ratedCurrent: parseFloat(ratedCurrent),
    conductors: parseFloat(conductors),
    insulationRatingC: parseFloat(insulationRating),
    ambientC: parseFloat(ambient),
  });

  const summary = result
    ? [
        result.ambientTooHot
          ? 'Ambient temperature is at or above the insulation rating: no safe current.'
          : `Derated current: ${result.deratedCurrent} A (${result.combinedPercent}% of ${ratedCurrent} A)`,
        `Bundle factor: ${result.bundlePercent}% (${result.conductors} conductors)`,
        `Temperature factor: ${result.temperaturePercent}% (${ambient} C ambient, ${insulationRating} C insulation)`,
        'Planning estimate; verify against your cable manufacturer data.',
      ].join('\n')
    : '';

  return (
    <div className="cs-calculator">
      <div className="cs-calc-inputs">
        <div className="cs-calc-field">
          <label htmlFor="calc_rated_current">Rated Current (Amps)</label>
          <input
            id="calc_rated_current"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 5"
            value={ratedCurrent}
            onChange={(e) => setRatedCurrent(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_conductors">Conductors in Bundle</label>
          <input
            id="calc_conductors"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 12"
            value={conductors}
            onChange={(e) => setConductors(e.target.value)}
          />
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_insulation">Insulation Temperature Rating</label>
          <select
            id="calc_insulation"
            value={insulationRating}
            onChange={(e) => setInsulationRating(e.target.value)}
          >
            {INSULATION_RATINGS.map((t) => (
              <option key={t} value={t}>{t} °C</option>
            ))}
          </select>
        </div>

        <div className="cs-calc-field">
          <label htmlFor="calc_ambient">Ambient Temperature (°C)</label>
          <input
            id="calc_ambient"
            type="number"
            step="1"
            placeholder="e.g. 60"
            value={ambient}
            onChange={(e) => setAmbient(e.target.value)}
          />
        </div>
      </div>

      <div className="cs-calc-results">
        {result ? (
          result.ambientTooHot ? (
            <div className={`cs-calc-status ${STATUS_LABELS.poor.className}`}>
              Ambient temperature is at or above the insulation rating. This cable has no safe current capacity here; choose a higher-rated insulation.
            </div>
          ) : (
            <>
              <div className="cs-calc-result-main">
                <span className="cs-calc-result-number">{result.deratedCurrent}A</span>
                <span className="cs-calc-result-label">Derated Current</span>
              </div>
              <div className="cs-calc-result-row">
                <span>Bundle Factor</span>
                <strong>{result.bundlePercent}%</strong>
              </div>
              <div className="cs-calc-result-row">
                <span>Temperature Factor</span>
                <strong>{result.temperaturePercent}%</strong>
              </div>
              <div className="cs-calc-result-row">
                <span>Combined Factor</span>
                <strong>{result.combinedPercent}%</strong>
              </div>
              <div className={`cs-calc-status ${STATUS_LABELS[result.statusLevel].className}`}>
                {STATUS_LABELS[result.statusLevel].label}
              </div>
            </>
          )
        ) : (
          <p className="cs-calc-placeholder">
            Enter your rated current, conductor count, insulation rating, and ambient temperature to see results.
          </p>
        )}
      </div>

      <p className="cs-calc-disclaimer">
        Planning estimate only. Rated current is taken at a 30 °C ambient for a single cable in free air. Check the result against your cable manufacturer&apos;s data and your application&apos;s requirements.
      </p>
      <EmailResultBox tool="cable-derating-calculator" toolName="Cable Derating Factor Calculator" summary={summary} />
    </div>
  );
}
