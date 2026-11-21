import Link from 'next/link';
import { getHubPages } from '../../lib/strapi';
import HubIllustration from '../../components/HubIllustration';

const SITE_URL = 'https://connectorselection.com';

export const metadata = {
  title: 'Interconnect Topic Hubs — Curated Guides by Application',
  description:
    "Curated collections of this site's deepest coverage, organized by application area — FFC/FPC connector selection, OCP server interconnects, PCIe & CEM slot connectors, and AI/GPU data center interconnect.",
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

// Keep each card to a short teaser: clamp the description to three lines.
const CLAMP = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

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
            Curated guides organized by application, each with the key articles,
            products and tools for that topic.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {hubs.length > 0 ? (
            <div
              className="cs-grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                background: 'transparent',
                border: 'none',
              }}
            >
              {hubs.map((hub) => (
                <Link
                  key={hub.id || hub.slug}
                  href={`/hubs/${hub.slug}/`}
                  className="cs-card"
                  prefetch={false}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{
                      height: 120,
                      background: 'var(--paper, #f6f4ee)',
                      borderBottom: '1px solid var(--line, #d9dee4)',
                    }}
                  >
                    <HubIllustration slug={hub.slug} />
                  </div>
                  <div
                    className="cs-card-body"
                    style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                  >
                    {hub.eyebrow && <span className="cs-eyebrow">{hub.eyebrow}</span>}
                    <h2>{hub.title}</h2>
                    {hub.intro_paragraph && <p style={CLAMP}>{hub.intro_paragraph}</p>}
                    <div className="cs-card-foot" style={{ marginTop: 'auto' }}>
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
