// lib/wireGauge.js
//
// Standard AWG-to-circular-mils values, sourced from NEC Chapter 9, Table 8
// (a publicly standardized reference, not manufacturer-specific).
// Copper only for v1 — see voltage-drop-calculator-implementation-plan.md
// for the reasoning behind scoping v1 to DC, copper-only.

export const AWG_CIRCULAR_MILS = {
  '24': 404.0,
  '22': 642.4,
  '20': 1022,
  '18': 1624,
  '16': 2583,
  '14': 4107,
  '12': 6530,
  '10': 10380,
  '8': 16510,
  '6': 26240,
  '4': 41740,
  '2': 66360,
  '1': 83690,
  '1/0': 105600,
  '2/0': 133100,
  '3/0': 167800,
  '4/0': 211600,
};

export const AWG_OPTIONS = [
  '24', '22', '20', '18', '16', '14', '12', '10',
  '8', '6', '4', '2', '1', '1/0', '2/0', '3/0', '4/0',
];

// Resistivity constant for copper, in ohm-circular-mils/ft.
// K=12.9 is the standard value used in NEC-style voltage drop calculations.
const COPPER_K = 12.9;
const METERS_TO_FEET = 3.28084;

/**
 * Calculates voltage drop for a copper conductor, DC circuit.
 */
export function calculateVoltageDrop({
  awg,
  currentAmps,
  length,
  lengthUnit = 'feet',
  systemVoltage,
  roundTrip = true,
}) {
  const circularMils = AWG_CIRCULAR_MILS[awg];

  if (
    !circularMils ||
    !currentAmps || currentAmps <= 0 ||
    !length || length <= 0 ||
    !systemVoltage || systemVoltage <= 0
  ) {
    return null;
  }

  const lengthInFeet = lengthUnit === 'meters' ? length * METERS_TO_FEET : length;
  const tripMultiplier = roundTrip ? 2 : 1;

  const voltageDrop = (tripMultiplier * COPPER_K * currentAmps * lengthInFeet) / circularMils;
  const percentDrop = (voltageDrop / systemVoltage) * 100;
  const loadVoltage = systemVoltage - voltageDrop;

  let statusLevel;
  if (percentDrop <= 3) {
    statusLevel = 'good';
  } else if (percentDrop <= 5) {
    statusLevel = 'caution';
  } else {
    statusLevel = 'poor';
  }

  return {
    voltageDrop: Math.round(voltageDrop * 1000) / 1000,
    percentDrop: Math.round(percentDrop * 100) / 100,
    loadVoltage: Math.round(loadVoltage * 1000) / 1000,
    statusLevel,
  };
}
// 1 circular mil = 0.0005067 mm² (standard conversion constant)
const CMIL_TO_MM2 = 0.0005067;

/**
 * Converts an AWG size to its cross-sectional area in mm².
 */
export function awgToMm2(awg) {
  const circularMils = AWG_CIRCULAR_MILS[awg];
  if (!circularMils) return null;
  return Math.round(circularMils * CMIL_TO_MM2 * 1000) / 1000;
}

/**
 * Given a target mm² value, finds the closest standard AWG size.
 * Returns both the matched AWG and its exact mm² for comparison.
 */
export function mm2ToNearestAwg(mm2) {
  if (!mm2 || mm2 <= 0) return null;

  let closest = null;
  let smallestDiff = Infinity;

  for (const awg of AWG_OPTIONS) {
    const awgMm2 = awgToMm2(awg);
    const diff = Math.abs(awgMm2 - mm2);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = { awg, mm2: awgMm2 };
    }
  }

  return closest;
}