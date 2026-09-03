import ConnectorSelectorWizard from '../../../components/ConnectorSelectorWizard';

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
  title: 'Connector Selector Wizard — Find the Right Connector Type',
  description:
    'Answer a few quick questions about your connection type, signal requirements, and operating environment to get a tailored connector recommendation with links to relevant engineering guides.',
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
        </div>
      </section>
    </>
  );
}
