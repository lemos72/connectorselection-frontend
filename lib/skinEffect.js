// Skin Effect Calculator — lib/skinEffect.js
// Formula: δ = √(ρ / (π × f × μ))
// where δ = skin depth (meters), ρ = resistivity (Ω·m), f = frequency (Hz), μ = permeability (H/m)

export const MATERIALS = {
  copper: {
    label: 'Copper',
    resistivity: 1.68e-8,   // Ω·m at 20°C
    permeability: 4 * Math.PI * 1e-7, // H/m (non-magnetic)
  },
  aluminum: {
    label: 'Aluminum',
    resistivity: 2.82e-8,   // Ω·m at 20°C
    permeability: 4 * Math.PI * 1e-7, // H/m (non-magnetic)
  },
};

/**
 * Calculate skin depth for a given frequency and material.
 * @param {number} frequencyHz - Frequency in Hz
 * @param {string} material - 'copper' | 'aluminum'
 * @returns {{ skinDepthMm: number, skinDepthUm: number } | null}
 */
export function calculateSkinDepth(frequencyHz, material) {
  if (!frequencyHz || frequencyHz <= 0) return null;

  const mat = MATERIALS[material];
  if (!mat) return null;

  const { resistivity, permeability } = mat;

  // δ = √(ρ / (π × f × μ))
  const skinDepthMeters = Math.sqrt(resistivity / (Math.PI * frequencyHz * permeability));
  const skinDepthMm = skinDepthMeters * 1000;
  const skinDepthUm = skinDepthMeters * 1e6;

  return {
    skinDepthMm,
    skinDepthUm,
  };
}

/**
 * Convert a frequency value + unit to Hz.
 * @param {number} value
 * @param {'Hz'|'kHz'|'MHz'|'GHz'} unit
 * @returns {number}
 */
export function toHz(value, unit) {
  const multipliers = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };
  return value * (multipliers[unit] || 1);
}

/**
 * Return a plain-English interpretation of the skin depth result.
 * @param {number} skinDepthMm
 * @param {string} material
 * @returns {string}
 */
export function interpretSkinDepth(skinDepthMm, material) {
  const matLabel = MATERIALS[material]?.label || 'conductor';
  const effectiveDiameterMm = (skinDepthMm * 2).toFixed(3);

  if (skinDepthMm >= 10) {
    return `At this frequency, skin effect is negligible for typical ${matLabel} wire sizes. Current distributes evenly across the conductor cross-section.`;
  } else if (skinDepthMm >= 1) {
    return `Current is concentrated in the outer ${skinDepthMm.toFixed(2)} mm of the ${matLabel} conductor. Wire thicker than ${effectiveDiameterMm} mm diameter gains little from extra copper at this frequency.`;
  } else if (skinDepthMm >= 0.1) {
    return `Skin effect is significant. Current flows in the outer ${skinDepthMm.toFixed(3)} mm only. For solid wire thicker than ${effectiveDiameterMm} mm diameter, consider Litz wire or hollow conductors to recover efficiency.`;
  } else {
    return `Skin effect is severe at this frequency. Current is confined to the outermost ${(skinDepthMm * 1000).toFixed(1)} μm. Solid conductors are highly inefficient — Litz wire or plated conductors are strongly recommended.`;
  }
}
