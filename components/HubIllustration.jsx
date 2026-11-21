// Line-art illustration for a topic hub, chosen by hub slug.
// Pure inline SVG: no image uploads. Unknown slugs get a generic connector drawing.
// Colours follow the site tokens (--blueprint, --copper, --grid, --line).

const INK = 'var(--blueprint, #1a3a5c)';
const COPPER = 'var(--copper, #b8541c)';
const SOFT = 'var(--line, #cfd6de)';

function Frame({ children, label }) {
  return (
    <svg
      viewBox="0 0 320 120"
      width="100%"
      height="100%"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke={INK}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* faint blueprint grid */}
      <g stroke={SOFT} strokeWidth="1" opacity="0.7">
        {[40, 80, 120, 160, 200, 240, 280].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="120" />
        ))}
        {[30, 60, 90].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="320" y2={y} />
        ))}
      </g>
      {children}
    </svg>
  );
}

// FFC/FPC: flat cable running into a ZIF connector
function Ffc() {
  return (
    <Frame label="Flat flex cable entering a ZIF connector">
      <rect x="150" y="38" width="120" height="44" rx="3" fill="#fff" />
      <rect x="150" y="38" width="120" height="12" rx="3" />
      <path d="M40 52 H150 M40 68 H150" strokeWidth="2.5" />
      <path d="M40 52 V68" />
      {[166, 180, 194, 208, 222, 236, 250].map((x) => (
        <line key={x} x1={x} y1="58" x2={x} y2="76" stroke={COPPER} />
      ))}
      <path d="M40 60 q-14 0 -22 14 t-10 28" stroke={COPPER} strokeDasharray="1 7" />
    </Frame>
  );
}

// PCIe / CEM: add-in card seating into a slot
function Pcie() {
  return (
    <Frame label="Add-in card seating into a PCIe slot">
      <rect x="40" y="26" width="150" height="50" rx="3" fill="#fff" />
      <rect x="60" y="38" width="40" height="26" rx="2" stroke={COPPER} />
      <path d="M118 36 H176 M118 46 H176 M118 56 H160" />
      <path d="M70 76 V92 M80 76 V92 M90 76 V92 M100 76 V92 M110 76 V92 M120 76 V92 M130 76 V92 M140 76 V92 M150 76 V92 M160 76 V92" stroke={COPPER} />
      <rect x="40" y="92" width="150" height="14" rx="2" fill="#fff" />
      <path d="M215 44 q20 -10 40 0 t40 0 M215 64 q20 -10 40 0 t40 0" stroke={SOFT} strokeWidth="2.5" />
    </Frame>
  );
}

// OCP: rack with blades and a power bus
function Ocp() {
  return (
    <Frame label="Open rack with servers and a power busbar">
      <rect x="110" y="12" width="100" height="98" rx="3" fill="#fff" />
      {[24, 46, 68, 90].map((y) => (
        <g key={y}>
          <rect x="120" y={y} width="62" height="16" rx="2" />
          <circle cx="170" cy={y + 8} r="2" fill={COPPER} stroke={COPPER} />
        </g>
      ))}
      <path d="M194 18 V104" stroke={COPPER} strokeWidth="4" />
      <path d="M194 30 H204 M194 52 H204 M194 74 H204 M194 96 H204" stroke={COPPER} />
    </Frame>
  );
}

// AI / GPU: accelerator package with high-speed lanes
function Ai() {
  return (
    <Frame label="GPU accelerator with high-speed interconnect lanes">
      <rect x="120" y="22" width="80" height="76" rx="4" fill="#fff" />
      <rect x="138" y="40" width="44" height="40" rx="2" stroke={COPPER} />
      <path d="M150 52 H170 M150 60 H170 M150 68 H170" stroke={COPPER} />
      {[34, 50, 66, 82].map((y) => (
        <g key={y}>
          <path d={`M120 ${y} H76 q-10 0 -10 -8`} />
          <path d={`M200 ${y} H244 q10 0 10 8`} />
        </g>
      ))}
    </Frame>
  );
}

// Fallback: a generic row of connector pins
function Generic() {
  return (
    <Frame label="Connector with contact pins">
      <rect x="100" y="40" width="120" height="40" rx="3" fill="#fff" />
      {[116, 134, 152, 170, 188, 206].map((x) => (
        <g key={x}>
          <line x1={x} y1="50" x2={x} y2="70" stroke={COPPER} />
          <line x1={x} y1="80" x2={x} y2="98" />
        </g>
      ))}
    </Frame>
  );
}

const BY_SLUG = {
  'fpc-ffc-connector-selection': Ffc,
  'pcie-cem-connectors': Pcie,
  'ocp-server-interconnects': Ocp,
  'ai-data-center-interconnects': Ai,
};

export default function HubIllustration({ slug }) {
  const Art = BY_SLUG[slug] || Generic;
  return <Art />;
}
