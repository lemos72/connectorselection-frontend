import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getArticles,
  getArticleBySlug,
  imageFrom,
} from '../../../lib/strapi';
import BlocksRenderer, {
  blocksToPlainText,
} from '../../../components/BlocksRenderer';

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

  return (
    <article className="cs-article">
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
      </div>
    </article>
  );
}
