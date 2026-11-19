// Coolant flow rate from heat load and temperature rise: V = Q / (rho x cp x dT).
// Fluid properties are typical values near 30 C. Planning estimates only.

export const COOLANTS = [
  { id: 'water', label: 'Water', density: 996, cp: 4180 },
  { id: 'pg25', label: 'Water + 25% propylene glycol', density: 1020, cp: 3950 },
  { id: 'pg30', label: 'Water + 30% propylene glycol', density: 1025, cp: 3890 },
  { id: 'pg50', label: 'Water + 50% propylene glycol', density: 1038, cp: 3560 },
];

export const COMPARE_LOADS_KW = [10, 30, 100, 200];
export const COMPARE_DELTA_T = [5, 10, 15];

const L_PER_GAL = 3.785411784;

// Returns volumetric flow in litres per minute, or null for bad input.
export function flowLpm(heatKw, deltaT, coolant) {
  if (!Number.isFinite(heatKw) || heatKw <= 0) return null;
  if (!Number.isFinite(deltaT) || deltaT <= 0) return null;
  if (!coolant) return null;
  const m3PerSec = (heatKw * 1000) / (coolant.density * coolant.cp * deltaT);
  return m3PerSec * 1000 * 60;
}

export function calculateCoolantFlow({ heatKw, deltaT, coolantId, racks }) {
  const coolant = COOLANTS.find((c) => c.id === coolantId);
  const lpm = flowLpm(heatKw, deltaT, coolant);
  if (lpm === null) return null;
  const massKgS = (heatKw * 1000) / (coolant.cp * deltaT);
  const n = Number.isFinite(racks) && racks >= 1 ? Math.floor(racks) : 1;
  return {
    lpm: Math.round(lpm * 10) / 10,
    gpm: Math.round((lpm / L_PER_GAL) * 10) / 10,
    massKgS: Math.round(massKgS * 100) / 100,
    racks: n,
    totalLpm: Math.round(lpm * n * 10) / 10,
    totalGpm: Math.round(((lpm * n) / L_PER_GAL) * 10) / 10,
  };
}
