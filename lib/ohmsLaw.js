// lib/ohmsLaw.js
//
// Basic Ohm's Law calculator: V = I × R
// Given any two known values, solves for the third.

export function calculateOhmsLaw({ voltage, current, resistance }) {
  const known = [voltage, current, resistance].filter(
    (v) => v !== null && v !== undefined && v !== '' && !isNaN(v)
  );

  if (known.length !== 2) return null;

  if (voltage === null || voltage === undefined || voltage === '' || isNaN(voltage)) {
    // Solve for voltage
    const v = current * resistance;
    return { voltage: round(v), current: round(current), resistance: round(resistance), solvedFor: 'voltage' };
  }

  if (current === null || current === undefined || current === '' || isNaN(current)) {
    // Solve for current
    if (resistance === 0) return null;
    const i = voltage / resistance;
    return { voltage: round(voltage), current: round(i), resistance: round(resistance), solvedFor: 'current' };
  }

  if (resistance === null || resistance === undefined || resistance === '' || isNaN(resistance)) {
    // Solve for resistance
    if (current === 0) return null;
    const r = voltage / current;
    return { voltage: round(voltage), current: round(current), resistance: round(r), solvedFor: 'resistance' };
  }

  return null;
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}