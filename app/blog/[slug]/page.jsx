import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getBlogPosts,
  getBlogPostBySlug,
  imageFrom,
} from '../../../lib/strapi';
import BlocksRenderer, {
  blocksToPlainText,
} from '../../../components/BlocksRenderer';
import NewsletterSignup from '../../../components/NewsletterSignup';

const HUB_CALLOUTS = {
  'ai-server-architecture-explained-where-connectors-are-used': {
    href: '/hubs/ai-data-center-interconnects/',
    label: 'Explore the AI/Data Center Interconnects Hub',
    description: 'CXL, GPU interconnects, and AI server architecture — the full guide to data center connector design.',
  },
  'why-ai-infrastructure-needs-better-connectors': {
    href: '/hubs/ai-data-center-interconnects/',
    label: 'Explore the AI/Data Center Interconnects Hub',
    description: 'CXL, GPU interconnects, and AI server architecture — the full guide to data center connector design.',
  },
};


export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.warn('[build] generateStaticParams (blog) failed:', e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.seo_title || post.title,
    description:
      post.seo_description || post.excerpt || blocksToPlainText(post.content, 155),
  };
}

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d)
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase();
  } catch {
    return '';
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const cover = imageFrom(post.cover_image, 'large');
  const category = post.category;
  const author = post.author;
  const date = fmtDate(post.published_date || post.publishedAt);
  const hubCallout = HUB_CALLOUTS[post.slug];

  return (
    <article className="cs-article">
      <div className="cs-container">
        <div className="cs-article-header">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog/">Blog</Link>
          </nav>
          <h1>{post.title}</h1>
          <div className="cs-article-meta">
            {(category?.Name || category?.name) && (
              <span>{category.Name || category.name}</span>
            )}
            {author?.name && <span>By {author.name}</span>}
            {date && <span>{date}</span>}
          </div>
        </div>

        {cover?.url && (
          <div className="cs-article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.url} alt={cover.alt || post.title} />
          </div>
        )}

        <div className="cs-article-body">
          <BlocksRenderer content={post.content} />
        </div>

        {hubCallout && (
          <div className="cs-tool-callout">
            <p>{hubCallout.description}</p>
            <Link href={hubCallout.href} className="cs-btn">
              {hubCallout.label} →
            </Link>
          </div>
        )}

        <NewsletterSignup source="blog-footer" />
      </div>
    </article>
  );
}
