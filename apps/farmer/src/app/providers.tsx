'use client';
import { PropsWithChildren } from 'react';
import { EnvironmentRibbon, I18nProvider, ToastProvider, ZoneProvider, setAssets } from '@rc/ui';
import { DataProvider } from '@rc/data';

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
