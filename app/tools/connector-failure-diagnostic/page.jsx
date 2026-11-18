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

          <h2>What to Check First and How to Fix It</h2>
          <div style={{ overflowX: 'auto', maxWidth: '720px', marginBottom: '20px' }}>
          <table className="cs-tool-table">
            <thead>
              <tr>
                <th>Failure mode</th>
                <th>What to check first</th>
                <th>Usual fix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fretting corrosion</td>
                <td>Dark debris or oxide on the contacts; contact resistance while the unit vibrates</td>
                <td>Matching gold plating on both sides, less relative motion, retention or strain relief</td>
              </tr>
              <tr>
                <td>Contact wear</td>
                <td>Mating cycles used against the rating; plating worn through</td>
                <td>Replace the connector; choose a higher-cycle part or thicker gold</td>
              </tr>
              <tr>
                <td>Overcurrent heating</td>
                <td>Actual current against the rating at your temperature; discoloration</td>
                <td>Derate for temperature and bundling, share current across more contacts, or use a higher-rated part</td>
              </tr>
              <tr>
                <td>Solder or crimp failure</td>
                <td>Gently flex the cable while watching the signal; inspect joints and pull-test crimps</td>
                <td>Rework the joint, correct the crimp, add strain relief</td>
              </tr>
              <tr>
                <td>Flex cable fatigue</td>
                <td>Bend radius and whether the cable moves in service; cracked traces</td>
                <td>Larger bend radius, a fixed bend instead of a moving one, or a cable rated for repeated flexing</td>
              </tr>
              <tr>
                <td>Moisture or ingress</td>
                <td>Corrosion, residue or water marks; the IP rating against the real environment</td>
                <td>A sealed connector, conformal coating, or a better cable exit</td>
              </tr>
            </tbody>
          </table>
          </div>

          <h2>Before You Replace the Connector</h2>
          <p>
            <strong>Reproduce the fault.</strong> Note when it appears: during vibration, when
            warm, when the cable is moved, or after cleaning. The trigger usually points to the
            cause.
          </p>
          <p>
            <strong>Measure, do not guess.</strong> Check continuity or contact resistance while you
            gently move the cable or tap the board.
          </p>
          <p>
            <strong>Compare with the rating.</strong> Check current, temperature, mating cycles and
            environment against the datasheet for the exact part.
          </p>
          <p>
            <strong>Inspect closely.</strong> Look under magnification for discoloration, debris,
            bent contacts, lifted solder joints or cracked traces.
          </p>
          <p>
            <strong>Change one thing at a time.</strong> If you reseat, clean and replace at once,
            you will not know which step fixed it.
          </p>

          <h2>Frequently Asked Questions</h2>
          <p>
            <strong>Why is my connector intermittent?</strong> The usual causes are fretting
            corrosion, a worn or damaged contact, a cracked solder joint or crimp, or a flex cable
            cracking at a bend. Gently moving the cable while you watch the signal helps tell them
            apart.
          </p>
          <p>
            <strong>What is fretting corrosion?</strong> Tiny movements between mated contacts,
            from vibration or thermal cycling, wear through the plating and let the exposed metal
            oxidize. The oxide raises contact resistance and makes the connection intermittent. It
            is most common with tin-plated contacts.
          </p>
          <p>
            <strong>Can a connector fail from too much current?</strong> Yes. Current near the
            rating, or many contacts carrying current at once, heats the connector. Check the
            rating at your actual temperature.
          </p>
          <p>
            <strong>How many mating cycles before a connector wears out?</strong> It depends mostly
            on the plating. Tin is typically rated for 10 to 50 cycles and gold for 100 to 5,000 or
            more. Always confirm the number on the datasheet for the exact part.
          </p>
          <p>
            <strong>Does this tool replace a failure analysis?</strong> No. It ranks common causes
            from the symptoms you pick. For a critical failure, inspect the part and ask the
            supplier for an analysis.
          </p>

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

          <h2>Related Guides</h2>
          <p>
            For more detail, see{' '}
            <Link href="/articles/connector-mating-cycles-explained-engineering-guide/">
              connector mating cycles
            </Link>
            ,{' '}
            <Link href="/articles/connector-galvanic-corrosion-plating-incompatibility/">
              galvanic corrosion and plating incompatibility
            </Link>
            ,{' '}
            <Link href="/articles/connector-contact-resistance-explained-design-guide/">
              contact resistance
            </Link>
            ,{' '}
            <Link href="/articles/how-to-read-connector-thermal-derating-curves/">
              thermal derating curves
            </Link>
            ,{' '}
            <Link href="/articles/connector-ip-ratings-environmental-sealing/">
              IP ratings and environmental sealing
            </Link>{' '}
            and{' '}
            <Link href="/articles/zif-non-zif-fpc-connector-latch-failure-prevention/">
              FPC connector latch failure prevention
            </Link>
            .
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
