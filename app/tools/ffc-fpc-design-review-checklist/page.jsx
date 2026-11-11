import Link from 'next/link';
import LeadMagnetForm from '../../../components/LeadMagnetForm';

const SITE_URL = 'https://connectorselection.com';
const PDF_URL = `${SITE_URL}/downloads/ffc-fpc-design-review-checklist.pdf`;

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'FFC/FPC Connector Design Review Checklist',
  url: `${SITE_URL}/tools/ffc-fpc-design-review-checklist/`,
  description:
    'A free 3-page checklist for reviewing an FFC or FPC connector interface: cable match, mechanical routing, electrical and signal integrity, environment, assembly and sourcing.',
  isAccessibleForFree: true,
  encodingFormat: 'application/pdf',
  publisher: { '@type': 'Organization', name: 'Connector Selection', url: SITE_URL },
};

export const metadata = {
  title: 'FFC/FPC Connector Design Review Checklist (Free PDF)',
  description:
    'Free 3-page FFC/FPC design review checklist with 37 checks: cable and connector match, bend radius and strain relief, signal integrity, ESD, soldering and sourcing, plus a sign-off table.',
  alternates: {
    canonical: `${SITE_URL}/tools/ffc-fpc-design-review-checklist/`,
  },
};

export default function FfcFpcDesignReviewChecklistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>FFC/FPC Connector Design Review Checklist</h1>
          <p>
            A free 3-page checklist for reviewing a flat flex cable interface before you release
            the design. Enter your email and the PDF downloads straight away.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <LeadMagnetForm
            pdfUrl={PDF_URL}
            source="ffc_fpc_design_review_checklist"
            title="Get the FFC/FPC Design Review Checklist"
            description="A free 3-page PDF with 37 checks and a sign-off table."
          />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <h2>What Is Inside</h2>
          <p>
            The checklist has six sections, and each check is a tick box with a one-line reason.
            Use it when the interface is defined, during layout review, and before the drawing is
            released.
          </p>
          <div style={{ overflowX: 'auto', maxWidth: '720px', marginBottom: '20px' }}>
            <table className="cs-tool-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Example checks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Match the cable to the connector</td>
                  <td>Pitch and positions, cable thickness with stiffener, contact side, pin 1 direction</td>
                </tr>
                <tr>
                  <td>2. Mechanical and routing</td>
                  <td>Bend radius, strain relief, insertion forces, mating cycles</td>
                </tr>
                <tr>
                  <td>3. Electrical and signal integrity</td>
                  <td>Current and derating, impedance, crosstalk, ESD, plating</td>
                </tr>
                <tr>
                  <td>4. Environment and reliability</td>
                  <td>Operating and soldering temperature limits, thermal cycling, test plan</td>
                </tr>
                <tr>
                  <td>5. PCB, assembly and inspection</td>
                  <td>Land pattern, reflow profile, solder joints, incoming inspection</td>
                </tr>
                <tr>
                  <td>6. Sourcing and documentation</td>
                  <td>Approved alternates, lifecycle status, complete drawing, lead time</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            It is general guidance for early design review. The connector and cable datasheets
            always take priority over general rules of thumb.
          </p>

          <h2>Related Tools</h2>
          <p>
            To work out how many contacts fit a given width, use the{' '}
            <Link href="/tools/ffc-fpc-pitch-calculator/">
              FFC/FPC Pitch &amp; Positions Calculator
            </Link>
            . For heating, try the{' '}
            <Link href="/tools/connector-derating-calculator/">Connector Derating Calculator</Link>
            , and if a connector is already misbehaving, the{' '}
            <Link href="/tools/connector-failure-diagnostic/">
              Why Is My Connector Failing? Diagnostic
            </Link>
            . Need pricing or availability?{' '}
            <Link href="/request-info/fpc-ffc-connectors/">Request FFC/FPC pricing</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
