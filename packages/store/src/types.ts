import type { RiceOrder } from '@rc/domain/buyers';

/** A palay commitment a miller posted in the buyer app (auto-matched against lots not yet committed). */
export interface LocalCommitment { id: string; tonnes: number; price: number; window: string[]; kg: number; lots: string[] }

/** Everything the demo can change at runtime. The seed (packages/domain) never changes; this is the delta on top of it. */
export interface DemoState {
    version: 1;
    riceOrders: RiceOrder[];
    commitments: LocalCommitment[];
}
export const emptyState = (): DemoState => ({ version: 1, riceOrders: [], commitments: [] });

/** The swap point. LocalAdapter implements this for the prototype (this browser only, synced across tabs).
    A server adapter (e.g. Supabase) would implement the same four methods; nothing in the apps changes. */
export interface DataAdapter {
    get(): DemoState;
    update(fn: (s: DemoState) => DemoState): void;
    subscribe(listener: (s: DemoState) => void): () => void;
    reset(): void;
}
