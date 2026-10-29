import Link from 'next/link';
import NewsletterSignup from '../../../components/NewsletterSignup';
import InsertionLossBudgetCalculator from '../../../components/InsertionLossBudgetCalculator';

// Using the bare domain (www.connectorselection.com does not resolve).
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Insertion Loss Budget Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/insertion-loss-budget-calculator/`,
  description:
    'Add up PCB trace, connector and cable insertion loss and compare the total with your channel loss budget.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Insertion Loss Budget Calculator — Channel Loss Tool',
  description:
    'Add up PCB trace, connector and cable insertion loss and compare the total with your channel loss budget. Free tool for high-speed interconnect design.',
};

export default function InsertionLossBudgetCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Insertion Loss Budget Calculator</h1>
          <p>
            Enter your loss budget and the loss of each part of the channel to
            see the total and how much margin is left.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <InsertionLossBudgetCalculator />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            Insertion loss in decibels (dB) adds along a channel, so the total
            loss is the sum of each segment:
          </p>
          <p>
            <strong>
              Total = (trace length × trace loss) + (connectors × loss per
              connector) + (cable length × cable loss) + other losses
            </strong>
          </p>
          <p>
            Margin is your budget minus the total. The status uses a simple
            rule of thumb of this tool: 10% of the budget or more is shown as
            within budget, under 10% as tight, and below zero as over budget.
            The rule of thumb is not part of any standard.
          </p>
          <p>
            Use loss values at the Nyquist frequency of your signaling rate,
            from your board stackup, connector and cable data. The budget
            itself comes from your interface specification. For how insertion
            loss, return loss and crosstalk fit together, see{' '}
            <Link href="/articles/insertion-loss-vs-return-loss-explained-engineering-guide/">
              Insertion Loss vs Return Loss Explained
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-insertion-loss-budget-calculator" />
        </div>
      </section>
    </>
  );
}
