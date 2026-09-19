import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProductIntroductions,
  getProductIntroBySlug,
  imageFrom,
} from '../../../lib/strapi';
import BlocksRenderer, {
  blocksToPlainText,
} from '../../../components/BlocksRenderer';
import NewsletterSignup from '../../../components/NewsletterSignup';

const HUB_CALLOUTS = {
  'cxl-connectors-explained-for-ai-systems': {
    href: '/hubs/ai-data-center-interconnects/',
    label: 'Explore the AI/Data Center Interconnects Hub',
    description: 'CXL, GPU interconnects, and AI server architecture — the full guide to data center connector design.',
  },
};


export async function generateStaticParams() {
  try {
    const products = await getProductIntroductions();
    return products.map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.warn('[build] generateStaticParams (products) failed:', e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProductIntroBySlug(slug).catch(() => null);
  if (!p) return { title: 'Product not found' };
  return {
    title: p.seo_title || p.product_name,
    description:
      p.seo_description ||
      p.short_description ||
      blocksToPlainText(p.content, 155),
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProductIntroBySlug(slug).catch(() => null);
  if (!p) notFound();

  const cover = imageFrom(p.cover_image, 'large');
  const category = p.category;
  const hubCallout = HUB_CALLOUTS[p.slug];

  return (
    <article className="cs-article">
      <div className="cs-container">
        <div className="cs-article-header">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products/">Products</Link>
          </nav>
          <h1>{p.product_name}</h1>
          <div className="cs-article-meta">
            {(category?.Name || category?.name) && (
              <span>{category.Name || category.name}</span>
            )}
            {p.short_description && <span>{p.short_description}</span>}
          </div>
        </div>

        {cover?.url && (
          <div className="cs-article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.url} alt={cover.alt || p.product_name} />
          </div>
        )}

        <div className="cs-article-body">
          <BlocksRenderer content={p.content} />
        </div>

        {hubCallout && (
          <div className="cs-tool-callout">
            <p>{hubCallout.description}</p>
            <Link href={hubCallout.href} className="cs-btn">
              {hubCallout.label} →
            </Link>
          </div>
        )}

        <NewsletterSignup source="product-footer" />
      </div>
    </article>
  );
}
