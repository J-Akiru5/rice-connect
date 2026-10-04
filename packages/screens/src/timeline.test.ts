import { describe, expect, it } from 'vitest';
import { BEATS, TOTAL, beatIndexAt, flipLang, haulAt } from './timeline';

describe('/demo timeline', () => {
    it('runs 78 s in contiguous beats in the brief order', () => {
        expect(TOTAL).toBe(78);
        expect(BEATS.map((b) => [b.key, b.start, b.end])).toEqual([
            ['farm', 0, 6],
            ['plan', 6, 16],
            ['market', 16, 28],
            ['dry', 28, 40],
            ['haul', 40, 52],
            ['pay', 52, 64],
            ['sms', 64, 72],
            ['end', 72, 78]
        ]);
        BEATS.forEach((b, i) => i > 0 && expect(b.start).toBe(BEATS[i - 1]?.end));
    });
    it('maps times to beats, holding the end card after 78 s', () => {
        expect(BEATS[beatIndexAt(0)]?.key).toBe('farm');
        expect(BEATS[beatIndexAt(5.99)]?.key).toBe('farm');
        expect(BEATS[beatIndexAt(6)]?.key).toBe('plan');
        expect(BEATS[beatIndexAt(64)]?.key).toBe('sms');
        expect(BEATS[beatIndexAt(99)]?.key).toBe('end');
    });
    it('flips EN, TL, HIL at 64, 67 and 70 s', () => {
        expect([63.9, 64, 66.9, 67, 69.9, 70, 75].map(flipLang)).toEqual(['en', 'en', 'en', 'tl', 'tl', 'hil', 'hil']);
    });
    it('walks the haul through Assigned > Accepted > Picked up > Delivered', () => {
        expect([40, 46, 48, 50].map((t) => haulAt(t).status)).toEqual([
            'assigned',
            'accepted',
            'pickedup',
            'delivered'
        ]);
    });
});
