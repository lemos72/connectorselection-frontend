import Link from 'next/link';

export default function RelatedArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="cs-related-articles">
      <h3>Related Articles</h3>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/articles/${article.slug}/`}>
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}