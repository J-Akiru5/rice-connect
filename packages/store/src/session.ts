import type { SessionRole } from './types';

/* The live session (B-04): what Supabase Auth says about the signed-in user. The demo store's `session` stays
   for demo mode; screens read both through the `useSession(role)` hook in @rc/ui. */
export interface LiveSession {
    /** The profile's real role, from the sign-up metadata; the guard checks this, not the app you are in. */
    role: SessionRole;
    /** What the UI shows as "signed in as": display name, else email/phone. */
    id: string;
    displayName: string;
    profileId: string;
}

let current: LiveSession | null = null;
let ready = true;
const listeners = new Set<() => void>();

export const getLiveSession = () => current;
/** False only while the adapter restores the stored session; guards wait for true before redirecting. */
export const getLiveSessionReady = () => ready;
export function setLiveSession(next: LiveSession | null) {
    current = next;
    ready = true;
    listeners.forEach((l) => l());
}
/** Called by the Supabase adapter while it restores the stored session. */
export function resetLiveSessionReady() {
    ready = false;
    listeners.forEach((l) => l());
}
export function subscribeLiveSession(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
