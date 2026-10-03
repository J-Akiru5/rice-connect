/* SIMULATED DATA for the RiceConnect Enactus 2026 prototype. Nothing here is real.
   Deterministic: mulberry32 with seed 20261009. Same shapes as the design system's lib/demo.ts
   (Farm, Lot, Haul, Slot, Slip, Commitment). Every number is computed from params.ts (the brief)
   or overrides.json (assumptions, listed in docs/NUMBERS.md). Money in integer centavos. */
import overrides from './overrides.json';
import { mulberry32 } from './rng';
import {
    SEED, FARM_COUNT, TOTAL_AREA_TENTHS, AREA_MIN_TENTHS, AREA_MAX_TENTHS, BARANGAY_SPLIT, BARANGAYS, WEEKS,
    YIELD_WET_KG_PER_HA, LOSS_PCT, DRYING_FACTOR_PER_MILLE, PRICE, COMMITMENTS_BRIEF, HERO,
} from './params';
import { dayLabel, dateLabel, monthWeekLabel } from './calendar';
import { settle } from './settlement';
import { pesoAscii, rate } from './money';
import { autoMatch, forecastKg, type MatchLot } from './match';
import { autoAssign, assignDryerSlots, type Driver, type Vehicle } from './assign';

export { BARANGAYS, WEEKS };
export const VARIETIES = ['NSIC Rc 222', 'NSIC Rc 216', 'NSIC Rc 160'] as const; // from the design's lib/demo.ts
export const KG_PER_SACK = overrides.kgPerSack;

/* ---------- yield ---------- */
/** 4,000 kg/ha wet × (1 − 3%) × 0.884, truncated to whole kg = 3,429 kg/ha dried. */
export const DRIED_KG_PER_HA = Math.floor((YIELD_WET_KG_PER_HA * (100 - LOSS_PCT) * DRYING_FACTOR_PER_MILLE) / 100 / 1000);
const driedKgFor = (areaTenths: number) => Math.round((areaTenths * DRIED_KG_PER_HA) / 10);

/* ---------- farms ---------- */
export type FarmStatus = 'registered' | 'verified' | 'cluster';
export interface Farm {
    id: string; name: string; mobile: string; barangay: string; areaHa: number;
    variety: string; plantingWeek: string; status: FarmStatus; harvestWeek: string; tonnes: number;
    areaTenths: number; harvestDay: number; harvestLabel: string; driedKg: number;
}

const rng = mulberry32(SEED);
interface Draw { raw: number; week: number; day: number; variety: number; mobile: number }
const draws: Draw[] = Array.from({ length: FARM_COUNT }, () => ({
    raw: 0.5 + rng() * 2.0, week: Math.floor(rng() * 4), day: Math.floor(rng() * 7),
    variety: Math.floor(rng() * VARIETIES.length), mobile: Math.floor(rng() * 10000),
}));
const HERO_INDEX = Number(HERO.farm.slice(2)) - 1;

/** Areas in tenths of a hectare: scaled to the total, clamped to 0.5–2.5 ha, residual on the last farm. */
export function normalizeAreas(raw: number[], total: number, min: number, max: number, pinned: Record<number, number> = {}): number[] {
    const pinnedSum = Object.values(pinned).reduce((a, b) => a + b, 0);
    const freeRaw = raw.reduce((s, x, i) => (i in pinned ? s : s + x), 0);
    const scale = (total - pinnedSum) / freeRaw;
    const out = raw.map((x, i) => (i in pinned ? pinned[i] : Math.min(max, Math.max(min, Math.round(x * scale)))));
    const last = out.length - 1;
    out[last] = total - out.slice(0, last).reduce((a, b) => a + b, 0);
    // If the residual left the range, move single tenths to or from the earliest farms that have room.
    for (let i = 0; out[last] > max && i < last; i++) while (!(i in pinned) && out[i] < max && out[last] > max) { out[i]++; out[last]--; }
    for (let i = 0; out[last] < min && i < last; i++) while (!(i in pinned) && out[i] > min && out[last] < min) { out[i]--; out[last]++; }
    return out;
}

