'use client';

import { useState } from 'react';
import Link from 'next/link';

// -----------------------------------------------------------------------------
// Question flow. Q4 (current level) only appears when Q2 === 'power', handled
// in the component logic below rather than as a fixed array index.
// -----------------------------------------------------------------------------
const QUESTIONS = [
  {
    key: 'connection',
    prompt: 'What are you connecting?',
    options: [
      { value: 'board-to-board', label: 'Board-to-board (same enclosure)' },
      { value: 'wire-to-board', label: 'Wire-to-board' },
      { value: 'wire-to-wire', label: 'Wire-to-wire / cable-to-cable' },
      { value: 'panel-external', label: 'Panel or chassis mount (external access)' },
    ],
  },
  {
    key: 'requirement',
    prompt: 'What does this connection primarily carry?',
    options: [
      { value: 'power', label: 'Power delivery' },
      { value: 'high-speed-data', label: 'High-speed data (1 Gbps+)' },
      { value: 'rf-coax', label: 'RF / coaxial signal' },
      { value: 'flex-fpc', label: 'Flexible flat cable / FPC' },
    ],
  },
  {
    key: 'environment',
    prompt: "What's the operating environment?",
    options: [
      { value: 'indoor', label: 'Indoor, controlled (consumer/enterprise electronics)' },
      { value: 'automotive', label: 'Automotive / EV' },
      { value: 'industrial', label: 'Industrial or harsh outdoor' },
      { value: 'ai-datacenter', label: 'AI / GPU data center' },
    ],
  },
];

const CURRENT_QUESTION = {
  key: 'current',
  prompt: 'Roughly how much current does this connection carry?',
  options: [
    { value: 'low', label: 'Low — under 2A' },
    { value: 'medium', label: 'Medium — 2 to 10A' },
    { value: 'high', label: 'High — over 10A' },
  ],
};

