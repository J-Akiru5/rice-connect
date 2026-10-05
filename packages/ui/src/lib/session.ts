'use client';
import { useDemoState, useLiveSession } from '@rc/store/react';
import type { SessionRole } from '@rc/store';
import { isLive } from './mode';

/** The signed-in identity for an app role (B-04): the live Supabase session in live mode, else the demo store.
    Returns the display id when that role is signed in, undefined otherwise. */
export function useSession(role: SessionRole): string | undefined {
    const demo = useDemoState().session[role];
    const live = useLiveSession();
    if (isLive) return live && live.role === role ? live.id : undefined;
    return demo;
}
