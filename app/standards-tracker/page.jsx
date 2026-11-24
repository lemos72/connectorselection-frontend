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

const th = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '2px solid var(--line, #d9dee4)',
  fontSize: 13,
  color: 'var(--muted, #5b6b7b)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};
const td = {
  padding: '12px',
  borderBottom: '1px solid var(--line, #d9dee4)',
  verticalAlign: 'top',
  fontSize: 15,
  lineHeight: 1.45,
};

function Row({ row, fallbackSource }) {
  const source = row.source || fallbackSource;
  return (
    <tr>
      <td style={{ ...td, fontWeight: 600, minWidth: 160 }}>{row.name}</td>
      <td style={{ ...td, minWidth: 150 }}>{row.status}</td>
      <td style={{ ...td, minWidth: 120 }}>{row.date}</td>
      <td style={{ ...td, minWidth: 260 }}>
        {row.note}
        {row.internal && (
          <>
            {' '}
            <Link href={row.internal.href} prefetch={false}>{row.internal.label} →</Link>
          </>
        )}
      </td>
      <td style={{ ...td, minWidth: 130 }}>
        {source ? (
          <a href={source.href} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>
        ) : null}
      </td>
    </tr>
  );
}

export default function StandardsTrackerPage() {
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
        </div>
      </section>

      {SECTIONS.map((s) => (
        <section className="cs-section" key={s.title}>
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>{s.title}</h2>
            </div>
            <p style={{ marginTop: 0 }}>{s.intro}</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
                <thead>
                  <tr>
                    <th style={th}>Standard</th>
                    <th style={th}>Latest status</th>
                    <th style={th}>Date</th>
                    <th style={th}>Notes</th>
                    <th style={th}>Official source</th>
                  </tr>
                </thead>
                <tbody>
                  {s.rows.map((r) => (
                    <Row key={r.name} row={r} fallbackSource={s.source} />
                  ))}
                </tbody>
              </table>
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
