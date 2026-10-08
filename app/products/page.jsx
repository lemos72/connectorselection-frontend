import Link from 'next/link';
import { getProductIntroductions, imageFrom } from '../../lib/strapi';

export const metadata = {
  title: "Connector Products: FPC/FFC, FAKRA, CXL & High-Speed Interconnect Guides",
  description: "Browse connector product guides covering FPC/FFC, FAKRA and HSD automotive RF, CXL for AI systems, and overmolded cable assemblies — specs, applications, and selection guidance for each.",
};

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (e) {
    console.warn('[build] fetch failed:', e.message);
    return fallback;
  }
}

export default async function ProductsPage() {
  const products = await safe(getProductIntroductions, []);

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Catalog</span>
          <h1>Product Introductions</h1>
          <p>Featured connector products and interconnect solutions.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          {products.length > 0 ? (
            <div className="cs-grid">
              {products.map((p) => {
                const img = imageFrom(p.cover_image, 'small');
                const category = p.category?.Name || p.category?.name;
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}/`}
                    className="cs-card"
                  >
                    {img?.url && (
                      <div className="cs-card-media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.alt || p.product_name}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="cs-card-body">
                      <div className="cs-card-eyebrow">
                        <span className="cs-eyebrow">
                          {category || 'Product'}
                        </span>
                      </div>
                      <h3>{p.product_name}</h3>
                      {p.short_description && <p>{p.short_description}</p>}
                      <div className="cs-card-foot">
                        <span>View →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="cs-empty">No products published yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
