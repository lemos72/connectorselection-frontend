import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCategories,
  getCategoryBySlug,
  getArticlesByCategorySlug,
} from '../../../lib/strapi';
import { blocksToPlainText } from '../../../components/BlocksRenderer';
import ArticleCard from '../../../components/ArticleCard';

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
  return {
    title: cat.Name || cat.name,
    description: blocksToPlainText(cat.description, 155),
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug).catch(() => null);
  if (!cat) notFound();

  const articles = await getArticlesByCategorySlug(slug).catch(() => []);

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/categories/">Categories</Link>
          </nav>
          <span className="cs-eyebrow">Category</span>
          <h1>{cat.Name || cat.name}</h1>
          {cat.description && <p>{blocksToPlainText(cat.description, 260)}</p>}
        </div>
      </section>

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
    </>
  );
}
