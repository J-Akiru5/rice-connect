import { describe, expect, it } from 'vitest';
import { rowToCommitment, rowToFarm, rowToOrder, rowToSlot } from './supabase-repos';

/* B-05: the row → domain mappers are pure, so the shape rules are unit-tested without a database. */

describe('Supabase row mapping (B-05)', () => {
    it('maps a farm row into the domain shape with derived forecast fields', () => {
        const farm = rowToFarm({
            id: 'F-014',
            name: 'Ana',
            mobile_e164: '+639171234567',
            barangay: 'Licu-an',
            area_ha: '1.5',
            variety: 'NSIC Rc 222',
            planting_week: 'W1',
            harvest_week: 'W3',
            status: 'cluster'
        });
        expect(farm).toMatchObject({
            id: 'F-014',
            mobile: '09•• ••• 4567',
            areaTenths: 15,
            harvestWeek: 'W3',
            harvestDay: 14,
            status: 'cluster'
        });
        expect(farm.driedKg).toBeGreaterThan(0);
        expect(farm.tonnes).toBeGreaterThan(0);
    });

    it('maps an order row, keeping the buyer type and week', () => {
        expect(
            rowToOrder({ id: 'R-001', buyer_type: 'miller', kg: 1000, sacks: 40, total_centavos: 4800000, week: 'W3' })
        ).toEqual({ id: 'R-001', type: 'miller', kg: 1000, sacks: 40, total: 4800000, week: 'W3' });
    });

    it('maps a slot row with the dryer label, the calendar day index and sack capacity', () => {
        expect(
            rowToSlot({
                id: 'D-58',
                dryer: 'RiceConnect Dryer',
                day: '2026-10-23',
                slot_time: 'morning',
                kg: 400,
                capacity_kg: 8000,
                lot_id: 'L-03'
            })
        ).toMatchObject({
            id: 'D-58',
            dryer: 'RiceConnect Dryer',
            day: '2026-10-23',
            time: 'morning',
            lot: 'L-03',
            /* W1 Monday is 2026-10-05, so the 23rd is day 18; 8000 kg at 50 kg/sack is 160 sacks. */
            dayIndex: 18,
            sacks: 8,
            capacityPerDay: 160
        });
    });

    it('maps a commitment row and never invents a buyer name', () => {
        const commitment = rowToCommitment(
            { id: 'C-01', tonnes: 5, grade: 'Grade 1', price_centavos_per_kg: 4600, weeks: ['W3'], status: 'open' },
            'Buyer A'
        );
        expect(commitment).toMatchObject({ buyer: 'Buyer A', tonnes: 5, week: 'W3', window: ['W3'], status: 'open' });
    });
});