// -----------------------------------------------------------------------------
// Recommendation engine — priority-ordered rules, first match wins. Each rule
// links to real existing site content (articles, categories, hubs, tools)
// rather than generic advice.
// -----------------------------------------------------------------------------
function getRecommendation(answers) {
  const { connection, requirement, environment, current } = answers;

  // Rule 1: AI / GPU data center context overrides most other factors
  if (environment === 'ai-datacenter') {
    return {
      title: 'AI / GPU Data Center Interconnect',
      description:
        "Data center AI infrastructure combines high-speed signaling with substantial power delivery in the same dense chassis — connector choice here needs to account for both simultaneously, not just one.",
      articles: [
        { title: 'OCP Interconnect Frameworks: NIC 3.0 and Open Compute', href: '/articles/ocp-interconnect-frameworks-nic3-open-compute/' },
        { title: 'High-Speed Board-to-Board Connector Interface Design', href: '/articles/high-speed-board-to-board-connector-interface-design/' },
        requirement === 'power'
          ? { title: 'OCP Open Rack Busbar Power Connectors: ORv2 vs. ORv3', href: '/articles/ocp-open-rack-busbar-power-connectors-orv2-orv3/' }
          : { title: 'PCIe Gen7 Connector Design: What Changes at 128 GT/s', href: '/articles/pcie-gen7-connector-design-what-changes-at-128-gt-s/' },
      ],
      categoryHref: '/hubs/ai-data-center-interconnects/',
      categoryLabel: 'Explore the AI / Data Center Hub',
      toolHref: '/tools/power-dissipation-calculator/',
      toolLabel: 'Power Dissipation Calculator',
    };
  }

  // Rule 2: flexible flat cable is a distinct enough category to override connection type
  if (requirement === 'flex-fpc') {
    return {
      title: 'FPC / FFC Flexible Flat Cable Connector',
      description:
        'Flexible flat cable connectors trade off retention mechanism (ZIF vs. non-ZIF) against cost, insertion force, and mating cycle count — the right choice depends heavily on your production volume and service-cycle expectations.',
      articles: [
        { title: 'ZIF vs. Non-ZIF FPC/FFC Mechanics', href: '/compare/zif-vs-non-zif-fpc-connectors/' },
        { title: 'Non-ZIF FPC Connectors Explained: Retention Without a Latch Mechanism', href: '/articles/non-zif-fpc-connectors-explained-retention-without-latch-mechanism/' },
        { title: 'FPC Connector Selection Guide for Engineers', href: '/articles/fpc-connector-selection-guide-for-engineers/' },
      ],
      categoryHref: '/categories/fpc-ffc-connectors/',
      categoryLabel: 'Browse FPC/FFC Connectors',
    };
  }

  // Rule 3: RF/coax signal path
  if (requirement === 'rf-coax') {
    return {
      title: 'RF / Coaxial Connector',
      description:
        environment === 'automotive'
          ? 'Automotive RF connections (radar, camera, telematics) typically call for FAKRA-family connectors sized to your frequency and space requirements.'
          : 'RF signal paths need tight impedance control end-to-end — the right connector family depends on frequency, whether the connection needs to be blind-mate, and how often it gets serviced.',
      articles: environment === 'automotive'
        ? [
            { title: 'FAKRA RF Connectors for Automotive Telematics', href: '/articles/fakra-rf-connectors-automotive-telematics/' },
            { title: 'Mini-FAKRA vs. FAKRA: What\'s the Difference?', href: '/articles/mini-fakra-vs-fakra-whats-the-difference/' },
            { title: 'LiDAR and Radar Sensor Connectors: IP Rating and Signal Integrity Requirements for ADAS', href: '/articles/lidar-and-radar-sensor-connectors-ip-rating-and-signal-integrity/' },
          ]
        : [
            { title: 'SMA vs. SMB RF Connectors', href: '/compare/smb-vs-sma-rf-connectors/' },
            { title: 'Blind-Mate RF Coaxial Connectors: Push-On vs. Threaded Interfaces', href: '/articles/blind-mate-rf-coaxial-connectors-push-on-vs-threaded/' },
            { title: 'SMA RF Coaxial Connectors: Microwave Impedance', href: '/articles/sma-rf-coaxial-connectors-microwave-impedance/' },
          ],
      categoryHref: '/categories/high-speed-connectors-signal-integrity/',
      categoryLabel: 'Browse High-Speed & Signal Integrity Connectors',
    };
  }

  // Rule 4: automotive/EV environment
  if (environment === 'automotive') {
    if (requirement === 'power') {
      return {
        title: 'Automotive High-Voltage Power Connector',
        description:
          'High-voltage automotive power connections, especially EV battery disconnects, need to account for arc-flash safety, not just current rating — this typically means an HVIL-equipped design.',
        articles: [
          { title: 'HVIL Connector Design: High-Voltage Interlock Loop for EV Battery Disconnects', href: '/articles/hvil-connector-design-high-voltage-interlock-loop-ev-battery/' },
          { title: 'High-Voltage EV Connectors Explained', href: '/articles/high-voltage-ev-connectors-explained/' },
          { title: 'Battery Connector Systems for Electric Vehicles', href: '/articles/battery-connector-systems-for-electric-vehicles/' },
        ],
        categoryHref: '/categories/automotive-connectors/',
        categoryLabel: 'Browse Automotive Connectors',
        toolHref: '/tools/voltage-drop-calculator/',
        toolLabel: 'Voltage Drop Calculator',
      };
    }
    return {
      title: 'Automotive Ethernet / Sensor Data Connector',
      description:
        'Automotive data connections increasingly run over Single Pair Ethernet or automotive-specific high-speed interfaces rather than legacy CAN/LIN — the right physical connector depends on data rate and sensor placement.',
      articles: [
        { title: 'Automotive Ethernet Connectors Explained', href: '/articles/automotive-ethernet-connectors-explained/' },
        { title: 'Single Pair Ethernet Connectors: M8 vs. M12 vs. Automotive-Specific Variants', href: '/articles/single-pair-ethernet-connectors-m8-m12-vs-automotive-variants/' },
        { title: 'LiDAR and Radar Sensor Connectors: IP Rating and Signal Integrity Requirements for ADAS', href: '/articles/lidar-and-radar-sensor-connectors-ip-rating-and-signal-integrity/' },
      ],
      categoryHref: '/categories/automotive-connectors/',
      categoryLabel: 'Browse Automotive Connectors',
    };
  }

  // Rule 5: high-speed data, non-automotive
  if (requirement === 'high-speed-data') {
    return {
      title: connection === 'board-to-board' ? 'High-Speed Board-to-Board Connector' : 'High-Speed Signal Connector',
      description:
        'High-speed digital signal paths need controlled impedance and low insertion loss across the whole connector interface — the specific family depends on your data rate and connection type.',
      articles: [
        { title: 'High-Speed Board-to-Board Connector Interface Design', href: '/articles/high-speed-board-to-board-connector-interface-design/' },
        { title: 'PCIe Connectors Explained: Gen4 vs. Gen5 vs. Gen6', href: '/articles/pcie-connectors-explained-gen4-vs-gen5-vs-gen6/' },
        { title: 'Signal Integrity Problems in High-Speed Connectors', href: '/articles/signal-integrity-problems-in-high-speed-connectors/' },
      ],
      categoryHref: '/categories/high-speed-connectors-signal-integrity/',
      categoryLabel: 'Browse High-Speed & Signal Integrity Connectors',
      toolHref: '/tools/skin-effect-calculator/',
      toolLabel: 'Skin Effect Calculator',
    };
  }

  // Rule 6: industrial/harsh environment, power or general
  if (environment === 'industrial') {
    return {
      title: 'Industrial-Rated Connector',
      description:
        'Industrial and harsh-outdoor connections generally need a specific IP rating and vibration tolerance beyond what standard indoor connectors provide — circular connector formats like M8/M12 are common here.',
      articles: [
        { title: 'Industrial RJ45 / M12 Ethernet Interconnects', href: '/articles/industrial-rj45-m12-ethernet-interconnects/' },
        { title: 'Connector IP Ratings: Environmental Sealing', href: '/articles/connector-ip-ratings-environmental-sealing/' },
        { title: 'Cable Harness Design for Harsh Environments', href: '/articles/cable-harness-design-for-harsh-environments/' },
      ],
      categoryHref: '/categories/cable-harness-assemblies/',
      categoryLabel: 'Browse Cable & Harness Assemblies',
    };
  }

  // Rule 7: board-to-board power connection, indoor
  if (connection === 'board-to-board' && requirement === 'power') {
    return {
      title: 'Board-to-Board Power Connector',
      description:
        current === 'high'
          ? 'High-current board-to-board power connections need real attention to contact current rating and thermal derating — check the manufacturer\'s derating curve before finalizing pin count.'
          : 'For board-to-board power delivery, pin count, contact resistance, and thermal derating at your actual operating temperature are the main things to verify against a datasheet.',
      articles: [
        { title: 'High-Current Wire-to-Board Connectors: Power', href: '/articles/high-current-wire-to-board-connectors-power/' },
        { title: 'How to Read Connector Thermal Derating Curves: A Practical Guide', href: '/articles/how-to-read-connector-thermal-derating-curves/' },
        { title: 'Connector Current Rating Explained: Engineering Guide', href: '/articles/connector-current-rating-explained-engineering-guide/' },
      ],
      categoryHref: '/categories/board-to-board/',
      categoryLabel: 'Browse Board-to-Board Connectors',
      toolHref: '/tools/power-dissipation-calculator/',
      toolLabel: 'Power Dissipation Calculator',
    };
  }

  // Rule 8: general board-to-board fallback
  if (connection === 'board-to-board') {
    return {
      title: 'Board-to-Board Connector',
      description:
        "For general board-to-board interconnects, the main decisions are pitch, stack height, and whether you need self-securing retention — start with our fundamentals guide.",
      articles: [
        { title: 'What Is a Board-to-Board Connector? Design Guide', href: '/articles/what-is-a-board-to-board-connector-design-guide/' },
        { title: 'Self-Securing Board-to-Board Connectors: How Auto-Latching Mechanisms Work', href: '/articles/self-securing-board-to-board-connectors-auto-latching-mechanics/' },
        { title: 'Micro-Pitch Board-to-Board Connectors: Design Constraints Below 0.4mm', href: '/articles/micro-pitch-board-to-board-connectors-design-constraints-below-0-4mm/' },
      ],
      categoryHref: '/categories/board-to-board/',
      categoryLabel: 'Browse Board-to-Board Connectors',
    };
  }

  // Default fallback
  return {
    title: 'General-Purpose Connector',
    description:
      "Your answers point to a general connector selection — start with the fundamentals of how connector types are classified, then narrow down by your specific environment and signal requirements.",
    articles: [
      { title: 'Connector Types Explained: Engineer\'s Guide', href: '/articles/connector-types-explained-engineers-guide/' },
      { title: 'How to Select the Right Connector: Engineering Guide', href: '/articles/how-to-select-the-right-connector-engineering-guide/' },
      { title: 'Electrical Connector Basics', href: '/articles/electrical-connector-basics/' },
    ],
    categoryHref: '/categories/connector-fundamentals/',
    categoryLabel: 'Browse Connector Fundamentals',
  };
}

