import Link from 'next/link';
import NewsletterSignup from '../../../components/NewsletterSignup';
import IpCodeDecoder from '../../../components/IpCodeDecoder';

// Using the bare domain (www.connectorselection.com does not resolve).
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'IP Code Decoder',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/ip-code-decoder/`,
  description:
    'Decode an IP rating such as IP67 or IP6K9K into plain-language dust and water protection levels.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'IP Code Decoder — IP Rating Meaning Tool',
  description:
    'Decode an IP rating such as IP67 or IP6K9K into plain-language dust and water protection levels. Free tool for engineers choosing sealed connectors.',
};

export default function IpCodeDecoderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>IP Code Decoder</h1>
          <p>
            Pick the two digits of an IP rating to see what dust and water
            protection they stand for.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <IpCodeDecoder />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Decoded</h2>
          <p>
            An IP code has two digits after the letters IP. The first digit
            (0 to 6) describes protection against solid objects and dust. The
            second digit (0 to 9) describes protection against water. An X
            in either position means that kind of protection was not rated.
          </p>
          <p>
            <strong>The two tests are separate.</strong> A product rated IP67
            has passed the dust-tight test and the temporary immersion test,
            but that does not mean it also passes the water-jet tests
            (IPX5 or IPX6). A product that needs to meet more than one water
            level should list each rating.
          </p>
          <p>
            The 9K water level is used in road vehicle standards (ISO 20653),
            so automotive connectors are often rated IP6K9K. For connectors,
            ratings normally apply only when the connector is fully mated and
            correctly assembled.
          </p>
          <p>
            The definitions follow IEC 60529. For a full chart with
            connector examples, see{' '}
            <Link href="/articles/ip-rating-chart-ip65-ip67-ip68-ip69k-explained/">
              IP Rating Chart: IP65, IP67, IP68 and IP69K Explained
            </Link>{' '}
            and{' '}
            <Link href="/articles/connector-ip-ratings-environmental-sealing/">
              Connector IP Ratings and Environmental Sealing
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-ip-code-decoder" />
        </div>
      </section>
    </>
  );
}
