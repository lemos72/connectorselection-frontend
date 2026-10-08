import Link from 'next/link';
import {
  getArticles,
  getCategories,
  getTopStories,
  getNewsItems,
  getHubPages,
  getHubBySlug,
} from '../lib/strapi';
import { imageSet } from '../lib/images';
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

// Strapi v5 entries carry a documentId; fall back to id.
const keyOf = (x) => x?.documentId ?? x?.id;

export default async function HomePage() {
  const articles = await safe(getArticles, []);
  const categories = await safe(getCategories, []);
  const topStories = await safe(() => getTopStories(4), []);
  const newsItemsRaw = await safe(getNewsItems, []);
  const newsItems = newsItemsRaw.slice(0, 6);
  const featured = articles.slice(0, 6);
  const hubs = await safe(getHubPages, []);

  // ---------------------------------------------------------------------------
  // Pictures for the hero and the topic rows. They reuse cover images that are
  // already in Strapi (nothing new to upload) and are picked from articles that
  // are NOT already shown in Top Stories / Latest Articles, so the same photo
  // never appears twice on the page.
  // ---------------------------------------------------------------------------
  const shown = new Set([
    ...topStories.filter((s) => s._type === 'article').map(keyOf),
    ...featured.map(keyOf),
  ]);

  const heroArticles = articles
    .filter((a) => a.cover_image && !shown.has(keyOf(a)))
    .slice(0, 3);
  heroArticles.forEach((a) => shown.add(keyOf(a)));
  const heroPics = heroArticles
    .map((a, i) => imageSet(a.cover_image, i === 0 ? 'large' : 'medium'))
    .filter(Boolean);

  // Each topic hub borrows the cover image of one of its related articles.
  const hubDetails = await Promise.all(
    hubs.map((hub) => safe(() => getHubBySlug(hub.slug), null))
  );
  const hubPics = hubDetails.map((detail) => {
    const withImage = (detail?.related_articles || []).filter((a) => a.cover_image);
    const pick = withImage.find((a) => !shown.has(keyOf(a))) || withImage[0];
    if (pick) shown.add(keyOf(pick));
    return pick ? imageSet(pick.cover_image, 'small') : null;
  });

  return (
    <div className="cs-hp">
      {/* Hero — text on the left, photo mosaic on the right. The photos are
          decorative (alt=""), so they add no new text for search engines.
          The first photo is the largest thing above the fold, so it loads
          eagerly with high priority; the other two load lazily. */}
      <section className="cs-hp-hero">
        <div
          className={`cs-container cs-hp-hero-inner${
            heroPics.length ? '' : ' cs-hp-hero-solo'
          }`}
        >
          <div className="cs-hp-hero-copy">
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
              <Link href="/categories/" className="cs-btn" prefetch={false}>
                Explore Categories
              </Link>
              <Link href="/contact/" className="cs-btn cs-btn-ghost" prefetch={false}>
                Contact Us
              </Link>
            </div>
          </div>

          {heroPics.length > 0 && (
            <div
              className={`cs-hp-mosaic cs-hp-mosaic-${heroPics.length}`}
              aria-hidden="true"
            >
              {heroPics.map((pic, i) => (
                <div className="cs-hp-mosaic-tile" key={pic.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pic.src}
                    srcSet={pic.srcSet}
                    sizes={
                      i === 0
                        ? '(max-width: 900px) 60vw, 560px'
                        : '(max-width: 900px) 40vw, 320px'
                    }
                    width={pic.width}
                    height={pic.height}
                    alt=""
                    decoding="async"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Stories — first story is the large lead, the rest sit beside it.
          Layout is done entirely in CSS (.cs-hp-top in globals.css). */}
      {topStories.length > 0 && (
        <section className="cs-section cs-home-top-band cs-hp-top">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Top Stories</h2>
            </div>
            <div className="cs-grid">
              {topStories.map((item) => (
                <TopStoryCard key={`${item._type}-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore by Topic — promotes hub pages. Each row shows a photo (from a
          related article), the hub title, and its full intro paragraph. */}
      {hubs.length > 0 && (
        <section className="cs-section cs-hp-topics">
          <div className="cs-container">
            <div className="cs-section-head">
              <span className="cs-eyebrow">Deep Dives</span>
              <h2>Explore by Topic</h2>
            </div>
            <div className="cs-hp-hubs">
              {hubs.map((hub, i) => {
                const pic = hubPics[i];
                return (
                  <Link
                    key={hub.id}
                    href={`/hubs/${hub.slug}/`}
                    prefetch={false}
                    className={`cs-hp-hub${pic ? '' : ' cs-hp-hub-nopic'}`}
                  >
                    {pic && (
                      <span className="cs-hp-hub-media" aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pic.src}
                          srcSet={pic.srcSet}
                          sizes="(max-width: 760px) 100vw, 260px"
                          width={pic.width}
                          height={pic.height}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    )}
                    <div className="cs-hp-hub-text">
                      <h3>{hub.title}</h3>
                      {hub.intro_paragraph && <p>{hub.intro_paragraph}</p>}
                    </div>
                    <span className="cs-hp-hub-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Industry News — card-based, own full-width section */}
      <section className="cs-section cs-home-news-band cs-hp-news">
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

      {/* Quick links: Tools + Glossary — unchanged, still above Categories. */}
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

      {/* Categories */}
      {categories.length > 0 && (
        <section className="cs-section cs-hp-cats">
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
      <section className="cs-section cs-hp-latest">
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
    </div>
  );
}
