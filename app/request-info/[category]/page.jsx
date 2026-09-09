import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '../../../lib/strapi';
import RFIForm from '../../../components/RFIForm';
import { RFI_FIELD_CONFIGS } from '../../../lib/rfiFieldConfigs';

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
    description: `Submit your ${config.shortLabel} requirements and get a personal follow-up with pricing and availability — no obligation.`,
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
          <span className="cs-eyebrow">Request Info</span>
          <h1>{config.shortLabel}: Request Info &amp; Pricing</h1>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <RFIForm category={category} />
        </div>
      </section>
    </>
  );
}
