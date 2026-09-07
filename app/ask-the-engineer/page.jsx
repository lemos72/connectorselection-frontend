import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getQuestions,
  getQuestionBySlug,
  getArticlesByCategorySlug,
} from '../../../lib/strapi';
import BlocksRenderer, {
  blocksToPlainText,
} from '../../../components/BlocksRenderer';
import ArticleCard from '../../../components/ArticleCard';
import NewsletterSignup from '../../../components/NewsletterSignup';

// Update if the canonical (indexed) domain form differs, e.g. non-www —
// keep this in sync with the same constant in app/articles/[slug]/page.jsx.
const SITE_URL = 'https://www.connectorselection.com';

export async function generateStaticParams() {
  try {
    const questions = await getQuestions();
    return questions.map((q) => ({ slug: q.slug }));
  } catch (e) {
    console.warn('[build] generateStaticParams (questions) failed:', e.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const question = await getQuestionBySlug(slug).catch(() => null);
  if (!question) return { title: 'Question not found' };
  return {
    title: question.seo_title || question.answer_title,
    description:
      question.seo_description ||
      blocksToPlainText(question.answer_content, 155),
    alternates: {
      canonical: `${SITE_URL}/ask-the-engineer/${question.slug}/`,
    },
  };
}

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d)
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

export default async function QuestionPage({ params }) {
  const { slug } = await params;
  const question = await getQuestionBySlug(slug).catch(() => null);
  if (!question) notFound();

  const category = question.category;
  const askerName = question.asker_name?.trim() || 'Anonymous';
  const date = fmtDate(question.answered_date);

  // Related content: same-category Articles, same fallback pattern as the
  // Article page (connector-fundamentals if the category has nothing yet).
  let relatedArticles = [];
  if (category?.slug) {
    relatedArticles = (
      await getArticlesByCategorySlug(category.slug).catch(() => [])
    ).slice(0, 4);
  }
  if (relatedArticles.length === 0) {
    relatedArticles = (
      await getArticlesByCategorySlug('connector-fundamentals').catch(() => [])
    ).slice(0, 4);
  }

  const breadcrumbItems = [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Ask the Engineer', url: `${SITE_URL}/ask-the-engineer/` },
    {
      name: question.answer_title,
      url: `${SITE_URL}/ask-the-engineer/${question.slug}/`,
    },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  // QAPage: Schema.org's dedicated type for a single question with a
  // curated answer (distinct from, and not deprecated like, FAQPage/HowTo).
  const qaPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.answer_title,
      text: question.question_text,
      answerCount: 1,
      author: {
        '@type': 'Person',
        name: askerName,
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: blocksToPlainText(question.answer_content, 5000),
        author: {
          '@type': 'Person',
          name: 'Connector Selection Team',
        },
      },
    },
  };

  return (
    <article className="cs-article cs-question-page">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaPageJsonLd) }}
      />

      <div className="cs-container">
        <div className="cs-article-header">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/ask-the-engineer/">Ask the Engineer</Link>
          </nav>

          <h1>{question.answer_title}</h1>

          <div className="cs-article-meta">
            {(category?.Name || category?.name) && (
              <span>{category.Name || category.name}</span>
            )}
            {date && <span>{date}</span>}
          </div>
        </div>

        <blockquote className="cs-question-quote">
          <p>{question.question_text}</p>
          <cite>— {askerName}</cite>
        </blockquote>

        <div className="cs-article-body">
          <BlocksRenderer content={question.answer_content} />
        </div>

        <NewsletterSignup source="ask-the-engineer-footer" />

        {relatedArticles.length > 0 && (
          <section className="cs-section cs-related">
            <div className="cs-section-head">
              <h2>Related Articles</h2>
            </div>
            <div className="cs-grid">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
