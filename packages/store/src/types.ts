import type { BuyerType, RiceOrder } from '@rc/domain/buyers';
import type { Farm } from '@rc/domain/schemas';

/** A palay commitment a miller posted in the buyer app (auto-matched against lots not yet committed). */
export interface LocalCommitment {
    id: string;
    tonnes: number;
    price: number;
    window: string[];
    kg: number;
    lots: string[];
}

/** Everything the demo can change at runtime. The seed (packages/domain) never changes; this is the delta on top of it. */
export type HaulStatus = 'requested' | 'assigned' | 'accepted' | 'pickedup' | 'delivered';
export type SlotStatus = 'scheduled' | 'confirmed' | 'move-requested';
/** A message in the farmer's SMS thread typed in the farmer app (the three system SMS come from the seed). */
export interface SmsReply {
    id: string;
    farm: string;
    text: string;
    action: 'ok' | 'move' | null;
    seq: number;
}

export interface DemoState {
    version: 1;
    riceOrders: RiceOrder[];
    commitments: LocalCommitment[];
    /** Haul status by haul id; absent = the seed's state ("assigned", waiting for the driver). */
    hauls: Record<string, HaulStatus>;
    /** Dryer slot status by slot id; absent = "scheduled". */
    slots: Record<string, SlotStatus>;
    smsReplies: SmsReply[];
    /** Farms added to the cluster in the coordinator app. */
    farmsAdded: string[];
    /** Last buyer type chosen in the buyer app (the radio group); absent = the default (Restaurant). */
    buyerType?: BuyerType;
    /** Settlement marked paid by the coordinator: lot id → ISO timestamp. Irreversible in the app. */
    settlementsPaid?: Record<string, string>;
    /** Farms added through the Add Farm form (simulated data only). */
    farmsCreated?: Farm[];
    /** Simulated sign-in per app (no accounts, no passwords): the demo identity signed in to each app, absent = signed out. */
    session: Partial<Record<SessionRole, string>>;
}
/** The apps with their own sign-in (the farmer signs in with a mobile number). */
export type SessionRole = 'coordinator' | 'buyer' | 'driver' | 'farmer' | 'admin';
export const emptyState = (): DemoState => ({
    version: 1,
    riceOrders: [],
    commitments: [],
    hauls: {},
    slots: {},
    smsReplies: [],
    farmsAdded: [],
    session: {}
});

/** The swap point. LocalAdapter implements this for the prototype (this browser only, synced across tabs).
    A server adapter (e.g. Supabase) would implement the same four methods; nothing in the apps changes. */
export interface DataAdapter {
    get(): DemoState;
    update(fn: (s: DemoState) => DemoState): void;
    subscribe(listener: (s: DemoState) => void): () => void;
    reset(): void;
}
