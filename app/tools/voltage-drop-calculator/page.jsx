import Link from 'next/link';
import VoltageDropCalculator from '../../../components/VoltageDropCalculator';

const SITE_URL = 'https://www.connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Voltage Drop Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/voltage-drop-calculator/`,
  description:
    'Calculate voltage drop for a copper wire run based on gauge, length, and current.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Voltage Drop Calculator — Wire Gauge Sizing Tool',
  description:
    'Calculate voltage drop for a copper wire run based on gauge, length, and current. Free tool for engineers sizing DC wiring for automotive, EV, and industrial applications.',
};

export default function VoltageDropCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Voltage Drop Calculator</h1>
          <p>
            Enter your wire gauge, current, length, and system voltage to see
            how much voltage you&apos;ll lose along the run.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <VoltageDropCalculator />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            Voltage drop happens because every wire has some electrical
            resistance, and that resistance increases with wire length and
            decreases with wire thickness (gauge). This tool uses the
            standard formula:
          </p>
          <p>
            <strong>Voltage Drop = (2 × K × I × L) / CM</strong>
          </p>
          <p>
            where K is the resistivity constant for copper (12.9), I is
            current in amps, L is one-way length in feet, and CM is the
            wire&apos;s cross-sectional area in circular mils, based on
            standard AWG values from NEC Chapter 9, Table 8.
          </p>
          <p>
            This calculator covers DC, copper-conductor circuits. For a
            deeper look at how current and voltage ratings work, see{' '}
            <Link href="/articles/connector-current-voltage-ratings-explained/">
              Connector Current and Voltage Ratings Explained
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}