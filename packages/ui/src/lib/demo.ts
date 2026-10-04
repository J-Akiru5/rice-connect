/* The design's lib/demo.ts, re-pointed at the prototype's seeded data (src/data). Same export names and shapes;
   money is integer centavos (PRICE, SLIP, VEHICLES.price), formatted with peso() / rate(). */
export {
    BARANGAYS,
    VARIETIES,
    WEEKS,
    FARMS,
    HERO_FARM,
    HERO_LOT as LOT,
    VEHICLES,
    HAUL,
    SLOT,
    SLIP,
    COMMITMENTS,
    PLAN,
    SMS
} from '@rc/domain/seed';
export type { Farm, FarmStatus } from '@rc/domain/seed';
export { RATES as PRICE } from '@rc/domain/seed';
export { peso, rate } from '@rc/domain/money';
