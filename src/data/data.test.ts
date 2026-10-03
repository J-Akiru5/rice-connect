import { describe, expect, it } from 'vitest';
import { settle } from './settlement';
import { peso, rate, pesoAscii } from './money';
import { autoMatch } from './match';
import { autoAssign, assignDryerSlots } from './assign';
import { mulberry32 } from './rng';
import * as D from './seed';
import { HERO } from './params';

describe('settlement: lot L-03 fixture (5,000 kg)', () => {
    const s = settle(5000);
    it('matches the brief to the centavo', () => {
        expect(s.gross).toBe(11_250_000); // ₱112,500.00
        expect(s.drying).toBe(750_000); // ₱7,500.00
        expect(s.margin).toBe(500_000); // ₱5,000.00
        expect(s.net).toBe(10_000_000); // ₱100,000.00
        expect(s.advance).toBe(8_000_000); // ₱80,000.00
        expect(s.balance).toBe(2_000_000); // ₱20,000.00
        expect(s.buyerFee).toBe(337_500); // ₱3,375.00, paid by the buyer
    });
    it('net per kg is 20.00 and the buyer fee rate rounds to 0.68', () => {
        expect(rate(s.rates.net)).toBe('20.00');
        expect(rate(s.rates.buyerFee)).toBe('0.68');
    });
    it('the buyer fee is never deducted from the farmer', () => {
        expect(s.net).toBe(s.gross - s.drying - s.margin);
        expect(s.advance + s.balance).toBe(s.net);
    });
    it('the seeded hero slip is this settlement', () => {
        expect(D.SLIP).toMatchObject({ lot: 'L-03', farm: 'F-014', haul: 'H-07', kg: 5000, net: 10_000_000, advance: 8_000_000, balance: 2_000_000, buyerFee: 337_500 });
    });
});

describe('money formatting', () => {
    it('shows ₱ with 2 decimals from integer centavos', () => {
        expect(peso(11_250_000)).toBe('₱112,500.00');
        expect(peso(68)).toBe('₱0.68');
        expect(pesoAscii(8_000_000)).toBe('PHP 80,000.00');
    });
    it('rejects non-integer centavos', () => {
        expect(() => peso(1.5)).toThrow();
    });
});

describe('seed: farms', () => {
    it('is deterministic (mulberry32, seed 20261009)', () => {
        const a = mulberry32(20261009); const b = mulberry32(20261009);
        expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    });
    it('has 100 farms totalling exactly 120.0 ha, each 0.5-2.5 ha', () => {
        expect(D.FARMS).toHaveLength(100);
        expect(D.FARMS.reduce((s, f) => s + f.areaTenths, 0)).toBe(1200);
        for (const f of D.FARMS) { expect(f.areaTenths).toBeGreaterThanOrEqual(5); expect(f.areaTenths).toBeLessThanOrEqual(25); }
    });
    it('splits barangays 33/34/33 and spreads harvests over W1-W4', () => {
        expect(D.BARANGAYS.map((b) => D.FARMS.filter((f) => f.barangay === b).length)).toEqual([33, 34, 33]);
        for (const w of D.WEEKS) expect(D.FARMS.some((f) => f.harvestWeek === w)).toBe(true);
    });
    it('uses codes and masked mobiles only', () => {
        for (const f of D.FARMS) { expect(f.name).toBe(`Farmer ${f.id}`); expect(f.mobile).toMatch(/^09•• ••• \d{4}$/); }
    });
    it('dries 3,429 kg/ha (~411 t in total)', () => {
        expect(D.DRIED_KG_PER_HA).toBe(3429);
        expect(Math.round(D.TOTALS.driedKg / 1000)).toBe(411);
    });
});

