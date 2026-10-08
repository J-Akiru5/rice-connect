import { parseSmsReply } from '@rc/domain/sms-reply';
import type { BuyerType } from '@rc/domain/buyers';
import type { AdminOverrides, DemoState, DirectoryRole, HaulStatus, SessionRole } from './types';

/* Pure state transitions shared by the apps (tested in actions.test.ts). */
export const DEFAULT_HAUL: HaulStatus = 'assigned';
export const haulStatus = (s: DemoState, id: string): HaulStatus => s.hauls[id] ?? DEFAULT_HAUL;
export const setHaul =
    (id: string, status: HaulStatus) =>
    (s: DemoState): DemoState => ({ ...s, hauls: { ...s.hauls, [id]: status } });

/** The farmer's reply to the slot SMS. "1 OK" confirms the dryer slot; "2 Move" asks to move it and puts the haul
    back to "requested" (pickup on hold until the coordinator re-plans). Unknown text is kept with action null. */
export function farmerReply(text: string, ids: { farm: string; slot: string; haul: string }) {
    return (s: DemoState): DemoState => {
        const action = parseSmsReply(text);
        const seq = s.smsReplies.reduce((m, r) => Math.max(m, r.seq), 0) + 1;
        const next: DemoState = {
            ...s,
            smsReplies: [
                ...s.smsReplies,
                {
                    id: `M-${String(seq).padStart(3, '0')}`,
                    farm: ids.farm,
                    text: text.trim(),
                    action,
                    seq,
                    at: new Date().toISOString()
                }
            ]
        };
        if (action === 'ok') return { ...next, slots: { ...next.slots, [ids.slot]: 'confirmed' } };
        if (action === 'move')
            return {
                ...next,
                slots: { ...next.slots, [ids.slot]: 'move-requested' },
                hauls: { ...next.hauls, [ids.haul]: 'requested' }
            };
        return next;
    };
}
export const addFarm =
    (id: string) =>
    (s: DemoState): DemoState =>
        s.farmsAdded.includes(id) ? s : { ...s, farmsAdded: [...s.farmsAdded, id] };

/** Remember the buyer type chosen in the buyer app (the screens never touch storage directly). */
export const setBuyerType =
    (buyerType: BuyerType) =>
    (s: DemoState): DemoState => ({ ...s, buyerType });

/** Simulated sign-in: records which demo identity is signed in to an app. Nothing is checked; nothing leaves the browser. */
export const signIn =
    (role: SessionRole, id: string) =>
    (s: DemoState): DemoState => ({ ...s, session: { ...s.session, [role]: id } });
export const signOut =
    (role: SessionRole) =>
    (s: DemoState): DemoState => {
        const session = { ...s.session };
        delete session[role];
        return { ...s, session };
    };

/* Simulated admin writes (S-11). The screens go through AdminRepo, not these directly; Phase 3 replaces
   the repository with Supabase and every write lands in the audit log (B-06). */
const adminOverrides = (s: DemoState): AdminOverrides => s.adminOverrides ?? { roles: {}, settings: {} };
export const setRoleOverride =
    (key: string, role: DirectoryRole) =>
    (s: DemoState): DemoState => {
        const o = adminOverrides(s);
        return { ...s, adminOverrides: { ...o, roles: { ...o.roles, [key]: role } } };
    };
export const clearRoleOverride =
    (key: string) =>
    (s: DemoState): DemoState => {
        const o = adminOverrides(s);
        const roles = { ...o.roles };
        delete roles[key];
        return { ...s, adminOverrides: { ...o, roles } };
    };
export const setSettingOverride =
    (key: string, value: string) =>
    (s: DemoState): DemoState => {
        const o = adminOverrides(s);
        return { ...s, adminOverrides: { ...o, settings: { ...o.settings, [key]: value } } };
    };
export const clearSettingOverride =
    (key: string) =>
    (s: DemoState): DemoState => {
        const o = adminOverrides(s);
        const settings = { ...o.settings };
        delete settings[key];
        return { ...s, adminOverrides: { ...o, settings } };
    };
