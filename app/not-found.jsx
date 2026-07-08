import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="cs-section">
      <div className="cs-container">
        <div style={{ maxWidth: 620, margin: '48px auto', textAlign: 'center' }}>
          <div className="cs-eyebrow" style={{ marginBottom: 16 }}>
            Error 404
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 40,
              color: 'var(--blueprint)',
              margin: '0 0 16px',
            }}
          >
            Page not found
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Link href="/" className="cs-btn">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
