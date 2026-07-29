import Link from 'next/link';
import ContactForm from '../../components/ContactForm';

const SITE_URL = 'https://connectorselection.com';

export async function generateMetadata() {
  return {
    title: 'Contact | connectorselection.com',
    description:
      'Get in touch with connectorselection.com — email, phone, or X (Twitter). Send us a message about connector selection, partnerships, or feedback.',
    alternates: {
      canonical: `${SITE_URL}/contact/`,
    },
  };
}

export default function ContactPage() {
  return (
    <>
      <section className="cs-band cs-contact-hero">
        <div className="cs-container">
          <nav className="cs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </nav>
          <span className="cs-eyebrow">Get in Touch</span>
          <h1>Contact Our Team</h1>
          <p className="cs-contact-lede">
            Questions about connector selection, technical specifications,
            partnership inquiries, or feedback on our content — reach out
            however&apos;s easiest for you. Our team typically responds
            within one business day.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container cs-contact-layout">
          {/* Direct contact methods */}
          <div className="cs-contact-methods">
            <h2>Direct Contact</h2>
            <p className="cs-contact-methods-intro">
              For engineering teams evaluating connector specifications,
              our team is glad to help — pick whichever channel works
              best for you.
            </p>

            <div className="cs-contact-method-card">
              <span className="cs-eyebrow">Email</span>
              <a
                href="mailto:lemos@connectorselection.com"
                className="cs-contact-method-value"
              >
                lemos@connectorselection.com
              </a>
              <p className="cs-contact-method-note">
                Best for detailed technical inquiries and documentation
                requests.
              </p>
            </div>

            <div className="cs-contact-method-card">
              <span className="cs-eyebrow">Phone</span>
              <a href="tel:+13236018072" className="cs-contact-method-value">
                (323) 601-8072
              </a>
              <p className="cs-contact-method-note">
                For time-sensitive questions or to speak with our team
                directly.
              </p>
            </div>

            <div className="cs-contact-method-card">
              <span className="cs-eyebrow">X / Twitter</span>
              <a
                href="https://x.com/tech_talkclub"
                target="_blank"
                rel="noopener noreferrer"
                className="cs-contact-method-value"
              >
                @tech_talkclub
              </a>
              <p className="cs-contact-method-note">
                Follow for updates, or send a quick message.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="cs-contact-form-wrap">
            <h2>Send Us a Message</h2>
            <p className="cs-contact-form-intro">
              Fill out the form below and we&apos;ll get back to you as
              soon as possible.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
