import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getComparisons, getComparisonBySlug } from '../../../lib/strapi';
import BlocksRenderer from '../../../components/BlocksRenderer';

const SITE_URL = 'https://www.connectorselection.com';

export async function generateStaticParams() {
  const comparisons = await getComparisons();
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const comparison = await getComparisonBySlug(params.slug);
  if (!comparison) return {};

  const title = comparison.seo_title || comparison.title;
  const description = comparison.seo_description || comparison.verdict || '';

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/compare/${comparison.slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/compare/${comparison.slug}/`,
      type: 'article',
    },
  };
}

export default async function ComparisonPage({ params }) {
  const comparison = await getComparisonBySlug(params.slug);
  if (!comparison) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: comparison.seo_title || comparison.title,
    description: comparison.seo_description || comparison.verdict || '',
    url: `${SITE_URL}/compare/${comparison.slug}/`,
    datePublished: comparison.published_date,
    publisher: {
      '@type': 'Organization',
      name: 'Connector Selection',
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: comparison.title,
        item: `${SITE_URL}/compare/${comparison.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">
            {comparison.connector_a} vs {comparison.connector_b}
          </span>
          <h1>{comparison.title}</h1>
          {comparison.verdict && (
            <p className="cs-article-intro">{comparison.verdict}</p>
          )}
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-article-body">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/compare/">Compare</Link></li>
              <li aria-current="page">{comparison.title}</li>
            </ol>
          </nav>

          {comparison.content && (
            <BlocksRenderer content={comparison.content} />
          )}

          <div className="cs-article-footer">
            <Link href="/compare/" className="cs-back-link">
              ← All Comparisons
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
