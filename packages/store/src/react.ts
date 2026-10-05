'use client';
import { useSyncExternalStore } from 'react';
import { getStore } from './local';
import { getLiveSession, subscribeLiveSession, type LiveSession } from './session';
import { emptyState, type DemoState } from './types';

const SERVER = emptyState();
/** Read the demo state (re-renders on local changes and on changes from other tabs). */
export function useDemoState(): DemoState {
    const s = getStore();
    return useSyncExternalStore(s.subscribe, s.get, () => SERVER);
}
/** Read the live Supabase session (B-04); null in demo mode. */
export function useLiveSession(): LiveSession | null {
    return useSyncExternalStore(subscribeLiveSession, getLiveSession, () => null);
}
export const updateDemoState = (fn: (s: DemoState) => DemoState) => getStore().update(fn);
export const resetDemoState = () => getStore().reset();
