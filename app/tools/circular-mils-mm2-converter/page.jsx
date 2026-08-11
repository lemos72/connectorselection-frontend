import CmilConverter from '../../../components/CmilConverter';

export const metadata = {
  title: 'Circular Mils to mm² Converter',
  description:
    'Convert between circular mils (CM) and square millimeters (mm²) for wire cross-sectional area calculations.',
};

export default function CmilConverterPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Circular Mils to mm² Converter</h1>
          <p>Convert wire cross-sectional area between circular mils and square millimeters.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <CmilConverter />
        </div>
      </section>
    </>
  );
}