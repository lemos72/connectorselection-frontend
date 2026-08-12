import Link from 'next/link';

export default function KeyTerms({ terms }) {
  if (!terms || terms.length === 0) return null;

  return (
    <div className="cs-key-terms">
      <h3>Key Terms in This Article</h3>
      <div className="cs-key-terms-list">
        {terms.map((t) => (
          <Link key={t.slug} href={`/glossary/#${t.slug}`} className="cs-key-term-chip">
            {t.term}
          </Link>
        ))}
      </div>
    </div>
  );
}