import { describe, expect, it } from 'vitest';
import * as B from './buyers';
import { HERO_LOT, TOTALS } from './seed';

describe('buyers: milled rice (assumed numbers)', () => {
    it('mills at the assumed recovery, rounded down to whole kg', () => {
        expect(B.MILLING.recoveryPct).toBe(62);
        expect(B.milledKg(5000)).toBe(3100);
        expect(B.milledKg(1)).toBe(0);
    });
    it('the hero rice lot comes from L-03', () => {
        expect(B.HERO_RICE_LOT).toEqual({ id: 'ML-03', fromLot: HERO_LOT.id, kg: 3100 });
    });
    it('prices orders in whole sacks', () => {
        const o = B.makeRiceOrder('restaurant', 4, 'W3', 1);
        expect(o).toMatchObject({ id: 'R-001', kg: 100, sacks: 4, total: 100 * 4800 });
    });
    it('rejects bad orders', () => {
        expect(() => B.makeRiceOrder('miller', 1, 'W3', 1)).toThrow();
        expect(() => B.makeRiceOrder('restaurant', 0, 'W3', 1)).toThrow();
        expect(() => B.makeRiceOrder('market', 1.5, 'W3', 1)).toThrow();
        expect(() => B.makeRiceOrder('retailer', 10_000, 'W3', 1)).toThrow();
    });
    it('supply is aggregated by barangay and adds up to the cluster total', () => {
        expect(B.SUPPLY).toHaveLength(3);
        expect(B.SUPPLY_WEEK_TOTAL.reduce((a, b) => a + b, 0)).toBe(TOTALS.driedKg);
        for (const r of B.SUPPLY) expect(r).not.toHaveProperty('farmIds');
    });
    it('rice available = partner miller palay × recovery', () => {
        expect(B.RICE_AVAILABLE_KG).toBe(B.milledKg(B.PARTNER_PALAY_KG));
        expect(B.isBuyerType('restaurant')).toBe(true);
        expect(B.isBuyerType('chef')).toBe(false);
    });
});
