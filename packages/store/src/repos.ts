import { COMMITMENTS, FARMS, HAUL, HERO_LOT, LOTS, SLIP, SLOTS, SMS, farmById, lotById } from '@rc/domain/seed';
import { makeRiceOrder } from '@rc/domain/buyers';
import type { Commitment, Farm, Lot, Slip, Slot, SmsMessage } from '@rc/domain/schemas';
import type { Week } from '@rc/domain/schemas';
import { addFarm, farmerReply, haulStatus, setHaul } from './actions';
import { getStore } from './local';
import type { DataAdapter, DemoState, HaulStatus, LocalCommitment, SmsReply, SlotStatus } from './types';

/* Repository layer (D-04): every screen talks to these interfaces; the mock implementations read the seed and
   persist writes in the LocalAdapter. A Supabase implementation (Phase 3) replaces them without screen changes. */

export type RepoErrorCode = 'not_found' | 'forbidden' | 'conflict' | 'validation' | 'network' | 'unknown';

export class RepoError extends Error {
    constructor(
        public code: RepoErrorCode,
        message: string,
        public id?: string
    ) {
        super(message);
        this.name = 'RepoError';
    }
}

export interface Page<T> {
    rows: T[];
    total: number;
    page: number;
    size: number;
}
export interface WriteOpts {
    idempotencyKey: string;
}
export interface ListQuery {
    page?: number;
    size?: number;
}
export interface FarmQuery extends ListQuery {
    barangay?: string;
    status?: Farm['status'];
    q?: string;
}
export interface HaulQuery extends ListQuery {
    status?: HaulStatus;
}

export interface FarmRepo {
    get(id: string): Promise<Farm>;
    list(q?: FarmQuery): Promise<Page<Farm>>;
    /** Adds a farm to the cluster (idempotent). */
    add(id: string, opts: WriteOpts): Promise<Farm>;
}
export interface LotRepo {
    get(id: string): Promise<Lot>;
    list(q?: ListQuery): Promise<Page<Lot>>;
    byFarm(farmId: string): Promise<Lot | null>;
}
export interface SlotRepo {
    get(id: string): Promise<Slot>;
    list(q?: ListQuery): Promise<Page<Slot>>;
    status(id: string): Promise<SlotStatus>;
    setStatus(id: string, next: SlotStatus, opts: WriteOpts): Promise<Slot>;
}
export interface HaulRepo {
    get(id: string): Promise<typeof HAUL>;
    status(id: string): Promise<HaulStatus>;
    setStatus(id: string, next: HaulStatus, opts: WriteOpts): Promise<typeof HAUL>;
}
export interface CommitmentRepo {
    /** The seed's buyer commitments. */
    list(q?: ListQuery): Promise<Page<Commitment>>;
    /** Commitments posted in the buyer app; returns the stored local record. */
    create(input: { tonnes: number; price: number; window: Week[] }, opts: WriteOpts): Promise<LocalCommitment>;
    mine(): Promise<LocalCommitment[]>;
}
export interface OrderRepo {
    list(q?: ListQuery): Promise<Page<ReturnType<typeof makeRiceOrder>>>;
    create(
        input: { type: Parameters<typeof makeRiceOrder>[0]; sacks: number; week: Week },
        opts: WriteOpts
    ): Promise<ReturnType<typeof makeRiceOrder>>;
    /** Cancels an order (idempotent); the buyer's Undo window calls this. */
    cancel(id: string, opts: WriteOpts): Promise<void>;
}
export interface SettlementRepo {
    /** The slip for a weighed lot; forecast lots have no settlement yet (not_found). */
    get(lotId: string): Promise<Slip>;
}
export interface SmsRepo {
    list(): Promise<SmsMessage[]>;
    replies(): Promise<SmsReply[]>;
    reply(text: string, opts: WriteOpts): Promise<SmsReply>;
}

export interface Repos {
    farms: FarmRepo;
    lots: LotRepo;
    slots: SlotRepo;
    hauls: HaulRepo;
    commitments: CommitmentRepo;
    orders: OrderRepo;
    settlements: SettlementRepo;
    sms: SmsRepo;
}

const pageOf = <T>(all: T[], q?: ListQuery): Page<T> => {
    const page = Math.max(1, q?.page ?? 1);
    const size = Math.max(1, q?.size ?? 20);
    return { rows: all.slice((page - 1) * size, page * size), total: all.length, page, size };
};

const must = <T>(value: T | undefined, id: string, what: string): T => {
    if (value === undefined) throw new RepoError('not_found', `${what} ${id} does not exist`, id);
    return value;
};

