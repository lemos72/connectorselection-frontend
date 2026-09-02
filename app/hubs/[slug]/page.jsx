import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getHubPages,
  getHubBySlug,
  imageFrom,
} from '../../../lib/strapi';
import BlocksRenderer, {
  blocksToPlainText,
} from '../../../components/BlocksRenderer';
import ArticleCard from '../../../components/ArticleCard';
import NewsletterSignup from '../../../components/NewsletterSignup';

// Matches the bare-domain fix applied across the rest of the site
// (see the Aug 2026 www canonical URL fix — www.connectorselection.com
// does not resolve; connectorselection.com is the canonical, working domain).
const SITE_URL = 'https://connectorselection.com';

// The other two hubs in the cluster, used for the cross-link strip at the
// bottom of every hub page. Update this list as new hubs are added.
const ALL_HUBS = [
  { slug: 'ocp-server-interconnects', name: 'OCP Server Interconnects' },
  { slug: 'pcie-cem-connectors', name: 'PCIe & CEM Slot Connectors' },
  { slug: 'ai-data-center-interconnects', name: 'AI / GPU Data Center Interconnect' },
];

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (e) {
    console.warn('[build] fetch failed:', e.message);
    return fallback;
  }
}

export async function generateStaticParams() {
  try {
    const hubs = await getHubPages();
    return hubs.map((h) => ({ slug: h.slug }));
  } catch (e) {
    console.warn('[build] generateStaticParams (hub-pages) failed:', e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hub = await getHubBySlug(slug).catch(() => null);
  if (!hub) return { title: 'Hub not found' };
  return {
    title: hub.seo_title || hub.title,
    description:
      hub.seo_description ||
      blocksToPlainText(hub.concept_intro, 155) ||
      hub.intro_paragraph ||
      '',
    alternates: {
      canonical: `${SITE_URL}/hubs/${hub.slug}/`,
    },
  };
}

export default async function HubPage({ params }) {
  const { slug } = await params;
  const hub = await getHubBySlug(slug).catch(() => null);
  if (!hub) notFound();

  const relatedProducts = hub.related_products || [];
  const allRelatedArticles = hub.related_articles || [];
  // First related article gets the big featured treatment up top;
  // the rest fill out the standard Key Articles grid below.
  const featuredArticle = allRelatedArticles[0] || null;
  const remainingArticles = allRelatedArticles.slice(1);
  const toolLinks = hub.related_tool_links || [];
  const otherHubs = ALL_HUBS.filter((h) => h.slug !== slug);

  const featuredCover = featuredArticle
    ? imageFrom(featuredArticle.cover_image, 'large')
    : null;
  const featuredCategory =
    featuredArticle?.category?.Name || featuredArticle?.category?.name;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Topics', item: `${SITE_URL}/hubs/` },
      { '@type': 'ListItem', position: 3, name: hub.title, item: `${SITE_URL}/hubs/${hub.slug}/` },
    ],
  };

  // CollectionPage schema — signals to search engines this page aggregates
  // a curated set of resources on one topic, rather than being a single
  // standalone article. hasPart lists the key articles pulled into the hub.
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.seo_title || hub.title,
    description: hub.seo_description || hub.intro_paragraph || '',
    url: `${SITE_URL}/hubs/${hub.slug}/`,
    hasPart: allRelatedArticles.map((a) => ({
      '@type': 'Article',
      headline: a.title,
      url: `${SITE_URL}/articles/${a.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Hero */}
      <section className="cs-band">
        <div className="cs-container">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/hubs/">Topics</Link>
            <span>/</span>
            <span>{hub.title}</span>
          </nav>
          {hub.eyebrow && <span className="cs-eyebrow">{hub.eyebrow}</span>}
          <h1>{hub.title}</h1>
          {hub.intro_paragraph && <p>{hub.intro_paragraph}</p>}
        </div>
      </section>

      {/* Featured Article — two-column hero card (image left, text right).
          This is the visual hook for the page; its own dedicated article
          URL is untouched and keeps earning its own SEO/search equity
          independently. */}
      {featuredArticle && (
        <section className="cs-section">
          <div className="cs-container">
            <Link
              href={`/articles/${featuredArticle.slug}/`}
              className="cs-card cs-card-featured"
              prefetch={false}
            >
              {featuredCover?.url && (
                <div className="cs-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredCover.url}
                    alt={featuredCover.alt || featuredArticle.title}
                  />
                </div>
              )}
              <div className="cs-card-body">
                <div className="cs-card-eyebrow">
                  <span className="cs-eyebrow">{featuredCategory || 'Featured'}</span>
                </div>
                <h2>{featuredArticle.title}</h2>
                {featuredArticle.excerpt && <p>{featuredArticle.excerpt}</p>}
                <div className="cs-card-foot">
                  <span>Read →</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Key Articles — the rest of the curated set, in the standard grid.
          auto-fit (not auto-fill) so a partial row doesn't leave an empty
          phantom column showing the grid container's background color. */}
      {remainingArticles.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>More Key Articles</h2>
            </div>
            <div className="cs-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {remainingArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Concept Introduction */}
      {hub.concept_intro && (
        <section className="cs-section">
          <div className="cs-container cs-prose">
            <BlocksRenderer content={hub.concept_intro} />
          </div>
        </section>
      )}

      {/* Case Studies / Applications */}
      {hub.case_study_content && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Where This Shows Up</h2>
            </div>
            <div className="cs-prose">
              <BlocksRenderer content={hub.case_study_content} />
            </div>
          </div>
        </section>
      )}

      {/* Product Introduction — deliberately placed lower on the page;
          supporting context rather than a primary draw. */}
      {relatedProducts.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Related Products</h2>
            </div>
            <div
              className="cs-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.min(relatedProducts.length, 3)}, minmax(280px, 360px))`,
              }}
            >
              {relatedProducts.map((p) => {
                const cover = imageFrom(p.cover_image, 'medium');
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}/`}
                    className="cs-card"
                    prefetch={false}
                  >
                    {cover?.url && (
                      <div className="cs-card-media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cover.url} alt={cover.alt || p.product_name} />
                      </div>
                    )}
                    <div className="cs-card-body">
                      <h3>{p.product_name}</h3>
                      {p.short_description && <p>{p.short_description}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Relevant Tools */}
      {toolLinks.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Relevant Tools</h2>
            </div>
            <div className="cs-quicklink-grid">
              {toolLinks.map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  prefetch={false}
                  className="cs-quicklink-card cs-quicklink-tools"
                >
                  <span className="cs-quicklink-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div className="cs-quicklink-text">
                    <h3>{tool.label}</h3>
                    {tool.description && <p>{tool.description}</p>}
                  </div>
                  <span className="cs-quicklink-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cs-section">
        <div className="cs-container">
          <NewsletterSignup source={`hub-${hub.slug}`} />
        </div>
      </section>

      {/* Cross-links to other hubs in the cluster */}
      {otherHubs.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Related Interconnect Topics</h2>
            </div>
            <div className="cs-cat-grid">
              {otherHubs.map((h) => (
                <Link
                  key={h.slug}
                  href={`/hubs/${h.slug}/`}
                  className="cs-cat"
                  prefetch={false}
                >
                  <h3>{h.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
