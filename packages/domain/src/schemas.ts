import { z } from 'zod';
import { BARANGAYS, WEEKS } from './params';

/* One schema per entity (docs/plan/03-architecture.md#data-contracts); TypeScript types are inferred from these.
   Money is an integer number of centavos; ids keep the seed's format. */

export const BarangaySchema = z.enum(BARANGAYS);
export const WeekSchema = z.enum(WEEKS);
export const CentavosSchema = z.number().int().nonnegative();
export const KgSchema = z.number().int().nonnegative();

export const FarmStatusSchema = z.enum(['registered', 'verified', 'cluster']);
export const FarmSchema = z.object({
    id: z.string().regex(/^F-\d{3}$/),
    name: z.string().min(1),
    mobile: z.string().regex(/^09•• ••• \d{4}$/),
    barangay: BarangaySchema,
    areaHa: z.number().positive(),
    variety: z.string().min(1),
    plantingWeek: z.string().min(1),
    status: FarmStatusSchema,
    harvestWeek: WeekSchema,
    tonnes: z.number().nonnegative(),
    areaTenths: z.number().int().positive(),
    harvestDay: z.number().int().nonnegative(),
    harvestLabel: z.string().min(1),
    driedKg: KgSchema
});

export const LotSchema = z.object({
    id: z.string().regex(/^L-\d{2,3}$/),
    farm: z.string().regex(/^F-\d{3}$/),
    sacks: z.number().int().positive(),
    kgPerSack: z.number().int().positive(),
    wetKg: KgSchema,
    driedKg: KgSchema,
    grade: z.string().min(1),
    mc: z.string().min(1),
    week: WeekSchema,
    dayIndex: z.number().int().nonnegative(),
    mcPct: z.number().nonnegative(),
    actual: z.boolean()
});

export const SlotSchema = z.object({
    id: z.string().regex(/^D-\d+$/),
    dryer: z.string().min(1),
    day: z.string().min(1),
    time: z.string().min(1),
    sacks: z.number().int().positive(),
    capacityPerDay: z.number().positive(),
    lot: z.string().regex(/^L-\d{2,3}$/),
    kg: KgSchema,
    dayIndex: z.number().int().nonnegative()
});

export const VehicleSchema = z.object({
    id: z.string().min(1),
    icon: z.string().min(1),
    capacity: z.number().int().positive(),
    price: CentavosSchema
});

export const DriverSchema = z.object({
    id: z.string().regex(/^DR-\d{2}$/),
    name: z.string().min(1),
    vehicle: z.string().min(1),
    plate: z.string().min(1),
    available: z.boolean(),
    distanceKm: z.number().nonnegative()
});

export const RouteStopSchema = z.object({ label: z.string().min(1), place: z.string().min(1) });
export const HaulSchema = z.object({
    id: z.string().regex(/^H-\d+$/),
    lot: z.string().regex(/^L-\d{2,3}$/),
    sacks: z.number().int().positive(),
    vehicle: z.string().nullable(),
    driver: DriverSchema.nullable(),
    from: RouteStopSchema,
    via: RouteStopSchema,
    to: RouteStopSchema,
    pickup: z.string().min(1),
    pickupDay: z.number().int().nonnegative(),
    km: z.number().nonnegative(),
    legKm: z.tuple([z.number().nonnegative(), z.number().nonnegative()])
});

export const CommitmentSchema = z.object({
    id: z.string().regex(/^C-\d{2}$/),
    buyer: z.string().min(1),
    tonnes: z.number().positive(),
    grade: z.string().min(1),
    mc: z.string().min(1),
    price: CentavosSchema,
    week: z.string().min(1),
    filled: z.number().nonnegative(),
    status: z.enum(['open', 'full']),
    window: z.array(WeekSchema).min(1),
    mcPct: z.number().nonnegative(),
    assumed: z.array(z.enum(['grade', 'mc', 'price']))
});

export const BuyerTypeSchema = z.enum(['miller', 'retailer', 'market', 'restaurant']);
export const RiceOrderSchema = z.object({
    id: z.string().regex(/^R-\d{3}$/),
    type: BuyerTypeSchema,
    kg: KgSchema,
    sacks: z.number().int().positive(),
    total: CentavosSchema,
    week: WeekSchema
});

export const SettlementSchema = z.object({
    kg: KgSchema,
    gross: CentavosSchema,
    drying: CentavosSchema,
    margin: CentavosSchema,
    net: CentavosSchema,
    advance: CentavosSchema,
    balance: CentavosSchema,
    buyerFee: CentavosSchema,
    rates: z.object({
        quoted: CentavosSchema,
        drying: CentavosSchema,
        margin: CentavosSchema,
        net: CentavosSchema,
        buyerFee: CentavosSchema
    })
});

export const SlipSchema = z.object({
    id: z.string().regex(/^S-\d+$/),
    lot: z.string().regex(/^L-\d{2,3}$/),
    farm: z.string().regex(/^F-\d{3}$/),
    haul: z.string().regex(/^H-\d+$/),
    slot: z.string().regex(/^D-\d+$/),
    kg: KgSchema,
    gross: CentavosSchema,
    drying: CentavosSchema,
    margin: CentavosSchema,
    net: CentavosSchema,
    advance: CentavosSchema,
    balance: CentavosSchema,
    buyerFee: CentavosSchema,
    date: z.string().min(1)
});

export const SmsMessageSchema = z.object({
    key: z.enum(['slot', 'advance', 'balance']),
    time: z.string().min(1),
    text: z.object({ en: z.string().min(1), tl: z.string().min(1), hil: z.string().min(1) })
});

export type Farm = z.infer<typeof FarmSchema>;
export type Week = z.infer<typeof WeekSchema>;
export const isWeek = (v: unknown): v is Week => WeekSchema.safeParse(v).success;
export type Lot = z.infer<typeof LotSchema>;
export type Slot = z.infer<typeof SlotSchema>;
export type Vehicle = z.infer<typeof VehicleSchema>;
export type Driver = z.infer<typeof DriverSchema>;
export type Haul = z.infer<typeof HaulSchema>;
export type Commitment = z.infer<typeof CommitmentSchema>;
export type BuyerType = z.infer<typeof BuyerTypeSchema>;
export type RiceOrder = z.infer<typeof RiceOrderSchema>;
export type Settlement = z.infer<typeof SettlementSchema>;
export type Slip = z.infer<typeof SlipSchema>;
export type SmsMessage = z.infer<typeof SmsMessageSchema>;
