'use client';
import { PropsWithChildren } from 'react';
import { EnvironmentRibbon, I18nProvider, ToastProvider, ZoneProvider, setAssets } from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { DataProvider, configureLive } from '@rc/data';

/* No basePath: public files are at the root. */
setAssets({
  logo: '/brand/riceconnect-logo.svg',
  logoReversed: '/brand/riceconnect-logo-reversed.svg',
  logoMono: '/brand/riceconnect-logo-mono.svg',
  mark: '/brand/riceconnect-mark.svg',
  markReversed: '/brand/riceconnect-mark-reversed.svg'
});

/* B-04: live mode signs in through Supabase instead of the demo mock. */
if (
  isLive &&
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  configureLive(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function Providers({ children }: PropsWithChildren) {
  return (
    <ZoneProvider zone="main">
      <I18nProvider>
        <DataProvider>
          <ToastProvider>
            <EnvironmentRibbon />
            {children}
          </ToastProvider>
        </DataProvider>
      </I18nProvider>
    </ZoneProvider>
  );
}
