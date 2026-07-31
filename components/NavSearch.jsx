'use client';

import { useState, useRef, useEffect } from 'react';

const TYPE_PATHS = {
  article: '/articles/',
  blogPost: '/blog/',
  productIntro: '/products/',
};

export default function NavSearch() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(null);
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

  async function ensureIndexLoaded() {
    if (index === null) {
      try {
        const res = await fetch('/search-index.json');
        const data = await res.json();
        setIndex(data);
      } catch (e) {
        setIndex([]);
      }
    }
  }

  const q = query.trim().toLowerCase();
  const results =
    index && q.length > 1
      ? index
          .filter((item) => {
            const haystack = `${item.title || ''} ${item.excerpt || ''}`.toLowerCase();
            return haystack.includes(q);
          })
          .slice(0, 8)
      : [];

  return (
    <div className="cs-nav-search" ref={wrapRef}>
      <input
        type="text"
        className="cs-nav-search-input"
        placeholder="Search articles…"
        value={query}
        onFocus={() => {
          ensureIndexLoaded();
          setOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        aria-label="Search site content"
      />
      {open && q.length > 1 && (
        <div className="cs-nav-search-results" role="listbox">
          {results.length > 0 ? (
            results.map((item) => (
              <a
                key={`${item.type}-${item.slug}`}
                href={`${TYPE_PATHS[item.type]}${item.slug}/`}
                className="cs-nav-search-result"
              >
                <span className="cs-nav-search-result-title">{item.title}</span>
              </a>
            ))
          ) : (
            <div className="cs-nav-search-empty">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
}
