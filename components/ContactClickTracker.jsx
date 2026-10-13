'use client';

import { useEffect } from 'react';

// Sends a GA4 event when someone clicks an email or phone link anywhere
// on the site. Safe if gtag hasn't loaded (ad blockers etc.): it just no-ops.
export default function ContactClickTracker() {
  useEffect(() => {
    function onClick(e) {
      const link = e.target.closest && e.target.closest('a[href^="mailto:"], a[href^="tel:"]');
      if (!link || typeof window.gtag !== 'function') return;
      const isEmail = link.getAttribute('href').startsWith('mailto:');
      window.gtag('event', isEmail ? 'contact_email_click' : 'contact_phone_click', {
        link_location: window.location.pathname,
      });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}