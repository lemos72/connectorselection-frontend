import { getArticles, getBlogPosts, getProductIntroductions } from '../../lib/strapi';

// Pre-rendered to a static file at build time (static export) — no server
// needed at runtime. The frontend fetches this as a plain JSON file.
export const dynamic = 'force-static';

export async function GET() {
  const [articles, blogPosts, productIntros] = await Promise.all([
    getArticles().catch(() => []),
    getBlogPosts().catch(() => []),
    getProductIntroductions().catch(() => []),
  ]);

  const index = [
    ...articles.map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      slug: a.slug,
      type: 'article',
    })),
    ...blogPosts.map((b) => ({
      title: b.title,
      excerpt: b.excerpt,
      slug: b.slug,
      type: 'blogPost',
    })),
    ...productIntros.map((pi) => ({
      title: pi.product_name,
      excerpt: pi.short_description,
      slug: pi.slug,
      type: 'productIntro',
    })),
  ];

  return Response.json(index);
}
