'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const TOOLS = [
  { href: '/tools/voltage-drop-calculator/', name: 'Voltage Drop Calculator' },
  { href: '/tools/awg-mm2-converter/', name: 'AWG to mm² Converter' },
  { href: '/tools/circular-mils-mm2-converter/', name: 'Circular Mils to mm² Converter' },
  { href: '/tools/wire-weight-calculator/', name: 'Wire Weight Calculator' },
  { href: '/tools/power-dissipation-calculator/', name: 'Power Dissipation Calculator' },
{ href: '/tools/skin-effect-calculator/', name: 'Skin Effect Calculator' },
  { href: '/tools/ohms-law-calculator/', name: "Ohm's Law Calculator" },
];

export default function NavToolsDropdown() {
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
        Tools
        <span className="cs-nav-dropdown-arrow" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="cs-nav-dropdown-menu" role="menu">
          <Link
            href="/tools/"
            className="cs-nav-dropdown-item cs-nav-dropdown-all"
            role="menuitem"
            onClick={() => setOpen(false)}
            prefetch={false}
          >
            All Tools
          </Link>
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="cs-nav-dropdown-item"
              role="menuitem"
              onClick={() => setOpen(false)}
              prefetch={false}
            >
              {tool.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}