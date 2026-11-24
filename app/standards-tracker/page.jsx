import Link from 'next/link';
import NewsletterSignup from '../../components/NewsletterSignup';

const SITE_URL = 'https://connectorselection.com';
const CHECKED = 'November 2026';

export const metadata = {
  title: 'Connector Standards Tracker: PCIe, OCP, SFF, USFP',
  description:
    'Current version and status of PCIe 7.0 and 8.0, OCP NIC 3.0, DC-MHS, Open Rack V3, SFF-TA-1002, EDSFF and USFP, each with a link to the official source.',
  alternates: {
    canonical: `${SITE_URL}/standards-tracker/`,
  },
};

// Each row: name, status (latest version we found listed by the standards body),
// date, note (plain facts only), source (official page), optional internal link.
const SECTIONS = [
  {
    id: 'pcie',
    title: 'PCI Express',
    intro: 'The PCI-SIG roadmap that sets the signaling speed for slots, cables and card-edge connectors.',
    rows: [
      {
        name: 'PCIe 7.0',
        status: 'Released to members (v1.0)',
        date: 'Jun 11, 2025',
        note: '128 GT/s per lane; up to 512 GB/s bi-directionally on a x16 link.',
        source: { label: 'PCI-SIG release', href: 'https://www.businesswire.com/news/home/20250611299049/en' },
        internal: { label: 'PCIe Gen7 connector signal integrity', href: '/articles/pcie-gen7-connector-signal-integrity-explained/' },
      },
      {
        name: 'PCIe 8.0',
        status: 'In development; 0.5 draft available to members',
        date: 'Announced Aug 5, 2025; release planned by 2028',
        note: '256 GT/s per lane; up to 1 TB/s bi-directionally on x16. PCI-SIG is reviewing new connector technology.',
        source: { label: 'PCI-SIG announcement', href: 'https://www.businesswire.com/news/home/20250805675479/en/PCI-SIG-Announces-PCI-Express-8.0-Specification-to-Reach-256.0-GTs' },
        internal: { label: 'PCIe & CEM slot connectors hub', href: '/hubs/pcie-cem-connectors/' },
      },
    ],
  },
  {
    id: 'sff',
    title: 'SNIA SFF and EDSFF',
    intro: 'Connector and storage form factor specifications published by the SFF technical work group.',
    rows: [
      {
        name: 'SFF-TA-1002',
        status: 'Published 1.6a; draft 1.6.2 in progress',
        date: 'May 16, 2025',
        note: 'Multi-lane high-speed connector. EDSFF devices rely on it for connector mechanicals.',
        source: { label: 'SNIA SFF specifications', href: 'https://www.snia.org/technology-communities/sff/specifications' },
        internal: { label: 'SFF-TA-1002 Type 1 vs Type 2', href: '/articles/sff-ta-1002-card-edge-connector-type-1-vs-type-2-sizes/' },
      },
      {
        name: 'SFF-TA-1008 (E3)',
        status: 'Published 3.0a',
        date: 'Jul 10, 2026',
        note: 'E3 form factors for enterprise and data center devices.',
        source: { label: 'SNIA SFF specifications', href: 'https://www.snia.org/technology-communities/sff/specifications' },
        internal: { label: 'EDSFF E1.S and E3.S explained', href: '/articles/edsff-connectors-explained-e1s-e3s-ocp-server-storage/' },
      },
      {
        name: 'SFF-TA-1006 (E1.S)',
        status: 'Rev 1.6 (SNIA member document)',
        date: 'Sep 2, 2025',
        note: '1U short device form factor. Check the SNIA page for the current published revision.',
        source: { label: 'SNIA SFF specifications', href: 'https://www.snia.org/technology-communities/sff/specifications' },
      },
      {
        name: 'SFF-TA-1009',
        status: 'Published 4.1a',
        date: 'May 4, 2025',
        note: 'EDSFF pin and signal specification.',
        source: { label: 'SNIA SFF specifications', href: 'https://www.snia.org/technology-communities/sff/specifications' },
      },
      {
        name: 'SFF-TA-1016',
        status: 'Published 1.3',
        date: 'Nov 15, 2024',
        note: 'Internal unshielded high-speed connector system.',
        source: { label: 'SNIA SFF specifications', href: 'https://www.snia.org/technology-communities/sff/specifications' },
      },
    ],
  },
  {
    id: 'ocp-nic',
    title: 'OCP: network cards and accelerators',
    intro: 'Open Compute Project specifications for NICs and accelerator modules.',
    rows: [
      {
        name: 'OCP NIC 3.0',
        status: '1.6.0 released; 1.6.1 in draft',
        date: '1.6.0: Mar 31, 2025; 1.6.1 draft: Aug 5, 2026',
        note: 'Open Compute network interface card specification.',
        source: { label: 'OCP NIC project', href: 'https://www.opencompute.org/projects/server/mezz-nic/' },
        internal: { label: 'OCP NIC 3.0 connectors', href: '/articles/ocp-nic-3-0-connectors-4c-plus-card-edge-selection/' },
      },
      {
        name: 'OAI-OAM (OCP Accelerator Module)',
        status: 'Base specification r2.0 v1.0 released',
        date: '2023',
        note: 'No newer revision is listed on the project page, and a 2024 message in the group notes reduced activity.',
        source: { label: 'OCP OAI project', href: 'https://www.opencompute.org/wiki/Server/OAI' },
        internal: { label: 'OAM connectors explained', href: '/articles/ocp-oam-connectors-accelerator-module-interconnect-design/' },
      },
    ],
  },
  {
    id: 'dc-mhs',
    title: 'OCP DC-MHS (modular server hardware)',
    intro: 'Latest version of each base specification as listed by OCP. RC means release candidate.',
    rows: [
      { name: 'M-XIO (extensible I/O)', status: '1.04 RC1', date: 'Feb 28, 2024', note: 'Cabled PCIe and CXL connectivity to peripherals.', internal: { label: 'DC-MHS and M-XIO explained', href: '/articles/dc-mhs-m-xio-connectors-cabled-pcie-ocp-servers/' } },
      { name: 'M-PIC (platform infrastructure connectivity)', status: '1.11', date: 'Mar 25, 2025', note: 'Platform infrastructure connectivity.' },
      { name: 'M-FLW (full width)', status: '1.2 RC3', date: 'Oct 10, 2024', note: 'Full-width host processor module form factor.' },
      { name: 'M-DNO (density optimized)', status: '1.1 RC2', date: 'Mar 21, 2024', note: 'Partial-width host processor modules.' },
      { name: 'M-SDNO', status: '1.1 RC2', date: 'May 30, 2025', note: 'M-DNO style host processor modules for 19-inch and 21-inch racks.' },
      { name: 'M-PESTI (peripheral sideband tunneling)', status: '1.2 RC2', date: 'Mar 14, 2024', note: 'Sideband signal tunneling for peripherals.' },
      { name: 'M-CRPS (common redundant power supply)', status: '1.06', date: 'Apr 24, 2026', note: 'Common redundant power supply.' },
    ],
    source: { label: 'OCP DC-MHS specifications', href: 'https://www.opencompute.org/projects/server/mhs/dc-mhs-specs-and-designs/' },
  },
  {
    id: 'orv3',
    title: 'OCP Open Rack V3 (ORv3)',
    intro: 'Rack and power specifications. Dates are the revision dates shown on each OCP document.',
    rows: [
      {
        name: 'Open Rack V3 base specification',
        status: '1.1',
        date: 'Dec 2023',
        note: 'Rack frame base specification (OCP wiki listing).',
        source: { label: 'OCP Open Rack wiki', href: 'https://OpenCompute.org/wiki/Open_Rack/SpecsAndDesigns' },
        internal: { label: 'Choosing connectors for an ORv3 AI rack', href: '/articles/ocp-orv3-ai-rack-connector-selection-spotlight/' },
      },
      {
        name: 'ORv3 HPR V2 72 kW power shelf',
        status: 'Rev 1.0.0',
        date: 'Jun 12, 2026',
        note: 'High power rack power shelf.',
        source: { label: 'OCP document', href: 'https://www.opencompute.org/documents/open-rack-v3-hpr-v2-72kw-power-shelf-spec-v1-0-0-pdf/' },
      },
      {
        name: 'ORv3 HVDC-LVDC 100 kW power shelf',
        status: '1.0.0',
        date: 'Feb 20, 2026',
        note: 'HVDC-LVDC power shelf design specification.',
        source: { label: 'OCP document', href: 'https://www.opencompute.org/documents/orv3-hvdc-lvdc-100kw-power-shelf-spec-1-0-0-pdf/' },
      },
      {
        name: 'ORv3 HPR 2000A DC power output connector',
        status: 'Rev 1.0.0',
        date: 'Jun 23, 2026',
        note: 'DC output connector for the high power rack.',
        source: { label: 'OCP document', href: 'https://www.opencompute.org/documents/ocp-orv3-hpr-2000a-dc-power-output-connector-rev1-0-0-final-pdf/' },
      },
      {
        name: 'ORv3 high power (60A) AC whip cable',
        status: 'Rev 1.1.0',
        date: 'Nov 11, 2026',
        note: 'AC whip that feeds the HPR V2 72 kW power shelf.',
        source: { label: 'OCP document', href: 'https://www.opencompute.org/wp-content/uploads/2026/11/OCP-ORv3-High-Power-60A-AC-WHIP-Power-Cable-SPEC-Rev1.1.0.pdf' },
      },
    ],
  },
  {
    id: 'optics',
    title: 'Pluggable optics',
    intro: 'Announced form factors that are not yet published specifications.',
    rows: [
      {
        name: 'USFP (ultra-dense small form factor pluggable)',
        status: 'Announced; open specification planned',
        date: 'Oct 12, 2026',
        note: '400 Gb/s per electrical lane. First planned modules carry 16 lanes in an OSFP-sized footprint. The announcement plans a community-led multi-source project for an open specification.',
        source: { label: 'NVIDIA and Cisco announcement', href: 'https://nvidianews.nvidia.com/news/nvidia-and-cisco-introduce-new-pluggable-optics-form-factor-to-scale-ai-factories' },
      },
    ],
  },
];

