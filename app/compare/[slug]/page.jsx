import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getComparisons, getComparisonBySlug } from '../../../lib/strapi';
import BlocksRenderer from '../../../components/BlocksRenderer';
import NewsletterSignup from '../../../components/NewsletterSignup';

// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

export async function generateStaticParams() {
  try {
    const comparisons = await getComparisons();
    return comparisons.map((c) => ({ slug: c.slug }));
  } catch (e) {
    console.warn('[build] generateStaticParams (comparisons) failed:', e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug).catch(() => null);
  if (!comparison) return { title: 'Comparison not found' };
  return {
    title: comparison.seo_title || comparison.title,
    description: comparison.seo_description || comparison.verdict || '',
    alternates: {
      canonical: `${SITE_URL}/compare/${comparison.slug}/`,
    },
  };
}

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d)
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase();
  } catch { return ''; }
}

export default async function ComparisonPage({ params }) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug).catch(() => null);
  if (!comparison) notFound();

  const category = comparison.category;
  const date = fmtDate(comparison.published_date || comparison.publishedAt);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare/` },
      { '@type': 'ListItem', position: 3, name: comparison.title, item: `${SITE_URL}/compare/${comparison.slug}/` },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: comparison.seo_title || comparison.title,
    description: comparison.seo_description || comparison.verdict || '',
    publisher: { '@type': 'Organization', name: 'Connector Selection' },
    datePublished: comparison.published_date || comparison.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/compare/${comparison.slug}/`,
    },
  };

  return (
    <article className="cs-article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="cs-container">
        <div className="cs-article-header">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/compare/">Compare</Link>
            {category && (
              <>
                <span>/</span>
                <Link href={`/categories/${category.slug}/`}>
                  {category.Name || category.name}
                </Link>
              </>
            )}
          </nav>

          <h1>{comparison.title}</h1>

          <div className="cs-article-meta">
            {comparison.connector_a && comparison.connector_b && (
              <span>{comparison.connector_a} vs {comparison.connector_b}</span>
            )}
            {date && <span>{date}</span>}
          </div>
        </div>

        {comparison.verdict && (
          <div className="cs-article-body">
            <p><strong>{comparison.verdict}</strong></p>
          </div>
        )}

        <div className="cs-article-body">
          <BlocksRenderer content={comparison.content} />
        </div>

        <NewsletterSignup source="compare-footer" />

      </div>
    </article>
  );
}
