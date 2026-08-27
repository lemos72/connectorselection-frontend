import Link from 'next/link';
import SkinEffectCalculator from '../../../components/SkinEffectCalculator';

// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Wire Skin Effect Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/skin-effect-calculator/`,
  description:
    'Calculate skin depth for copper and aluminum conductors at any frequency. See how skin effect limits current penetration at RF and high-speed signal frequencies.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Wire Skin Effect Calculator — Skin Depth by Frequency & Material',
  description:
    'Calculate skin depth for copper and aluminum conductors at any frequency. See how skin effect limits current penetration at RF, high-speed signal, and switching frequencies.',
};

export default function SkinEffectCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Wire Skin Effect Calculator</h1>
          <p>
            At high frequencies, current stops flowing through the full cross-section
            of a conductor and concentrates near the surface. Enter a frequency and
            material to calculate skin depth.
          </p>
        </div>
      </section>
      <section className="cs-section">
        <div className="cs-container">
          <SkinEffectCalculator />
        </div>
      </section>
      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>What Is Skin Effect?</h2>
          <p>
            Skin effect is the tendency of alternating current to flow near the outer
            surface of a conductor rather than through its full cross-section. As
            frequency increases, current is increasingly confined to a thin outer
            layer — the &quot;skin depth&quot; (δ). The center of the conductor
            carries little to no current at high enough frequencies, making the
            extra copper electrically useless.
          </p>

          <h2>The Formula</h2>
          <p>Skin depth is calculated using:</p>
          <p>
            <strong>δ = √( ρ / (π × f × μ) )</strong>
          </p>
          <p>
            where δ is skin depth in meters, ρ is the electrical resistivity of the
            conductor (Ω·m), f is frequency in Hz, and μ is magnetic permeability
            (H/m) — for copper and aluminum this equals μ₀ (4π × 10⁻⁷ H/m).
          </p>

          <h2>Practical Reference Values (Copper)</h2>
          <table className="cs-tool-table">
            <thead>
              <tr>
                <th>Frequency</th>
                <th>Skin Depth</th>
                <th>Typical Context</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>60 Hz</td>
                <td>8.5 mm</td>
                <td>Mains power — negligible effect on typical wire</td>
              </tr>
              <tr>
                <td>10 kHz</td>
                <td>0.66 mm</td>
                <td>Switching power supplies — starts to matter for thick wire</td>
              </tr>
              <tr>
                <td>1 MHz</td>
                <td>0.066 mm (66 μm)</td>
                <td>RF circuits, high-speed signals — significant</td>
              </tr>
              <tr>
                <td>100 MHz</td>
                <td>6.6 μm</td>
                <td>PCB traces, RF connectors — severe</td>
              </tr>
              <tr>
                <td>1 GHz</td>
                <td>2.1 μm</td>
                <td>Microwave — only surface plating carries current</td>
              </tr>
            </tbody>
          </table>

          <h2>Design Implications</h2>
          <p>
            When skin depth is much smaller than your conductor radius, effective AC
            resistance increases significantly compared to DC resistance. For a deeper
            look at how skin effect interacts with connector plating and high-frequency
            signal loss, see{' '}
            <Link href="/articles/skin-effect-ac-loss-high-frequency-cables/">
              Skin Effect &amp; AC Loss: Why High-Frequency Signals Hug the Surface
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
