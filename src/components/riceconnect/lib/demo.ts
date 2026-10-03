/* The design's lib/demo.ts, re-pointed at the prototype's seeded data (src/data). Same export names and shapes;
   money is integer centavos (PRICE, SLIP, VEHICLES.price), formatted with peso() / rate(). */
export { BARANGAYS, VARIETIES, WEEKS, FARMS, HERO_FARM, HERO_LOT as LOT, VEHICLES, HAUL, SLOT, SLIP, COMMITMENTS, PLAN, SMS } from '@/data/seed';
export type { Farm, FarmStatus } from '@/data/seed';
export { RATES as PRICE } from '@/data/seed';
export { peso, rate } from '@/data/money';
