// Original inline-SVG illustrations for the FFC/FPC request-info page.
// Pure presentational components (no hooks, no client code), so they render
// on the server and add no JavaScript to the page. Colors are the site's
// design tokens written as hex (blueprint #12355b, copper #b3541e, etc.).
// Each picture is 320 x 210, has a light panel behind it, and keeps its text
// to one or two words — the explanation lives in the HTML caption below it.

const BLUE = '#12355b';
const COPPER = '#b3541e';
const LINE = '#b7c0cc';
const PAPER = '#eef2f7';
const PANEL = '#f5f7fa';
const STIFF = '#c9d3df';

function Panel() {
  return <rect x="0" y="0" width="320" height="210" rx="6" fill={PANEL} />;
}

/* ----------------------------------------------------------------------
   Pitch: same cable width at three pitches
   ---------------------------------------------------------------------- */
export function PitchDiagram() {
  const stripX = 84;
  const stripW = 220;
  const perMm = 36.67; // px per mm of pitch
  const rows = [
    { label: '0.3 mm', pitch: 0.3 * perMm, y: 22 },
    { label: '0.5 mm', pitch: 0.5 * perMm, y: 74 },
    { label: '1.0 mm', pitch: 1.0 * perMm, y: 126 },
  ];
  return (
    <svg
      className="cs-rfi-svg"
      viewBox="0 0 320 210"
      role="img"
      aria-label="Three cable ends of the same width with 0.3, 0.5 and 1.0 millimetre pitch. Smaller pitch means more, thinner conductors."
    >
      <Panel />
      {rows.map((r) => {
        const count = Math.floor(stripW / r.pitch + 0.001);
        const used = count * r.pitch;
        const start = stripX + (stripW - used) / 2;
        const cw = r.pitch * 0.5;
        const els = [];
        for (let i = 0; i < count; i += 1) {
          const cx = start + r.pitch * (i + 0.5);
          els.push(
            <rect
              key={i}
              x={cx - cw / 2}
              y={r.y + 6}
              width={cw}
              height={26}
              fill={COPPER}
            />
          );
        }
        return (
          <g key={r.label}>
            <text x="16" y={r.y + 25} fontSize="15" fontWeight="600" fill={BLUE}>
              {r.label}
            </text>
            <rect
              x={stripX}
              y={r.y}
              width={stripW}
              height={38}
              fill="#fff"
              stroke={LINE}
            />
            {els}
          </g>
        );
      })}
      {/* dimension on the 1.0 mm row: centre of conductor 1 to centre of conductor 2 */}
      <g stroke={BLUE} strokeWidth="1.5">
        <line x1="102.3" y1="172" x2="102.3" y2="184" />
        <line x1="139" y1="172" x2="139" y2="184" />
        <line x1="102.3" y1="178" x2="139" y2="178" />
      </g>
      <text x="120.7" y="203" fontSize="14" fill={BLUE} textAnchor="middle">
        pitch
      </text>
    </svg>
  );
}

/* ----------------------------------------------------------------------
   ZIF vs non-ZIF (side view of a board connector)
   ---------------------------------------------------------------------- */
function Connector({ ox, zif }) {
  return (
    <g>
      <text
        x={ox + 67}
        y="30"
        fontSize="15"
        fontWeight="600"
        fill={BLUE}
        textAnchor="middle"
      >
        {zif ? 'ZIF' : 'Non-ZIF'}
      </text>
      {/* board */}
      <rect x={ox} y="170" width="134" height="12" fill={PAPER} stroke={LINE} />
      {/* housing */}
      <rect x={ox + 44} y="112" width="90" height="58" fill="#fff" stroke={BLUE} strokeWidth="2" />
      {zif ? (
        /* raised lever */
        <line
          x1={ox + 124}
          y1="114"
          x2={ox + 134}
          y2="72"
          stroke={COPPER}
          strokeWidth="7"
          strokeLinecap="round"
        />
      ) : (
        /* spring contacts pressing on the cable */
        <g fill="none" stroke={COPPER} strokeWidth="3" strokeLinejoin="round">
          <polyline points={`${ox + 74},119 ${ox + 90},131 ${ox + 106},119`} />
          <polyline points={`${ox + 74},163 ${ox + 90},151 ${ox + 106},163`} />
        </g>
      )}
      {/* cable */}
      <rect x={ox} y="132" width="84" height="18" fill={STIFF} stroke={LINE} />
      <rect x={ox + 62} y="132" width="30" height="18" fill={COPPER} />
      {/* insertion arrow */}
      <line
        x1={ox + 6}
        y1="94"
        x2={ox + 38}
        y2="94"
        stroke={BLUE}
        strokeWidth={zif ? 2 : 4}
      />
      <polygon
        points={`${ox + 36},${zif ? 88 : 86} ${ox + 48},94 ${ox + 36},${zif ? 100 : 102}`}
        fill={BLUE}
      />
    </g>
  );
}

