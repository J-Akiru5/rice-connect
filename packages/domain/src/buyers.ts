/* Buyer side of the simulated data: what each buyer type can see and buy.
   Millers buy dried palay (the brief's commitments). Retailers, market sellers and restaurants buy milled rice,
   which comes from palay the partner miller mills. Milling numbers are ASSUMED (overrides.json, docs/NUMBERS.md). */
import overrides from './overrides.json';
import { BARANGAYS, WEEKS, FARMS, LOTS, MATCHES, COMMITMENTS, HERO_LOT, type Lot } from './seed';
import type { Centavos } from './money';

export type BuyerType = 'miller' | 'retailer' | 'market' | 'restaurant';
export const BUYER_TYPES: BuyerType[] = ['miller', 'retailer', 'market', 'restaurant'];
export const isBuyerType = (v: unknown): v is BuyerType =>
    typeof v === 'string' && (BUYER_TYPES as string[]).includes(v);
export const buysPalay = (t: BuyerType) => overrides.buyerTypes[t] === 'palay';

export const MILLING = {
    recoveryPct: overrides.milling.recoveryPct,
    price: overrides.milling.priceCentavosPerKg as Centavos,
    sackKg: overrides.milling.sackKg,
    partnerMiller: overrides.milling.partnerMiller
};
/** Milled rice from dried palay at the assumed recovery rate, whole kg (rounded down). */
export const milledKg = (palayKg: number) => Math.floor((palayKg * MILLING.recoveryPct) / 100);
/** Price of a milled-rice order in centavos. */
export const ricePrice = (kg: number): Centavos => kg * MILLING.price;
export const riceSacks = (kg: number) => Math.ceil(kg / MILLING.sackKg);

/** Palay the cluster has not yet committed to any buyer, by lot. */
export const UNCOMMITTED_LOTS: Lot[] = LOTS.filter((l) => !MATCHES.some((m) => m.lots.includes(l.id)));

/** Supply by barangay and week, in kg: dried palay forecast, and the milled-rice equivalent. Aggregated: never per farm. */
export const SUPPLY = BARANGAYS.map((b) => {
    const palay = WEEKS.map((w) =>
        FARMS.filter((f) => f.barangay === b && f.harvestWeek === w).reduce((s, f) => s + f.driedKg, 0)
    );
    return { barangay: b, farms: FARMS.filter((f) => f.barangay === b).length, palay, rice: palay.map(milledKg) };
});
export const SUPPLY_WEEK_TOTAL = WEEKS.map((_, i) => SUPPLY.reduce((s, r) => s + (r.palay[i] ?? 0), 0));

/** Milled rice the partner miller can offer from the palay committed to it (C-01 today), at the assumed recovery. */
export const PARTNER_COMMITMENT = COMMITMENTS.find((c) => c.buyer === MILLING.partnerMiller)!;
export const PARTNER_PALAY_KG = MATCHES.find((m) => m.commitment === PARTNER_COMMITMENT.id)!.kg;
export const RICE_AVAILABLE_KG = milledKg(PARTNER_PALAY_KG);
/** The milled lot made from the hero palay lot L-03 (what a rice order traces back to). */
export const HERO_RICE_LOT = { id: 'M' + HERO_LOT.id, fromLot: HERO_LOT.id, kg: milledKg(HERO_LOT.driedKg) };

export interface RiceOrder {
    id: string;
    type: BuyerType;
    kg: number;
    sacks: number;
    total: Centavos;
    week: string;
}
/** A new milled-rice order: whole sacks, priced at the assumed rate. Rejects zero, partial sacks and more than is available. */
export function makeRiceOrder(
    type: BuyerType,
    sacks: number,
    week: string,
    seq: number,
    availableKg = RICE_AVAILABLE_KG
): RiceOrder {
    if (buysPalay(type)) throw new Error('millers buy palay through commitments, not rice orders');
    if (!Number.isInteger(sacks) || sacks < 1) throw new Error('order at least one whole sack');
    const kg = sacks * MILLING.sackKg;
    if (kg > availableKg) throw new Error(`only ${availableKg} kg available`);
    return { id: `R-${String(seq).padStart(3, '0')}`, type, kg, sacks, total: ricePrice(kg), week };
}
