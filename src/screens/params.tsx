'use client';
import { useSearchParams } from 'next/navigation';

/** Reads ?state= (the design's state boards: empty | error | success) from the URL. */
export function useViewState<T extends string>(allowed: readonly T[]): T | 'default' {
    const v = useSearchParams().get('state');
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : 'default';
}
