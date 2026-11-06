const SITE_URL = 'https://connectorselection.com';

// Links are unstyled site-wide, so make these clearly look clickable.
const LINK_STYLE = {
  color: 'var(--blueprint)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontWeight: 500,
};

export const metadata = {
  title: 'Privacy Policy | Connector Selection',
  description:
    'How Connector Selection collects and uses information: analytics, forms, newsletter signups and emailed tool results, and the choices you have.',
  alternates: { canonical: `${SITE_URL}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="cs-band">
        <div className="cs-container">
          <span className="cs-eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p>Last updated: November 5, 2026</p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-tool-explainer">
          <p>
            This policy explains what information Connector Selection (connectorselection.com)
            collects when you use the site, why we collect it, and the choices you have.
          </p>

          <h2>Information You Give Us</h2>
          <p>
            When you submit a contact form, a request for information or quote, a question to the
            Ask the Engineer section, a newsletter signup, or a request to have a calculator result
            emailed to you, we receive the details you enter, such as your name, email address,
            company, and the message or calculation you submitted. We use this information to
            respond to you, to send the content you asked for, and to improve the site. Where a
            request is about a specific product, we may share it with the relevant supplier so they
            can respond to you.
          </p>

          <h2>Newsletter and Emails</h2>
          <p>
            If you subscribe to our newsletter, we use your email address to send our briefings and
            updates. Emails are sent through Brevo, our email service provider. Every email includes
            an unsubscribe link, and you can stop receiving them at any time. Emailed calculator
            results are one-time messages sent in response to your request.
          </p>

          <h2>Analytics</h2>
          <p>We use the following tools to understand how the site is used.</p>
          <p>
            <strong>Google Analytics 4</strong> collects usage data such as pages viewed, approximate
            location, device and browser type, and how you arrived at the site. Google&rsquo;s use of
            this data is described in the{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
              Google Privacy Policy
            </a>
            .
          </p>
          <p>
            <strong>Microsoft Clarity</strong> collects usage data such as clicks, scrolling and mouse
            movement, and may record anonymized session replays and heatmaps. Text you type into form
            fields is masked and not recorded. Clarity data is processed by Microsoft in accordance
            with the{' '}
            <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
              Microsoft Privacy Statement
            </a>
            .
          </p>
          <p>
            These tools use cookies or similar technologies. We use the information only to improve
            the site and its content.
          </p>

          <h2>Cookies</h2>
          <p>
            Cookies are small files stored in your browser. Our analytics tools use them to recognize
            repeat visits and measure usage. You can block or delete cookies in your browser settings;
            the site will still work, though some analytics will no longer be accurate.
          </p>

          <h2>How We Share Information</h2>
          <p>
            We do not sell your personal information. We share it only with service providers that
            help us run the site and communicate with you (such as our hosting, analytics and email
            providers), with suppliers when you ask us to connect you about a product, and where
            required by law.
          </p>

          <h2>Your Choices</h2>
          <p>
            You can unsubscribe from the newsletter at any time using the link in any email.
          </p>
          <p>
            You can ask us to access, correct or delete the personal information you have given us by
            contacting us through the site.
          </p>
          <p>
            You can opt out of Google Analytics with the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
              Google Analytics opt-out browser add-on
            </a>
            , and block analytics cookies in your browser settings.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. The date at the top shows when it was last
            changed.
          </p>
        </div>
      </section>
    </>
  );
}
