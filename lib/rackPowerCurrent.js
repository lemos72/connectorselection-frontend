// Rack power to current: I = P / V for a DC bus, and I^2 x R loss in the path.
// Planning estimates only.

export const BUS_VOLTAGES = [
  { id: '12', volts: 12, label: '12 V DC (ORv2 busbar)' },
  { id: '48', volts: 48, label: '48 V DC (ORv3 busbar)' },
  { id: '400', volts: 400, label: '400 V DC (HVDC)' },
  { id: '800', volts: 800, label: '800 V DC (HVDC)' },
];

export const COMPARE_POWERS_KW = [10, 30, 100, 200];

export function currentAmps(powerKw, volts) {
  if (!Number.isFinite(powerKw) || powerKw <= 0 || !Number.isFinite(volts) || volts <= 0) return null;
  return (powerKw * 1000) / volts;
}

// Loss in the conductor path. resistanceMohm is the total round-trip path
// resistance (busbar, connectors and cable) in milliohms.
export function pathLossWatts(amps, resistanceMohm) {
  if (!Number.isFinite(amps) || !Number.isFinite(resistanceMohm) || resistanceMohm < 0) return null;
  return amps * amps * (resistanceMohm / 1000);
}

export function calculateRackCurrent({ powerKw, volts, resistanceMohm, parallelPaths }) {
  const amps = currentAmps(powerKw, volts);
  if (amps === null) return null;
  const paths = Number.isFinite(parallelPaths) && parallelPaths >= 1 ? Math.floor(parallelPaths) : 1;
  const out = {
    amps: Math.round(amps * 10) / 10,
    paths,
    ampsPerPath: Math.round((amps / paths) * 10) / 10,
    hasLoss: false,
  };
  if (Number.isFinite(resistanceMohm) && resistanceMohm > 0) {
    const loss = pathLossWatts(amps, resistanceMohm);
    out.hasLoss = true;
    out.lossWatts = Math.round(loss * 10) / 10;
    out.lossPercent = Math.round((loss / (powerKw * 1000)) * 10000) / 100;
  }
  return out;
}

// Same power at a different voltage, same resistance: loss falls with V^2.
export function lossRatio(fromVolts, toVolts) {
  return (fromVolts * fromVolts) / (toVolts * toVolts);
}
