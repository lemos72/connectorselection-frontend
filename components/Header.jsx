import Link from 'next/link';
import { getCategories } from '../lib/strapi';
import NavCategoriesDropdown from './NavCategoriesDropdown';
import NavToolsDropdown from './NavToolsDropdown';
import NavSearch from './NavSearch';

export default async function Header() {
  const categories = await getCategories().catch(() => []);

  return (
    <header className="cs-header">
      <div className="cs-container cs-header-inner">
        <Link href="/" className="cs-brand" aria-label="connectorselection.com home" prefetch={false}>
          <span className="cs-brand-mark">
            connector<b>selection</b>
          </span>
          <span className="cs-brand-sub">Interconnect Knowledge Base</span>
        </Link>

        <nav className="cs-nav" aria-label="Primary">
          <Link href="/articles/" prefetch={false}>Articles</Link>
          <NavCategoriesDropdown categories={categories} />
          <Link href="/blog/" prefetch={false}>Blog</Link>
          <Link href="/news/" prefetch={false}>News</Link>
          <NavToolsDropdown />
          <Link href="/ask-the-engineer/" prefetch={false}>Ask</Link>
          <Link href="/products/" prefetch={false}>Products</Link>
        </nav>

        <div className="cs-header-actions">
          <NavSearch />
          <Link href="/contact/" className="cs-btn cs-btn-sm cs-header-cta" prefetch={false}>
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}