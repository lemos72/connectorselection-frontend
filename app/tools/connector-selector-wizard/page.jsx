import Link from 'next/link';
import ConnectorSelectorWizard from '../../../components/ConnectorSelectorWizard';
import NewsletterSignup from '../../../components/NewsletterSignup';

const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Connector Selector Wizard',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/connector-selector-wizard/`,
  description:
    'Answer a few questions about your application, environment, and signal requirements to get a tailored connector type recommendation with links to relevant guides.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const metadata = {
  title: 'Electrical Connector Selector Tool: Find the Right Type',
  description:
    'Free connector selector tool: answer 3-4 questions on connection type, requirement and environment to get a recommended connector and matching guides.',
  alternates: {
    canonical: `${SITE_URL}/tools/connector-selector-wizard/`,
  },
};

export default function ConnectorSelectorWizardPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Connector Selector Wizard</h1>
          <p>
            Answer a few quick questions about your connection type, signal requirements,
            and operating environment to get a tailored connector recommendation.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <ConnectorSelectorWizard />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Works</h2>
          <p>
            This wizard walks through the questions a hardware engineer would ask
            themselves when starting a connector selection: what you&apos;re connecting,
            what it primarily carries (power, high-speed data, RF, or flexible flat
            cable), and where it operates. Your answers are matched against the site&apos;s
            engineering guides to point you toward the most relevant articles, category,
            and calculator tool for your specific situation — not a generic checklist.
          </p>
          <p>
            This is a starting point for narrowing down connector families, not a final
            specification tool. Always verify the specific connector part number against
            its manufacturer datasheet before finalizing a design.
          </p>

          <h2>What Is a Connector Selector Tool?</h2>
          <p>
            A connector selector tool narrows the field of connector types before you
            start comparing part numbers. This free tool runs in your browser. You choose
            the connection type, the main requirement and the operating environment, and
            it points you to the connector type and guides that fit.
          </p>

          <h2>What to Check After You Pick a Connector Type</h2>
          <ul>
            <li>
              <strong>Current and voltage:</strong> see{' '}
              <Link href="/articles/connector-current-voltage-ratings-explained/">
                connector current and voltage ratings explained
              </Link>
              , and size the wire run with the{' '}
              <Link href="/tools/voltage-drop-calculator/">Voltage Drop Calculator</Link>.
            </li>
            <li>
              <strong>Durability:</strong> check the rated mating cycles. See{' '}
              <Link href="/articles/connector-mating-cycles-explained-engineering-guide/">
                connector mating cycles explained
              </Link>
              .
            </li>
            <li>
              <strong>Plating and contacts:</strong> read{' '}
              <Link href="/articles/connector-plating-technology-engineering-specifications/">
                connector plating technology
              </Link>
              .
            </li>
            <li>
              <strong>Sealing:</strong> match the rating to your environment with the{' '}
              <Link href="/articles/ip-rating-chart-ip65-ip67-ip68-ip69k-explained/">
                IP rating chart
              </Link>
              .
            </li>
            <li>
              <strong>Flat flexible cable:</strong> compare{' '}
              <Link href="/compare/zif-vs-non-zif-fpc-connectors/">ZIF vs non-ZIF connectors</Link>
              , or browse{' '}
              <Link href="/categories/fpc-ffc-connectors/">FPC and FFC connectors</Link>.
            </li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          <h3>Does the wizard give me a part number?</h3>
          <p>
            No. It narrows down the connector type and points you to the right guides.
            Always verify the specific part number against the manufacturer datasheet
            before you finalize a design.
          </p>
          <h3>What do I need to know before I start?</h3>
          <p>
            What you are connecting, what the connection mainly carries (power,
            high-speed data, RF or flat flexible cable), and where it will operate.
          </p>
          <h3>Do I need to install anything?</h3>
          <p>No. It is a free tool that works in your web browser.</p>
          <h3>What should I do if a connector I already use is failing?</h3>
          <p>
            Try{' '}
            <Link href="/tools/connector-failure-diagnostic/">Why Is My Connector Failing?</Link>{' '}
            to see the most likely causes and what to check first.
          </p>
          <h3>Where can I learn the basics?</h3>
          <p>
            Start with{' '}
            <Link href="/articles/electrical-connector-basics/">electrical connector basics</Link>
            , or ask a question on the{' '}
            <Link href="/ask-the-engineer/">Ask the Engineer page</Link>.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-connector-selector-wizard" />
        </div>
      </section>
    </>
  );
}
