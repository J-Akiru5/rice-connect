import { parseSmsReply } from '@rc/domain/sms-reply';
import type { DemoState, HaulStatus, SessionRole } from './types';

/* Pure state transitions shared by the apps (tested in actions.test.ts). */
export const DEFAULT_HAUL: HaulStatus = 'assigned';
export const haulStatus = (s: DemoState, id: string): HaulStatus => s.hauls[id] ?? DEFAULT_HAUL;
export const setHaul = (id: string, status: HaulStatus) => (s: DemoState): DemoState => ({ ...s, hauls: { ...s.hauls, [id]: status } });

/** The farmer's reply to the slot SMS. "1 OK" confirms the dryer slot; "2 Move" asks to move it and puts the haul
    back to "requested" (pickup on hold until the coordinator re-plans). Unknown text is kept with action null. */
export function farmerReply(text: string, ids: { farm: string; slot: string; haul: string }) {
    return (s: DemoState): DemoState => {
        const action = parseSmsReply(text);
        const seq = s.smsReplies.reduce((m, r) => Math.max(m, r.seq), 0) + 1;
        const next: DemoState = { ...s, smsReplies: [...s.smsReplies, { id: `M-${String(seq).padStart(3, '0')}`, farm: ids.farm, text: text.trim(), action, seq }] };
        if (action === 'ok') return { ...next, slots: { ...next.slots, [ids.slot]: 'confirmed' } };
        if (action === 'move') return { ...next, slots: { ...next.slots, [ids.slot]: 'move-requested' }, hauls: { ...next.hauls, [ids.haul]: 'requested' } };
        return next;
    };
}
export const addFarm = (id: string) => (s: DemoState): DemoState => (s.farmsAdded.includes(id) ? s : { ...s, farmsAdded: [...s.farmsAdded, id] });

/** Simulated sign-in: records which demo identity is signed in to an app. Nothing is checked; nothing leaves the browser. */
export const signIn = (role: SessionRole, id: string) => (s: DemoState): DemoState => ({ ...s, session: { ...s.session, [role]: id } });
export const signOut = (role: SessionRole) => (s: DemoState): DemoState => {
    const session = { ...s.session };
    delete session[role];
    return { ...s, session };
};
