import { afterEach, describe, expect, it } from 'vitest';
import { LocalAdapter, STORE_KEY } from './local';
import { emptyState } from './types';

class MemStorage {
    m = new Map<string, string>();
    getItem = (k: string) => this.m.get(k) ?? null;
    setItem = (k: string, v: string) => void this.m.set(k, v);
    removeItem = (k: string) => void this.m.delete(k);
}
const order = { id: 'R-001', type: 'restaurant' as const, kg: 100, sacks: 4, total: 480000, week: 'W3' as const };
const open: { close(): void }[] = [];
const channel = (name: string) => {
    const c = new BroadcastChannel(name);
    open.push(c);
    return c as unknown as BroadcastChannel;
};
afterEach(() => {
    open.splice(0).forEach((c) => c.close());
});
const tick = () => new Promise((r) => setTimeout(r, 30));

describe('LocalAdapter', () => {
    it('starts empty, updates, persists and notifies', () => {
        const storage = new MemStorage();
        const a = new LocalAdapter({ storage });
        let seen = 0;
        a.subscribe(() => seen++);
        a.update((s) => ({ ...s, riceOrders: [order] }));
        expect(a.get().riceOrders).toHaveLength(1);
        expect(JSON.parse(storage.getItem(STORE_KEY)!).riceOrders[0].id).toBe('R-001');
        expect(seen).toBe(1);
        expect(new LocalAdapter({ storage }).get().riceOrders[0]?.id).toBe('R-001');
    });
    it('migrates the old buyer-portal keys', () => {
        const storage = new MemStorage();
        storage.setItem('rc-rice-orders', JSON.stringify([order]));
        expect(new LocalAdapter({ storage }).get().riceOrders).toEqual([order]);
    });
    it('survives corrupt or blocked storage', () => {
        const storage = new MemStorage();
        storage.setItem(STORE_KEY, '{oops');
        expect(new LocalAdapter({ storage }).get()).toEqual(emptyState());
        const blocked = {
            getItem: () => {
                throw new Error('blocked');
            },
            setItem: () => {
                throw new Error('blocked');
            },
            removeItem: () => {
                throw new Error('blocked');
            }
        };
        const a = new LocalAdapter({ storage: blocked });
        a.update((s) => ({ ...s, riceOrders: [order] }));
        expect(a.get().riceOrders).toHaveLength(1);
    });
    it('syncs two tabs through BroadcastChannel (buyer → coordinator)', async () => {
        const buyer = new LocalAdapter({ storage: new MemStorage(), channel: channel('t1') });
        const coordinator = new LocalAdapter({ storage: new MemStorage(), channel: channel('t1') });
        buyer.update((s) => ({ ...s, riceOrders: [order] }));
        await tick();
        expect(coordinator.get().riceOrders).toEqual([order]);
    });
    it('reset clears state everywhere', async () => {
        const a = new LocalAdapter({ storage: new MemStorage(), channel: channel('t2') });
        const b = new LocalAdapter({ storage: new MemStorage(), channel: channel('t2') });
        a.update((s) => ({ ...s, riceOrders: [order] }));
        await tick();
        b.reset();
        await tick();
        expect(a.get()).toEqual(emptyState());
    });
    it('reset keeps the simulated sign-ins', () => {
        const a = new LocalAdapter({ storage: new MemStorage() });
        a.update((s) => ({ ...s, riceOrders: [order], session: { coordinator: 'Cluster 1' } }));
        a.reset();
        expect(a.get()).toEqual({ ...emptyState(), session: { coordinator: 'Cluster 1' } });
    });
    it('loads older saves without a session as signed out', () => {
        const storage = new MemStorage();
        const { session: _, ...old } = emptyState();
        storage.setItem(STORE_KEY, JSON.stringify(old));
        expect(new LocalAdapter({ storage }).get().session).toEqual({});
    });
});
