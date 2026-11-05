// Return loss / VSWR / reflection coefficient maths.
// Gamma (|Γ|) is the magnitude of the reflection coefficient, between 0 and 1.
//   Return loss RL (dB)  = -20 · log10(Γ)
//   VSWR                 = (1 + Γ) / (1 − Γ)
//   Reflected power      = Γ²
//   Mismatch loss (dB)   = -10 · log10(1 − Γ²)

export const MODES = {
  rl:    { label: 'Return loss (dB)',            placeholder: 'e.g. 15' },
  vswr:  { label: 'VSWR',                        placeholder: 'e.g. 1.5' },
  gamma: { label: 'Reflection coefficient |Γ|',  placeholder: 'e.g. 0.18' },
};

export function gammaFrom(mode, value) {
  if (!(value > 0)) return { error: 'Enter a value greater than zero.' };
  if (mode === 'rl') {
    return { gamma: Math.pow(10, -value / 20) };
  }
  if (mode === 'vswr') {
    if (value <= 1) return { error: 'VSWR must be greater than 1 (1:1 is a perfect match).' };
    return { gamma: (value - 1) / (value + 1) };
  }
  if (mode === 'gamma') {
    if (value >= 1) return { error: 'The reflection coefficient must be between 0 and 1.' };
    return { gamma: value };
  }
  return { error: 'Unknown input type.' };
}

export function calculateReflection(mode, value) {
  const g = gammaFrom(mode, value);
  if (g.error) return { error: g.error };
  const gamma = g.gamma;
  if (gamma >= 1) return { error: 'Total reflection: nothing is transmitted.' };
  const gamma2 = gamma * gamma;
  return {
    gamma,
    returnLossDb: -20 * Math.log10(gamma),
    vswr: (1 + gamma) / (1 - gamma),
    reflectedPct: gamma2 * 100,
    transmittedPct: (1 - gamma2) * 100,
    mismatchLossDb: -10 * Math.log10(1 - gamma2),
  };
}

// Common rule-of-thumb bands: 20 dB return loss ≈ VSWR 1.22, 10 dB ≈ VSWR 1.92.
export function matchStatus(returnLossDb) {
  if (returnLossDb >= 20) return 'good';
  if (returnLossDb >= 10) return 'caution';
  return 'poor';
}

export function interpretMatch(r) {
  const reflected = r.reflectedPct >= 10 ? r.reflectedPct.toFixed(1) : r.reflectedPct.toFixed(2);
  return `${reflected}% of the incident power is reflected and ${r.transmittedPct.toFixed(2)}% reaches the load. The mismatch alone costs ${r.mismatchLossDb.toFixed(3)} dB; cable and connector attenuation is extra.`;
}

export function fmt(n, digits = 3) {
  if (!isFinite(n)) return '∞';
  if (n >= 1000) return n.toFixed(0);
  return Number(n.toPrecision(digits)).toString();
}
