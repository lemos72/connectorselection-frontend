// IP code decoder data (IEC 60529; the 9K water level follows ISO 20653 for road vehicles).

export const SOLID_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', 'X'];
export const LIQUID_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '9K', 'X'];

export const SOLID_TEXT = {
  '0': 'No protection',
  '1': 'Objects 50 mm and larger (back of hand)',
  '2': 'Objects 12.5 mm and larger (fingers)',
  '3': 'Objects 2.5 mm and larger (tools, thick wires)',
  '4': 'Objects 1 mm and larger (wires, small tools)',
  '5': 'Dust protected (limited ingress)',
  '6': 'Dust tight (no ingress)',
  X: 'Not rated',
};

export const LIQUID_TEXT = {
  '0': 'No protection',
  '1': 'Vertically falling drips',
  '2': 'Drips with enclosure tilted up to 15°',
  '3': 'Spraying up to 60° from vertical',
  '4': 'Splashing from any direction',
  '5': 'Water jets (6.3 mm nozzle)',
  '6': 'Powerful water jets (12.5 mm nozzle)',
  '7': 'Temporary immersion (up to 1 m for 30 min)',
  '8': 'Continuous immersion (conditions set by the manufacturer)',
  '9': 'High-pressure, high-temperature water jets',
  '9K': 'High-pressure, high-temperature water jets (ISO 20653, road vehicles)',
  X: 'Not rated',
};

export function decodeIpCode({ solid, liquid }) {
  if (!SOLID_TEXT[solid] || !LIQUID_TEXT[liquid]) return null;
  const code = liquid === '9K' ? (solid === 'X' ? 'IPX9K' : `IP${solid}K9K`) : `IP${solid}${liquid}`;
  let note = '';
  if (liquid === '7' || liquid === '8') {
    note = 'Immersion ratings do not imply jet protection (IPX5 or IPX6) unless the product is also rated for it.';
  } else if (liquid === '9') {
    note = 'A high-pressure jet rating does not imply immersion protection (IPX7 or IPX8) unless the product is also rated for it.';
  }
  return {
    code,
    solidText: SOLID_TEXT[solid],
    liquidText: LIQUID_TEXT[liquid],
    note,
  };
}
