import SkinEffectCalculator from '@/components/SkinEffectCalculator';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://connectorselection.com';

export const metadata = {
  title: 'Wire Skin Effect Calculator — Skin Depth by Frequency & Material',
  description:
    'Calculate skin depth for copper and aluminum conductors at any frequency. See how skin effect limits current penetration at RF, high-speed signal, and switching frequencies.',
  alternates: {
    canonical: `${SITE_URL}/tools/skin-effect-calculator/`,
  },
};

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Wire Skin Effect Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/skin-effect-calculator/`,
  description:
    'Calculate skin depth for copper and aluminum conductors at any frequency. Determine how skin effect impacts conductor efficiency at RF and high-speed signal frequencies.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools/` },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Skin Effect Calculator',
      item: `${SITE_URL}/tools/skin-effect-calculator/`,
    },
  ],
};

export default function SkinEffectCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="cs-container cs-tool-page">
        <nav className="cs-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/tools/">Tools</a></li>
            <li aria-current="page">Skin Effect Calculator</li>
          </ol>
        </nav>

        <h1 className="cs-tool-page__title">Wire Skin Effect Calculator</h1>
        <p className="cs-tool-page__intro">
          At high frequencies, current stops flowing through the full cross-section of a
          conductor and concentrates near the surface. This tool calculates skin depth —
          the effective current-carrying thickness — for copper and aluminum at any frequency.
        </p>

        <SkinEffectCalculator />

        <section className="cs-tool-explainer">
          <h2>What Is Skin Effect?</h2>
          <p>
            Skin effect is the tendency of alternating current to flow near the outer surface
            of a conductor rather than through its full cross-section. As frequency increases,
            current is increasingly confined to a thin outer layer — the "skin depth" (δ).
            The center of the conductor carries little to no current at high enough frequencies,
            making it electrically useless.
          </p>

          <h2>The Formula</h2>
          <p>Skin depth is calculated using:</p>
          <pre className="cs-tool-formula">
            δ = √( ρ / (π × f × μ) )
          </pre>
          <ul>
            <li><strong>δ</strong> — skin depth (meters)</li>
            <li><strong>ρ</strong> — electrical resistivity of the conductor (Ω·m)</li>
            <li><strong>f</strong> — frequency (Hz)</li>
            <li><strong>μ</strong> — magnetic permeability (H/m) — for copper and aluminum, this equals μ₀ (4π × 10⁻⁷ H/m)</li>
          </ul>

          <h2>Practical Reference Values (Copper)</h2>
          <table className="cs-tool-table">
            <thead>
              <tr>
                <th>Frequency</th>
                <th>Skin Depth (Copper)</th>
                <th>Typical Context</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>60 Hz</td><td>8.5 mm</td><td>Mains power — negligible effect on typical wire</td></tr>
              <tr><td>10 kHz</td><td>0.66 mm</td><td>Switching power supplies — starts to matter for thick wire</td></tr>
              <tr><td>1 MHz</td><td>0.066 mm (66 μm)</td><td>RF circuits, high-speed signals — significant</td></tr>
              <tr><td>100 MHz</td><td>6.6 μm</td><td>PCB traces, RF connectors — severe</td></tr>
              <tr><td>1 GHz</td><td>2.1 μm</td><td>Microwave — only surface plating carries current</td></tr>
            </tbody>
          </table>

          <h2>Design Implications</h2>
          <p>
            When skin depth is much smaller than your conductor radius, the effective AC
            resistance increases significantly compared to DC resistance. Key design
            considerations:
          </p>
          <ul>
            <li>
              <strong>Solid wire at RF:</strong> A 2mm solid copper rod at 1 MHz behaves
              like a hollow tube — only the outer 66μm carries current. Consider hollow
              conductors or Litz wire for high-frequency power applications.
            </li>
            <li>
              <strong>Connector contact plating:</strong> Gold plating thickness (typically
              0.1–1.27μm) is sufficient to matter at GHz frequencies — the plating layer
              itself becomes the primary current path.
            </li>
            <li>
              <strong>High-speed PCB traces:</strong> Skin effect increases insertion loss
              at higher data rates. This is a key factor in connector and trace impedance
              modeling above ~1 Gbps.
            </li>
            <li>
              <strong>Transformer windings:</strong> Skin effect causes unexpected heating
              in transformer and inductor windings at switching frequencies. Litz wire
              (multiple thin, individually insulated strands) is the standard solution.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
