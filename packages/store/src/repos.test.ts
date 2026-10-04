import { describe, expect, it } from 'vitest';
import { HERO_LOT, SLIP } from '@rc/domain/seed';
import { LocalAdapter } from './local';
import { RepoError, createMockRepos } from './repos';

const repos = () => createMockRepos(new LocalAdapter());

describe('farm repository', () => {
    it('gets a seed farm and reports missing ones as not_found', async () => {
        const r = repos();
        expect((await r.farms.get('F-014')).id).toBe('F-014');
        await expect(r.farms.get('F-999')).rejects.toMatchObject({ code: 'not_found' });
    });

    it('filters and pages', async () => {
        const r = repos();
        const licuan = await r.farms.list({ barangay: 'Licu-an' });
        expect(licuan.total).toBe(34);
        expect(licuan.rows.length).toBe(20);
        const page2 = await r.farms.list({ barangay: 'Licu-an', page: 2, size: 20 });
        expect(page2.rows.length).toBe(14);
        const verified = await r.farms.list({ status: 'verified' });
        expect(verified.rows.every((f) => f.status === 'verified')).toBe(true);
    });

    it('adds a farm once per idempotency key', async () => {
        const r = repos();
        await r.farms.add('F-002', { idempotencyKey: 'k1' });
        await r.farms.add('F-002', { idempotencyKey: 'k1' });
        expect(await r.farms.get('F-002')).toBeTruthy();
        const again = await r.farms.add('F-002', { idempotencyKey: 'k2' });
        expect(again.id).toBe('F-002');
    });

    it('creates a simulated farm once per key and validates the area', async () => {
        const r = repos();
        const draft = {
            name: 'Demo Farm One',
            barangay: 'Ilajas' as const,
            areaHa: 1.5,
            variety: 'NSIC Rc 222',
            harvestWeek: 'W3' as const
        };
        const farm = await r.farms.create(draft, { idempotencyKey: 'f1' });
        expect(farm.id).toBe('F-101');
        expect(farm.status).toBe('cluster');
        expect(farm.areaTenths).toBe(15);
        await r.farms.create(draft, { idempotencyKey: 'f1' });
        expect(await r.farms.created()).toHaveLength(1);
        expect((await r.farms.list({ q: 'F-101' })).total).toBe(1);
        await expect(r.farms.create({ ...draft, areaHa: 9 }, { idempotencyKey: 'f2' })).rejects.toMatchObject({
            code: 'validation'
        });
    });
});

describe('lot repository', () => {
    it('gets lots and finds the hero lot by farm', async () => {
        const r = repos();
        expect((await r.lots.get('L-03')).farm).toBe('F-014');
        expect((await r.lots.byFarm('F-014'))?.id).toBe('L-03');
        expect(await r.lots.byFarm('F-999')).toBeNull();
        await expect(r.lots.get('L-999')).rejects.toMatchObject({ code: 'not_found' });
    });
});

describe('slot repository', () => {
    it('keeps the status in the store and replays idempotent writes', async () => {
        const adapter = new LocalAdapter();
        const r = createMockRepos(adapter);
        expect(await r.slots.status(SLIP.slot)).toBe('scheduled');
        await r.slots.setStatus(SLIP.slot, 'confirmed', { idempotencyKey: 'k1' });
        expect(await r.slots.status(SLIP.slot)).toBe('confirmed');
        await r.slots.setStatus(SLIP.slot, 'confirmed', { idempotencyKey: 'k1' });
        expect(adapter.get().slots[SLIP.slot]).toBe('confirmed');
    });
});

describe('haul repository', () => {
    it('reads the seed haul and moves its status', async () => {
        const adapter = new LocalAdapter();
        const r = createMockRepos(adapter);
        expect(await r.hauls.status('H-07')).toBe('assigned');
        await r.hauls.setStatus('H-07', 'pickedup', { idempotencyKey: 'k1' });
        expect(await r.hauls.status('H-07')).toBe('pickedup');
        adapter.update((s) => ({ ...s, hauls: {} }));
        expect(await r.hauls.status('H-07')).toBe('assigned');
    });
});

