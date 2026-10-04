import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'RiceConnect · Farmer (prototype)',
  description: 'RiceConnect Enactus 2026 prototype by Team Syntaxure Labs (ISUFST). Simulated data only.',
  robots: { index: false, follow: false },
  icons: { icon: '/farmer/brand/riceconnect-mark.svg' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

/* Sets the theme before paint; storage access is wrapped so a blocked store falls back to light. */
const THEME_BOOT = `try{if(localStorage.getItem('rc-theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}`;

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
