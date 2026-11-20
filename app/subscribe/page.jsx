import Link from 'next/link';
import NewsletterSignup from '../../components/NewsletterSignup';

const SITE_URL = 'https://connectorselection.com';

// Landing page for email invitations. Kept out of search results on purpose:
// its only job is to receive readers who were invited directly.
export const metadata = {
  title: 'Subscribe to the Weekly Connector & Cable Briefing',
  description:
    'A short weekly briefing on connectors and cables: industry news plus new engineering guides. Free, and you can unsubscribe at any time.',
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/subscribe/`,
    title: 'Subscribe to the Weekly Connector & Cable Briefing',
    description:
      'A short weekly briefing on connectors and cables: industry news plus new engineering guides. Free, and you can unsubscribe at any time.',
  },
  twitter: {
    card: 'summary',
    title: 'Subscribe to the Weekly Connector & Cable Briefing',
    description:
      'A short weekly briefing on connectors and cables: industry news plus new engineering guides.',
  },
};

const BENEFITS = [
  {
    tag: 'NEWS',
    title: 'Connector and cable news',
    text: 'The week in interconnects, from data center racks to automotive, without the noise.',
  },
  {
    tag: 'GUIDES',
    title: 'New engineering guides',
    text: 'Practical write-ups on selection, specs and design trade-offs, as soon as they are published.',
  },
  {
    tag: 'TOOLS',
    title: 'Free calculators',
    text: 'Quick tools for derating, voltage drop, rack power, coolant flow and more, announced as they ship.',
  },
];

const START = [
  { href: '/tools/', label: 'Engineering tools & calculators' },
  { href: '/articles/', label: 'All articles' },
];

const ROWS = [0, 1, 2, 3, 4, 5];

function ConnectorArt() {
  return (
    <svg
      viewBox="0 0 420 260"
      role="img"
      aria-label="Illustration of a connector with pins and signal traces"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <pattern id="sub-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" style={{ stroke: 'var(--grid)' }} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="420" height="260" fill="url(#sub-grid)" />

      {/* signal traces from the right-hand pin column */}
      {ROWS.map((i) => {
        const y = 80 + i * 24;
        const ty = 52 + i * 31;
        return (
          <g key={`t${i}`}>
            <path
              d={`M125 ${y} H200 L228 ${ty} H384`}
              fill="none"
              style={{ stroke: 'var(--copper)' }}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="384" cy={ty} r="4.5" style={{ fill: 'var(--card)', stroke: 'var(--copper)' }} strokeWidth="2" />
          </g>
        );
      })}

      {/* stubs from the left-hand pin column */}
      {ROWS.map((i) => (
        <path
          key={`s${i}`}
          d={`M75 ${80 + i * 24} H18`}
          style={{ stroke: 'var(--line-strong)' }}
          strokeWidth="2"
          fill="none"
        />
      ))}

      {/* connector housing */}
      <rect
        x="48"
        y="52"
        width="104"
        height="176"
        rx="8"
        style={{ fill: 'var(--card)', stroke: 'var(--blueprint)' }}
        strokeWidth="2.5"
      />
      <rect x="60" y="64" width="80" height="152" rx="4" style={{ fill: 'var(--paper)', stroke: 'var(--line)' }} strokeWidth="1" />

      {/* pins */}
      {ROWS.map((i) => (
        <g key={`p${i}`}>
          <circle cx="75" cy={80 + i * 24} r="6" style={{ fill: 'var(--blueprint)' }} />
          <circle cx="125" cy={80 + i * 24} r="6" style={{ fill: 'var(--copper)' }} />
        </g>
      ))}

      <text x="48" y="246" style={{ fill: 'var(--muted)', fontFamily: 'var(--font-mono)' }} fontSize="11">
        12 POSITIONS · 2 ROWS
      </text>
    </svg>
  );
}

export default function SubscribePage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Newsletter</span>
          <h1>The Weekly Connector &amp; Cable Briefing</h1>
          <p>
            One short email a week: connector and cable news, new engineering
            guides and free tools. Free to join, and you can unsubscribe at any time.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <NewsletterSignup source="invite-email" />
            </div>
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderTop: '3px solid var(--copper)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <ConnectorArt />
            </div>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <h2 style={{ color: 'var(--blueprint)', marginBottom: '20px' }}>What you get</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {BENEFITS.map((b) => (
              <div
                key={b.tag}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderLeft: '4px solid var(--copper)',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    color: 'var(--copper)',
                  }}
                >
                  {b.tag}
                </span>
                <h3 style={{ margin: '8px 0', color: 'var(--ink)' }}>{b.title}</h3>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <h2 style={{ color: 'var(--blueprint)', marginBottom: '12px' }}>Want a look first?</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>
            Start with a few of the most useful places on the site.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {START.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: 'var(--card)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '999px',
                  color: 'var(--blueprint)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {s.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
