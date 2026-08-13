import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getArticles,
  getArticleBySlug,
  getArticlesByCategorySlug,
  getGlossaryTerms,
  matchGlossaryTerms,
  getRelatedArticlesByTermOverlap,
  imageFrom,
} from '../../../lib/strapi';
import BlocksRenderer, {
  blocksToPlainText,
} from '../../../components/BlocksRenderer';
import ArticleCard from '../../../components/ArticleCard';
import NewsletterSignup from '../../../components/NewsletterSignup';
import KeyTerms from '../../../components/KeyTerms';

// Articles where a relevant tool callout should appear. Add more slugs here
// as new tools ship and more articles become relevant.
const TOOL_CALLOUTS = {
  'wire-gauge-awg-explained-selecting-the-right-conductor-size': {
    href: '/tools/awg-mm2-converter/',
    label: 'Try the AWG to mm² Converter',
    description: 'Convert between AWG sizes and metric cross-sectional area.',
  },
  'what-is-a-wire-harness-complete-guide-for-engineers': {
    href: '/tools/wire-weight-calculator/',
    label: 'Try the Wire Weight Calculator',
    description: 'Estimate wire weight for your harness based on gauge, length, and material.',
  },
  'what-is-raw-cable-bulk-cable-vs-cable-assemblies-explained': {
    href: '/tools/wire-weight-calculator/',
    label: 'Try the Wire Weight Calculator',
    description: 'Estimate wire weight based on gauge, length, and material.',
  },
  'connector-current-voltage-ratings-explained': {
    href: '/tools/voltage-drop-calculator/',
    label: 'Try the Voltage Drop Calculator',
    description: 'Calculate voltage drop for your specific wire gauge, length, and current.',
  },
  'cable-temperature-ratings-current-derating-voltage-drop': {
    href: '/tools/voltage-drop-calculator/',
    label: 'Try the Voltage Drop Calculator',
    description: 'Calculate voltage drop for your specific wire gauge, length, and current.',
  },
  'wire-harness-management-testing-validation': {
    href: '/tools/wire-weight-calculator/',
    label: 'Try the Wire Weight Calculator',
    description: 'Estimate wire weight for your harness based on gauge, length, and material.',
  },
  'connector-current-rating-explained-engineering-guide': {
    href: '/tools/voltage-drop-calculator/',
    label: 'Try the Voltage Drop Calculator',
    description: 'Calculate voltage drop for your specific wire gauge, length, and current.',
  },
  'high-current-wire-to-wire-connections-power': {
    href: '/tools/power-dissipation-calculator/',
    label: 'Try the Power Dissipation Calculator',
    description: 'Calculate heat loss in your wire run using P = I²R.',
  },
  'high-current-wire-to-board-connectors-power': {
    href: '/tools/voltage-drop-calculator/',
    label: 'Try the Voltage Drop Calculator',
    description: 'Calculate voltage drop for your specific wire gauge, length, and current.',
  },
  'connector-contact-resistance-explained-design-guide': {
    href: '/tools/ohms-law-calculator/',
    label: "Try the Ohm's Law Calculator",
    description: 'Solve for voltage, current, or resistance given any two values.',
  },
  'electrical-connector-basics': {
    href: '/tools/ohms-law-calculator/',
    label: "Try the Ohm's Law Calculator",
    description: 'Solve for voltage, current, or resistance given any two values.',
  },
  'custom-cable-harness-manufacturing-design-considerations': {
    href: '/tools/wire-weight-calculator/',
    label: 'Try the Wire Weight Calculator',
    description: 'Estimate wire weight for your harness based on gauge, length, and material.',
  },
};

// Update if the canonical (indexed) domain form differs, e.g. non-www.
const SITE_URL = 'https://www.connectorselection.com';