const RELATED_HUBS = [
  { href: '/hubs/pcie-cem-connectors/', name: 'PCIe & CEM Slot Connectors' },
  { href: '/hubs/ai-data-center-interconnects/', name: 'AI / GPU Data Center Interconnect' },
  { href: '/hubs/ocp-server-interconnects/', name: 'OCP Server Interconnects' },
];

const KINDS = {
  published: { label: 'Published', bg: '#e6f4ec', fg: '#1f6b43' },
  draft: { label: 'Draft / RC', bg: '#fdf1d8', fg: '#7a4f00' },
  announced: { label: 'Announced', bg: '#e3edf9', fg: '#1d4577' },
};

// Pill category from the status text we recorded for each row.
function statusKind(status) {
  if (/^announced/i.test(status)) return 'announced';
  if (/^in development/i.test(status)) return 'draft';
  if (/\bRC\d\b/.test(status)) return 'draft';
  return 'published';
}

// Newest movements, taken from the rows above (date shown as recorded).
const LATEST = [
  { name: 'ORv3 60A AC whip cable', what: 'Rev 1.1.0', date: 'Nov 11, 2026', id: 'orv3' },
  { name: 'USFP pluggable optics', what: 'Announced', date: 'Oct 12, 2026', id: 'optics' },
  { name: 'OCP NIC 3.0', what: '1.6.1 in draft', date: 'Aug 5, 2026', id: 'ocp-nic' },
  { name: 'SFF-TA-1008 (E3)', what: 'Published 3.0a', date: 'Jul 10, 2026', id: 'sff' },
];

