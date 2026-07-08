import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: {
    default: 'connectorselection.com — Interconnect Knowledge Base',
    template: '%s | connectorselection.com',
  },
  description:
    'Technical articles and selection guidance for electronic connectors: high-speed, board-to-board, EV, and signal integrity.',
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
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
