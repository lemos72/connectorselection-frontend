// PCIe bandwidth data. Gen 1-5 values use the line-encoding efficiency of each generation.
// Gen 6 and Gen 7 use PAM4 with flit-based transfer; the figures below are the headline rates
// (GT/s divided by 8) and do not subtract flit, CRC or protocol overhead.

export const PCIE_GENERATIONS = [
  { value: '1', label: 'Gen 1', gtPerSec: 2.5, efficiency: 8 / 10, encoding: '8b/10b NRZ' },
  { value: '2', label: 'Gen 2', gtPerSec: 5, efficiency: 8 / 10, encoding: '8b/10b NRZ' },
  { value: '3', label: 'Gen 3', gtPerSec: 8, efficiency: 128 / 130, encoding: '128b/130b NRZ' },
  { value: '4', label: 'Gen 4', gtPerSec: 16, efficiency: 128 / 130, encoding: '128b/130b NRZ' },
  { value: '5', label: 'Gen 5', gtPerSec: 32, efficiency: 128 / 130, encoding: '128b/130b NRZ' },
  { value: '6', label: 'Gen 6', gtPerSec: 64, efficiency: 1, encoding: 'PAM4, flit mode (headline rate)' },
  { value: '7', label: 'Gen 7', gtPerSec: 128, efficiency: 1, encoding: 'PAM4, flit mode (headline rate)' },
];

export const LANE_OPTIONS = [1, 2, 4, 8, 16];

function fmt(n) {
  return n >= 10 ? Math.round(n * 10) / 10 : Math.round(n * 100) / 100;
}

export function calculatePcieBandwidth({ generation, lanes, targetGBps }) {
  const gen = PCIE_GENERATIONS.find((g) => g.value === generation);
  if (!gen || !LANE_OPTIONS.includes(Number(lanes))) return null;
  const perLane = (gen.gtPerSec * gen.efficiency) / 8; // GB/s per lane, one direction
  const perDirection = perLane * Number(lanes);
  let lanesNeeded = null;
  if (Number.isFinite(targetGBps) && targetGBps > 0) {
    const fit = LANE_OPTIONS.find((n) => perLane * n >= targetGBps);
    lanesNeeded = fit ? `x${fit}` : 'More than x16';
  }
  return {
    perDirection: fmt(perDirection),
    bothDirections: fmt(perDirection * 2),
    rawRate: `${gen.gtPerSec} GT/s`,
    encoding: gen.encoding,
    lanesNeeded,
  };
}
