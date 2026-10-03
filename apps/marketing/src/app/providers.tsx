'use client';
import { PropsWithChildren } from 'react';
import { I18nProvider, ZoneProvider, setAssets } from '@rc/ui';

/* This app's public files live under its basePath. */
setAssets({
  logo: '/brand/riceconnect-logo.svg', logoReversed: '/brand/riceconnect-logo-reversed.svg',
  logoMono: '/brand/riceconnect-logo-mono.svg', mark: '/brand/riceconnect-mark.svg', markReversed: '/brand/riceconnect-mark-reversed.svg',
});

export function Providers({ children }: PropsWithChildren) {
  return <ZoneProvider zone="marketing"><I18nProvider>{children}</I18nProvider></ZoneProvider>;
}
