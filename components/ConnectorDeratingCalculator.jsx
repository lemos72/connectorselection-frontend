'use client';

import { useState } from 'react';

export default function ConnectorDeratingCalculator() {
  const [ratedCurrent, setRatedCurrent] = useState('');
  const [refAmbient, setRefAmbient] = useState('25');
  const [maxTemp, setMaxTemp] = useState('105');
  const [operatingAmbient, setOperatingAmbient] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function calculate(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const iRated = parseFloat(ratedCurrent);
    const tRef = parseFloat(refAmbient);
    const tMax = parseFloat(maxTemp);
    const tOp = parseFloat(operatingAmbient);

    if ([iRated, tRef, tMax, tOp].some((v) => Number.isNaN(v))) {
      setError('Enter a number in every field.');
      return;
    }
    if (iRated <= 0) {
      setError('Rated current must be greater than zero.');
      return;
    }
    if (tMax <= tRef) {
      setError('Max rated temperature must be higher than the reference ambient temperature.');
      return;
    }
    if (tOp >= tMax) {
      setError(
        'Your operating ambient is at or above the connector’s max rated temperature — no current rating is safe at this ambient. Choose a higher-rated connector or reduce ambient temperature.'
      );
      return;
    }

    const ratio = (tMax - tOp) / (tMax - tRef);
    const derated = iRated * Math.sqrt(Math.max(ratio, 0));
    setResult({ derated: derated.toFixed(2), ratio: (ratio * 100).toFixed(0) });
  }

  return (
    <div className="derating-calc">
      <form onSubmit={calculate} className="derating-calc-form">
        <label>
          Rated current at reference ambient (A)
          <input
            type="number"
            step="any"
            min="0"
            inputMode="decimal"
            value={ratedCurrent}
            onChange={(e) => setRatedCurrent(e.target.value)}
            required
          />
        </label>

        <label>
          Reference ambient temperature (°C)
          <input
            type="number"
            step="any"
            inputMode="decimal"
            value={refAmbient}
            onChange={(e) => setRefAmbient(e.target.value)}
            required
          />
          <span className="derating-hint">
            The ambient temperature the datasheet’s rated current was measured at — commonly 20–30°C. Check the datasheet’s stated test conditions.
          </span>
        </label>

        <label>
          Connector’s max rated temperature (°C)
          <input
            type="number"
            step="any"
            inputMode="decimal"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value)}
            required
          />
          <span className="derating-hint">
            The maximum rated operating temperature for the housing/contact material — commonly 85, 105, 125, or 150°C depending on material.
          </span>
        </label>

        <label>
          Your actual operating ambient temperature (°C)
          <input
            type="number"
            step="any"
            inputMode="decimal"
            value={operatingAmbient}
            onChange={(e) => setOperatingAmbient(e.target.value)}
            required
          />
        </label>

        <button type="submit">Calculate derated current</button>
      </form>

      {error && <p className="derating-error">{error}</p>}

      {result && (
        <div className="derating-result">
          <p>
            Estimated derated current: <strong>{result.derated} A</strong>
          </p>
          <p className="derating-hint">
            That’s {result.ratio}% of the rated current, based on the remaining thermal headroom between your operating ambient and the connector’s max rated temperature.
          </p>
        </div>
      )}

      <p className="derating-disclaimer">
        This is a planning estimate using the standard square-root derating approximation
        (I<sub>derated</sub> = I<sub>rated</sub> × √[(T<sub>max</sub> − T<sub>ambient</sub>) / (T<sub>max</sub> − T<sub>ref</sub>)]), the same
        relationship most manufacturer derating curves are built on. It is not a substitute for the
        actual published derating curve for your specific part number, which also accounts for
        contact geometry, number of loaded contacts, and airflow — factors this general formula
        can’t capture. Always verify against the manufacturer’s datasheet before finalizing a design.
      </p>
    </div>
  );
}
