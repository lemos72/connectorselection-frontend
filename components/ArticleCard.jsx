import Link from 'next/link';
import { imageFrom } from '../lib/strapi';

function fmtDate(d) {
  if (!d) return '';
  try {
    const date = new Date(d);
    return date
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

export default function ArticleCard({ article, basePath = '/articles', prefetch = false }) {
  if (!article) return null;
  const img = imageFrom(article.cover_image, 'small');
  const category = article.category?.Name || article.category?.name;
  const date = fmtDate(article.published_date || article.publishedAt);

  return (
    <Link href={`${basePath}/${article.slug}/`} className="cs-card" prefetch={prefetch}>
      {img?.url && (
        <div className="cs-card-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.url} alt={img.alt || article.title} loading="lazy" />
        </div>
      )}
      <div className="cs-card-body">
        <div className="cs-card-eyebrow">
          <span className="cs-eyebrow">{category || 'Article'}</span>
        </div>
        <h3>{article.title}</h3>
        {article.excerpt && <p>{article.excerpt}</p>}
        <div className="cs-card-foot">
          {date && <span>{date}</span>}
          <span>Read →</span>
        </div>
      </div>
    </Link>
  );
}