describe('IDs link the modules: F-014 → L-03 → H-07 → dryer slot → slip', () => {
    it('chains', () => {
        expect(D.HERO_LOT).toMatchObject({ id: HERO.lot, farm: HERO.farm, driedKg: 5000 });
        expect(D.HAUL).toMatchObject({ id: HERO.haul, lot: HERO.lot });
        expect(D.SLOT.lot).toBe(HERO.lot);
        expect(D.SLIP).toMatchObject({ haul: HERO.haul, slot: D.SLOT.id, lot: HERO.lot, farm: HERO.farm });
        expect(D.commitmentOfLot(HERO.lot)).toBe('C-01');
    });
});

describe('auto-match', () => {
    it('matched tonnes >= requested for every commitment', () => {
        for (const m of D.MATCHES) expect(m.kg).toBeGreaterThanOrEqual(m.requestedKg);
    });
    it('never uses a lot twice and respects the window', () => {
        const all = D.MATCHES.flatMap((m) => m.lots);
        expect(new Set(all).size).toBe(all.length);
        for (const m of D.MATCHES) {
            const c = D.COMMITMENTS.find((x) => x.id === m.commitment)!;
            for (const id of m.lots) expect(c.window).toContain(D.lotById(id)!.week);
        }
    });
    it('reports an unfilled commitment when the forecast is short', () => {
        const r = autoMatch([{ id: 'X', tonnes: 10, grade: 'G', mcPct: 14, window: ['W1'] }], [{ id: 'a', week: 'W1', dayIndex: 0, driedKg: 4000, grade: 'G', mcPct: 14 }]);
        expect(r[0]).toMatchObject({ filled: false, kg: 4000 });
    });
});

describe('dryer slots', () => {
    it('no dryer day goes over 24 t', () => {
        const days = new Set(D.SLOTS.map((s) => s.dayIndex));
        for (const d of days) expect(D.dryerKgOnDay(d)).toBeLessThanOrEqual(24_000);
    });
    it('every lot gets one slot, never before its harvest day', () => {
        expect(D.SLOTS).toHaveLength(D.LOTS.length);
        for (const s of D.SLOTS) expect(s.dayIndex).toBeGreaterThanOrEqual(D.lotById(s.lot)!.dayIndex);
    });
    it('pushes overflow to the next day', () => {
        const s = assignDryerSlots([{ id: 'a', dayIndex: 0, driedKg: 15000 }, { id: 'b', dayIndex: 0, driedKg: 15000 }], 24000);
        expect(s.map((x) => x.dayIndex)).toEqual([0, 1]);
    });
});

describe('driver auto-assignment', () => {
    const vehicles = [{ id: 'tri', icon: 'Tricycle', capacity: 10, price: 45000 }, { id: 'truck', icon: 'Truck', capacity: 100, price: 350000 }, { id: 'pickup', icon: 'Multicab', capacity: 100, price: 120000 }];
    const d = (id: string, vehicle: string, distanceKm: number, available = true) => ({ id, name: id, plate: id, vehicle, distanceKm, available });
    it('respects capacity: the nearest driver is skipped when the load does not fit', () => {
        expect(autoAssign(60, [d('near', 'tri', 1), d('far', 'truck', 5)], vehicles)?.id).toBe('far');
    });
    it('skips unavailable drivers and returns null when nobody fits', () => {
        expect(autoAssign(60, [d('a', 'truck', 1, false)], vehicles)).toBeNull();
        expect(autoAssign(500, [d('a', 'truck', 1)], vehicles)).toBeNull();
    });
    it('breaks distance ties on the lowest price', () => {
        expect(autoAssign(60, [d('t', 'truck', 3), d('p', 'pickup', 3)], vehicles)?.id).toBe('p');
    });
    it('the hero haul H-07 got a driver whose vehicle carries all its sacks', () => {
        expect(D.HAUL.driver).not.toBeNull();
        expect(D.vehicleOf(D.HAUL.driver!).capacity).toBeGreaterThanOrEqual(D.HAUL.sacks);
    });
});

describe('SMS', () => {
    it('is plain ASCII and fits one 160-character SMS in every language', () => {
        for (const m of D.SMS) for (const t of Object.values(m.text)) { expect(t).toMatch(/^[\x20-\x7E]*$/); expect(t.length).toBeLessThanOrEqual(160); }
    });
});
