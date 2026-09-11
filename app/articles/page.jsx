import { getArticles } from '../../lib/strapi';
import ArticleCard from '../../components/ArticleCard';

export const metadata = {
  title: 'Connector & Interconnect Engineering Articles',
  description:
    'Technical articles on connector selection, high-speed signal integrity, automotive and EV interconnects, FPC/FFC, and cable harness design — written for hardware engineers.',
};

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (e) {
    console.warn('[build] fetch failed:', e.message);
    return fallback;
  }
}

export default async function ArticlesPage() {
  const articles = await safe(getArticles, []);

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Knowledge Base</span>
          <h1>Articles</h1>
          <p>
            In-depth guidance on connector technologies, selection criteria, and
            interconnect design for demanding electronic systems.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {articles.length > 0 ? (
            <div className="cs-grid">
              {articles.map((a) => (
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
