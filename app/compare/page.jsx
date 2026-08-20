import { getComparisons } from '../../lib/strapi';
import ComparisonCard from '../../components/ComparisonCard';

export const metadata = {
  title: 'Connector Comparison Guides — Side-by-Side Technical Breakdowns',
  description:
    'Side-by-side connector comparisons for hardware engineers — FPC vs FFC, FAKRA vs Mini-FAKRA, ZIF vs Non-ZIF, PCIe generations, and more.',
};

async function safe(fn, fallback) {
  try { return await fn(); }
  catch (e) { console.warn('[build] fetch failed:', e.message); return fallback; }
}

export default async function ComparePage() {
  const comparisons = await safe(getComparisons, []);

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
          {comparisons.length > 0 ? (
            <div className="cs-grid">
              {comparisons.map((c) => (
                <ComparisonCard key={c.id} comparison={c} />
              ))}
            </div>
          ) : (
            <div className="cs-empty">
              No comparisons published yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
