'use client';
import { PropsWithChildren } from 'react';
import { EnvironmentRibbon, I18nProvider, ToastProvider, ZoneProvider, setAssets } from '@rc/ui';
import { DataProvider } from '@rc/data';

/* This app's public files live under its basePath. */
setAssets({
  logo: '/buyer/brand/riceconnect-logo.svg',
  logoReversed: '/buyer/brand/riceconnect-logo-reversed.svg',
  logoMono: '/buyer/brand/riceconnect-logo-mono.svg',
  mark: '/buyer/brand/riceconnect-mark.svg',
  markReversed: '/buyer/brand/riceconnect-mark-reversed.svg'
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <ZoneProvider zone="buyer">
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
