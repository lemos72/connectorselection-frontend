// Per-category field configuration for the RFI (Request for Information) form.
// Only categories with an entry here get the RFI form rendered on their
// category page — see app/categories/[slug]/page.jsx.
//
// Keys MUST match real Strapi category slugs (confirmed Sept 2026):
//   - fpc-ffc-connectors
//   - high-speed-connectors-signal-integrity (covers PCIe/CEM content —
//     there is no standalone "pcie-cem-connectors" category)
//
// GUIDED MODE (Nov 2026): a category that defines `needs` + `hero` gets the
// new guided layout (need cards -> only the relevant fields). A category
// without `needs` keeps the original full form, unchanged.

// Country list for the optional Country dropdown. Values are free-form text
// inside the spec_fields JSON, so adding countries needs no Strapi change.
export const COUNTRY_OPTIONS = [
  'United States',
  'Canada',
  'Mexico',
  'United Kingdom',
  'Germany',
  'France',
  'Italy',
  'Netherlands',
  'Poland',
  'Israel',
  'India',
  'China',
  'Hong Kong',
  'Taiwan',
  'South Korea',
  'Japan',
  'Singapore',
  'Australia',
  'Other',
];

export const RFI_FIELD_CONFIGS = {
  'fpc-ffc-connectors': {
    label: 'FPC/FFC Connector RFI',
    // Short, controlled display name for CTA copy and page headings —
    // deliberately NOT the Strapi category's Name/seo_title field, which
    // is a long SEO-oriented string ("FPC & FFC Connectors: Guides,
    // Comparisons & Selection Tools") that reads badly mid-sentence.
    shortLabel: 'FPC/FFC Connectors',

    // Top-of-page copy for the guided layout.
    hero: {
      title: 'Need FFC/FPC cables or connectors? Tell us your specs.',
      sub:
        'Standard, custom length, hard-to-find, low or high volume. Share your specs and we will reply with product and pricing information.',
      steps: [
        {
          icon: 'specs',
          title: 'Tell us your specs',
          text: 'Pick what you need and share the pitch, positions and quantity.',
        },
        {
          icon: 'review',
          title: 'We review your request',
          text: 'An engineer reads your specs and prepares product and pricing information.',
        },
        {
          icon: 'quote',
          title: 'Get product & pricing info',
          text: 'We reply by email. No obligation.',
        },
      ],
    },

    // The "What do you need?" cards. `core` fields are shown right after the
    // card is chosen; `more` fields go under "More details (optional)".
    // Field names refer to entries in `fields` below.
    needs: [
      {
        key: 'cable',
        title: 'FFC/FPC cable',
        desc: 'Ready-made cable, standard or custom length.',
        example: 'e.g. 0.5 mm pitch, 20 pin, 100 mm',
        core: ['pitch', 'positions', 'length'],
        more: ['contact_type', 'termination', 'flex_cycles'],
      },
      {
        key: 'custom',
        title: 'Custom cable or assembly',
        desc: 'Special length, termination, shielding or flex life.',
        example: 'e.g. 40 pin, contacts on opposite sides',
        core: ['pitch', 'positions', 'length', 'termination'],
        more: ['contact_type', 'stack_height', 'flex_cycles'],
      },
      {
        key: 'connector',
        title: 'Board connector (socket)',
        desc: 'The FFC/FPC connector that mounts on your PCB.',
        example: 'e.g. 0.5 mm pitch, 20 pin, ZIF',
        core: ['pitch', 'positions', 'contact_type'],
        more: ['stack_height', 'flex_cycles'],
      },
      {
        key: 'help',
        title: 'Not sure, help me choose',
        desc: 'Describe your product and we will suggest suitable parts.',
        example: 'e.g. camera module to main board, 60 mm gap',
        core: [],
        more: ['pitch', 'positions', 'contact_type'],
        notesRequired: true,
      },
    ],

    fields: [
      {
        name: 'pitch',
        label: 'Pitch (mm)',
        type: 'select',
        options: ['0.3', '0.4', '0.5', '1.0', 'Other'],
      },
      {
        name: 'positions',
        label: 'Number of Positions',
        type: 'text',
        placeholder: 'e.g. 20',
      },
      {
        name: 'length',
        label: 'Cable Length (mm)',
        type: 'text',
        placeholder: 'e.g. 100, or "not sure yet"',
      },
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
        placeholder: 'e.g. 100,000 or "static, no flexing"',
      },
      {
        name: 'termination',
        label: 'Termination Style',
        type: 'text',
        placeholder: 'e.g. stiffener on both ends, contacts on same side',
      },
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
