import Link from 'next/link';

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d)
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase();
  } catch { return ''; }
}

export default function ComparisonCard({ comparison, prefetch = false }) {
  if (!comparison) return null;
  const category = comparison.category?.Name || comparison.category?.name;
  const date = fmtDate(comparison.published_date || comparison.publishedAt);
  const eyebrow = (comparison.connector_a && comparison.connector_b)
    ? `${comparison.connector_a} vs ${comparison.connector_b}`
    : category || 'Compare';

  return (
    <Link href={`/compare/${comparison.slug}/`} className="cs-card" prefetch={prefetch}>
      <div className="cs-card-body">
        <div className="cs-card-eyebrow">
          <span className="cs-eyebrow">{eyebrow}</span>
        </div>
        <h3>{comparison.title}</h3>
        {comparison.verdict && <p>{comparison.verdict.slice(0, 120)}{comparison.verdict.length > 120 ? '…' : ''}</p>}
        <div className="cs-card-foot">
          {date && <span>{date}</span>}
          <span>Read →</span>
        </div>
      </div>
    </Link>
  );
}
