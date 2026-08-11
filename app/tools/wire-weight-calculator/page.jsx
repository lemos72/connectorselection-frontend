import WireWeightCalculator from '../../../components/WireWeightCalculator';

export const metadata = {
  title: 'Wire Weight Calculator — Estimate Cable Weight by Gauge & Length',
  description:
    'Estimate the weight of copper or aluminum wire based on AWG gauge and length. Useful for shipping, cost, and cable harness planning.',
};

export default function WireWeightCalculatorPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Wire Weight Calculator</h1>
          <p>Estimate wire weight based on gauge, length, and conductor material.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <WireWeightCalculator />
        </div>
      </section>
    </>
  );
}