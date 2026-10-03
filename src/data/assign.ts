/* Driver auto-assignment and dryer slot assignment. Pure functions; seed.ts feeds them. */
export interface Vehicle { id: string; icon: string; capacity: number; price: number }
export interface Driver { id: string; name: string; vehicle: string; plate: string; available: boolean; distanceKm: number }

/** Nearest available driver whose vehicle carries all the sacks in one trip; tie-break: lowest price per trip, then id.
    Returns null when nobody qualifies (the Haul error state). The coordinator may override with any driver. */
export function autoAssign(sacks: number, drivers: readonly Driver[], vehicles: readonly Vehicle[]): Driver | null {
    const v = (d: Driver) => vehicles.find((x) => x.id === d.vehicle)!;
    const ok = drivers.filter((d) => d.available && v(d).capacity >= sacks);
    ok.sort((a, b) => a.distanceKm - b.distanceKm || v(a).price - v(b).price || a.id.localeCompare(b.id));
    return ok[0] ?? null;
}
/** Trips a vehicle needs for a load. */
export const tripsFor = (sacks: number, v: Vehicle) => Math.ceil(sacks / v.capacity);

export interface SlotLot { id: string; dayIndex: number; driedKg: number }
export interface DryerSlot { id: string; lot: string; dayIndex: number; kg: number }

/** First fit: each lot dries on its harvest day, or the next day with room. A day never takes more than capacityKg.
    Slot ids follow the order slots are given out (D-1, D-2, ...). */
export function assignDryerSlots(lots: readonly SlotLot[], capacityKg: number): DryerSlot[] {
    const used = new Map<number, number>();
    const order = [...lots].sort((a, b) => a.dayIndex - b.dayIndex || a.id.localeCompare(b.id));
    return order.map((l, i) => {
        if (l.driedKg > capacityKg) throw new Error(`lot ${l.id} is larger than a dryer day`);
        let day = l.dayIndex;
        while ((used.get(day) ?? 0) + l.driedKg > capacityKg) day++;
        used.set(day, (used.get(day) ?? 0) + l.driedKg);
        return { id: `D-${i + 1}`, lot: l.id, dayIndex: day, kg: l.driedKg };
    });
}
