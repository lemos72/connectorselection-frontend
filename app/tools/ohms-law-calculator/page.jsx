import OhmsLawCalculator from '../../../components/OhmsLawCalculator';

// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: "Ohm's Law Calculator",
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/ohms-law-calculator/`,
  description: "Calculate voltage, current, or resistance using Ohm's Law.",
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const metadata = {
  title: "Ohm's Law Calculator — Solve for Voltage, Current, or Resistance",
  description:
    "Calculate voltage, current, or resistance using Ohm's Law (V = I × R). Enter any two values to solve for the third.",
};

export default function OhmsLawCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Ohm&apos;s Law Calculator</h1>
          <p>Enter any two values to solve for the third.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <OhmsLawCalculator />
        </div>
      </section>
    </>
  );
}
