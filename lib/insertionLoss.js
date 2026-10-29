// Channel insertion-loss budget: adds up the loss of each segment and compares it with a budget
// the user enters. All values are in dB and are treated as positive losses.

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) && value !== '' ? Math.abs(n) : 0;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function calculateLossBudget({
  budgetDb,
  traceLengthIn,
  traceLossPerIn,
  connectorCount,
  connectorLossDb,
  cableLengthM,
  cableLossPerM,
  otherLossDb,
}) {
  const budget = Number(budgetDb);
  if (!Number.isFinite(budget) || budget <= 0) return null;

  const trace = num(traceLengthIn) * num(traceLossPerIn);
  const connectors = num(connectorCount) * num(connectorLossDb);
  const cable = num(cableLengthM) * num(cableLossPerM);
  const other = num(otherLossDb);
  const total = trace + connectors + cable + other;
  if (total === 0) return null;

  const margin = budget - total;
  let statusLevel = 'good';
  if (margin < 0) statusLevel = 'poor';
  else if (margin < budget * 0.1) statusLevel = 'caution';

  return {
    total: round2(total),
    margin: round2(margin),
    trace: round2(trace),
    connectors: round2(connectors),
    cable: round2(cable),
    other: round2(other),
    statusLevel,
  };
}
