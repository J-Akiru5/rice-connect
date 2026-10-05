'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { getQueryClient } from './client';

export function DataProvider({ children }: PropsWithChildren) {
    return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
