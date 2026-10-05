import { describe, expect, it } from 'vitest';
import { getPageWindow, paginate, filterFarms, sortBy, parseListParams, listQuery, pageCount } from './list';
import { FARMS, BARANGAYS } from './seed';

const sp = (s: string) => new URLSearchParams(s);

describe('getPageWindow', () => {
    it('shows every page when there are few', () => {
        expect(getPageWindow(30, 1, 10)).toEqual([1, 2, 3]);
        expect(getPageWindow(50, 3, 10)).toEqual([1, 2, 3, 4, 5]);
        expect(getPageWindow(50, 1, 10)).toEqual([1, 2, 'gap', 5]);
        expect(getPageWindow(5, 1, 10)).toEqual([1]);
        expect(getPageWindow(0, 1, 10)).toEqual([1]);
    });
    it('keeps first, last and current ±1 with gaps', () => {
        expect(getPageWindow(100, 5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
        expect(getPageWindow(100, 1, 10)).toEqual([1, 2, 'gap', 10]);
        expect(getPageWindow(100, 10, 10)).toEqual([1, 'gap', 9, 10]);
    });
    it('fills a gap that would hide a single page', () => {
        expect(getPageWindow(100, 4, 10)).toEqual([1, 2, 3, 4, 5, 'gap', 10]);
        expect(getPageWindow(100, 3, 10)).toEqual([1, 2, 3, 4, 'gap', 10]);
    });
    it('clamps an out-of-range current page', () => {
        expect(getPageWindow(100, 99, 20)).toEqual([1, 'gap', 4, 5]);
        expect(getPageWindow(100, -3, 20)).toEqual([1, 2, 'gap', 5]);
    });
});

describe('paginate', () => {
    const items = Array.from({ length: 100 }, (_, i) => i + 1);
    it('slices a page and reports Showing 21-40 of 100', () => {
        const p = paginate(items, 2, 20);
        expect(p).toMatchObject({ page: 2, pages: 5, from: 21, to: 40, total: 100 });
        expect(p.rows[0]).toBe(21);
    });
    it('clamps page bounds', () => {
        expect(paginate(items, 0, 20).page).toBe(1);
        expect(paginate(items, 9, 20)).toMatchObject({ page: 5, from: 81, to: 100 });
        expect(paginate(items, 3, 50)).toMatchObject({ page: 2, from: 51, to: 100 });
    });
    it('handles a short last page and an empty list', () => {
        expect(paginate(items.slice(0, 13), 2, 10)).toMatchObject({ from: 11, to: 13, pages: 2 });
        expect(paginate([], 4, 10)).toMatchObject({ page: 1, pages: 1, from: 0, to: 0, total: 0, rows: [] });
    });
    it('pageCount never returns 0', () => expect(pageCount(0, 20)).toBe(1));
});

describe('filterFarms', () => {
    it('filters by status', () => {
        const r = filterFarms(FARMS, { status: 'registered' });
        expect(r.length).toBeGreaterThan(0);
        expect(r.every((f) => f.status === 'registered')).toBe(true);
    });
    it('filters by barangay (33/34/33)', () => {
        expect(filterFarms(FARMS, { barangay: BARANGAYS[1] })).toHaveLength(34);
    });
    it('searches ID, case-insensitive, and combines with filters', () => {
        expect(filterFarms(FARMS, { q: 'f-014' }).map((f) => f.id)).toEqual(['F-014']);
        expect(filterFarms(FARMS, { q: 'F-014', barangay: BARANGAYS[2] })).toEqual([]);
    });
    it('returns everything with no filter and nothing for a miss', () => {
        expect(filterFarms(FARMS, {})).toHaveLength(100);
        expect(filterFarms(FARMS, { q: 'zzz' })).toEqual([]);
    });
});

describe('sortBy', () => {
    it('is stable', () => {
        const r = sortBy(
            [
                { k: 2, n: 'a' },
                { k: 1, n: 'b' },
                { k: 2, n: 'c' }
            ],
            (x) => x.k
        );
        expect(r.map((x) => x.n)).toEqual(['b', 'a', 'c']);
    });
});

describe('URL state', () => {
    it('parses and validates params', () => {
        expect(parseListParams(sp('page=2&size=20&q=x&status=verified&barangay=B'))).toEqual({
            page: 2,
            size: 20,
            q: 'x',
            status: 'verified',
            barangay: 'B'
        });
        expect(parseListParams(sp('page=-1&size=7'))).toMatchObject({ page: 1, size: null });
        expect(parseListParams(sp(''))).toMatchObject({ page: 1, size: null, q: '' });
    });
    it('changing search, a filter or the size resets to page 1', () => {
        expect(listQuery('page=3&q=a', { q: 'b' })).toBe('?q=b');
        expect(listQuery('page=3', { status: 'verified' })).toBe('?status=verified');
        expect(listQuery('page=3&size=20', { size: 50 })).toBe('?size=50');
    });
    it('keeps the page when only the page changes, drops page 1 and empty values', () => {
        expect(listQuery('q=a', { page: 2 })).toBe('?q=a&page=2');
        expect(listQuery('q=a&page=2', { page: 1 })).toBe('?q=a');
        expect(listQuery('q=a&week=2', { q: '' })).toBe('?week=2');
    });
});