describe('commitment repository', () => {
    it('lists the seed commitments and validates new ones', async () => {
        const r = repos();
        expect((await r.commitments.list()).total).toBeGreaterThan(0);
        await expect(
            r.commitments.create({ tonnes: 0, price: 100, window: ['W3'] }, { idempotencyKey: 'k1' })
        ).rejects.toMatchObject({
            code: 'validation'
        });
    });

    it('stores a commitment once per idempotency key', async () => {
        const r = repos();
        await r.commitments.create({ tonnes: 5, price: 2200, window: ['W3'] }, { idempotencyKey: 'k1' });
        await r.commitments.create({ tonnes: 5, price: 2200, window: ['W3'] }, { idempotencyKey: 'k1' });
        expect(await r.commitments.mine()).toHaveLength(1);
    });
});

describe('order repository', () => {
    it('places a valid order once per key and rejects over-availability', async () => {
        const r = repos();
        const order = await r.orders.create({ type: 'restaurant', sacks: 4, week: 'W3' }, { idempotencyKey: 'k1' });
        expect(order.total).toBe(order.kg * 4800);
        await r.orders.create({ type: 'restaurant', sacks: 4, week: 'W3' }, { idempotencyKey: 'k1' });
        expect((await r.orders.list()).total).toBe(1);
        await expect(
            r.orders.create({ type: 'restaurant', sacks: 100000, week: 'W3' }, { idempotencyKey: 'k2' })
        ).rejects.toMatchObject({ code: 'validation' });
    });

    it('cancels an order and reports a missing one as not_found', async () => {
        const r = repos();
        const order = await r.orders.create({ type: 'restaurant', sacks: 4, week: 'W3' }, { idempotencyKey: 'c1' });
        await r.orders.cancel(order.id, { idempotencyKey: 'x1' });
        expect((await r.orders.list()).total).toBe(0);
        await expect(r.orders.cancel(order.id, { idempotencyKey: 'x2' })).rejects.toMatchObject({
            code: 'not_found'
        });
    });
});

describe('settlement repository', () => {
    it('returns the slip for the weighed lot only', async () => {
        const r = repos();
        const slip = await r.settlements.get(HERO_LOT.id);
        expect(slip.id).toBe(SLIP.id);
        expect(slip.net).toBe(SLIP.net);
        await expect(r.settlements.get('L-01')).rejects.toMatchObject({ code: 'not_found' });
    });

    it('marks the weighed lot paid once and refuses a second key', async () => {
        const r = repos();
        expect(await r.settlements.paidAt(HERO_LOT.id)).toBeNull();
        const at = await r.settlements.markPaid(HERO_LOT.id, { idempotencyKey: 'p1' });
        expect(await r.settlements.paidAt(HERO_LOT.id)).toBe(at);
        await expect(r.settlements.markPaid(HERO_LOT.id, { idempotencyKey: 'p2' })).rejects.toMatchObject({
            code: 'conflict'
        });
    });
});

describe('sms repository', () => {
    it('lists the three seed messages and records a reply once', async () => {
        const adapter = new LocalAdapter();
        const r = createMockRepos(adapter);
        expect(await r.sms.list()).toHaveLength(3);
        const reply = await r.sms.reply('1 OK', { idempotencyKey: 'k1' });
        expect(reply.action).toBe('ok');
        expect(adapter.get().slots[SLIP.slot]).toBe('confirmed');
        await r.sms.reply('1 OK', { idempotencyKey: 'k1' });
        expect(await r.sms.replies()).toHaveLength(1);
    });
});

describe('typed errors', () => {
    it('carries a code and the entity id', () => {
        const e = new RepoError('forbidden', 'nope', 'F-014');
        expect(e.code).toBe('forbidden');
        expect(e.id).toBe('F-014');
        expect(e).toBeInstanceOf(Error);
    });
});
