import Link from 'next/link';
import {
  getArticles,
  getCategories,
  getTopStories,
  getNewsItems,
} from '../lib/strapi';
import ArticleCard from '../components/ArticleCard';
import TopStoryCard from '../components/TopStoryCard';

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
  const topStories = await safe(() => getTopStories(2), []);
  const newsItemsRaw = await safe(getNewsItems, []);
  const newsItems = newsItemsRaw.slice(0, 5);
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
            <Link href="/categories/" className="cs-btn cs-btn-ghost">
              Explore Categories
            </Link>
            <Link href="/contact/" className="cs-btn">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Top Stories + News — front and center, directly below the hero */}
      {(topStories.length > 0 || newsItems.length > 0) && (
        <section className="cs-section cs-home-top-band">
          <div className="cs-container">
            <div className="cs-home-top-grid">
              {/* Top Stories */}
              <div className="cs-home-top-stories">
                <div className="cs-section-head">
                  <h2>Top Stories</h2>
                </div>
                {topStories.length > 0 ? (
                  <div className="cs-grid">
                    {topStories.map((item) => (
                      <TopStoryCard key={`${item._type}-${item.id}`} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="cs-empty">
                    No stories marked as featured yet. Toggle `featured` on an
                    Article or Blog Post in Strapi to show it here.
                  </div>
                )}
              </div>

              {/* News */}
              <div className="cs-home-news">
                <div className="cs-section-head">
                  <h2>News</h2>
                  <Link href="/news/">All news →</Link>
                </div>
                {newsItems.length > 0 ? (
                  <ul className="cs-home-news-list">
                    {newsItems.map((n) => (
                      <li key={n.id} className="cs-home-news-item">
                        <a
                          href={n.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="cs-home-news-title">{n.title}</span>
                          <span className="cs-home-news-meta">
                            {n.sourceName}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="cs-empty">
                    No news items yet. The RSS fetch job populates this
                    automatically every 6 hours.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

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
