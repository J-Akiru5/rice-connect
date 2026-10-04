'use client';
import { PropsWithChildren } from 'react';
import { EnvironmentRibbon, I18nProvider, ToastProvider, ZoneProvider, setAssets } from '@rc/ui';
import { DataProvider } from '@rc/data';

/* This app's public files live under its basePath. */
setAssets({
  logo: '/driver/brand/riceconnect-logo.svg',
  logoReversed: '/driver/brand/riceconnect-logo-reversed.svg',
  logoMono: '/driver/brand/riceconnect-logo-mono.svg',
  mark: '/driver/brand/riceconnect-mark.svg',
  markReversed: '/driver/brand/riceconnect-mark-reversed.svg'
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <ZoneProvider zone="driver">
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
