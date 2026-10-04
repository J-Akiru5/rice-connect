'use client';
import { PropsWithChildren } from 'react';
import { EnvironmentRibbon, I18nProvider, ToastProvider, ZoneProvider, setAssets } from '@rc/ui';

/* No basePath: public files are at the root. */
setAssets({
  logo: '/brand/riceconnect-logo.svg',
  logoReversed: '/brand/riceconnect-logo-reversed.svg',
  logoMono: '/brand/riceconnect-logo-mono.svg',
  mark: '/brand/riceconnect-mark.svg',
  markReversed: '/brand/riceconnect-mark-reversed.svg'
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <ZoneProvider zone="main">
      <I18nProvider>
        <ToastProvider>
          <EnvironmentRibbon />
          {children}
        </ToastProvider>
      </I18nProvider>
    </ZoneProvider>
  );
}
