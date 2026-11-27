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
      'automotive-ethernet-connectors-explained',
      'automotive-camera-connectors-serdes-and-high-speed-interfaces',
      'next-gen-automotive-adas-connectors-mini-fakra-ethernet',
      'lidar-and-radar-sensor-connectors-ip-rating-and-signal-integrity',
      'fakra-rf-connectors-automotive-telematics',
      'connector-requirements-for-electric-vehicles-evs',
      'battery-connector-systems-for-electric-vehicles',
      'single-pair-ethernet-connectors-m8-m12-vs-automotive-variants',
      'battery-cell-interconnect-systems-ccs-busbars-fpc-explained',
    ],
  },
  'supply-chain-sourcing': {
    pdfUrl:
      'https://connectorselection.com/downloads/connector-sourcing-obsolescence-playbook.pdf',
    source: 'sourcing_playbook_guide',
    title: 'Connector Sourcing & Obsolescence Playbook',
    description:
      'Second-sourcing strategy, BOM risk scoring, EOL/PCN notices, and qualifying a replacement -- free PDF guide.',
    articleSlugs: [
      'supply-chain-sourcing-second-sourcing-connectors',
      'bom-risk-register-connector-sourcing',
      'how-to-read-connector-eol-notice-pcn',
      'reverse-engineering-sourcing-obsolete-proprietary-connectors',
      'verifying-connector-intermateability-second-source-qualification',
    ],
  },
  'high-speed-connectors-signal-integrity': {
    pdfUrl:
      'https://connectorselection.com/downloads/pcie-connector-form-factors-cheat-sheet.pdf',
    source: 'pcie_form_factors_cheatsheet',
    title: 'Get the PCIe Connector Form Factors Cheat Sheet',
    description:
      'A free 2-page cheat sheet comparing PCIe slots, M.2, U.2, EDSFF and OCP NIC 3.0 form factors, with power limits and speeds by PCIe generation.',
    articleSlugs: [
      'what-is-a-cem-slot-pcie-card-electromechanical-connector-explained',
      'pcie-connectors-explained-gen4-vs-gen5-vs-gen6',
      'edsff-connectors-explained-e1s-e3s-ocp-server-storage',
      'ocp-interconnect-frameworks-nic3-open-compute',
      'pcie-gen7-connector-design-what-changes-at-128-gt-s',
    ],
  },
  'connector-fundamentals': {
    pdfUrl:
      'https://connectorselection.com/downloads/connector-selection-checklist.pdf',
    source: 'connector_selection_checklist',
    title: 'Get the Connector Selection Checklist',
    description:
      'A free 2-page printable checklist covering electrical, mechanical, environmental, standards and sourcing checks before you commit a connector to a design — straight to your inbox.',
    articleSlugs: [
      'how-to-select-the-right-connector-engineering-guide',
      'connector-types-explained-engineers-guide',
      'connector-current-rating-explained-engineering-guide',
      'connector-voltage-rating-creepage-clearance-explained',
      'how-to-read-connector-thermal-derating-curves',
      'cable-derating-factor-explained',
      'connector-contact-resistance-explained-design-guide',
      'connector-mating-cycles-explained-engineering-guide',
      'connector-pitch-explained-04mm-05mm-10mm',
      'connector-galvanic-corrosion-plating-incompatibility',
      'ul-94-flammability-rating-connector-housings',
      'rohs-reach-compliant-connectors-requirements-guide',
    ],
  },
  'ip-rating-sealing': {
    pdfUrl:
      'https://connectorselection.com/downloads/connector-ip-rating-sealing-guide.pdf',
    source: 'ip_rating_sealing_guide',
    title: 'Get the Connector IP Rating & Sealing Guide',
    description:
      'A free 2-page PDF explaining how to read IP codes, what IP67, IP68 and IP69K do and do not cover, and a sealing checklist for your design — straight to your inbox.',
    articleSlugs: [
      'ip-rating-chart-ip65-ip67-ip68-ip69k-explained',
      'connector-ip-ratings-environmental-sealing',
      'waterproof-wire-to-wire-connectors-environmental',
      'cable-harness-design-for-harsh-environments',
      'industrial-rj45-m12-ethernet-interconnects',
    ],
  },
  'ai-server-data-center-connectors': {
    pdfUrl:
      'https://connectorselection.com/downloads/ocp-data-center-connector-cheat-sheet.pdf',
    source: 'ocp_data_center_cheatsheet',
    title: 'Get the OCP & Data Center Connector Cheat Sheet',
    description:
      'A free 2-page cheat sheet covering SFF-TA-1002 sizes, EDSFF E1.S vs E3.S, OCP NIC 3.0 form factors, DC-MHS M-XIO connectors, OAM and ORv3 power, with a pre-design checklist — straight to your inbox.',
    articleSlugs: [
      'sff-ta-1002-card-edge-connector-type-1-vs-type-2-sizes',
      'ocp-nic-3-0-connectors-4c-plus-card-edge-selection',
      'ocp-oam-connectors-accelerator-module-interconnect-design',
      'dc-mhs-m-xio-connectors-cabled-pcie-ocp-servers',
      'm-xio-mcio-connectors-dc-mhs-cabled-pcie-explained',
      'ocp-orv3-ai-rack-connector-selection-spotlight',
      'what-is-an-ocp-server-ocp-vs-traditional-racks',
      // Added Nov 27, 2026: DC-MHS, cabled PCIe and ORv3 power articles that
      // match the cheat sheet topics. CRPS and UQD/UQDB pages are left out on
      // purpose (control pages). EDSFF and PCIe Gen4-6 are already in the
      // PCIe magnet's list, which is checked first, so they are not repeated.
      'dc-mhs-host-processor-module-hpm-m-flw-vs-m-dno',
      'm-pesti-sideband-tunneling-dc-mhs-presence-detection',
      'ocp-dc-scm-connector-interface-explained',
      'mcio-vs-oculink-cabled-pcie-connectors-ocp-ai-servers',
      'orv3-power-connectors-by-use-case-shelf-busbar-blind-mate-node',
      'orv3-vs-orv3-hpr-power-shelf-ac-input-connectors-whips',
      'orv3-ac-input-connector-7-pin-power-shelf-inlet',
      'ocp-open-rack-busbar-power-connectors-orv2-orv3',
      'ocp-orv3-compliant-connectors-what-the-standards-require',
    ],
  },
};
