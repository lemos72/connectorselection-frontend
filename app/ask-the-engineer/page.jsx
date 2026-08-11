import AskEngineerForm from '../../components/AskEngineerForm';

export const metadata = {
  title: 'Ask the Engineer',
  description:
    'Got a connector or interconnect question? Ask below.',
};

export default function AskEngineerPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Community</span>
          <h1>Ask the Engineer</h1>
          <p>
            Got a specific question about connector selection, signal
            integrity, or interconnect design? Ask below — I read every
            submission personally, and the best ones get featured here as
            full answers.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <AskEngineerForm />
        </div>
      </section>
    </>
  );
}