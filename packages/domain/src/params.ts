/* Numbers GIVEN in the build brief (not assumptions). Assumptions live in overrides.json.
   Money is integer centavos. */
export const SEED = 20261009;
export const FARM_COUNT = 100;
export const TOTAL_AREA_TENTHS = 1200; // 120.0 ha, exactly
export const AREA_MIN_TENTHS = 5; // 0.5 ha
export const AREA_MAX_TENTHS = 25; // 2.5 ha
export const BARANGAY_SPLIT = [33, 34, 33] as const;
/* Real barangays of Dingle, Iloilo, chosen by the team (the farms in them are still simulated). */
export const BARANGAYS = ['San Matias', 'Licu-an', 'Ilajas'] as const;
export const MUNICIPALITY = 'Dingle, Iloilo';
export const WEEKS = ['W1', 'W2', 'W3', 'W4'] as const;

export const YIELD_WET_KG_PER_HA = 4000;
export const LOSS_PCT = 3;
export const DRYING_FACTOR_PER_MILLE = 884; // 0.884

export const PRICE = {
    quoted: 2250, // ₱22.50/kg
    drying: 150, // ₱1.50/kg
    margin: 100, // ₱1.00/kg
    advancePct: 80,
    buyerFeePct: 3, // of quoted, paid by the buyer, never deducted
} as const;

export const COMMITMENTS_BRIEF = [
    { id: 'C-01', buyer: 'Buyer A (simulated)', tonnes: 30, grade: 'Grade 1', mcPct: 14, price: 2250, window: ['W3', 'W4'] },
    { id: 'C-02', buyer: 'Buyer B (simulated)', tonnes: 25, window: ['W2', 'W3'] },
] as const;

/* The one lot that flows through every module. */
export const HERO = { farm: 'F-014', lot: 'L-03', haul: 'H-07', lotKg: 5000, commitment: 'C-01', slip: 'S-0303' } as const;
