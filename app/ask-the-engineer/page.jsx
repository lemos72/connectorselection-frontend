import { getQuestions } from '../../lib/strapi';
import AskEngineerForm from '../../components/AskEngineerForm';
import QuestionCard from '../../components/QuestionCard';

export const metadata = {
  title: 'Ask the Engineer',
  description:
    'Submit a real connector, cable, or interconnect engineering question and get a curated, published answer.',
};

export default async function AskTheEngineerPage() {
  const questions = await getQuestions().catch(() => []);

  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Ask the Engineer</span>
          <h1>Ask the Engineer</h1>
          <p>
            Have a specific connector, cable, or interconnect design question?
            Ask it below. I read every submission personally — answered
            questions get published here for anyone with the same question.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-ask-engineer-form-wrap">
          <AskEngineerForm />
        </div>
      </section>

      {questions.length > 0 && (
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-section-head">
              <h2>Recently Answered</h2>
            </div>
            <div className="cs-grid">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
