import { describe, expect, it } from 'vitest';
import { COMMITMENTS, DRIVERS, FARMS, HAUL, HERO_LOT, LOTS, SETTLEMENT, SLIP, SLOTS, SMS, VEHICLES } from './seed';
import { makeRiceOrder } from './buyers';
import {
    CommitmentSchema,
    DriverSchema,
    FarmSchema,
    HaulSchema,
    LotSchema,
    RiceOrderSchema,
    SettlementSchema,
    SlipSchema,
    SlotSchema,
    SmsMessageSchema,
    VehicleSchema
} from './schemas';

const order = makeRiceOrder('restaurant', 4, 'W3', 1);

describe('seed parses', () => {
    it('parses every farm, lot, slot, vehicle, driver and commitment', () => {
        for (const f of FARMS) FarmSchema.parse(f);
        for (const l of LOTS) LotSchema.parse(l);
        for (const s of SLOTS) SlotSchema.parse(s);
        for (const v of VEHICLES) VehicleSchema.parse(v);
        for (const d of DRIVERS) DriverSchema.parse(d);
        for (const c of COMMITMENTS) CommitmentSchema.parse(c);
    });

    it('parses the haul, settlement, slip, order and SMS thread', () => {
        HaulSchema.parse(HAUL);
        SettlementSchema.parse(SETTLEMENT);
        SlipSchema.parse(SLIP);
        RiceOrderSchema.parse(order);
        for (const m of SMS) SmsMessageSchema.parse(m);
    });

    it('keeps the hero lot money whole centavos', () => {
        expect(Number.isInteger(HERO_LOT.driedKg)).toBe(true);
        expect(Number.isInteger(SETTLEMENT.advance)).toBe(true);
        expect(SETTLEMENT.advance + SETTLEMENT.balance).toBe(SETTLEMENT.net);
    });
});

describe('invalid samples', () => {
    it('rejects an unmasked mobile and a negative weight', () => {
        expect(FarmSchema.safeParse({ ...FARMS[0]!, mobile: '09171234567' }).success).toBe(false);
        expect(FarmSchema.safeParse({ ...FARMS[0]!, driedKg: -1 }).success).toBe(false);
    });

    it('rejects partial sacks, a negative total and an unknown week on an order', () => {
        expect(RiceOrderSchema.safeParse({ ...order, sacks: 1.5 }).success).toBe(false);
        expect(RiceOrderSchema.safeParse({ ...order, total: -1 }).success).toBe(false);
        expect(RiceOrderSchema.safeParse({ ...order, week: 'W9' }).success).toBe(false);
    });

    it('rejects a haul with a bad id, a negative distance and a single leg', () => {
        expect(HaulSchema.safeParse({ ...HAUL, id: 'HAUL-1' }).success).toBe(false);
        expect(HaulSchema.safeParse({ ...HAUL, km: -2 }).success).toBe(false);
        expect(HaulSchema.safeParse({ ...HAUL, legKm: [3.2] }).success).toBe(false);
    });

    it('rejects an SMS missing a language', () => {
        const first = SMS[0]!;
        const { hil: _hil, ...rest } = first.text;
        expect(SmsMessageSchema.safeParse({ ...first, text: rest }).success).toBe(false);
    });
});
