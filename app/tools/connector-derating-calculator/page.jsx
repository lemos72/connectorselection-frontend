import Link from 'next/link';
import NewsletterSignup from '../../../components/NewsletterSignup';
import ConnectorDeratingCalculator from '../../../components/ConnectorDeratingCalculator';

// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Connector Derating Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/connector-derating-calculator/`,
  description:
    'Estimate a connector’s derated current rating for your actual operating ambient temperature, using the standard square-root derating approximation.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Connector Derating Calculator — Estimate Current Rating by Ambient Temperature',
  description:
    'Estimate a connector’s derated current rating for your actual operating ambient temperature, using the standard square-root derating approximation. Free tool.',
};

export default function ConnectorDeratingCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Connector Derating Calculator</h1>
          <p>
            Enter a connector&rsquo;s rated current, the reference ambient it was tested at,
            its max rated temperature, and your actual operating ambient &mdash; this estimates
            how much current the connector can safely carry at your real-world temperature.
          </p>
        </div>
      </section>
      <section className="cs-section">
        <div className="cs-container">
          <ConnectorDeratingCalculator />
        </div>
      </section>
      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Calculator Works</h2>
          <p>
            Connector current ratings are almost always measured at a specific reference
            ambient temperature (often 20&ndash;30&deg;C) and a specific allowable
            temperature rise. As ambient temperature climbs toward the connector&rsquo;s max
            rated temperature, less of that thermal headroom is left for the heat generated
            by current flow, so the safe current has to drop. Because resistive heating
            scales with the square of current, most manufacturer derating curves &mdash; and
            this calculator &mdash; use a square-root relationship between remaining
            temperature headroom and derated current.
          </p>

          <h2>The Formula</h2>
          <p>Derated current is estimated using:</p>
          <p>
            <strong>
              I<sub>derated</sub> = I<sub>rated</sub> &times; &radic;[(T<sub>max</sub> &minus;
              T<sub>ambient</sub>) / (T<sub>max</sub> &minus; T<sub>ref</sub>)]
            </strong>
          </p>
          <p>
            where I<sub>rated</sub> is the current rating at the reference ambient, T
            <sub>max</sub> is the connector&rsquo;s max rated temperature, T<sub>ambient</sub>{' '}
            is your actual operating ambient, and T<sub>ref</sub> is the reference ambient the
            rated current was measured at.
          </p>

          <h2>Limitations</h2>
          <p>
            This is a planning estimate, not a substitute for the manufacturer&rsquo;s actual
            published derating curve for your specific part number &mdash; the real curve also
            accounts for contact geometry, number of loaded contacts, and airflow, which this
            general formula can&rsquo;t capture. Always verify against the datasheet before
            finalizing a design.
          </p>
          <p>
            For the full explanation of how to read a manufacturer&rsquo;s actual derating
            curve, common mistakes, and a worked example, see{' '}
            <Link href="/articles/how-to-read-connector-thermal-derating-curves/">
              How to Read Connector Thermal Derating Curves
            </Link>{' '}
            and{' '}
            <Link href="/articles/cable-temperature-ratings-current-derating-voltage-drop/">
              Cable Temperature Ratings, Current Derating &amp; Voltage Drop
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-connector-derating-calculator" />
        </div>
      </section>
    </>
  );
}
