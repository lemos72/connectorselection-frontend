// Rule-based connector failure diagnostic. Each cause gets a score from the
// symptom, the connector family and the conditions the user ticks. The top
// causes are ranked and shown with what to check first. This is an
// engineering checklist, not a root-cause analysis.

export const SYMPTOMS = [
  { id: 'intermittent', label: 'Works, then drops out or flickers' },
  { id: 'dead', label: 'No connection at all' },
  { id: 'heat', label: 'Gets hot, discolored or melted' },
  { id: 'errors', label: 'Data errors or link drops at speed' },
  { id: 'mating', label: 'Hard to mate, or will not stay mated' },
  { id: 'corrosion', label: 'Visible corrosion, residue or discoloration' },
];

export const FAMILIES = [
  { id: 'board', label: 'Board-to-board or wire-to-board' },
  { id: 'ffc', label: 'FFC / FPC flat flex' },
  { id: 'io', label: 'USB, I/O or high-speed card connector' },
];

export const CONDITIONS = [
  { id: 'vibration', label: 'Vibration or shock' },
  { id: 'thermal', label: 'Large temperature swings' },
  { id: 'humid', label: 'Humidity, condensation or corrosive air' },
  { id: 'cycles', label: 'Many mating cycles' },
  { id: 'mixed', label: 'Tin mated with gold plating' },
  { id: 'current', label: 'Current close to the rating' },
  { id: 'flexed', label: 'Cable is flexed, pulled or folded' },
  { id: 'motion', label: 'Fails only when moved or pressed' },
  { id: 'rework', label: 'Hand soldered or reworked' },
  { id: 'speed', label: 'Runs at multi-gigabit speeds' },
];

// Weights: how strongly each input points at a cause.
const W = {
  symptom: {
    intermittent: { fretting: 3, seated: 3, solder: 3, wear: 2, contam: 2, strain: 2, flex: 2 },
    dead: { seated: 3, solder: 3, flex: 3, wear: 1, strain: 2, contam: 1 },
    heat: { current: 5, wear: 2, contam: 2, fretting: 1, seated: 1 },
    errors: { si: 4, seated: 2, wear: 1, contam: 1, fretting: 1 },
    mating: { seated: 4, wear: 2, contam: 1, flex: 1 },
    corrosion: { contam: 4, fretting: 3, moisture: 4, mixedplating: 2 },
  },
  family: {
    board: { fretting: 1, solder: 1, seated: 1 },
    ffc: { flex: 3, seated: 2, strain: 1 },
    io: { wear: 1, si: 1, strain: 1 },
  },
  condition: {
    vibration: { fretting: 3, solder: 2, seated: 2, strain: 1 },
    thermal: { solder: 3, fretting: 2, mixedplating: 1 },
    humid: { moisture: 4, contam: 3, mixedplating: 1 },
    cycles: { wear: 4, fretting: 1 },
    mixed: { mixedplating: 4, fretting: 2 },
    current: { current: 4, contam: 1 },
    flexed: { flex: 3, strain: 3 },
    motion: { strain: 3, solder: 2, flex: 2, seated: 2 },
    rework: { solder: 3, contam: 2 },
    speed: { si: 4, seated: 1 },
  },
};

