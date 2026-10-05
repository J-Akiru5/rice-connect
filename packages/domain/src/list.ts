/* Pure list helpers: page window, paginate, filter + sort, URL params. No React, fully unit-tested (list.test.ts). */

export const PAGE_SIZES = [10, 20, 50] as const;
export const SIZE_MOBILE = 10;
export const SIZE_DESKTOP = 20;
export type PageItem = number | 'gap';

export const pageCount = (total: number, pageSize: number) =>
    Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
export const clampPage = (page: number, pages: number) =>
    Math.min(Math.max(1, Math.floor(Number.isFinite(page) ? page : 1)), Math.max(1, pages));

/** Page buttons to show: first, last, current ±1, and 'gap' for hidden runs. A gap that would hide a single page shows that page instead. */
export function getPageWindow(total: number, page: number, pageSize: number): PageItem[] {
    const pages = pageCount(total, pageSize);
    const cur = clampPage(page, pages);
    const keep = new Set([1, pages, cur - 1, cur, cur + 1].filter((p) => p >= 1 && p <= pages));
    const sorted = [...keep].sort((a, b) => a - b);
    const out: PageItem[] = [];
    sorted.forEach((p, i) => {
        const prev = sorted[i - 1];
        if (prev !== undefined && p - prev === 2) out.push(prev + 1);
        else if (prev !== undefined && p - prev > 2) out.push('gap');
        out.push(p);
    });
    return out;
}

export interface Page<T> {
    rows: T[];
    page: number;
    pages: number;
    from: number;
    to: number;
    total: number;
    size: number;
}
/** Slice one page. Out-of-range pages clamp to the nearest valid page; an empty list is page 1 of 1, "0-0 of 0". */
export function paginate<T>(items: readonly T[], page: number, size: number): Page<T> {
    const total = items.length;
    const pages = pageCount(total, size);
    const p = clampPage(page, pages);
    const start = (p - 1) * size;
    const rows = items.slice(start, start + size);
    return { rows, page: p, pages, total, size, from: total ? start + 1 : 0, to: start + rows.length };
}

export interface FarmFilter {
    q?: string;
    status?: string;
    barangay?: string;
}
interface FarmLike {
    id: string;
    name: string;
    barangay: string;
    variety: string;
    status: string;
}
/** Search (ID, farmer code, barangay, variety; case-insensitive) AND status AND barangay. */
export function filterFarms<T extends FarmLike>(farms: readonly T[], f: FarmFilter): T[] {
    const q = (f.q ?? '').trim().toLowerCase();
    return farms.filter(
        (x) =>
            (!f.status || x.status === f.status) &&
            (!f.barangay || x.barangay === f.barangay) &&
            (!q || [x.id, x.name, x.barangay, x.variety].some((v) => v.toLowerCase().includes(q)))
    );
}
/** Stable sort by a key (ascending), ties keep input order. */
export function sortBy<T>(items: readonly T[], key: (x: T) => string | number): T[] {
    return items
        .map((x, i) => ({ x, i }))
        .sort((a, b) => {
            const ka = key(a.x),
                kb = key(b.x);
            return ka < kb ? -1 : ka > kb ? 1 : a.i - b.i;
        })
        .map((w) => w.x);
}

export interface ListParams {
    page: number;
    size: number | null;
    q: string;
    status: string;
    barangay: string;
}
type Getter = { get(name: string): string | null };
/** Read list state from the URL. `size` is null when absent or not one of 10 / 20 / 50 (the caller picks 10 or 20 by width). */
export function parseListParams(sp: Getter): ListParams {
    const page = Number.parseInt(sp.get('page') ?? '1', 10);
    const size = Number.parseInt(sp.get('size') ?? '', 10);
    return {
        page: Number.isFinite(page) && page >= 1 ? page : 1,
        size: (PAGE_SIZES as readonly number[]).includes(size) ? size : null,
        q: sp.get('q') ?? '',
        status: sp.get('status') ?? '',
        barangay: sp.get('barangay') ?? ''
    };
}
/** Build "?page=2&q=..." from the current params plus a patch. A changed search, filter or size resets to page 1.
    Empty values and page 1 are left out. Other params on the URL (e.g. week) are kept. */
export function listQuery(
    current: URLSearchParams | string,
    patch: Partial<Record<keyof ListParams | string, string | number | null>>
): string {
    const next = new URLSearchParams(typeof current === 'string' ? current : current.toString());
    const resets = ['q', 'status', 'barangay', 'size'].some(
        (k) => k in patch && String(patch[k] ?? '') !== (next.get(k) ?? '')
    );
    for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === undefined || v === '') next.delete(k);
        else next.set(k, String(v));
    }
    if (resets && !('page' in patch)) next.delete('page');
    if (next.get('page') === '1') next.delete('page');
    const s = next.toString();
    return s ? `?${s}` : '';
}
