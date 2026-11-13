import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '../../../lib/strapi';
import RFIForm from '../../../components/RFIForm';
import { RFI_FIELD_CONFIGS } from '../../../lib/rfiFieldConfigs';
import {
  PitchDiagram,
  ZifDiagram,
  CableDiagram,
  StepIcon,
} from '../../../components/FfcDiagrams';

const SITE_URL = 'https://connectorselection.com';

export async function generateStaticParams() {
  // Deliberately NOT fetched from Strapi — this list is the hardcoded RFI
  // pilot scope (see lib/rfiFieldConfigs.js), so it can never come back
  // empty. That sidesteps the Ask the Engineer build gotcha entirely
  // (output: 'export' + an empty generateStaticParams() array throws a
  // misleading "missing generateStaticParams()" error) — this route's
  // param list has nothing to do with live Strapi data.
  return Object.keys(RFI_FIELD_CONFIGS).map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const config = RFI_FIELD_CONFIGS[category];
  if (!config) return { title: 'Request Info' };

  return {
    title: `${config.label} — Request Info & Pricing`,
    description: config.needs
      ? `Tell us your ${config.shortLabel} requirements and we'll reply with product and pricing information — no obligation.`
      : `Submit your ${config.shortLabel} requirements and get a personal follow-up with pricing and availability — no obligation.`,
    alternates: {
      canonical: `${SITE_URL}/request-info/${category}/`,
    },
  };
}

export default async function RequestInfoPage({ params }) {
  const { category } = await params;
  const config = RFI_FIELD_CONFIGS[category];
  if (!config) notFound();

  const cat = await getCategoryBySlug(category).catch(() => null);
  // Use the raw Strapi category name for the breadcrumb link (matches
  // what the category page itself shows), but the controlled shortLabel
  // for the page heading — the Strapi Name/seo_title is long SEO copy
  // that reads badly in a heading like "X: Request Info & Pricing".
  const categoryName = cat?.Name || cat?.name || config.shortLabel;

  // Guided layout: categories that define `needs` + `hero` in
  // lib/rfiFieldConfigs.js get the visual page. Others keep the original.
  const guided = Boolean(config.needs && config.hero);
  const hero = config.hero;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: `${SITE_URL}/categories/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${SITE_URL}/categories/${category}/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Request Info',
        item: `${SITE_URL}/request-info/${category}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/categories/">Categories</Link>
            <span>/</span>
            <Link href={`/categories/${category}/`}>{categoryName}</Link>
            <span>/</span>
            <span>Request Info</span>
          </nav>
          {guided ? (
            <div className="cs-rfi-hero">
              <div className="cs-rfi-hero-text">
                <span className="cs-eyebrow">Request Info</span>
                <h1 className="cs-rfi-h1">{hero.title}</h1>
                <p className="cs-rfi-hero-sub">{hero.sub}</p>
              </div>
              <ol className="cs-rfi-steps" aria-label="How it works">
                {hero.steps.map((s, i) => (
                  <li className="cs-rfi-step" key={s.title}>
                    <span className="cs-rfi-step-icon">
                      <StepIcon kind={s.icon} />
                    </span>
                    <span className="cs-rfi-step-body">
                      <strong>
                        {i + 1}. {s.title}
                      </strong>
                      <span>{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <>
              <span className="cs-eyebrow">Request Info</span>
              <h1>{config.shortLabel}: Request Info &amp; Pricing</h1>
            </>
          )}
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {guided ? (
            <>
              <RFIForm category={category} />

              <section className="cs-rfi-learn" aria-labelledby="rfi-learn-title">
                <h2 id="rfi-learn-title">Not sure which part you need?</h2>
                <p>Quick pictures to help you fill in the specs.</p>
                <div className="cs-rfi-diagrams">
                  <figure className="cs-rfi-diagram-card">
                    <PitchDiagram />
                    <figcaption>
                      <strong>Pitch</strong>
                      <span>
                        The distance between conductors. It must match your
                        connector.
                      </span>
                    </figcaption>
                  </figure>
                  <figure className="cs-rfi-diagram-card">
                    <ZifDiagram />
                    <figcaption>
                      <strong>ZIF or non-ZIF</strong>
                      <span>
                        ZIF opens with a lever. Non-ZIF grips the cable
                        directly.
                      </span>
                    </figcaption>
                  </figure>
                  <figure className="cs-rfi-diagram-card">
                    <CableDiagram />
                    <figcaption>
                      <strong>Cable ends</strong>
                      <span>
                        Tell us the positions, length and contact side.
                      </span>
                    </figcaption>
                  </figure>
                </div>
                <div className="cs-rfi-learn-links">
                  <Link href="/tools/ffc-fpc-pitch-calculator/">
                    FFC/FPC pitch calculator
                  </Link>
                  <Link href="/tools/ffc-fpc-design-review-checklist/">
                    Design review checklist
                  </Link>
                  <Link href={`/categories/${category}/`}>
                    All FPC/FFC guides
                  </Link>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Short reassurance block for visitors arriving from search or ads:
                  who we are, what they get, what happens next, what to include. */}
              <div
                style={{
                  border: '1px solid var(--line)',
                  background: 'var(--card)',
                  borderRadius: '8px',
                  padding: '20px 24px',
                  marginBottom: '32px',
                  maxWidth: '760px',
                }}
              >
                <p style={{ margin: '0 0 10px' }}>
                  <strong>Who we are:</strong> Connector Selection is an independent
                  connector resource written by engineers.
                </p>
                <p style={{ margin: '0 0 10px' }}>
                  <strong>What you get:</strong> pricing, availability and
                  suitable alternatives for your {config.shortLabel} requirement.
                </p>
                <p style={{ margin: '0 0 10px' }}>
                  <strong>What happens next:</strong> an engineer reviews your
                  request and replies within 2 business days. No obligation.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>To get a faster answer,</strong> include the pitch,
                  number of positions, quantity and timeline.
                </p>
              </div>
              <RFIForm category={category} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
