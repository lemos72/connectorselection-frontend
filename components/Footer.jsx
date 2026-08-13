import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="cs-footer">
      <div className="cs-container">
        <div className="cs-footer-inner">
          <div className="cs-footer-brand">
            <span className="cs-brand-mark">
              connector<b>selection</b>
            </span>
            <p>
              A technical resource for engineers selecting connectors and
              interconnect solutions across high-speed, board-to-board, EV, and
              signal-integrity applications.
            </p>
          </div>
          <div className="cs-footer-cols">
            <div className="cs-footer-col">
              <h5>Browse</h5>
              <Link href="/articles/" prefetch={false}>Articles</Link>
              <Link href="/categories/" prefetch={false}>Categories</Link>
              <Link href="/blog/" prefetch={false}>Blog</Link>
              <Link href="/products/" prefetch={false}>Products</Link>
              <Link href="/contact/" prefetch={false}>Contact</Link>
            </div>
            <div className="cs-footer-col">
              <h5>Resource</h5>
              <Link href="/" prefetch={false}>Home</Link>
              <Link href="/articles/" prefetch={false}>Knowledge Base</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="cs-footer-bottom">
        <div className="cs-container">
          © {year} connectorselection.com — Built for interconnect engineers.
        </div>
      </div>
    </footer>
  );
}