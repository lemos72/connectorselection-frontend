import Link from 'next/link';
import NewsletterSignup from '../../../components/NewsletterSignup';
import CableDeratingCalculator from '../../../components/CableDeratingCalculator';
import {
  BUNDLE_BANDS,
  INSULATION_RATINGS,
  temperatureFactor,
} from '../../../lib/cableDerating';

const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Cable Derating Factor Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/cable-derating-calculator/`,
  description:
    'Estimate the derated current of a cable from the number of conductors in the bundle, the insulation temperature rating, and the ambient temperature.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Cable Derating Factor Calculator — Bundle and Ambient Temperature',
  description:
    'Free cable derating factor calculator. Enter the rated current, conductors in the bundle, insulation rating and ambient temperature to get the derated current, with a derating factor table.',
};

const AMBIENTS = [30, 40, 50, 60, 70, 80, 90, 105];

const tableStyle = { width: '100%', borderCollapse: 'collapse', margin: '1rem 0' };
const cellStyle = {
  padding: '0.5rem 0.75rem',
  textAlign: 'left',
  borderBottom: '1px solid rgba(128, 128, 128, 0.35)',
};

export default function CableDeratingCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Cable Derating Factor Calculator</h1>
          <p>
            Enter the rated current, the number of conductors in the bundle,
            the insulation temperature rating, and the ambient temperature to
            see how much current the cable can safely carry.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <CableDeratingCalculator />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            Two effects reduce the current a cable can carry. Conductors
            bundled together cannot shed heat as well as a single cable, and a
            warm environment leaves less temperature headroom before the
            insulation reaches its limit. This tool multiplies the two factors:
          </p>
          <p>
            <strong>Derated Current = Rated Current × Bundle Factor × Temperature Factor</strong>
          </p>
          <p>
            The temperature factor is √((T<sub>rating</sub> − T<sub>ambient</sub>) / (T<sub>rating</sub> − 30)),
            because heating in a conductor rises with the square of the
            current. The rated current is assumed to apply at a 30 °C ambient,
            and the factor is not raised above 100% for cooler rooms.
          </p>

          <h2>Bundle Derating Factor Table</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Conductors in bundle</th>
                <th style={cellStyle}>Allowed current</th>
              </tr>
            </thead>
            <tbody>
              {BUNDLE_BANDS.map((band) => (
                <tr key={band.label}>
                  <td style={cellStyle}>{band.label}</td>
                  <td style={cellStyle}>{Math.round(band.factor * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Temperature Derating Factor Table</h2>
          <p>Allowed current as a percentage of rated current, by insulation rating and ambient temperature.</p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Insulation rating</th>
                {AMBIENTS.map((a) => (
                  <th key={a} style={cellStyle}>{a} °C</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INSULATION_RATINGS.map((rating) => (
                <tr key={rating}>
                  <td style={cellStyle}>{rating} °C</td>
                  {AMBIENTS.map((a) => (
                    <td key={a} style={cellStyle}>
                      {a >= rating ? '—' : `${Math.round(temperatureFactor(rating, a) * 100)}%`}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Frequently Asked Questions</h2>
          <h3>What is a cable derating factor?</h3>
          <p>
            It is a percentage reduction applied to a cable&apos;s rated
            current to account for bundling and ambient temperature.
          </p>
          <h3>How do I derate a multi-conductor cable?</h3>
          <p>
            Find the bundle factor for your conductor count, find the
            temperature factor for your ambient temperature, and multiply both
            by the rated current.
          </p>
          <h3>Does ambient temperature change the current rating?</h3>
          <p>
            Yes. The hotter the surroundings, the less the conductor can heat
            before the insulation reaches its limit, so the allowed current
            falls.
          </p>
          <h3>What should I check after derating?</h3>
          <p>
            Check the voltage drop with the{' '}
            <Link href="/tools/voltage-drop-calculator/">Voltage Drop Calculator</Link>
            . For connectors, use the{' '}
            <Link href="/tools/connector-derating-calculator/">Connector Derating Calculator</Link>
            . For the background, read{' '}
            <Link href="/articles/cable-temperature-ratings-current-derating-voltage-drop/">
              Cable Temperature Ratings, Derating and Voltage Drop Explained
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-cable-derating-calculator" />
        </div>
      </section>
    </>
  );
}
