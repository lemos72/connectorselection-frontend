import Link from 'next/link';
import FfcFpcPitchCalculator from '../../../components/FfcFpcPitchCalculator';
import NewsletterSignup from '../../../components/NewsletterSignup';

const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'FFC/FPC Pitch & Positions Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/ffc-fpc-pitch-calculator/`,
  description:
    'Calculate FFC/FPC conductor span and nominal width from pitch and number of positions, or find how many positions fit in a given width.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'FFC/FPC Pitch & Positions Calculator — Cable Width & Span',
  description:
    'Free FFC/FPC calculator: get conductor span and nominal width from pitch and positions, or see how many positions fit in your available width. Pitches from 0.3 to 1.25 mm.',
  alternates: {
    canonical: `${SITE_URL}/tools/ffc-fpc-pitch-calculator/`,
  },
};

export default function FfcFpcPitchCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>FFC/FPC Pitch &amp; Positions Calculator</h1>
          <p>
            Enter a pitch and number of positions to see the conductor span and width &mdash; or
            enter the width you have and see how many positions fit.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <FfcFpcPitchCalculator />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            An FFC (flexible flat cable) or FPC (flexible printed circuit) carries its conductors
            side by side at a fixed center-to-center spacing, the pitch. Two simple geometric
            relationships follow from that:
          </p>
          <p>
            <strong>Conductor span = (positions &minus; 1) &times; pitch</strong>
          </p>
          <p>
            <strong>Nominal width = positions &times; pitch</strong>
          </p>
          <p>
            The span is the distance from the center of the first conductor to the center of the
            last one. The nominal width is the space each conductor occupies if you give every
            conductor one full pitch. A real cable is a little wider than the span because it
            needs insulation and an edge margin on both sides, and that margin differs between
            manufacturers and series, so always confirm the final width against the datasheet.
          </p>

          <h2>Common FFC/FPC Pitches</h2>
          <table>
            <thead>
              <tr>
                <th>Pitch</th>
                <th>Typical use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0.3 mm</td>
                <td>Very compact designs such as phones, wearables and camera modules</td>
              </tr>
              <tr>
                <td>0.5 mm</td>
                <td>The most widely used pitch for displays, cameras and consumer electronics</td>
              </tr>
              <tr>
                <td>0.8 mm</td>
                <td>Mid-density interconnects where a little more spacing helps handling</td>
              </tr>
              <tr>
                <td>1.0 mm</td>
                <td>General-purpose and industrial boards, easier to hand-assemble</td>
              </tr>
              <tr>
                <td>1.25 mm</td>
                <td>Larger pitch for lower density or higher current per conductor</td>
              </tr>
            </tbody>
          </table>

          <h2>Related Reading</h2>
          <p>
            Choosing between connector styles? See the{' '}
            <Link href="/categories/fpc-ffc-connectors/">FPC/FFC connector guides</Link> and the
            Ask the Engineer answer on{' '}
            <Link href="/ask-the-engineer/zif-or-non-zif-fpc-connector/">
              ZIF vs non-ZIF FPC connectors
            </Link>
            . If you have a specific requirement, you can{' '}
            <Link
              href="/request-info/fpc-ffc-connectors/?utm_source=site&utm_medium=tool&utm_campaign=ffc-fpc-pitch-calculator"
              prefetch={false}
            >
              request FFC/FPC pricing and availability
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-ffc-fpc-pitch-calculator" />
        </div>
      </section>
    </>
  );
}
