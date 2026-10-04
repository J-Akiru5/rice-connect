import { emptyState, type DataAdapter, type DemoState } from './types';

/* LocalAdapter: in-memory state seeded empty on top of the deterministic seed, persisted to localStorage and
   synced to other tabs of the same origin with BroadcastChannel (plus the 'storage' event as a fallback).
   Every storage access is wrapped in try/catch: a blocked store just means no persistence. */
export const STORE_KEY = 'rc-store-v1';
export const CHANNEL = 'rc-store';
const LEGACY = { orders: 'rc-rice-orders', commitments: 'rc-commitments' } as const;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
type ChannelLike = { postMessage(m: unknown): void; addEventListener(t: 'message', l: (e: MessageEvent) => void): void; close(): void };
export interface LocalAdapterOptions { storage?: StorageLike | null; channel?: ChannelLike | null; key?: string }

function parse(raw: string | null): DemoState | null {
    if (!raw) return null;
    try {
        const v = JSON.parse(raw);
        if (v && v.version === 1 && Array.isArray(v.riceOrders) && Array.isArray(v.commitments)) return { ...emptyState(), ...v }; // older saves lack the newer fields
    } catch { /* corrupt: ignore */ }
    return null;
}
function readLegacy(storage: StorageLike): DemoState | null {
    try {
        const o = JSON.parse(storage.getItem(LEGACY.orders) ?? 'null');
        const c = JSON.parse(storage.getItem(LEGACY.commitments) ?? 'null');
        if (!Array.isArray(o) && !Array.isArray(c)) return null;
        return { ...emptyState(), riceOrders: Array.isArray(o) ? o : [], commitments: Array.isArray(c) ? c : [] };
    } catch { return null; }
}

export class LocalAdapter implements DataAdapter {
    private state: DemoState;
    private listeners = new Set<(s: DemoState) => void>();
    private storage: StorageLike | null;
    private channel: ChannelLike | null;
    private key: string;

    constructor(opts: LocalAdapterOptions = {}) {
        this.storage = opts.storage ?? null;
        this.channel = opts.channel ?? null;
        this.key = opts.key ?? STORE_KEY;
        let initial: DemoState | null = null;
        try { initial = this.storage ? parse(this.storage.getItem(this.key)) ?? readLegacy(this.storage) : null; } catch { initial = null; }
        this.state = initial ?? emptyState();
        this.channel?.addEventListener('message', (e) => {
            const next = parse(typeof e.data === 'string' ? e.data : null);
            if (next) this.set(next, false);
        });
    }
    get = () => this.state;
    subscribe = (l: (s: DemoState) => void) => { this.listeners.add(l); return () => { this.listeners.delete(l); }; };
    update = (fn: (s: DemoState) => DemoState) => this.set(fn(this.state), true);
    reset = () => {
        try { this.storage?.removeItem(LEGACY.orders); this.storage?.removeItem(LEGACY.commitments); } catch { /* blocked */ }
        this.set(emptyState(), true);
    };
    /** Apply a state that arrived from another tab via the 'storage' event. */
    receive = (raw: string | null) => { const next = parse(raw) ?? (raw === null ? emptyState() : null); if (next) this.set(next, false); };
    close = () => this.channel?.close();

    private set(next: DemoState, broadcast: boolean) {
        this.state = next;
        const raw = JSON.stringify(next);
        if (broadcast) {
            try { this.storage?.setItem(this.key, raw); } catch { /* blocked */ }
            try { this.channel?.postMessage(raw); } catch { /* closed */ }
        }
        this.listeners.forEach((l) => l(next));
    }
}

/** The browser singleton (one per tab). On the server it is an in-memory adapter with no persistence. */
let browserAdapter: LocalAdapter | null = null;
export function getStore(): LocalAdapter {
    if (typeof window === 'undefined') return new LocalAdapter();
    if (browserAdapter) return browserAdapter;
    let storage: StorageLike | null = null;
    try { storage = window.localStorage; } catch { storage = null; }
    let channel: ChannelLike | null = null;
    try { channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL); } catch { channel = null; }
    const adapter = new LocalAdapter({ storage, channel });
    window.addEventListener('storage', (e) => { if (e.key === STORE_KEY) adapter.receive(e.newValue); });
    browserAdapter = adapter;
    return adapter;
}
