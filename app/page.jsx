import Link from 'next/link';
import { getArticles, getCategories } from '../lib/strapi';
import ArticleCard from '../components/ArticleCard';

// Re-fetch at build; safe defaults if the API is unreachable so the build
// doesn't hard-fail during early setup.
async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (e) {
    console.warn('[build] fetch failed:', e.message);
    return fallback;
  }
}

export default async function HomePage() {
  const articles = await safe(getArticles, []);
  const categories = await safe(getCategories, []);
  const featured = articles.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="cs-hero">
        <div className="cs-container">
          <div className="cs-hero-eyebrow cs-eyebrow">
            Interconnect Knowledge Base
          </div>
          <h1>Select the right connector with confidence.</h1>
          <p>
            Practical, engineer-written guidance on connector technologies,
            signal integrity, and interconnect design — for high-speed,
            board-to-board, EV, and data-center applications.
          </p>
          <div className="cs-hero-actions">
            <Link href="/articles/" className="cs-btn">
              Browse Articles
            </Link>
            <Link href="/categories/" className="cs-btn cs-btn-ghost">
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Categories</h2>
              <Link href="/categories/">All categories →</Link>
            </div>
            <div className="cs-cat-grid">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}/`}
                  className="cs-cat"
                >
                  <span className="cs-cat-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{cat.Name || cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent articles */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-section-head">
            <h2>Latest Articles</h2>
            <Link href="/articles/">All articles →</Link>
          </div>
          {featured.length > 0 ? (
            <div className="cs-grid">
              {featured.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <div className="cs-empty">
              No published articles yet. Publish content in Strapi, then rebuild.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
