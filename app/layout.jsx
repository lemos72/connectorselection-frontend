import './globals.css';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Google Analytics 4 Measurement ID
const GA_ID = 'G-9DEPFJ6916';

export const metadata = {
  title: {
    default: 'Connector Selection Guides: High-Speed, Automotive & Cable Harness',
    template: '%s | connectorselection.com',
  },
  description:
    'Practical engineering guides for hardware engineers — connector selection, high-speed signal integrity, automotive, EV, FFC/FPC, AI server interconnects, and cable harness design.',
  metadataBase: new URL('https://connectorselection.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* IBM Plex Sans + Mono — technical, precise, not a generic default */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
