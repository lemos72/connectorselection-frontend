import OhmsLawCalculator from '../../../components/OhmsLawCalculator';

export const metadata = {
  title: "Ohm's Law Calculator — Solve for Voltage, Current, or Resistance",
  description:
    "Calculate voltage, current, or resistance using Ohm's Law (V = I × R). Enter any two values to solve for the third.",
};

export default function OhmsLawCalculatorPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Ohm&apos;s Law Calculator</h1>
          <p>Enter any two values to solve for the third.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <OhmsLawCalculator />
        </div>
      </section>
    </>
  );
}