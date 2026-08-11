import AwgConverter from '../../../components/AwgConverter';

export const metadata = {
  title: 'AWG to mm² Converter — Wire Gauge Conversion Tool',
  description:
    'Convert between American Wire Gauge (AWG) and cross-sectional area in mm². Free tool for engineers working across US and metric wire specifications.',
};

export default function AwgConverterPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>AWG to mm² Converter</h1>
          <p>Convert between American Wire Gauge sizes and metric cross-sectional area.</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <AwgConverter />
        </div>
      </section>
    </>
  );
}