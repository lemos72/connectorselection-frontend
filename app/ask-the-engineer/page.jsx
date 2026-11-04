import { getQuestions } from '../../lib/strapi';
import AskEngineerForm from '../../components/AskEngineerForm';
import QuestionCard from '../../components/QuestionCard';

export const metadata = {
  title: 'Ask the Engineer',
  description:
    'Submit a real connector, cable, or interconnect engineering question and get a curated, published answer.',
};

const catName = (q) =>
  (q && q.category && (q.category.Name || q.category.name || q.category.title)) || '';

const css = `
.cs-ask-hero{display:grid;grid-template-columns:1.15fr .85fr;gap:36px;align-items:start}
.cs-ask-actions{display:flex;flex-wrap:wrap;gap:12px;margin:22px 0 4px}
.cs-ask-btn{display:inline-block;padding:12px 20px;border-radius:4px;font-weight:700;font-size:15px;text-decoration:none;border:2px solid #12355b}
.cs-ask-btn.primary{background:#12355b;color:#fff}
.cs-ask-btn.ghost{background:transparent;color:#12355b}
.cs-ask-stats{display:flex;flex-wrap:wrap;gap:26px;margin-top:26px}
.cs-ask-stat b{display:block;font-size:28px;line-height:1.1;color:#12355b}
.cs-ask-stat span{font-size:13px;color:#5b6b80}
.cs-ask-panel{background:#fff;border:1px solid #dfe5ee;border-radius:8px;padding:20px 22px}
.cs-ask-panel h2{font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:#c2571a;margin:0 0 12px}
.cs-ask-list{list-style:none;margin:0;padding:0}
.cs-ask-list li{border-top:1px solid #e8edf4}
.cs-ask-list li:first-child{border-top:0}
.cs-ask-list a{display:flex;gap:10px;justify-content:space-between;align-items:baseline;padding:11px 0;color:#12355b;text-decoration:none;font-weight:600;font-size:15px;line-height:1.35}
.cs-ask-list a:hover{color:#c2571a}
.cs-ask-list small{display:block;font-weight:400;color:#6b7a90;font-size:12px;letter-spacing:.04em;text-transform:uppercase;margin-top:2px}
.cs-ask-more{display:inline-block;margin-top:10px;font-weight:700;font-size:14px;color:#12355b}
.cs-ask-topics{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.cs-ask-topics span{border:1px solid #c9d3e0;border-radius:999px;padding:4px 12px;font-size:13px;color:#12355b;background:#fff}
.cs-ask-next{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.cs-ask-next a{display:block;background:#fff;border:1px solid #dfe5ee;border-radius:8px;padding:18px 20px;text-decoration:none;color:#1a2433}
.cs-ask-next a:hover{border-color:#12355b}
.cs-ask-next svg{width:40px;height:40px;margin-bottom:8px}
.cs-ask-next b{display:block;color:#12355b;font-size:16px;margin-bottom:4px}
.cs-ask-next span{font-size:14px;line-height:1.5;color:#4a5a70}
@media (max-width:860px){.cs-ask-hero{grid-template-columns:1fr}.cs-ask-next{grid-template-columns:1fr}}
`;

