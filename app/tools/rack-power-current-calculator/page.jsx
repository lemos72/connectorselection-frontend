import Link from 'next/link';
import NewsletterSignup from '../../../components/NewsletterSignup';
import RackPowerCurrentCalculator from '../../../components/RackPowerCurrentCalculator';
import { BUS_VOLTAGES, COMPARE_POWERS_KW, currentAmps } from '../../../lib/rackPowerCurrent';

const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Rack Power to Current Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/rack-power-current-calculator/`,
  description:
    'Convert rack power in kW to busbar current in amps at 12 V, 48 V, 400 V or 800 V DC, and estimate the I²R loss in the power path.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Rack Power to Current Calculator — kW to Amps at 12 V, 48 V, 400 V, 800 V',
  description:
    'Free rack power to current calculator. Enter rack kW and DC bus voltage (12 V, 48 V, 400 V, 800 V) to get the busbar current, current per parallel path and I²R loss.',
  alternates: {
    canonical: `${SITE_URL}/tools/rack-power-current-calculator/`,
  },
};

export default function RackPowerCurrentCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Rack Power to Current Calculator</h1>
          <p>
            Enter the rack power and the DC bus voltage to see how many amps the
            busbar and connectors must carry, and how much power is lost in the
            path.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <RackPowerCurrentCalculator />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            For a DC bus, current is power divided by voltage. The loss in the
            conductors, busbar and connectors is the current squared times the
            resistance of the path:
          </p>
          <p>
            <strong>Current (A) = Power (W) ÷ Voltage (V)</strong>
          </p>
          <p>
            <strong>Loss (W) = Current² × Resistance (Ω)</strong>
          </p>
          <p>
            Enter the round-trip resistance in milliohms, which covers the
            supply and return conductors plus every connector in the path. Split
            the load across parallel paths to see the current each path carries.
            Because loss rises with the square of the current, a higher bus
            voltage cuts loss sharply: at the same power and resistance, 800 V
            loses about 1/280 of what 48 V does.
          </p>

          <h2>Current by Rack Power and Bus Voltage</h2>
          <div style={{ overflowX: 'auto', maxWidth: '720px', marginBottom: '20px' }}>
            <table className="cs-tool-table">
              <thead>
                <tr>
                  <th>Rack power</th>
                  {BUS_VOLTAGES.map((v) => (
                    <th key={v.id}>{v.volts} V</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_POWERS_KW.map((kw) => (
                  <tr key={kw}>
                    <td>{kw} kW</td>
                    {BUS_VOLTAGES.map((v) => (
                      <td key={v.id}>{Math.round(currentAmps(kw, v.volts) * 10) / 10} A</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Frequently Asked Questions</h2>
          <p><strong>How many amps is a 33 kW rack at 48 V?</strong></p>
          <p>
            About 688 A (33,000 W ÷ 48 V). That is why 48 V racks need a
            heavy busbar and high-current power connectors rather than cables.
          </p>
          <p><strong>Why are racks moving to 400 V and 800 V DC?</strong></p>
          <p>
            Current falls in proportion to voltage and loss falls with its
            square, so conductors and connectors can be smaller and run cooler
            at the same rack power.
          </p>
          <p><strong>Does this work for AC?</strong></p>
          <p>
            No. It assumes a DC bus. For AC, current also depends on power
            factor and, for three-phase, on the square root of three.
          </p>
          <p><strong>What should I check next?</strong></p>
          <p>
            Check the heat in the path with the{' '}
            <Link href="/tools/power-dissipation-calculator/">Power Dissipation Calculator</Link>
            , the connector rating with the{' '}
            <Link href="/tools/connector-derating-calculator/">Connector Derating Calculator</Link>
            , and read{' '}
            <Link href="/articles/ocp-open-rack-busbar-power-connectors-orv2-orv3/">
              our guide to OCP Open Rack busbar power connectors (ORv2 and ORv3)
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-rack-power-current-calculator" />
        </div>
      </section>
    </>
  );
}
