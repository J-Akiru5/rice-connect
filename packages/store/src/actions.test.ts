import { describe, expect, it } from 'vitest';
import { emptyState } from './types';
import { farmerReply, haulStatus, setHaul, addFarm, signIn, signOut } from './actions';

const ids = { farm: 'F-014', slot: 'D-58', haul: 'H-07' };
describe('store actions', () => {
    it('defaults the haul to assigned and updates it', () => {
        expect(haulStatus(emptyState(), 'H-07')).toBe('assigned');
        expect(haulStatus(setHaul('H-07', 'pickedup')(emptyState()), 'H-07')).toBe('pickedup');
    });
    it('"1 OK" confirms the slot and keeps the haul', () => {
        const s = farmerReply(' 1 ok ', ids)(emptyState());
        expect(s.slots['D-58']).toBe('confirmed');
        expect(s.hauls['H-07']).toBeUndefined();
        expect(s.smsReplies[0]).toMatchObject({ id: 'M-001', text: '1 ok', action: 'ok' });
    });
    it('"2 Move" asks to move the slot and puts the haul on hold', () => {
        const s = farmerReply('2 MOVE', ids)(emptyState());
        expect(s.slots['D-58']).toBe('move-requested');
        expect(s.hauls['H-07']).toBe('requested');
    });
    it('keeps unknown replies without changing anything else', () => {
        const s = farmerReply('hello', ids)(emptyState());
        expect(s.smsReplies[0].action).toBeNull();
        expect(s.slots).toEqual({});
    });
    it('numbers replies in order and adds a farm once', () => {
        const s = farmerReply('2', ids)(farmerReply('1', ids)(emptyState()));
        expect(s.smsReplies.map((r) => r.id)).toEqual(['M-001', 'M-002']);
        expect(addFarm('F-014')(addFarm('F-014')(emptyState())).farmsAdded).toEqual(['F-014']);
    });
    it('signs in and out of one app without touching the others', () => {
        const s = signIn('buyer', 'Buyer A (simulated)')(signIn('coordinator', 'Cluster 1')(emptyState()));
        expect(s.session).toEqual({ coordinator: 'Cluster 1', buyer: 'Buyer A (simulated)' });
        expect(signOut('buyer')(s).session).toEqual({ coordinator: 'Cluster 1' });
    });
});