export default function ConnectorSelectorWizard() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  // Build the effective question list: insert the current-level question
  // right after "requirement" if and only if the user picked "power".
  const activeQuestions = [...QUESTIONS];
  if (answers.requirement === 'power') {
    activeQuestions.splice(2, 0, CURRENT_QUESTION);
  }

  const isComplete = step >= activeQuestions.length;
  const currentQuestion = activeQuestions[step];

  function handleAnswer(value) {
    const updated = { ...answers, [currentQuestion.key]: value };
    setAnswers(updated);
    setStep(step + 1);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleRestart() {
    setAnswers({});
    setStep(0);
  }

  const recommendation = isComplete ? getRecommendation(answers) : null;

  return (
    <div className="cs-wizard">
      {!isComplete && (
        <>
          <div className="cs-wizard-progress" aria-label={`Question ${step + 1} of ${activeQuestions.length}`}>
            {activeQuestions.map((q, i) => (
              <span
                key={q.key}
                className={
                  'cs-wizard-dot' +
                  (i === step ? ' cs-wizard-dot-active' : i < step ? ' cs-wizard-dot-done' : '')
                }
              />
            ))}
          </div>

          <h2 className="cs-wizard-prompt">{currentQuestion.prompt}</h2>

          <div className="cs-wizard-options">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="cs-wizard-option"
                onClick={() => handleAnswer(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button type="button" className="cs-wizard-back" onClick={handleBack}>
              ← Back
            </button>
          )}
        </>
      )}

      {isComplete && recommendation && (
        <div className="cs-wizard-result">
          <span className="cs-eyebrow">Recommendation</span>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.description}</p>

          <div className="cs-wizard-result-articles">
            <h3>Start here</h3>
            <ul>
              {recommendation.articles.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} prefetch={false}>{a.title} →</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="cs-wizard-result-actions">
            <Link href={recommendation.categoryHref} className="cs-btn" prefetch={false}>
              {recommendation.categoryLabel}
            </Link>
            {recommendation.toolHref && (
              <Link href={recommendation.toolHref} className="cs-btn cs-btn-ghost" prefetch={false}>
                {recommendation.toolLabel} →
              </Link>
            )}
          </div>

          <button type="button" className="cs-wizard-restart" onClick={handleRestart}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
