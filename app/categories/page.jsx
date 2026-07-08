import Link from 'next/link';
import { getCategories } from '../../lib/strapi';
import { blocksToPlainText } from '../../components/BlocksRenderer';

export const metadata = {
  title: 'Categories',
  description: 'Browse connector knowledge by application category.',
};

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (e) {
    console.warn('[build] fetch failed:', e.message);
    return fallback;
  }
}

export default async function CategoriesPage() {
  const categories = await safe(getCategories, []);

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Index</span>
          <h1>Categories</h1>
          <p>Browse the knowledge base by connector type and application area.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {categories.length > 0 ? (
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
                  {cat.description && (
                    <p>{blocksToPlainText(cat.description, 160)}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="cs-empty">No categories published yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
