import Link from 'next/link';
import ConnectorFailureDiagnostic from '../../../components/ConnectorFailureDiagnostic';
import NewsletterSignup from '../../../components/NewsletterSignup';

const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Why Is My Connector Failing? Diagnostic',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/connector-failure-diagnostic/`,
  description:
    'Pick a symptom and a connector type to see the most likely causes of a failing connector, what to check first, and how to fix it.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Why Is My Connector Failing? — Connector Failure Diagnostic',
  description:
    'Free connector troubleshooting tool: choose your symptom and connector type to see the most likely causes, such as fretting corrosion, contact wear, solder joint cracks or flex cable fatigue, and what to check first.',
  alternates: {
    canonical: `${SITE_URL}/tools/connector-failure-diagnostic/`,
  },
};

export default function ConnectorFailureDiagnosticPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Why Is My Connector Failing?</h1>
          <p>
            Choose what is happening and what kind of connector it is. The diagnostic ranks the
            most likely causes and tells you what to check first.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <ConnectorFailureDiagnostic />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Works</h2>
          <p>
            Each symptom, connector type and operating condition points toward certain failure
            modes. The tool adds up those signals and ranks the causes, so a flickering FFC cable
            that gets flexed ranks flex fatigue first, while a hot connector near its current
            rating ranks derating first. It is a checklist built from common failure modes, so
            treat the ranking as a place to start, not a verdict.
          </p>

          <h2>Common Connector Failure Modes</h2>
          <div style={{ overflowX: 'auto', maxWidth: '720px', marginBottom: '20px' }}>
          <table className="cs-tool-table">
            <thead>
              <tr>
                <th>Failure mode</th>
                <th>Typical sign</th>
                <th>Usual trigger</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fretting corrosion</td>
                <td>Intermittent, rising resistance</td>
                <td>Vibration, thermal cycling, tin plating</td>
              </tr>
              <tr>
                <td>Contact wear</td>
                <td>Gradual loss of contact</td>
                <td>Mating cycles beyond the rating</td>
              </tr>
              <tr>
                <td>Overcurrent heating</td>
                <td>Heat, discoloration, melting</td>
                <td>Current near the rating, bundled contacts</td>
              </tr>
              <tr>
                <td>Solder or crimp failure</td>
                <td>Fails when moved or pressed</td>
                <td>Thermal cycling, vibration, rework</td>
              </tr>
              <tr>
                <td>Flex cable fatigue</td>
                <td>Open or intermittent trace</td>
                <td>Tight bends, repeated flexing</td>
              </tr>
              <tr>
                <td>Moisture or ingress</td>
                <td>Corrosion, shorts</td>
                <td>Condensation, wash-down, salt</td>
              </tr>
            </tbody>
          </table>
          </div>

          <h2>Related Tools</h2>
          <p>
            To check heating, use the{' '}
            <Link href="/tools/connector-derating-calculator/">Connector Derating Calculator</Link>.
            For sealing, decode a rating with the{' '}
            <Link href="/tools/ip-code-decoder/">IP Code Decoder</Link>. For a flat flex cable, use
            the{' '}
            <Link href="/tools/ffc-fpc-pitch-calculator/">
              FFC/FPC Pitch &amp; Positions Calculator
            </Link>
            , and to pick a more robust replacement, try the{' '}
            <Link href="/tools/connector-selector-wizard/">Connector Selector Wizard</Link>.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-connector-failure-diagnostic" />
        </div>
      </section>
    </>
  );
}
