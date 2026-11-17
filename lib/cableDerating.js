// Cable current derating: bundle (conductor count) factor x ambient temperature factor.
// Estimates for general planning only.

export const INSULATION_RATINGS = [80, 90, 105, 125, 150, 200];

export const BUNDLE_BANDS = [
  { label: '1-3', min: 1, max: 3, factor: 1 },
  { label: '4-6', min: 4, max: 6, factor: 0.8 },
  { label: '7-9', min: 7, max: 9, factor: 0.7 },
  { label: '10-20', min: 10, max: 20, factor: 0.5 },
  { label: '21-30', min: 21, max: 30, factor: 0.45 },
  { label: '31-40', min: 31, max: 40, factor: 0.4 },
  { label: '41 or more', min: 41, max: Infinity, factor: 0.35 },
];

// Reference ambient for the rated current (degrees C).
export const BASE_AMBIENT_C = 30;

export function bundleFactor(conductors) {
  const band = BUNDLE_BANDS.find((b) => conductors >= b.min && conductors <= b.max);
  return band ? band.factor : null;
}

// Heating scales with I^2 * R, so the allowed current scales with the square
// root of the remaining temperature headroom. Not raised above 1 for cool rooms.
export function temperatureFactor(insulationRatingC, ambientC) {
  if (ambientC >= insulationRatingC) return 0;
  if (ambientC <= BASE_AMBIENT_C) return 1;
  return Math.sqrt((insulationRatingC - ambientC) / (insulationRatingC - BASE_AMBIENT_C));
}

export function calculateCableDerating({ ratedCurrent, conductors, insulationRatingC, ambientC }) {
  if (
    !Number.isFinite(ratedCurrent) || ratedCurrent <= 0 ||
    !Number.isFinite(conductors) || conductors < 1 ||
    !Number.isFinite(insulationRatingC) ||
    !Number.isFinite(ambientC)
  ) {
    return null;
  }
  const n = Math.floor(conductors);
  const bundle = bundleFactor(n);
  const temp = temperatureFactor(insulationRatingC, ambientC);
  const combined = bundle * temp;
  const derated = ratedCurrent * combined;

  let statusLevel = 'good';
  if (combined < 0.5) statusLevel = 'poor';
  else if (combined < 0.8) statusLevel = 'caution';
  if (temp === 0) statusLevel = 'poor';

  return {
    conductors: n,
    bundlePercent: Math.round(bundle * 1000) / 10,
    temperaturePercent: Math.round(temp * 1000) / 10,
    combinedPercent: Math.round(combined * 1000) / 10,
    deratedCurrent: Math.round(derated * 100) / 100,
    ambientTooHot: temp === 0,
    statusLevel,
  };
}
