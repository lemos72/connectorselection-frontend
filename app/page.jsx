import Link from 'next/link';
import {
  getArticles,
  getCategories,
  getTopStories,
  getNewsItems,
} from '../lib/strapi';
import ArticleCard from '../components/ArticleCard';
import TopStoryCard from '../components/TopStoryCard';
import NewsCard from '../components/NewsCard';

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
  const newsItems = newsItemsRaw.slice(0, 6);
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
            <Link href="/categories/" className="cs-btn cs-btn-ghost" prefetch={false}>
              Explore Categories
            </Link>
            <Link href="/contact/" className="cs-btn" prefetch={false}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links: Tools + Glossary */}
      <section className="cs-section cs-home-quicklinks">
        <div className="cs-container">
          <div className="cs-quicklink-grid">
            <Link href="/tools/" prefetch={false} className="cs-quicklink-card cs-quicklink-tools">
              <span className="cs-quicklink-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className="cs-quicklink-text">
                <h3>Engineering Tools</h3>
                <p>Voltage drop, AWG conversion, and 4 more calculators built for connector selection.</p>
              </div>
              <span className="cs-quicklink-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <Link href="/glossary/" prefetch={false} className="cs-quicklink-card cs-quicklink-glossary">
              <span className="cs-quicklink-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17.5H6.5A2.5 2.5 0 0 0 4 22V4.5z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 7h7M9 10.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </span>
              <div className="cs-quicklink-text">
                <h3>Connector &amp; Cable Glossary</h3>
                <p>70+ terms defined in plain language, from A-to-Z.</p>
              </div>
              <span className="cs-quicklink-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Stories — own full-width section. NOTE: the cs-home-top-stories
          wrapper below is required — .cs-home-top-stories .cs-grid in
          globals.css overrides the generic auto-fill grid with a fixed
          2-column layout. Without this wrapper, a 2-item grid in a
          full-width section leaves an empty 3rd auto-fill column showing
          the grid container's background color as a blank box. */}
      {topStories.length > 0 && (
        <section className="cs-section cs-home-top-band">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Top Stories</h2>
            </div>
            <div className="cs-home-top-stories">
              <div className="cs-grid">
                {topStories.map((item) => (
                  <TopStoryCard key={`${item._type}-${item.id}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Industry News — bigger, card-based, own full-width section */}
      <section className="cs-section cs-home-news-band">
        <div className="cs-container">
          <div className="cs-section-head">
            <span className="cs-eyebrow">Industry Updates</span>
            <h2>Latest Industry News</h2>
            <Link href="/news/" prefetch={false}>All news →</Link>
          </div>
          {newsItems.length > 0 ? (
            <div className="cs-grid">
              {newsItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="cs-empty">
              No news items yet. The RSS fetch job populates this
              automatically every 6 hours.
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Categories</h2>
              <Link href="/categories/" prefetch={false}>All categories →</Link>
            </div>
            <div className="cs-cat-grid">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}/`}
                  className="cs-cat"
                  prefetch={false}
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
            <Link href="/articles/" prefetch={false}>All articles →</Link>
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
