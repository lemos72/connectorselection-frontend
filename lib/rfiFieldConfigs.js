// Per-category field configuration for the RFI (Request for Information) form.
// Only categories with an entry here get the RFI form rendered on their
// category page — see app/categories/[slug]/page.jsx.
//
// Keys MUST match real Strapi category slugs (confirmed Sept 2026):
//   - fpc-ffc-connectors
//   - high-speed-connectors-signal-integrity (covers PCIe/CEM content —
//     there is no standalone "pcie-cem-connectors" category)

export const RFI_FIELD_CONFIGS = {
  'fpc-ffc-connectors': {
    label: 'FPC/FFC Connector RFI',
    // Short, controlled display name for CTA copy and page headings —
    // deliberately NOT the Strapi category's Name/seo_title field, which
    // is a long SEO-oriented string ("FPC & FFC Connectors: Guides,
    // Comparisons & Selection Tools") that reads badly mid-sentence.
    shortLabel: 'FPC/FFC Connectors',
    fields: [
      {
        name: 'pitch',
        label: 'Pitch (mm)',
        type: 'select',
        options: ['0.3', '0.4', '0.5', '1.0', 'Other'],
      },
      { name: 'positions', label: 'Number of Positions', type: 'text' },
      {
        name: 'contact_type',
        label: 'Contact Type',
        type: 'select',
        options: ['ZIF', 'Non-ZIF', 'Not sure'],
      },
      {
        name: 'stack_height',
        label: 'Cable Thickness / Stack Height',
        type: 'text',
      },
      {
        name: 'flex_cycles',
        label: 'Flex Life Requirement (cycles)',
        type: 'text',
      },
      { name: 'termination', label: 'Termination Style', type: 'text' },
    ],
  },
  'high-speed-connectors-signal-integrity': {
    label: 'High-Speed / PCIe Connector RFI',
    shortLabel: 'High-Speed / PCIe Connectors',
    fields: [
      {
        name: 'pcie_gen',
        label: 'PCIe Generation',
        type: 'select',
        options: ['Gen3', 'Gen4', 'Gen5', 'Gen6', 'Gen7', 'Not sure'],
      },
      { name: 'cem_revision', label: 'CEM Slot Revision', type: 'text' },
      {
        name: 'form_factor',
        label: 'Form Factor',
        type: 'select',
        options: ['Card edge', 'Cable', 'M.2', 'Other'],
      },
      { name: 'lane_count', label: 'Lane Count', type: 'text' },
      {
        name: 'retention',
        label: 'Mechanical Retention Requirement',
        type: 'text',
      },
    ],
  },
};

// NOTE: Strapi enumeration values must start with a letter before any
// digit (validation rule enforced in the Content-Type Builder UI) — hence
// "within_1_3_months" rather than "1-3_months". These MUST exactly match
// the enum values configured on the `rfi` content type's `timeline` field
// in Strapi, or submissions will be rejected.
export const TIMELINE_OPTIONS = [
  { value: 'immediate', label: 'Immediate / in-stock now' },
  { value: 'within_1_3_months', label: '1-3 months' },
  { value: 'within_3_6_months', label: '3-6 months' },
  { value: 'exploratory', label: 'Just exploring options' },
];
