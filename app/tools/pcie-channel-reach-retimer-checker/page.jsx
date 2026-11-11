import Link from 'next/link';
import PcieChannelReachChecker from '../../../components/PcieChannelReachChecker';
import NewsletterSignup from '../../../components/NewsletterSignup';

const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PCIe Channel Reach & Retimer Checker',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/pcie-channel-reach-retimer-checker/`,
  description:
    'Estimate how much of the PCIe 4.0, 5.0 or 6.0 channel loss budget your board trace, connectors and add-in card use, and see whether a retimer is likely needed.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'PCIe Channel Reach & Retimer Checker — Loss Budget by Generation',
  description:
    'Free PCIe loss budget checker for Gen 4, 5 and 6: enter board material, trace length and connector loss to see your margin, the longest trace that fits, and whether a retimer is likely needed.',
  alternates: {
    canonical: `${SITE_URL}/tools/pcie-channel-reach-retimer-checker/`,
  },
};

export default function PcieChannelReachCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>PCIe Channel Reach &amp; Retimer Checker</h1>
          <p>
            Pick a PCIe generation, a board material and a trace length to see how much of the
            channel loss budget you use, how much margin is left, and whether you are likely to
            need a retimer.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <PcieChannelReachChecker />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>How This Is Calculated</h2>
          <p>
            Every PCIe generation has an end-to-end insertion loss budget, measured from chip
            bump to chip bump at the Nyquist frequency. The checker adds up the loss of each part
            of the channel and compares it with that budget:
          </p>
          <p>
            <strong>
              Channel loss = root package + board trace + other loss + CEM connector + add-in card
            </strong>
          </p>
          <p>
            Board trace loss is the trace length multiplied by the loss per inch of your laminate.
            A share of the total budget is held back as margin for temperature, manufacturing
            variation and noise. If the channel loss exceeds the budget, the usual fixes are a
            shorter trace, a lower-loss laminate, fewer connectors, or a retimer that splits the
            channel into two shorter segments.
          </p>

          <h2>Budgets Used</h2>
          <div style={{ overflowX: 'auto', maxWidth: '720px', marginBottom: '20px' }}>
          <table className="cs-tool-table">
            <thead>
              <tr>
                <th>Generation</th>
                <th>Total budget</th>
                <th>Nyquist</th>
                <th>Package</th>
                <th>CEM connector</th>
                <th>Add-in card</th>
                <th>System board</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PCIe 4.0</td>
                <td>28 dB</td>
                <td>8 GHz</td>
                <td>5.0 dB</td>
                <td>1.5 dB</td>
                <td>8.0 dB</td>
                <td>13.5 dB</td>
              </tr>
              <tr>
                <td>PCIe 5.0</td>
                <td>36 dB</td>
                <td>16 GHz</td>
                <td>9.0 dB</td>
                <td>1.5 dB</td>
                <td>9.5 dB</td>
                <td>16.0 dB</td>
              </tr>
              <tr>
                <td>PCIe 6.0</td>
                <td>32 dB</td>
                <td>16 GHz</td>
                <td colSpan={4}>
                  Per-segment split not included. Enter values from your silicon and card vendors.
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          <p>
            The Gen 4 and Gen 5 allocations follow published guidance from Astera Labs, and the
            Gen 6 total follows Signal Integrity Journal. The loss-per-inch presets for Gen 5 and
            Gen 6 are typical values at 16 GHz. For Gen 4, and for any specific stackup, use the
            figure from your laminate datasheet.
          </p>

          <h2>Related Reading</h2>
          <p>
            Learn how the connector itself fits into the channel in{' '}
            <Link href="/articles/what-is-a-cem-slot-pcie-card-electromechanical-connector-explained/">
              What is a CEM slot?
            </Link>{' '}
            and{' '}
            <Link href="/articles/pcie-connectors-explained-gen4-vs-gen5-vs-gen6/">
              PCIe connectors explained: Gen 4 vs Gen 5 vs Gen 6
            </Link>
            . For a custom loss budget with your own segments, use the{' '}
            <Link href="/tools/insertion-loss-budget-calculator/">
              Insertion Loss Budget Calculator
            </Link>
            , and to check throughput, the{' '}
            <Link href="/tools/pcie-bandwidth-calculator/">PCIe Bandwidth Calculator</Link>.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-pcie-channel-reach-retimer-checker" />
        </div>
      </section>
    </>
  );
}
