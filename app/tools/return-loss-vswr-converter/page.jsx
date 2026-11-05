import Link from 'next/link';
import ReturnLossVswrConverter from '../../../components/ReturnLossVswrConverter';
import NewsletterSignup from '../../../components/NewsletterSignup';

// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

const toolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Return Loss / VSWR Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (Web Browser)',
  url: `${SITE_URL}/tools/return-loss-vswr-converter/`,
  description:
    'Convert between return loss (dB), VSWR and reflection coefficient. See reflected power, transmitted power and mismatch loss for a connector, cable or channel.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const metadata = {
  title: 'Return Loss to VSWR Converter — Reflection Coefficient & Mismatch Loss',
  description:
    'Convert return loss (dB) to VSWR and reflection coefficient, and see reflected power, transmitted power and mismatch loss for a connector, cable or channel.',
};

export default function ReturnLossVswrConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Return Loss / VSWR Converter</h1>
          <p>
            Return loss, VSWR and reflection coefficient all describe the same
            thing: how much signal bounces back from an impedance mismatch.
            Enter any one of them to get the others, plus reflected power and
            mismatch loss.
          </p>
        </div>
      </section>
      <section className="cs-section">
        <div className="cs-container">
          <ReturnLossVswrConverter />
        </div>
      </section>
      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>What Is Return Loss?</h2>
          <p>
            When a signal meets an impedance change, such as a connector that
            does not match the cable or trace around it, part of the signal is
            reflected back toward the source. Return loss measures how much
            weaker the reflected signal is than the incident signal, in dB. A
            larger return loss means a smaller reflection and a better match.
          </p>

          <h2>The Formulas</h2>
          <p>
            All three quantities come from the magnitude of the reflection
            coefficient, |Γ|:
          </p>
          <p>
            <strong>Return loss (dB) = −20 × log₁₀(|Γ|)</strong>
          </p>
          <p>
            <strong>VSWR = (1 + |Γ|) / (1 − |Γ|)</strong>
          </p>
          <p>
            <strong>Mismatch loss (dB) = −10 × log₁₀(1 − |Γ|²)</strong>
          </p>
          <p>
            The fraction of power reflected is |Γ|², and the fraction that
            reaches the load is 1 − |Γ|². Return loss is quoted here as a
            positive number of dB; S11 in dB is the same value with a negative
            sign.
          </p>

          <h2>Reference Values</h2>
          <table className="cs-tool-table">
            <thead>
              <tr>
                <th>Return Loss</th>
                <th>VSWR</th>
                <th>Power Reflected</th>
                <th>Mismatch Loss</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>30 dB</td>
                <td>1.07 : 1</td>
                <td>0.1%</td>
                <td>0.004 dB</td>
              </tr>
              <tr>
                <td>20 dB</td>
                <td>1.22 : 1</td>
                <td>1.0%</td>
                <td>0.044 dB</td>
              </tr>
              <tr>
                <td>15 dB</td>
                <td>1.43 : 1</td>
                <td>3.2%</td>
                <td>0.140 dB</td>
              </tr>
              <tr>
                <td>10 dB</td>
                <td>1.92 : 1</td>
                <td>10%</td>
                <td>0.458 dB</td>
              </tr>
              <tr>
                <td>6 dB</td>
                <td>3.01 : 1</td>
                <td>25%</td>
                <td>1.26 dB</td>
              </tr>
            </tbody>
          </table>

          <h2>Design Implications</h2>
          <p>
            A return loss of 20 dB or better is generally treated as a good
            match, and 10 to 20 dB is moderate. Mismatch loss only counts the
            power lost to reflection. It does not include the attenuation of the
            cable or connector itself, which is insertion loss, and a
            reflection can also reflect again from the source and distort the
            signal. For how return loss and insertion loss differ, and which one
            matters for your channel, see{' '}
            <Link href="/articles/insertion-loss-vs-return-loss-explained-engineering-guide/">
              Insertion Loss vs Return Loss Explained
            </Link>
            . To see how connector impedance causes reflections, read{' '}
            <Link href="/articles/impedance-matching-in-high-speed-connectors-explained/">
              Impedance Matching in High-Speed Connectors
            </Link>
            , and to total up channel loss use the{' '}
            <Link href="/tools/insertion-loss-budget-calculator/">
              Insertion Loss Budget Calculator
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source="tool-return-loss-vswr-converter" />
        </div>
      </section>
    </>
  );
}
