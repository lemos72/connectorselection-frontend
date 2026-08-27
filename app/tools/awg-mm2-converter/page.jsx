import AwgConverter from '../../../components/AwgConverter';

// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AWG to mm² Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/awg-mm2-converter/`,
  description: 'Convert between American Wire Gauge (AWG) and cross-sectional area in mm².',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const metadata = {
  title: 'AWG to mm² Converter — Wire Gauge Conversion Tool',
  description:
    'Convert between American Wire Gauge (AWG) and cross-sectional area in mm². Free tool for engineers working across US and metric wire specifications.',
};

export default function AwgConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>AWG to mm² Converter</h1>
          <p>Convert between American Wire Gauge sizes and metric cross-sectional area.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <AwgConverter />
        </div>
      </section>
    </>
  );
}