/** Mock repositories over the seed + LocalAdapter. Every write takes an idempotency key. */
export function createMockRepos(adapter: DataAdapter): Repos {
    const seen = new Map<string, unknown>();
    const once = async <T>(key: string, run: () => Promise<T> | T): Promise<T> => {
        if (seen.has(key)) return seen.get(key) as T;
        const value = await run();
        seen.set(key, value);
        return value;
    };
    const state = (): DemoState => adapter.get();

    const farms: FarmRepo = {
        async get(id) {
            return must(farmById(id), id, 'Farm');
        },
        async list(q) {
            let all = [...FARMS];
            if (q?.barangay) all = all.filter((f) => f.barangay === q.barangay);
            if (q?.status) all = all.filter((f) => f.status === q.status);
            if (q?.q) {
                const needle = q.q.toLowerCase();
                all = all.filter((f) => f.id.toLowerCase().includes(needle) || f.name.toLowerCase().includes(needle));
            }
            return pageOf(all, q);
        },
        async add(id, opts) {
            return once(opts.idempotencyKey, () => {
                const farm = must(farmById(id), id, 'Farm');
                if (!state().farmsAdded.includes(id)) adapter.update(addFarm(id));
                return farm;
            });
        }
    };

    const lots: LotRepo = {
        async get(id) {
            return must(lotById(id), id, 'Lot');
        },
        async list(q) {
            return pageOf([...LOTS], q);
        },
        async byFarm(farmId) {
            return LOTS.find((l) => l.farm === farmId) ?? null;
        }
    };

    const slots: SlotRepo = {
        async get(id) {
            return must(
                SLOTS.find((s) => s.id === id),
                id,
                'Slot'
            );
        },
        async list(q) {
            return pageOf([...SLOTS], q);
        },
        async status(id) {
            await slots.get(id);
            return state().slots[id] ?? 'scheduled';
        },
        async setStatus(id, next, opts) {
            return once(opts.idempotencyKey, async () => {
                const slot = await slots.get(id);
                adapter.update((s) => ({ ...s, slots: { ...s.slots, [id]: next } }));
                return slot;
            });
        }
    };

    const hauls: HaulRepo = {
        async get(id) {
            if (id !== HAUL.id) throw new RepoError('not_found', `Haul ${id} does not exist`, id);
            return HAUL;
        },
        async status(id) {
            await hauls.get(id);
            return haulStatus(state(), id);
        },
        async setStatus(id, next, opts) {
            return once(opts.idempotencyKey, async () => {
                const haul = await hauls.get(id);
                adapter.update(setHaul(id, next));
                return haul;
            });
        }
    };

    const commitments: CommitmentRepo = {
        async list(q) {
            return pageOf([...COMMITMENTS], q);
        },
        async mine() {
            return state().commitments;
        },
        async create(input, opts) {
            return once(opts.idempotencyKey, () => {
                if (input.tonnes <= 0) throw new RepoError('validation', 'commitment tonnes must be positive');
                if (input.price <= 0) throw new RepoError('validation', 'commitment price must be positive');
                const mine = state().commitments;
                const id = `C-${String(COMMITMENTS.length + mine.length + 1).padStart(2, '0')}`;
                const record: LocalCommitment = {
                    id,
                    tonnes: input.tonnes,
                    price: input.price,
                    window: input.window,
                    kg: 0,
                    lots: []
                };
                adapter.update((s) => ({ ...s, commitments: [record, ...s.commitments] }));
                return record;
            });
        }
    };

    const orders: OrderRepo = {
        async list(q) {
            return pageOf([...state().riceOrders], q);
        },
        async create(input, opts) {
            return once(opts.idempotencyKey, () => {
                const orders = state().riceOrders;
                try {
                    const order = makeRiceOrder(input.type, input.sacks, input.week, orders.length + 1);
                    adapter.update((s) => ({ ...s, riceOrders: [order, ...s.riceOrders] }));
                    return order;
                } catch (e) {
                    throw new RepoError('validation', e instanceof Error ? e.message : 'order rejected');
                }
            });
        },
        async cancel(id, opts) {
            return once(opts.idempotencyKey, () => {
                if (!state().riceOrders.some((o) => o.id === id))
                    throw new RepoError('not_found', `Order ${id} does not exist`, id);
                adapter.update((s) => ({ ...s, riceOrders: s.riceOrders.filter((o) => o.id !== id) }));
            });
        }
    };

    const settlements: SettlementRepo = {
        async get(lotId) {
            if (lotId !== HERO_LOT.id) throw new RepoError('not_found', `No settlement for lot ${lotId} yet`, lotId);
            return SLIP;
        }
    };

    const sms: SmsRepo = {
        async list() {
            return [...SMS];
        },
        async replies() {
            return state().smsReplies;
        },
        async reply(text, opts) {
            return once(opts.idempotencyKey, () => {
                const before = state().smsReplies.length;
                adapter.update(farmerReply(text, { farm: HERO_LOT.farm, slot: SLIP.slot, haul: HAUL.id }));
                const next = state().smsReplies;
                const reply = next[next.length - 1];
                if (!reply || next.length === before) throw new RepoError('unknown', 'reply was not stored');
                return reply;
            });
        }
    };

    return { farms, lots, slots, hauls, commitments, orders, settlements, sms };
}

let repos: Repos | null = null;
/** Browser singleton; screens get data through the @rc/data hooks (D-05), not directly. */
export function getRepos(): Repos {
    repos ??= createMockRepos(getStore());
    return repos;
}