const ICON_PROPS = {
  width: 30,
  height: 30,
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'var(--copper, #b8662b)',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function SectionIcon({ id }) {
  switch (id) {
    case 'pcie':
      return (
        <svg {...ICON_PROPS}>
          <rect x="3" y="10" width="26" height="8" rx="1.5" />
          <path d="M7 18v5M11 18v5M15 18v5M21 18v5M25 18v5" />
        </svg>
      );
    case 'sff':
      return (
        <svg {...ICON_PROPS}>
          <rect x="4" y="7" width="10" height="18" rx="1.5" />
          <rect x="18" y="7" width="10" height="18" rx="1.5" />
          <path d="M7 21h4M21 21h4" />
        </svg>
      );
    case 'ocp-nic':
      return (
        <svg {...ICON_PROPS}>
          <rect x="4" y="8" width="24" height="16" rx="1.5" />
          <path d="M9 24v3M13 24v3M17 24v3M7 12h6v5H7z" />
        </svg>
      );
    case 'dc-mhs':
      return (
        <svg {...ICON_PROPS}>
          <rect x="4" y="6" width="24" height="7" rx="1.5" />
          <rect x="4" y="19" width="24" height="7" rx="1.5" />
          <path d="M8 9.5h2M8 22.5h2M22 9.5h2M22 22.5h2" />
        </svg>
      );
    case 'orv3':
      return (
        <svg {...ICON_PROPS}>
          <rect x="7" y="3" width="18" height="26" rx="1.5" />
          <path d="M7 10h18M7 17h18M7 24h18M11 6.5h4M11 13.5h4M11 20.5h4" />
        </svg>
      );
    default:
      return (
        <svg {...ICON_PROPS}>
          <rect x="3" y="11" width="16" height="10" rx="1.5" />
          <path d="M19 14h5M19 18h5M24 12v8M27 14v4" />
        </svg>
      );
  }
}

const CARD = {
  display: 'flex',
  flexDirection: 'column',
  background: '#fff',
  border: '1px solid var(--line, #d9dee4)',
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(20, 40, 70, 0.08)',
  overflow: 'hidden',
};

function StatusPill({ kind }) {
  const k = KINDS[kind];
  return (
    <span
      style={{
        background: k.bg,
        color: k.fg,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        padding: '3px 9px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {k.label}
    </span>
  );
}

function StandardCard({ row, fallbackSource }) {
  const source = row.source || fallbackSource;
  const kind = statusKind(row.status);
  return (
    <div style={CARD}>
      <div style={{ height: 4, background: KINDS[kind].fg, opacity: 0.8 }} />
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 17, lineHeight: 1.3, color: 'var(--blueprint, #12355b)' }}>{row.name}</h3>
          <StatusPill kind={kind} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{row.status}</div>
        <div style={{ fontSize: 13, color: 'var(--muted, #5b6b7b)' }}>{row.date}</div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5 }}>
          {row.note}
          {row.internal && (
            <>
              {' '}
              <Link href={row.internal.href} prefetch={false}>{row.internal.label} →</Link>
            </>
          )}
        </p>
        {source && (
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 10,
              borderTop: '1px solid var(--line, #d9dee4)',
              fontSize: 14,
            }}
          >
            <a href={source.href} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StandardsTrackerPage() {
  const total = SECTIONS.reduce((n, s) => n + s.rows.length, 0);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Connector Standards Tracker', item: `${SITE_URL}/standards-tracker/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Reference</span>
          <h1>Connector Standards Tracker</h1>
          <p>
            The current version and status of the standards behind data center connectors, each
            with a link to the official source. Last checked {CHECKED}.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
            {[
              { n: total, l: 'standards tracked' },
              { n: SECTIONS.length, l: 'families' },
              { n: LATEST[0].date, l: 'newest revision' },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  background: '#fff',
                  border: '1px solid var(--line, #d9dee4)',
                  borderRadius: 8,
                  padding: '10px 18px',
                  minWidth: 130,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--blueprint, #12355b)' }}>{s.n}</div>
                <div style={{ fontSize: 13, color: 'var(--muted, #5b6b7b)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-section-head">
            <h2>Latest movement</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {LATEST.map((l) => (
              <a
                key={l.name}
                href={`#${l.id}`}
                style={{
                  ...CARD,
                  padding: '14px 16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  borderLeft: '4px solid var(--copper, #b8662b)',
                }}
              >
                <span style={{ fontSize: 13, color: 'var(--muted, #5b6b7b)' }}>{l.date}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--blueprint, #12355b)', margin: '4px 0' }}>{l.name}</span>
                <span style={{ fontSize: 14 }}>{l.what}</span>
              </a>
            ))}
          </div>

          <nav
            aria-label="Standards families"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24, alignItems: 'center' }}
          >
            <span style={{ fontSize: 13, color: 'var(--muted, #5b6b7b)', marginRight: 4 }}>Jump to:</span>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  border: '1px solid var(--line, #d9dee4)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  fontSize: 14,
                  textDecoration: 'none',
                  background: '#fff',
                }}
              >
                {s.title}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 18, fontSize: 13 }}>
            {Object.entries(KINDS).map(([key, k]) => (
              <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: k.fg, display: 'inline-block' }} />
                {k.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {SECTIONS.map((s, i) => (
        <section
          className="cs-section"
          key={s.id}
          id={s.id}
          style={{ scrollMarginTop: 80, background: i % 2 === 0 ? '#f4f6f9' : undefined }}
        >
          <div className="cs-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  background: '#fff',
                  border: '1px solid var(--line, #d9dee4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SectionIcon id={s.id} />
              </span>
              <div>
                <h2 style={{ margin: 0 }}>{s.title}</h2>
                <span style={{ fontSize: 13, color: 'var(--muted, #5b6b7b)' }}>
                  {s.rows.length} {s.rows.length === 1 ? 'standard' : 'standards'}
                </span>
              </div>
            </div>
            <p style={{ margin: '8px 0 20px' }}>{s.intro}</p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: 18,
              }}
            >
              {s.rows.map((r) => (
                <StandardCard key={r.name} row={r} fallbackSource={s.source} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="cs-section">
        <div className="cs-container">
          <p>
            <em>General guidance only. Check the official source for the current version before you design.</em>
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-section-head">
            <h2>Related Interconnect Topics</h2>
          </div>
          <div className="cs-cat-grid">
            {RELATED_HUBS.map((h) => (
              <Link key={h.href} href={h.href} className="cs-cat" prefetch={false}>
                <h3>{h.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="standards-tracker" />
        </div>
      </section>
    </>
  );
}
