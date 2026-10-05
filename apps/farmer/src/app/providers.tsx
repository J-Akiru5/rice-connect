'use client';
import { PropsWithChildren } from 'react';
import { EnvironmentRibbon, I18nProvider, ToastProvider, ZoneProvider, setAssets } from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { DataProvider, configureLiveAuth } from '@rc/data';

/* B-04: live mode signs in through Supabase instead of the demo mock. */
if (
  isLive &&
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  configureLiveAuth(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/* This app's public files live under its basePath. */
setAssets({
  logo: '/farmer/brand/riceconnect-logo.svg',
  logoReversed: '/farmer/brand/riceconnect-logo-reversed.svg',
  logoMono: '/farmer/brand/riceconnect-logo-mono.svg',
  mark: '/farmer/brand/riceconnect-mark.svg',
  markReversed: '/farmer/brand/riceconnect-mark-reversed.svg'
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <ZoneProvider zone="farmer">
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
