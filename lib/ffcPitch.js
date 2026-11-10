// FFC/FPC pitch and positions geometry.
// All values are pure geometry (no manufacturer data):
//   span          = (positions - 1) x pitch   center of first conductor to center of last
//   nominal width = positions x pitch         the width each conductor "owns"
// Real cable widths add an edge margin that varies by manufacturer and series.

export const PITCH_OPTIONS = [0.3, 0.5, 0.8, 1.0, 1.25];

const MM_PER_INCH = 25.4;

function round(value, digits = 2) {
  const f = Math.pow(10, digits);
  return Math.round(value * f) / f;
}

export function formatMm(value) {
  return String(round(value, 2));
}

export function formatInch(mm) {
  return round(mm / MM_PER_INCH, 3).toFixed(3);
}

export function calculateFromPositions(pitch, positions) {
  if (!(pitch > 0) || !Number.isInteger(positions) || positions < 2) return null;
  const span = (positions - 1) * pitch;
  const nominalWidth = positions * pitch;
  return { pitch, positions, span, nominalWidth };
}

export function calculateMaxPositions(pitch, availableWidth) {
  if (!(pitch > 0) || !(availableWidth > 0)) return null;
  // Largest n where n x pitch <= available width. The small epsilon avoids
  // floating-point misses such as 3 / 0.5 evaluating to 5.999999.
  const positions = Math.floor(availableWidth / pitch + 1e-9);
  if (positions < 1) return { positions: 0, span: 0, nominalWidth: 0, pitch, availableWidth };
  return {
    positions,
    span: (positions - 1) * pitch,
    nominalWidth: positions * pitch,
    pitch,
    availableWidth,
  };
}

export function compareAcrossPitches(positions) {
  if (!Number.isInteger(positions) || positions < 2) return [];
  return PITCH_OPTIONS.map((pitch) => ({
    pitch,
    span: (positions - 1) * pitch,
    nominalWidth: positions * pitch,
  }));
}
