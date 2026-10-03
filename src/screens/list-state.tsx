'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { listQuery, parseListParams, SIZE_DESKTOP, SIZE_MOBILE } from '@/lib/list';
import { useFramed } from './shell';

const MQ = '(max-width: 767.98px)';
function subscribe(cb: () => void) {
    const m = window.matchMedia(MQ);
    m.addEventListener('change', cb);
    return () => m.removeEventListener('change', cb);
}
/** Default rows per page: 10 below 768px (a CSS media query, no user-agent) or inside the phone frame, else 20. */
export function useDefaultPageSize() {
    const framed = useFramed();
    const narrow = useSyncExternalStore(subscribe, () => window.matchMedia(MQ).matches, () => false);
    return framed || narrow ? SIZE_MOBILE : SIZE_DESKTOP;
}

/** List state in the URL (?page=&size=&q=&status=&barangay=): refresh and Back keep it.
    Typing and filters replace the history entry; page links push one. */
export function useListState() {
    const sp = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const p = parseListParams(sp);
    const fallback = useDefaultPageSize();
    const size = p.size ?? fallback;
    const href = useCallback((patch: Record<string, string | number | null>) => pathname + listQuery(sp.toString(), patch), [pathname, sp]);
    const set = useCallback((patch: Record<string, string | number | null>) => router.replace(href(patch), { scroll: false }), [router, href]);
    return { ...p, size, href, set, pageHref: (n: number) => href({ page: n }) };
}

export type ListState = ReturnType<typeof useListState>;
/** The same shape without hooks: page 1, desktop size, no filters. Used for the server-rendered Suspense fallback. */
export function staticListState(pathname: string, size = SIZE_DESKTOP): ListState {
    const href = (patch: Record<string, string | number | null>) => pathname + listQuery('', patch);
    return { page: 1, size, q: '', status: '', barangay: '', href, set: () => {}, pageHref: (n: number) => href({ page: n }) };
}