export function ZifDiagram() {
  return (
    <svg
      className="cs-rfi-svg"
      viewBox="0 0 320 210"
      role="img"
      aria-label="Side view of two connectors. ZIF has a lever that opens it so the cable slides in without force. Non-ZIF grips the cable directly with spring contacts."
    >
      <Panel />
      <Connector ox={14} zif />
      <Connector ox={172} zif={false} />
    </svg>
  );
}

/* ----------------------------------------------------------------------
   Cable ends (top view of one end)
   ---------------------------------------------------------------------- */
export function CableDiagram() {
  const lines = [];
  const pads = [];
  for (let i = 0; i < 7; i += 1) {
    lines.push(
      <line
        key={`l${i}`}
        x1="16"
        y1={88 + i * 8}
        x2="232"
        y2={88 + i * 8}
        stroke={COPPER}
        strokeWidth="2"
        opacity="0.85"
      />
    );
    pads.push(
      <rect
        key={`p${i}`}
        x="248"
        y={84 + i * 8}
        width="52"
        height="5"
        fill={COPPER}
      />
    );
  }
  return (
    <svg
      className="cs-rfi-svg"
      viewBox="0 0 320 210"
      role="img"
      aria-label="Top view of the end of an FFC cable showing the conductors, the stiffener at the insertion end and the exposed contacts."
    >
      <Panel />
      {/* cable body */}
      <rect x="16" y="78" width="216" height="64" fill="#fff" stroke={LINE} />
      {lines}
      {/* stiffener + contacts */}
      <rect x="232" y="70" width="72" height="80" fill={STIFF} stroke={LINE} />
      {pads}

      {/* labels: one or two words each */}
      <g stroke={BLUE} strokeWidth="1.5" fill="none">
        <line x1="110" y1="52" x2="110" y2="90" />
        <line x1="268" y1="52" x2="268" y2="70" />
        <line x1="268" y1="150" x2="268" y2="170" />
      </g>
      <text x="110" y="44" fontSize="14" fill={BLUE} textAnchor="middle">
        Conductors
      </text>
      <text x="268" y="44" fontSize="14" fill={BLUE} textAnchor="middle">
        Stiffener
      </text>
      <text x="268" y="188" fontSize="14" fill={BLUE} textAnchor="middle">
        Contacts
      </text>
    </svg>
  );
}

/* ----------------------------------------------------------------------
   Small line icons for the "how it works" steps
   ---------------------------------------------------------------------- */
export function StepIcon({ kind }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: 'false',
  };
  if (kind === 'match') {
    return (
      <svg {...common}>
        <circle cx="5.5" cy="12" r="2.6" />
        <circle cx="18.5" cy="6" r="2.6" />
        <circle cx="18.5" cy="18" r="2.6" />
        <path d="M8 11 16 7M8 13 16 17" />
      </svg>
    );
  }
  if (kind === 'quote') {
    return (
      <svg {...common}>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    );
  }
  if (kind === 'review') {
    return (
      <svg {...common}>
        <path d="M5 3h8l4 4v6" />
        <path d="M13 3v4h4" />
        <path d="M5 3v18h6" />
        <circle cx="15.5" cy="16.5" r="3.5" />
        <path d="m18 19 3 3" />
      </svg>
    );
  }
  // 'specs' (default)
  return (
    <svg {...common}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3h6v3H9z" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </svg>
  );
}
