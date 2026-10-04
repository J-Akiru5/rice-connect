import type { Metadata, Viewport } from 'next';
import './globals.css';
import { THEME_BOOT } from '@rc/ui/theme';
import { isDemo } from '@rc/ui/mode';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'RiceConnect · Cluster selling for smallholder rice farmers',
  description: isDemo
    ? 'RiceConnect Enactus 2026 prototype by Team Syntaxure Labs (ISUFST). Simulated data only.'
    : 'RiceConnect by Team Syntaxure Labs (ISUFST).',
  robots: { index: true, follow: true },
  icons: { icon: '/brand/riceconnect-mark.svg' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
