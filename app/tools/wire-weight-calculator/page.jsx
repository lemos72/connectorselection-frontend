import WireWeightCalculator from '../../../components/WireWeightCalculator';

// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Wire Weight Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/wire-weight-calculator/`,
  description: 'Estimate wire weight based on gauge, length, and conductor material.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const metadata = {
  title: 'Wire Weight Calculator — Estimate Cable Weight by Gauge & Length',
  description:
    'Estimate the weight of copper or aluminum wire based on AWG gauge and length. Useful for shipping, cost, and cable harness planning.',
};

export default function WireWeightCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Wire Weight Calculator</h1>
          <p>Estimate wire weight based on gauge, length, and conductor material.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <WireWeightCalculator />
        </div>
      </section>
    </>
  );
}
