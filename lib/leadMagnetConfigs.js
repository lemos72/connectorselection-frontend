// Central config for gated PDF lead magnets. To wire up a new guide:
// 1. Add an entry here, keyed by the category slug it should appear on.
// 2. List the source-article slugs it should replace the standard
//    NewsletterSignup with in app/articles/[slug]/page.jsx.
// No other changes needed in either page template — same philosophy as
// RFI_FIELD_CONFIGS in lib/rfiFieldConfigs.js.
export const LEAD_MAGNET_CONFIGS = {
  'fpc-ffc-connectors': {
    pdfUrl:
      'https://connectorselection.com/downloads/fpc-ffc-connector-selection-guide.pdf',
    source: 'fpc_ffc_guide',
    title: 'Get the FPC & FFC Connector Selection Guide',
    description:
      'A free 8-page PDF covering pitch selection, ZIF vs. Non-ZIF, and flex circuit design rules — straight to your inbox.',
    articleSlugs: [
      'ffc-vs-fpc-cables-key-differences-costs-and-selection-guide',
      'fpc-connector-selection-guide-for-engineers',
      'fpc-connector-pitch-explained-03mm-04mm-05mm-comparison',
      'zif-vs-non-zif-fpc-ffc-mechanics',
      'how-to-design-reliable-fpc-cable-connections',
    ],
  },
  'automotive-connectors': {
    pdfUrl:
      'https://connectorselection.com/downloads/automotive-connector-selection-guide.pdf',
    source: 'automotive_guide',
    title: 'Get the Automotive Connector Selection Guide',
    description:
      'A free PDF covering USCAR-2/ISO 20653 standards, FAKRA vs. Mini-FAKRA, high-voltage EV connectors and HVIL, and environmental sealing for ADAS sensors — straight to your inbox.',
    articleSlugs: [
      'automotive-connector-standards-a-beginners-guide',
      'mini-fakra-vs-fakra-whats-the-difference',
      'hvil-connector-design-high-voltage-interlock-loop-ev-battery',
      'high-voltage-ev-connectors-explained',
      'environmental-sealing-ip-ratings-external-adas-sensors',
    ],
  },
};