export default async function AskTheEngineerPage() {
  const questions = await getQuestions().catch(() => []);
  const total = questions.length;
  const latest = questions.slice(0, 6);
  const topics = [];
  questions.forEach((q) => {
    const n = catName(q);
    if (n && !topics.includes(n)) topics.push(n);
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section className="cs-band">
        <div className="cs-container cs-ask-hero">
          <div>
            <span className="cs-eyebrow">Ask the Engineer</span>
            <h1>Ask the Engineer</h1>
            <p>
              Have a specific connector, cable, or interconnect design question?
              Ask it below. I read every submission personally — answered
              questions get published here for anyone with the same question.
            </p>
            {total > 0 && (
              <p>
                <strong>Your question may already be answered.</strong> Browse{' '}
                {total} answers on connector selection, signal integrity, FPC/FFC,
                cable and power before you write yours.
              </p>
            )}
            <div className="cs-ask-actions">
              {total > 0 && (
                <a className="cs-ask-btn primary" href="#answers">
                  Browse answered questions ↓
                </a>
              )}
              <a className="cs-ask-btn ghost" href="#ask">
                Ask your own question
              </a>
            </div>
            {total > 0 && (
              <div className="cs-ask-stats">
                <div className="cs-ask-stat">
                  <b>{total}</b>
                  <span>published answers</span>
                </div>
                {topics.length > 0 && (
                  <div className="cs-ask-stat">
                    <b>{topics.length}</b>
                    <span>topic areas</span>
                  </div>
                )}
                <div className="cs-ask-stat">
                  <b>Free</b>
                  <span>every answer, no signup</span>
                </div>
              </div>
            )}
            {topics.length > 0 && (
              <div className="cs-ask-topics" aria-label="Topics covered">
                {topics.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}
          </div>

          {latest.length > 0 && (
            <aside className="cs-ask-panel" aria-label="Newest answers">
              <h2>Newest answers</h2>
              <ul className="cs-ask-list">
                {latest.map((q) => (
                  <li key={q.id}>
                    <a href={`/ask-the-engineer/${q.slug}/`}>
                      <span>
                        {q.answer_title || q.question_text}
                        {catName(q) && <small>{catName(q)}</small>}
                      </span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="cs-ask-more" href="#answers">
                See all {total} answers ↓
              </a>
            </aside>
          )}
        </div>
      </section>

      <section className="cs-section" id="ask">
        <div className="cs-container cs-ask-engineer-form-wrap">
          <AskEngineerForm />
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-section-head">
            <h2>More ways to get an answer fast</h2>
          </div>
          <div className="cs-ask-next">
            <a href="/tools/">
              <svg viewBox="0 0 40 40" fill="none" stroke="#12355b" strokeWidth="2" aria-hidden="true">
                <rect x="6" y="5" width="28" height="30" rx="3" />
                <rect x="10" y="9" width="20" height="7" fill="#c2571a" stroke="none" />
                <circle cx="13" cy="23" r="1.6" fill="#12355b" stroke="none" />
                <circle cx="20" cy="23" r="1.6" fill="#12355b" stroke="none" />
                <circle cx="27" cy="23" r="1.6" fill="#12355b" stroke="none" />
                <circle cx="13" cy="29" r="1.6" fill="#12355b" stroke="none" />
                <circle cx="20" cy="29" r="1.6" fill="#12355b" stroke="none" />
                <circle cx="27" cy="29" r="1.6" fill="#12355b" stroke="none" />
              </svg>
              <b>Engineering calculators</b>
              <span>Voltage drop, AWG conversion, derating and more. Free, and you can email yourself the result.</span>
            </a>
            <a href="/articles/">
              <svg viewBox="0 0 40 40" fill="none" stroke="#12355b" strokeWidth="2" aria-hidden="true">
                <path d="M8 6h18l6 6v22H8z" />
                <path d="M26 6v6h6" />
                <path d="M13 19h14M13 24h14M13 29h9" stroke="#c2571a" />
              </svg>
              <b>Engineering guides</b>
              <span>In-depth articles on connectors, cables, OCP, PCIe and automotive interconnects.</span>
            </a>
            <a href="/compare/">
              <svg viewBox="0 0 40 40" fill="none" stroke="#12355b" strokeWidth="2" aria-hidden="true">
                <rect x="5" y="9" width="12" height="22" rx="2" />
                <rect x="23" y="9" width="12" height="22" rx="2" />
                <path d="M17 20h6" stroke="#c2571a" />
                <path d="M21 17l3 3-3 3" stroke="#c2571a" />
              </svg>
              <b>Connector comparisons</b>
              <span>Side-by-side looks at series from major makers, with the second-source risks.</span>
            </a>
          </div>
        </div>
      </section>

      {questions.length > 0 && (
        <section className="cs-section" id="answers">
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
