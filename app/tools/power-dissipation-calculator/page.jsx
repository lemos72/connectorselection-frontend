import PowerDissipationCalculator from '../../../components/PowerDissipationCalculator';

export const metadata = {
  title: 'Power Dissipation Calculator — Wire Heat Loss (P = I²R)',
  description:
    'Calculate power dissipated as heat in a copper wire run based on gauge, current, and length using P = I²R.',
};

export default function PowerDissipationCalculatorPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Power Dissipation Calculator</h1>
          <p>Calculate heat loss in a wire run based on gauge, current, and length.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <PowerDissipationCalculator />
        </div>
      </section>
    </>
  );
}