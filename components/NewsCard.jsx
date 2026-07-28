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

export default function NewsCard({ item }) {
  if (!item) return null;
  const date = fmtDate(item.publishedAt_source || item.fetchedAt);

  return (
    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="cs-card">
      <div className="cs-card-body">
        <div className="cs-card-eyebrow">
          <span className="cs-eyebrow">{item.category || 'General'}</span>
        </div>
        <h3>{item.title}</h3>
        {item.summary && <p>{item.summary}</p>}
        <div className="cs-card-foot">
          <span>{item.sourceName}{date ? ` · ${date}` : ''}</span>
          <span>Read more →</span>
        </div>
      </div>
    </a>
  );
}