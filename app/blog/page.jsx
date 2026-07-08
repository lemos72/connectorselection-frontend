import { getBlogPosts } from '../../lib/strapi';
import ArticleCard from '../../components/ArticleCard';

export const metadata = {
  title: 'Blog',
  description: 'Industry commentary and updates on connectors and interconnect trends.',
};

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (e) {
    console.warn('[build] fetch failed:', e.message);
    return fallback;
  }
}

export default async function BlogPage() {
  const posts = await safe(getBlogPosts, []);

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Journal</span>
          <h1>Blog</h1>
          <p>Commentary, industry trends, and updates from the interconnect world.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {posts.length > 0 ? (
            <div className="cs-grid">
              {posts.map((p) => (
                <ArticleCard key={p.id} article={p} basePath="/blog" />
              ))}
            </div>
          ) : (
            <div className="cs-empty">No blog posts published yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