export const CAUSES = {
  fretting: {
    name: 'Fretting corrosion',
    why: 'Tiny repeated movement wears through the thin plating and the exposed metal oxidizes. Resistance rises in small jumps, so the circuit flickers.',
    check: 'Look for dark debris on the contact surface. Measure contact resistance while gently moving the connector.',
    fix: 'Gold plating on both mates, a design with more contact force, or a locking or retention feature that stops micro-motion.',
  },
  seated: {
    name: 'Not fully mated or misaligned',
    why: 'A connector that is only part way in, tilted, or missing its latch can touch on some contacts and not others.',
    check: 'Reseat it and listen or feel for the latch. Check for bent contacts, debris in the cavity and tolerance stack-up between boards.',
    fix: 'Add guide features or a positive lock, widen the lead-in, or loosen board-to-board alignment tolerances.',
  },
  solder: {
    name: 'Solder joint or crimp failure',
    why: 'Cracked solder joints from thermal cycling or vibration, poor crimps, or lifted pads act like a connector that is failing even when the contacts are fine.',
    check: 'Press and wiggle the part while monitoring continuity. Inspect joints under magnification and pull-test crimps.',
    fix: 'Reflow or rework the joints, add through-hole or board-lock anchors, or switch to a crimp with a verified pull strength.',
  },
  wear: {
    name: 'Contact wear from mating cycles',
    why: 'Every mating cycle wears the plating. Past the rated cycle count, base metal shows and resistance climbs.',
    check: 'Compare the cycles so far with the datasheet rating. Look for shiny or bare spots on the contacts.',
    fix: 'Choose a higher-cycle connector or heavier gold, or move the repeated mating to a replaceable adapter.',
  },
  contam: {
    name: 'Contamination or oxidation',
    why: 'Flux residue, dust, oils, sulfur or oxide films raise contact resistance, especially on low-force contacts.',
    check: 'Inspect for residue or tarnish. Look at what was cleaned or sprayed near the connector.',
    fix: 'Clean the contacts, change the cleaning process, or use gold plating or a sealed connector.',
  },
  mixedplating: {
    name: 'Mixed plating (tin against gold)',
    why: 'Tin and gold in one contact pair wear differently and can corrode faster than a matched pair.',
    check: 'Check both datasheets for the plating on each half, and look for black or gray tin oxide.',
    fix: 'Use the same plating on both mates, ideally gold for low-level signals.',
  },
  current: {
    name: 'Overcurrent or poor derating',
    why: 'Contact resistance turns current into heat. Bundled contacts, high ambient temperature and a full current load can push the temperature past the plastic and plating limits.',
    check: 'Measure temperature rise at full load and compare it with the derating curve for the number of loaded contacts.',
    fix: 'Spread current over more contacts, move to a higher-rated series, or reduce the load.',
    tool: { href: '/tools/connector-derating-calculator/', label: 'Connector Derating Calculator' },
  },
  flex: {
    name: 'Flex cable fatigue or ZIF latch issue',
    why: 'Flat flex cables crack at tight bends or at the connector edge, and a ZIF latch that is not fully closed or a cable of the wrong thickness gives poor contact.',
    check: 'Check the bend radius, the latch position, the cable thickness against the connector spec, and the stiffener at the cable end.',
    fix: 'Increase the bend radius, add strain relief, and use a cable and connector matched in pitch, thickness and contact side.',
    tool: { href: '/tools/ffc-fpc-pitch-calculator/', label: 'FFC/FPC Pitch & Positions Calculator' },
  },
  strain: {
    name: 'Mechanical stress or poor strain relief',
    why: 'Cable pull, board flex or a mating force carried by the solder joints can crack joints or shift contacts over time.',
    check: 'Look at where the load goes. Does the cable pull on the connector, and does the board bend near it?',
    fix: 'Add strain relief, support the board near the connector, or use a connector with board locks.',
  },
  si: {
    name: 'Signal integrity or channel loss',
    why: 'At multi-gigabit speeds a good connection can still fail on loss, reflections or crosstalk, so the link drops while the contacts test fine.',
    check: 'Check the total channel loss against the budget and the connector and via performance at the data rate.',
    fix: 'Shorten or improve the board trace, pick a connector rated for the data rate, or add a retimer.',
    tool: { href: '/tools/insertion-loss-budget-calculator/', label: 'Insertion Loss Budget Calculator' },
  },
  moisture: {
    name: 'Moisture or ingress',
    why: 'Water, condensation or salt can short contacts or corrode them, and a connector without the right sealing leaks.',
    check: 'Look for water marks, white or green deposits, and check the connector sealing against the environment.',
    fix: 'Use a sealed connector with the right IP rating and a proper gasket and mating seal.',
    tool: { href: '/tools/ip-code-decoder/', label: 'IP Code Decoder' },
  },
};

// Returns ranked causes: [{ id, ...cause, score, level }]
export function diagnose({ symptom, family, conditions }) {
  if (!symptom || !family) return null;
  const scores = {};
  const add = (map) => {
    if (!map) return;
    Object.entries(map).forEach(([id, w]) => {
      scores[id] = (scores[id] || 0) + w;
    });
  };
  add(W.symptom[symptom]);
  add(W.family[family]);
  (conditions || []).forEach((c) => add(W.condition[c]));

  const ranked = Object.entries(scores)
    .map(([id, score]) => ({ id, score, ...CAUSES[id] }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 4);
  if (!ranked.length) return null;

  const top = ranked[0].score;
  return ranked.map((c, i) => ({
    ...c,
    level: i === 0 ? 'Most likely' : c.score >= top * 0.6 ? 'Likely' : 'Possible',
  }));
}
