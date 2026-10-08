import Link from 'next/link';
import { getHubPages } from '../../lib/strapi';

const SITE_URL = 'https://connectorselection.com';

export const metadata = {
  title: 'Interconnect Topic Hubs — Curated Guides by Application',
  description:
    "Curated collections of this site's deepest coverage, organized by application area — OCP server interconnects, PCIe & CEM slot connectors, and AI/GPU data center interconnect.",
  alternates: {
    canonical: `${SITE_URL}/hubs/`,
  },
};

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (e) {
    console.warn('[build] fetch failed:', e.message);
    return fallback;
  }
}

export default async function HubsIndexPage() {
  const hubs = await safe(getHubPages, []);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Topics', item: `${SITE_URL}/hubs/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Topics</span>
          <h1>Interconnect Topic Hubs</h1>
          <p>
            Curated collections of the site&rsquo;s deepest coverage, organized by application
            area rather than connector type &mdash; each one pulls together the key articles,
            products, and tools relevant to that topic.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {hubs.length > 0 ? (
            <div className="cs-grid">
              {hubs.map((hub) => (
                <Link
                  key={hub.id || hub.slug}
                  href={`/hubs/${hub.slug}/`}
                  className="cs-card"
                  prefetch={false}
                >
                  <div className="cs-card-body">
                    {hub.eyebrow && <span className="cs-eyebrow">{hub.eyebrow}</span>}
                    <h2>{hub.title}</h2>
                    {hub.intro_paragraph && <p>{hub.intro_paragraph}</p>}
                    <div className="cs-card-foot">
                      <span>Explore →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="cs-empty">No topic hubs published yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
