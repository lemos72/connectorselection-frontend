import Link from 'next/link';

export const metadata = {
  title: 'Engineering Tools & Calculators',
  description:
    'Free interactive tools for connector and wire engineering — voltage drop, wire gauge conversion, power dissipation, and more.',
};

const TOOLS = [
  {
    href: '/tools/voltage-drop-calculator/',
    name: 'Voltage Drop Calculator',
    description: 'Calculate voltage drop for a wire run based on gauge, length, and current.',
  },
  {
    href: '/tools/awg-mm2-converter/',
    name: 'AWG to mm² Converter',
    description: 'Convert between American Wire Gauge and metric cross-sectional area.',
  },
  {
    href: '/tools/circular-mils-mm2-converter/',
    name: 'Circular Mils to mm² Converter',
    description: 'Convert wire cross-sectional area between circular mils and mm².',
  },
  {
    href: '/tools/wire-weight-calculator/',
    name: 'Wire Weight Calculator',
    description: 'Estimate wire weight by gauge, length, and conductor material.',
  },
  {
    href: '/tools/power-dissipation-calculator/',
    name: 'Power Dissipation Calculator',
    description: 'Calculate heat loss in a wire run using P = I²R.',
  },
{
  href: '/tools/skin-effect-calculator/',
  name: 'Skin Effect Calculator',
  description: 'Calculate skin depth for copper and aluminum conductors at any frequency.',
},
  {
    href: '/tools/ohms-law-calculator/',
    name: "Ohm's Law Calculator",
    description: 'Solve for voltage, current, or resistance given any two values.',
  },
];

export default function ToolsIndexPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Tools</span>
          <h1>Engineering Tools & Calculators</h1>
          <p>Free interactive tools for wire and connector engineering.</p>
<p>
  Looking for definitions instead? Check the{' '}
  <Link href="/glossary/">Connector & Cable Glossary</Link>.
</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-grid cs-tools-grid">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="cs-card cs-tool-card">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}