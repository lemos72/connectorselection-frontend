import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCategories,
  getCategoryBySlug,
  getArticlesByCategorySlug,
} from '../../../lib/strapi';
import { blocksToPlainText } from '../../../components/BlocksRenderer';
import ArticleCard from '../../../components/ArticleCard';
import LeadMagnetForm from '../../../components/LeadMagnetForm';
import { RFI_FIELD_CONFIGS } from '../../../lib/rfiFieldConfigs';

// Keep in sync with the same constant in the article page template.
// NOTE: as of Aug 2026, www.connectorselection.com does not resolve —
// confirmed broken, not just missing content. Using the bare domain.
const SITE_URL = 'https://connectorselection.com';

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch (e) {
    console.warn('[build] generateStaticParams (categories) failed:', e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug).catch(() => null);
  if (!cat) return { title: 'Category not found' };

  const categoryName = cat.Name || cat.name;

  // Article count feeds the auto-generated description below, and makes
  // it feel concrete/specific rather than generic boilerplate.
  const articles = await getArticlesByCategorySlug(slug).catch(() => []);
  const count = articles.length;

  // If a category has custom seo_title/seo_description set in Strapi,
  // prefer those. Otherwise, auto-generate a solid default from the
  // category name + article count — no per-category upkeep required.
  const autoTitle = `${categoryName}: Engineering Guides & Selection Resources`;
  const autoDescription = count > 0
    ? `Explore ${count} engineering guide${count === 1 ? '' : 's'} on ${categoryName.toLowerCase()} — selection criteria, comparisons, and design considerations for hardware engineers.`
    : `Engineering guides and selection resources on ${categoryName.toLowerCase()} for hardware engineers.`;

  const title = cat.seo_title || autoTitle;
  const description = cat.seo_description || autoDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/categories/${cat.slug}/`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug).catch(() => null);
  if (!cat) notFound();

  const [articles, allCategories] = await Promise.all([
    getArticlesByCategorySlug(slug).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const categoryName = cat.Name || cat.name;
  const otherCategories = allCategories.filter((c) => c.slug !== slug);

  // ---- Breadcrumb structured data (schema.org BreadcrumbList) ----
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
        item: `${SITE_URL}/categories/${cat.slug}/`,
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
            <span>{categoryName}</span>
          </nav>
          <span className="cs-eyebrow">Category</span>
          <h1>{categoryName}</h1>
          {cat.description && <p>{blocksToPlainText(cat.description, 260)}</p>}
        </div>
      </section>

      {slug === 'fpc-ffc-connectors' && (
        <section className="cs-section">
          <div className="cs-container">
            <LeadMagnetForm />
          </div>
        </section>
      )}

      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-section-head">
            <h2>Articles</h2>
            <span className="cs-eyebrow-muted">
              {articles.length} {articles.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          {articles.length > 0 ? (
            <div className="cs-grid">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <div className="cs-empty">
              No articles in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* RFI (Request for Information) pilot — a compact CTA linking to a
          dedicated /request-info/[slug]/ page, rather than the full form
          embedded here. Only renders on categories with a spec-field
          config defined in lib/rfiFieldConfigs.js (currently
          fpc-ffc-connectors and high-speed-connectors-signal-integrity).
          Adding a third pilot category later is a config-only change —
          no edit needed here or in the request-info page template. */}
      {RFI_FIELD_CONFIGS[slug] && (
        <section className="cs-section cs-rfi-cta">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Need Pricing or Availability for {categoryName}?</h2>
              <p>
                Share your requirements and I&apos;ll personally follow up
                with pricing and availability info — no obligation.
              </p>
            </div>
            <Link href={`/request-info/${slug}/`} className="cs-btn">
              Request Info &amp; Pricing →
            </Link>
          </div>
        </section>
      )}

      {otherCategories.length > 0 && (
        <section className="cs-section cs-related">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Explore Other Categories</h2>
            </div>
            <div className="cs-cat-grid">
              {otherCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}/`}
                  className="cs-cat"
                >
                  <h3>{c.Name || c.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