const areas = normalizeAreas(draws.map((d) => d.raw * 10), TOTAL_AREA_TENTHS, AREA_MIN_TENTHS, AREA_MAX_TENTHS, { [HERO_INDEX]: overrides.hero.areaTenths });
const barangayOf = (i: number) => (i < BARANGAY_SPLIT[0] ? 0 : i < BARANGAY_SPLIT[0] + BARANGAY_SPLIT[1] ? 1 : 2);

export const FARMS: Farm[] = draws.map((d, i) => {
    const n = i + 1;
    const id = 'F-' + String(n).padStart(3, '0');
    const isHero = i === HERO_INDEX;
    const week = isHero ? WEEKS.indexOf(overrides.hero.harvestWeek as (typeof WEEKS)[number]) : d.week;
    const harvestDay = week * 7 + d.day;
    const driedKg = driedKgFor(areas[i]);
    const status: FarmStatus = isHero ? (overrides.hero.pinStatus as FarmStatus) : n % 9 === 0 ? 'registered' : n % 4 === 0 ? 'verified' : 'cluster'; // design rule
    return {
        id, name: `Farmer ${id}`, mobile: `09•• ••• ${String(d.mobile).padStart(4, '0')}`,
        barangay: BARANGAYS[barangayOf(i)], areaHa: areas[i] / 10, areaTenths: areas[i],
        variety: VARIETIES[d.variety], plantingWeek: monthWeekLabel(harvestDay - overrides.cropDaysPlantingToHarvest),
        status, harvestWeek: WEEKS[week], harvestDay, harvestLabel: dayLabel(harvestDay),
        tonnes: Math.round(driedKg / 100) / 10, driedKg,
    };
});
export const HERO_FARM: Farm = FARMS[HERO_INDEX];
export const farmById = (id: string) => FARMS.find((f) => f.id === id);

/* ---------- lots ---------- */
export interface Lot {
    id: string; farm: string; sacks: number; kgPerSack: number; wetKg: number; driedKg: number; grade: string; mc: string;
    week: string; dayIndex: number; mcPct: number; actual: boolean;
}
const GRADE = overrides.forecastGrade;
const MC = overrides.forecastMcPct;
/** One forecast lot per farm. L-03 is the hero lot (weighed: 5,000 kg); the rest are numbered by harvest date. */
export const LOTS: Lot[] = (() => {
    const byDate = [...FARMS].sort((a, b) => a.harvestDay - b.harvestDay || a.id.localeCompare(b.id));
    const heroNo = Number(HERO.lot.slice(2));
    let next = 1;
    return byDate.map((f) => {
        const isHero = f.id === HERO.farm;
        if (!isHero && next === heroNo) next++;
        const no = isHero ? heroNo : next++;
        const driedKg = isHero ? HERO.lotKg : f.driedKg;
        return {
            id: 'L-' + String(no).padStart(2, '0'), farm: f.id, kgPerSack: KG_PER_SACK, driedKg,
            sacks: Math.ceil(driedKg / KG_PER_SACK),
            wetKg: Math.round((driedKg * 1000 * 100) / DRYING_FACTOR_PER_MILLE / (100 - LOSS_PCT)),
            grade: GRADE, mc: `${MC}% MC`, mcPct: MC, week: f.harvestWeek, dayIndex: f.harvestDay, actual: isHero,
        };
    });
})();
export const lotById = (id: string) => LOTS.find((l) => l.id === id);
export const lotOfFarm = (farmId: string) => LOTS.find((l) => l.farm === farmId)!;
export const HERO_LOT = lotById(HERO.lot)!;

/* ---------- plan ---------- */
/** Dried tonnes by barangay and harvest week (forecast), summed from FARMS. */
export const PLAN = BARANGAYS.map((b) => ({
    barangay: b,
    weeks: WEEKS.map((w) => Math.round(FARMS.filter((f) => f.barangay === b && f.harvestWeek === w).reduce((s, f) => s + f.driedKg, 0) / 100) / 10),
    farms: FARMS.filter((f) => f.barangay === b).length,
}));
export const TOTALS = {
    farms: FARMS.length,
    areaTenths: FARMS.reduce((s, f) => s + f.areaTenths, 0),
    driedKg: FARMS.reduce((s, f) => s + f.driedKg, 0),
    wetKg: FARMS.reduce((s, f) => s + f.areaTenths * YIELD_WET_KG_PER_HA, 0) / 10,
};
export const WEEK_KG = WEEKS.map((w) => FARMS.filter((f) => f.harvestWeek === w).reduce((s, f) => s + f.driedKg, 0));

