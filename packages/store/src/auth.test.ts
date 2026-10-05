import { describe, expect, it } from 'vitest';
import { LocalAdapter } from './local';
import { MockAuthAdapter } from './auth';

const ids = {
    coordinator: 'Cluster 1',
    buyer: 'Buyer A (simulated)',
    driver: 'Driver DR-05',
    farmer: 'Farmer F-014',
    admin: 'Super Admin'
};

describe('MockAuthAdapter', () => {
    it('signs in as the demo identity and keeps nothing that was typed', async () => {
        const store = new LocalAdapter();
        const auth = new MockAuthAdapter(ids, 0, () => store);
        const r = await auth.signIn('buyer', { identifier: 'someone@example.com', password: 'secret123' });
        expect(r).toEqual({ ok: true, displayName: 'Buyer A (simulated)' });
        expect(store.get().session).toEqual({ buyer: 'Buyer A (simulated)' });
        expect(JSON.stringify(store.get())).not.toMatch(/someone|secret123/);
    });
    it('signs up the same way and signs out one app only', async () => {
        const store = new LocalAdapter();
        const auth = new MockAuthAdapter(ids, 0, () => store);
        await auth.signUp('farmer', {
            identifier: '0917 123 4567',
            password: 'longenough',
            name: 'Typed Name',
            profile: { barangay: 'Ilajas' }
        });
        await auth.signIn('coordinator', { identifier: 'c@example.com', password: 'x' });
        expect(JSON.stringify(store.get())).not.toMatch(/0917|Typed Name|longenough/);
        await auth.signOut('farmer');
        expect(store.get().session).toEqual({ coordinator: 'Cluster 1' });
    });
});
