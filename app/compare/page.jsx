import Link from 'next/link';
import { getComparisons } from '../../lib/strapi';

const SITE_URL = 'https://www.connectorselection.com';

export const metadata = {
  title: 'Connector Comparison Guides — Side-by-Side Technical Breakdowns',
  description:
    'Side-by-side connector comparisons for hardware engineers — FPC vs FFC, FAKRA vs Mini-FAKRA, ZIF vs Non-ZIF, PCIe generations, and more.',
  alternates: {
    canonical: `${SITE_URL}/compare/`,
  },
};

export default async function ComparePage() {
  const comparisons = await getComparisons();

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Compare</span>
          <h1>Connector Comparison Guides</h1>
          <p>
            Side-by-side technical breakdowns to help engineers choose between
            connector types, standards, and interface options.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {comparisons.length === 0 ? (
            <p>No comparisons published yet.</p>
          ) : (
            <div className="cs-article-grid">
              {comparisons.map((comparison) => (
                <Link
                  key={comparison.id}
                  href={`/compare/${comparison.slug}/`}
                  className="cs-article-card"
                  prefetch={false}
                >
                  <div className="cs-article-card__body">
                    <span className="cs-eyebrow">
                      {comparison.connector_a} vs {comparison.connector_b}
                    </span>
                    <h2 className="cs-article-card__title">{comparison.title}</h2>
                    {comparison.verdict && (
                      <p className="cs-article-card__excerpt">{comparison.verdict}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
