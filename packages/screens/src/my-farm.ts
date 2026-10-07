'use client';
import { useMemo } from 'react';
import { useFarms, useHauls, useLots } from '@rc/data';
import { HERO_FARM } from '@rc/domain/seed';
import type { Farm, Haul, Lot } from '@rc/domain/schemas';

/** The signed-in farmer's farm, lot and haul from the repositories (mock in demo, Supabase in live).
    Demo keeps the pinned hero (F-014 · L-03 · H-07) so every demo number is unchanged; live takes the
    first RLS-visible farm/lot/haul — the pilot has one farm per farmer (recorded in docs/BLOCKERS.md).
    Screens must treat a missing farm/lot/haul as an empty state, never as demo content. */
export function useMyFarm(): {
    farm: Farm | undefined;
    lot: Lot | undefined;
    isPending: boolean;
    isError: boolean;
    retry: () => void;
} {
    const farmsQuery = useFarms({ size: 500 });
    const lotsQuery = useLots({ size: 500 });
    const farms = useMemo(() => farmsQuery.data?.rows ?? [], [farmsQuery.data]);
    const lots = useMemo(() => lotsQuery.data?.rows ?? [], [lotsQuery.data]);
    const farm = farms.find((f) => f.id === HERO_FARM.id) ?? farms[0];
    const lot = lots.find((l) => l.farm === farm?.id);
    return {
        farm,
        lot,
        isPending: farmsQuery.isPending || lotsQuery.isPending,
        isError: farmsQuery.isError || lotsQuery.isError,
        retry: () => {
            void farmsQuery.refetch();
            void lotsQuery.refetch();
        }
    };
}

/** The signed-in farmer's haul (RLS scopes a farmer to the haul on their lot). Demo keeps H-07 first. */
export function useMyHaul(lotId?: string): {
    haul: Haul | undefined;
    isPending: boolean;
    isError: boolean;
    retry: () => void;
} {
    const haulsQuery = useHauls({ size: 20 });
    const hauls = haulsQuery.data?.rows ?? [];
    const haul = hauls.find((h) => h.lot === lotId) ?? hauls[0];
    return {
        haul,
        isPending: haulsQuery.isPending,
        isError: haulsQuery.isError,
        retry: () => void haulsQuery.refetch()
    };
}
