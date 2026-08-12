import Link from 'next/link';
import { getGlossaryTerms } from '../../lib/strapi';

export const metadata = {
  title: 'Connector & Cable Glossary',
  description:
    'Quick definitions for connector, cable, and interconnect terminology — from AWG to ZIF.',
};

function groupByLetter(terms) {
  const groups = {};
  for (const t of terms) {
    const letter = t.term.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(t);
  }
  return groups;
}

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms().catch(() => []);
  const grouped = groupByLetter(terms);
  const letters = Object.keys(grouped).sort();

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Reference</span>
          <h1>Connector & Cable Glossary</h1>
          <p>Quick definitions for connector, cable, and interconnect terminology.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <nav className="cs-glossary-jumpnav" aria-label="Jump to letter">
            {letters.map((letter) => (
              <a key={letter} href={`#letter-${letter}`}>
                {letter}
              </a>
            ))}
          </nav>

          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="cs-glossary-group">
              <h2>{letter}</h2>
              {grouped[letter].map((t) => (
                <div key={t.id} className="cs-glossary-term">
                  <h3>{t.term}</h3>
                  <p>{t.short_definition}</p>
                  {t.related_article_slug && (
                    <Link href={`/articles/${t.related_article_slug}/`}>
                      {t.link_label || 'Read full guide →'}
                    </Link>
                  )}
                  {!t.related_article_slug && t.external_href && (
                    <Link href={t.external_href}>
                      {t.link_label || 'Learn more →'}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}