import Link from 'next/link';
import NewsletterSignup from '../../../components/NewsletterSignup';
import CoolantFlowCalculator from '../../../components/CoolantFlowCalculator';
import {
  COOLANTS,
  COMPARE_LOADS_KW,
  COMPARE_DELTA_T,
  flowLpm,
} from '../../../lib/coolantFlow';

const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Liquid Cooling Flow Rate Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/liquid-cooling-flow-rate-calculator/`,
  description:
    'Estimate the coolant flow rate in litres per minute and gallons per minute needed to remove a given heat load at a chosen coolant temperature rise, for water or propylene glycol mixtures.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Liquid Cooling Flow Rate Calculator — kW to L/min and GPM',
  description:
    'Free liquid cooling flow rate calculator. Enter the heat load in kW, the coolant temperature rise and the coolant (water or propylene glycol) to get the flow in L/min and gpm.',
  alternates: {
    canonical: `${SITE_URL}/tools/liquid-cooling-flow-rate-calculator/`,
  },
};

const water = COOLANTS[0];

export default function LiquidCoolingFlowRatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Liquid Cooling Flow Rate Calculator</h1>
          <p>
            Enter the heat load, the coolant temperature rise and the coolant
            to see how many litres per minute the loop must carry.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <CoolantFlowCalculator />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            The coolant carries heat away as it warms up. The heat it absorbs
            equals the mass flow times its specific heat times the temperature
            rise, so the flow needed for a given heat load is:
          </p>
          <p>
            <strong>Flow (m³/s) = Heat load (W) ÷ (Density × Specific heat × Temperature rise)</strong>
          </p>
          <p>
            The result is converted to litres per minute and US gallons per
            minute. Glycol mixtures hold less heat per kilogram than water, so
            they need more flow for the same load and temperature rise. A
            smaller temperature rise also needs more flow, which raises pressure
            drop and puts more load on the quick-disconnect couplings and
            manifolds.
          </p>

          <h2>Fluids Used</h2>
          <div style={{ overflowX: 'auto', maxWidth: '720px', marginBottom: '20px' }}>
            <table className="cs-tool-table">
              <thead>
                <tr>
                  <th>Coolant</th>
                  <th>Density (kg/m³)</th>
                  <th>Specific heat (J/kg·K)</th>
                </tr>
              </thead>
              <tbody>
                {COOLANTS.map((c) => (
                  <tr key={c.id}>
                    <td>{c.label}</td>
                    <td>{c.density}</td>
                    <td>{c.cp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Typical values near 30 °C. Use your coolant datasheet for exact figures.</p>

          <h2>Water Flow by Heat Load and Temperature Rise (L/min)</h2>
          <div style={{ overflowX: 'auto', maxWidth: '720px', marginBottom: '20px' }}>
            <table className="cs-tool-table">
              <thead>
                <tr>
                  <th>Heat load</th>
                  {COMPARE_DELTA_T.map((d) => (
                    <th key={d}>ΔT {d} °C</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_LOADS_KW.map((kw) => (
                  <tr key={kw}>
                    <td>{kw} kW</td>
                    {COMPARE_DELTA_T.map((d) => (
                      <td key={d}>{Math.round(flowLpm(kw, d, water) * 10) / 10}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Frequently Asked Questions</h2>
          <p><strong>How much water flow does 1 kW of heat need?</strong></p>
          <p>
            About 1.4 L/min at a 10 °C temperature rise, or about 2.9 L/min at
            5 °C.
          </p>
          <p><strong>Why does glycol need more flow than water?</strong></p>
          <p>
            It has a lower specific heat, so each litre carries less heat. A
            50% mixture needs roughly 13% more flow than water for the same
            load and temperature rise.
          </p>
          <p><strong>Does this include pressure drop?</strong></p>
          <p>
            No. It gives the flow only. Pressure drop depends on the cold
            plates, hoses, manifolds and couplings in your loop.
          </p>
          <p><strong>What should I check next?</strong></p>
          <p>
            Size the electrical side with the{' '}
            <Link href="/tools/rack-power-current-calculator/">Rack Power to Current Calculator</Link>
            , and read{' '}
            <Link href="/categories/ai-server-data-center-connectors/">
              our AI server and data center connector guides
            </Link>
            {' '}for liquid cooling interfaces.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-liquid-cooling-flow-rate-calculator" />
        </div>
      </section>
    </>
  );
}