/* ---------- commitments + auto-match ---------- */
export interface Commitment { id: string; buyer: string; tonnes: number; grade: string; mc: string; price: number; week: string; filled: number; status: string; window: string[]; mcPct: number; assumed: string[] }
/** C-02 has no grade, MC or price in the brief: those come from overrides.json and are flagged as assumed. */
const BRIEF_C = COMMITMENTS_BRIEF.map((c) => {
    const given = c as { grade?: string; mcPct?: number; price?: number };
    const a = overrides.commitmentC02;
    const assumed = [given.grade === undefined && 'grade', given.mcPct === undefined && 'mc', given.price === undefined && 'price'].filter(Boolean) as string[];
    return {
        id: c.id, buyer: c.buyer, tonnes: c.tonnes, window: [...c.window] as string[],
        grade: given.grade ?? a.grade, mcPct: given.mcPct ?? a.mcPct, price: given.price ?? a.priceCentavosPerKg, assumed,
    };
});
const matchLots: MatchLot[] = LOTS.map((l) => ({ id: l.id, week: l.week, dayIndex: l.dayIndex, driedKg: l.driedKg, grade: l.grade, mcPct: l.mcPct }));
export const MATCHES = autoMatch(BRIEF_C, matchLots, { [HERO.lot]: HERO.commitment });
export const COMMITMENTS: Commitment[] = BRIEF_C.map((c) => {
    const m = MATCHES.find((x) => x.commitment === c.id)!;
    return {
        ...c, mc: `${c.mcPct}% MC`, week: `${c.window[0]}-${c.window[c.window.length - 1]}`,
        filled: Math.round(m.kg / 100) / 10, status: m.filled ? 'full' : 'open',
    };
});
export const forecastInWindow = (window: string[]) => forecastKg(window, matchLots);
export const commitmentOfLot = (lotId: string) => MATCHES.find((m) => m.lots.includes(lotId))?.commitment;

/* ---------- dryer ---------- */
export const DRYER = { name: 'Cluster Dryer 1', place: BARANGAYS[1], capacityKg: overrides.dryerKgPerDay, capacitySacks: overrides.dryerKgPerDay / KG_PER_SACK };
export const DRYER_SLOTS = assignDryerSlots(LOTS.map((l) => ({ id: l.id, dayIndex: l.dayIndex, driedKg: l.driedKg })), overrides.dryerKgPerDay);
export interface Slot { id: string; dryer: string; day: string; time: string; sacks: number; capacityPerDay: number; lot: string; kg: number; dayIndex: number }
export const SLOTS: Slot[] = DRYER_SLOTS.map((s) => ({
    id: s.id, dryer: DRYER.name, day: dayLabel(s.dayIndex), time: `${s.kg.toLocaleString('en-US')} kg`,
    sacks: Math.ceil(s.kg / KG_PER_SACK), capacityPerDay: DRYER.capacitySacks, lot: s.lot, kg: s.kg, dayIndex: s.dayIndex,
}));
export const slotOfLot = (lotId: string) => SLOTS.find((s) => s.lot === lotId)!;
export const SLOT = slotOfLot(HERO.lot);
export const dryerKgOnDay = (dayIndex: number) => SLOTS.filter((s) => s.dayIndex === dayIndex).reduce((a, s) => a + s.kg, 0);

