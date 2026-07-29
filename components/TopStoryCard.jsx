import Link from 'next/link';
import { imageFrom } from '../lib/strapi';

// Renders a curated "Top Story" — works for both Articles and Blog Post
// items since they share the same field shape (title, excerpt, category,
// cover_image, slug) but live at different URL paths.
export default function TopStoryCard({ item }) {
  if (!item) return null;

  const href =
    item._type === 'blogPost' ? `/blog/${item.slug}/` : `/articles/${item.slug}/`;

  const img = imageFrom(item.cover_image);
  const categoryName = item.category?.Name || item.category?.name;

  return (
    <Link href={href} className="cs-card cs-top-story-card">
      {img?.url && (
        <div className="cs-card-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt || item.title}
            width={img.width || undefined}
            height={img.height || undefined}
          />
        </div>
      )}
      <div className="cs-card-body">
        {categoryName && <span className="cs-eyebrow">{categoryName}</span>}
        <h3>{item.title}</h3>
        {item.excerpt && <p>{item.excerpt}</p>}
      </div>
    </Link>
  );
}
