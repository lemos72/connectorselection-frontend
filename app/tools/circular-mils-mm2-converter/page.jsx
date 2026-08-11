import CmilConverter from '../../../components/CmilConverter';

const SITE_URL = 'https://www.connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Circular Mils to mm² Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/circular-mils-mm2-converter/`,
  description: 'Convert wire cross-sectional area between circular mils and square millimeters.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const metadata = {
  title: 'Circular Mils to mm² Converter',
  description:
    'Convert between circular mils (CM) and square millimeters (mm²) for wire cross-sectional area calculations.',
};

export default function CmilConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Circular Mils to mm² Converter</h1>
          <p>Convert wire cross-sectional area between circular mils and square millimeters.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <CmilConverter />
        </div>
      </section>
    </>
  );
}