import Link from 'next/link';

export default function Header() {
  return (
    <header className="cs-header">
      <div className="cs-container cs-header-inner">
        <Link href="/" className="cs-brand" aria-label="connectorselection.com home">
          <span className="cs-brand-mark">
            connector<b>selection</b>
          </span>
          <span className="cs-brand-sub">Interconnect Knowledge Base</span>
        </Link>
        <nav className="cs-nav" aria-label="Primary">
          <Link href="/articles/">Articles</Link>
          <Link href="/categories/">Categories</Link>
          <Link href="/blog/">Blog</Link>
          <Link href="/products/">Products</Link>
        </nav>
      </div>
    </header>
  );
}