// Static export needs the full list of slugs to pre-render at build time.
export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((a) => ({ slug: a.slug }));
  } catch (e) {
    console.warn('[build] generateStaticParams (articles) failed:', e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) return { title: 'Article not found' };
  return {
    title: article.seo_title || article.title,
    description:
      article.seo_description ||
      article.excerpt ||
      blocksToPlainText(article.content, 155),
    alternates: {
      canonical: `${SITE_URL}/articles/${article.slug}/`,
    },
  };
}

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase();
  } catch {
    return '';
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);
  if (!article) notFound();

  const cover = imageFrom(article.cover_image, 'large');
  const category = article.category;
  const author = article.author;
  const date = fmtDate(article.published_date || article.publishedAt);
  const toolCallout = TOOL_CALLOUTS[article.slug];

  // ---- Key Terms (auto-matched glossary terms mentioned in this article) ----
  const allGlossaryTerms = await getGlossaryTerms().catch(() => []);
  const matchedTerms = matchGlossaryTerms(article.content, allGlossaryTerms);

  // ---- Related Articles: term-overlap first, same-category as fallback ----
  let relatedArticles = await getRelatedArticlesByTermOverlap(article.slug, 4).catch(() => []);

  if (relatedArticles.length === 0 && category?.slug) {
    relatedArticles = (await getArticlesByCategorySlug(category.slug).catch(() => []))
      .filter((a) => a.slug !== article.slug)
      .slice(0, 4);
  }

  // ---- Breadcrumb structured data (schema.org BreadcrumbList) ----
  const breadcrumbItems = [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Articles', url: `${SITE_URL}/articles/` },
  ];
  if (category?.slug) {
    breadcrumbItems.push({
      name: category.Name || category.name,
      url: `${SITE_URL}/categories/${category.slug}/`,
    });
  }
  breadcrumbItems.push({
    name: article.title,
    url: `${SITE_URL}/articles/${article.slug}/`,
  });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: cover?.url ? [cover.url] : undefined,
    author: {
      '@type': 'Person',
      name: author?.name || 'Connector Selection Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Connector Selection',
    },
    datePublished: article.published_date || article.publishedAt,
    dateModified: article.updatedAt || article.published_date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${article.slug}/`,
    },
  };

  return (
    <article className="cs-article">
      {/* Structured data: helps Google understand site hierarchy and can
          surface breadcrumb rich results in search. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="cs-container">
        <div className="cs-article-header">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/articles/">Articles</Link>
            {category && (
              <>
                <span>/</span>
                <Link href={`/categories/${category.slug}/`}>
                  {category.Name || category.name}
                </Link>
              </>
            )}
          </nav>

          <h1>{article.title}</h1>

          <div className="cs-article-meta">
            {(category?.Name || category?.name) && (
              <span>{category.Name || category.name}</span>
            )}
            {author?.name && <span>By {author.name}</span>}
            {date && <span>{date}</span>}
          </div>
        </div>

        {cover?.url && (
          <div className="cs-article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.url} alt={cover.alt || article.title} />
          </div>
        )}

        <div className="cs-article-body">
          <BlocksRenderer content={article.content} />

          {author && (author.bio || author.name) && (
            <div className="cs-author">
              <div>
                <div className="cs-author-label">Author</div>
                <h4>{author.name}</h4>
                {author.bio && (
                  <BlocksRenderer content={author.bio} />
                )}
              </div>
            </div>
          )}
        </div>

        <KeyTerms terms={matchedTerms} />

        {toolCallout && (
          <div className="cs-tool-callout">
            <p>{toolCallout.description}</p>
            <Link href={toolCallout.href} className="cs-btn">
              {toolCallout.label} →
            </Link>
          </div>
        )}

        <NewsletterSignup source="article-footer" />

        {relatedArticles.length > 0 && (
          <section className="cs-section cs-related">
            <div className="cs-section-head">
              <h2>Related Articles</h2>
              {category?.slug && (
                <Link href={`/categories/${category.slug}/`}>
                  More in {category.Name || category.name} →
                </Link>
              )}
            </div>
            <div className="cs-grid">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}