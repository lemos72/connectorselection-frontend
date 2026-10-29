import Link from 'next/link';
import NewsletterSignup from '../../../components/NewsletterSignup';
import PcieBandwidthCalculator from '../../../components/PcieBandwidthCalculator';

// Using the bare domain (www.connectorselection.com does not resolve).
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PCIe Bandwidth Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/pcie-bandwidth-calculator/`,
  description:
    'Calculate PCIe link bandwidth by generation and lane count, or find how many lanes a target bandwidth needs.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'PCIe Bandwidth Calculator — Lanes and Generation Tool',
  description:
    'Calculate PCIe link bandwidth by generation (Gen 1 to Gen 7) and lane count, or find how many lanes a target bandwidth needs. Free tool for hardware engineers.',
};

export default function PcieBandwidthCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>PCIe Bandwidth Calculator</h1>
          <p>
            Choose a PCIe generation and lane count to see the link bandwidth,
            or enter a target to see how many lanes it needs.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <PcieBandwidthCalculator />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            Each PCIe lane runs at a raw rate in gigatransfers per second
            (GT/s). Bandwidth per lane is that rate, multiplied by the
            encoding efficiency of the generation, divided by 8 bits per byte:
          </p>
          <p>
            <strong>Bandwidth per direction = (GT/s × efficiency ÷ 8) × lanes</strong>
          </p>
          <p>
            Gen 1 and Gen 2 use 8b/10b encoding (80% efficient). Gen 3, Gen 4
            and Gen 5 use 128b/130b encoding (about 98.5% efficient). Gen 6
            and Gen 7 use PAM4 signaling with flit-based transfer, and this
            tool shows their headline rates (GT/s divided by 8) without
            subtracting flit or protocol overhead.
          </p>
          <p>
            These are theoretical link figures. Real throughput is lower
            because of packet headers and other protocol overhead. For how the
            connector side changes between generations, see{' '}
            <Link href="/articles/pcie-connector-evolution-gen5-gen6/">
              PCIe Connector Evolution: Gen 5 and Gen 6
            </Link>{' '}
            and the{' '}
            <Link href="/compare/pcie-gen-5-vs-gen-6-vs-gen-7-connectors/">
              Gen 5 vs Gen 6 vs Gen 7 connector comparison
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-pcie-bandwidth-calculator" />
        </div>
      </section>
    </>
  );
}
