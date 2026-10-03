'use client';
import { PropsWithChildren } from 'react';
import { I18nProvider } from '@/components/riceconnect';

export function Providers({ children }: PropsWithChildren) {
  return <I18nProvider>{children}</I18nProvider>;
}
