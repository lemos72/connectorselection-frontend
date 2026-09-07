import Link from 'next/link';

function truncate(text, max = 140) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

// Card for a single answered question, used on the /ask-the-engineer/
// listing page. Follows the same cs-card visual pattern as ArticleCard and
// the tool cards on /tools/ (cs-card + a type-specific modifier class).
export default function QuestionCard({ question }) {
  const name = question.asker_name?.trim() || 'Anonymous';
  const category = question.category;

  return (
    <Link
      href={`/ask-the-engineer/${question.slug}/`}
      className="cs-card cs-question-card"
    >
      <h3>{question.answer_title}</h3>
      <p className="cs-question-excerpt">
        &ldquo;{truncate(question.question_text)}&rdquo;
      </p>
      <div className="cs-question-meta">
        <span>Asked by {name}</span>
        {(category?.Name || category?.name) && (
          <span>{category.Name || category.name}</span>
        )}
      </div>
    </Link>
  );
}
