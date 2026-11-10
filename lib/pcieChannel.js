// PCIe channel-loss budget helpers.
// Budgets are end-to-end (bump to bump) insertion loss at the Nyquist frequency.
//   PCIe 4.0: 28 dB total  (package 5.0 + CEM connector 1.5 + add-in card 8.0 + system board 13.5)
//   PCIe 5.0: 36 dB total  (package 9.0 + CEM connector 1.5 + add-in card 9.5 + system board 16.0)
//   PCIe 6.0: 32 dB total  (no per-segment split included here)
// Sources: Astera Labs, "PCI Express 5.0 Architecture Channel Insertion Loss Budget";
//          Signal Integrity Journal, "How to Choose an Interconnect for PCIe 6.0 High-Speed Systems".
// This is an early-design estimate, not a compliance check.

export const GENERATIONS = {
  '4': { label: 'PCIe 4.0 (16 GT/s)', nyquist: '8 GHz', total: 28, pkg: 5.0, cem: 1.5, aic: 8.0, hasSplit: true },
  '5': { label: 'PCIe 5.0 (32 GT/s)', nyquist: '16 GHz', total: 36, pkg: 9.0, cem: 1.5, aic: 9.5, hasSplit: true },
  '6': { label: 'PCIe 6.0 (64 GT/s)', nyquist: '16 GHz', total: 32, hasSplit: false },
};

// Typical board loss at 16 GHz (Gen 5 / Gen 6). No presets for Gen 4 (8 GHz).
export const LOSS_PRESETS = [
  { id: 'low', label: 'Low-loss laminate (about 1.0 dB/in at 16 GHz)', value: 1.0 },
  { id: 'mid', label: 'Mid-range laminate (about 1.4 dB/in at 16 GHz)', value: 1.4 },
];

export const RESERVE_OPTIONS = [10, 15, 20];

const MM_PER_INCH = 25.4;

function round(v, d = 1) {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function fmtDb(v) {
  return round(v, 1).toFixed(1);
}

export function fmtIn(v) {
  return round(v, 1).toFixed(1);
}

export function fmtMm(inches) {
  return String(Math.round(inches * MM_PER_INCH));
}

export function evaluateChannel({ gen, pkg, cem, aic, traceIn, dbPerIn, otherDb, reservePct }) {
  const g = GENERATIONS[gen];
  if (!g) return null;
  if (!(traceIn >= 0) || !(dbPerIn > 0)) return null;
  const fixed = (pkg || 0) + (cem || 0) + (aic || 0) + (otherDb || 0);
  const traceLoss = traceIn * dbPerIn;
  const estimated = fixed + traceLoss;
  const reserve = (g.total * reservePct) / 100;
  const usable = g.total - reserve;
  const margin = usable - estimated;
  let status = 'fits';
  if (margin < 0) status = estimated <= g.total ? 'tight' : 'over';
  const maxTraceIn = Math.max(0, (usable - fixed) / dbPerIn);
  return { total: g.total, fixed, traceLoss, estimated, reserve, usable, margin, status, maxTraceIn };
}