/* ---------- haul ---------- */
export const VEHICLES: Vehicle[] = overrides.vehicles;
export const DRIVERS: Driver[] = overrides.drivers.map((d) => ({
    ...d, name: `Driver ${d.id}`, distanceKm: Math.round((0.5 + rng() * 9.5) * 10) / 10, // seeded, drawn after the farms
}));
const legKm = [Math.round((1 + rng() * 9) * 10) / 10, Math.round((1 + rng() * 9) * 10) / 10]; // farm→dryer, dryer→buyer
const heroBuyer = COMMITMENTS.find((c) => c.id === HERO.commitment)!.buyer;
const heroDriver = autoAssign(HERO_LOT.sacks, DRIVERS, VEHICLES);
export const HAUL = {
    id: HERO.haul, lot: HERO_LOT.id, sacks: HERO_LOT.sacks,
    vehicle: heroDriver?.vehicle ?? null, driver: heroDriver,
    from: { label: `Farm ${HERO_FARM.id}`, place: HERO_FARM.barangay },
    via: { label: DRYER.name, place: DRYER.place },
    to: { label: heroBuyer, place: BARANGAYS[2] },
    pickup: HERO_FARM.harvestLabel, pickupDay: HERO_FARM.harvestDay, km: Math.round((legKm[0] + legKm[1]) * 10) / 10, legKm,
};
export const vehicleOf = (d: Driver) => VEHICLES.find((v) => v.id === d.vehicle)!;

/* ---------- settlement + slip ---------- */
export const SETTLEMENT = settle(HERO_LOT.driedKg);
const advanceDay = SLOT.dayIndex + 1; // within 24 h of drying and delivery
const balanceDay = advanceDay + overrides.buyerPaysAfterDays;
export const SLIP = {
    id: HERO.slip, lot: HERO_LOT.id, farm: HERO_FARM.id, haul: HAUL.id, slot: SLOT.id, kg: SETTLEMENT.kg,
    gross: SETTLEMENT.gross, drying: SETTLEMENT.drying, margin: SETTLEMENT.margin, net: SETTLEMENT.net,
    advance: SETTLEMENT.advance, balance: SETTLEMENT.balance, buyerFee: SETTLEMENT.buyerFee, date: dateLabel(advanceDay),
};
/** Per-kg rates in centavos (same keys the design's PRICE had; values in centavos). */
export const RATES = { ...SETTLEMENT.rates, advancePct: PRICE.advancePct };

/* ---------- SMS (plain ASCII, one GSM-7 SMS each) ---------- */
const smsDay = HERO_FARM.harvestDay - overrides.smsSlotLeadDays;
const v = {
    farm: HERO_FARM.id, lot: HERO_LOT.id, haul: HAUL.id, slot: SLOT.id, slip: SLIP.id, sacks: HAUL.sacks,
    date: HERO_FARM.harvestLabel, advance: pesoAscii(SLIP.advance), balance: pesoAscii(SLIP.balance),
    net: pesoAscii(SLIP.net), rate: 'PHP ' + rate(SETTLEMENT.rates.net),
};
const f = (s: string) => s.replace(/\{(\w+)\}/g, (_, k) => String((v as Record<string, unknown>)[k]));
export const SMS = [
    { key: 'slot' as const, time: dayLabel(smsDay), text: {
        en: f('RiceConnect: {farm} harvest {date}. Haul {haul} picks up {sacks} sacks for dryer slot {slot}. Reply 1 OK, 2 to move.'),
        tl: f('RiceConnect: {farm} ani sa {date}. Kukunin ng Hakot {haul} ang {sacks} sako para sa patuyuan {slot}. Sagot 1 OK, 2 ilipat.'),
        hil: f('RiceConnect: {farm} alani sa {date}. Kuhaon sang Hakot {haul} ang {sacks} sako para sa pamalahan {slot}. Sabat 1 OK, 2 ibalhin.') } },
    { key: 'advance' as const, time: dayLabel(advanceDay), text: {
        en: f('RiceConnect: Advance {advance} sent for Lot {lot} (80% of net). Slip {slip}.'),
        tl: f('RiceConnect: Naipadala ang paunang bayad na {advance} para sa Lot {lot} (80% ng neto). Resibo {slip}.'),
        hil: f('RiceConnect: Napadala na ang abanse nga {advance} para sa Lot {lot} (80% sang neto). Resibo {slip}.') } },
    { key: 'balance' as const, time: dayLabel(balanceDay), text: {
        en: f('RiceConnect: Balance {balance} released for Lot {lot}. Total {net} ({rate}/kg). Thank you!'),
        tl: f('RiceConnect: Naibigay na ang natitirang {balance} para sa Lot {lot}. Kabuuan {net} ({rate}/kg). Salamat!'),
        hil: f('RiceConnect: Gin-release na ang nabilin nga {balance} para sa Lot {lot}. Kabilugan {net} ({rate}/kg). Salamat!') } },
];
