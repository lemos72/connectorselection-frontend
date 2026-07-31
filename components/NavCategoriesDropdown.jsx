'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function NavCategoriesDropdown({ categories }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="cs-nav-dropdown" ref={wrapRef}>
      <button
        type="button"
        className="cs-nav-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Categories
        <span className="cs-nav-dropdown-arrow" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="cs-nav-dropdown-menu" role="menu">
          <Link
            href="/categories/"
            className="cs-nav-dropdown-item cs-nav-dropdown-all"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}/`}
              className="cs-nav-dropdown-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {cat.Name || cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
