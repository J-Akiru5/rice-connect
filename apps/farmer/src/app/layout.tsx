import type { Metadata, Viewport } from 'next';
import './globals.css';
import { THEME_BOOT } from '@rc/ui/theme';
import { MODE_BOOT, isDemo } from '@rc/ui/mode';
import { RoleGuard } from '@rc/screens/guard';
import { AnniDock } from '@rc/screens/anni';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: `RiceConnect · Farmer${isDemo ? ' (prototype)' : ''}`,
  description: isDemo
    ? 'RiceConnect Enactus 2026 prototype by Team Syntaxure Labs (ISUFST). Simulated data only.'
    : 'RiceConnect by Team Syntaxure Labs (ISUFST).',
  robots: { index: false, follow: false },
  icons: { icon: '/farmer/brand/riceconnect-mark.svg' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <script dangerouslySetInnerHTML={{ __html: MODE_BOOT }} />
      </head>
      <body>
        <Providers>
          {/* S-12: farmer routes require the farmer session in live mode; sign-in and sign-up stay open. */}
          <RoleGuard role="farmer" allow={['/farmer/login', '/farmer/signup']}>
            {children}
            <AnniDock />
          </RoleGuard>
        </Providers>
      </body>
    </html>
  );
}
