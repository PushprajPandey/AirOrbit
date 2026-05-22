import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AirOrbit | Flight Management',
  description: 'Your journey, our mission — search, book, and manage flights with AirOrbit',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'AirOrbit',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0EA5E9',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AirOrbit" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          id="material-symbols-font"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          media="print"
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.getElementById('material-symbols-font');
                if (link) {
                  link.addEventListener('load', function() {
                    link.media = 'all';
                  });
                  // If browser already cached it and loaded it
                  if (link.sheet) {
                    link.media = 'all';
                  }
                }
              })();
            `
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
