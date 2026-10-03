'use client';
import { PropsWithChildren } from 'react';
import { I18nProvider, ZoneProvider, setAssets } from '@rc/ui';

/* This app's public files live under its basePath. */
setAssets({
  logo: '/coordinator/brand/riceconnect-logo.svg', logoReversed: '/coordinator/brand/riceconnect-logo-reversed.svg',
  logoMono: '/coordinator/brand/riceconnect-logo-mono.svg', mark: '/coordinator/brand/riceconnect-mark.svg', markReversed: '/coordinator/brand/riceconnect-mark-reversed.svg',
});

export function Providers({ children }: PropsWithChildren) {
  return <ZoneProvider zone="coordinator"><I18nProvider>{children}</I18nProvider></ZoneProvider>;
}
