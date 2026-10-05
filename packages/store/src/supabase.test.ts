import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getLiveSession, setLiveSession } from './session';
import { SupabaseAuthAdapter } from './supabase';

/* B-04: the adapter maps Supabase Auth onto the AuthAdapter interface and publishes the live session.
   The client is faked; no network. */

const user = (role: string, name: string) => ({
    id: 'u-1',
    email: 'person@example.com',
    phone: undefined,
    user_metadata: { role, display_name: name }
});

function makeClient(overrides: Partial<Record<string, unknown>> = {}) {
    const auth = {
        getSession: vi.fn(async () => ({ data: { session: null } })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(async () => ({ error: null })),
        ...overrides
    };
    return { auth } as unknown as SupabaseClient;
}

beforeEach(() => setLiveSession(null));

describe('SupabaseAuthAdapter', () => {
    it('signs in with the email identifier and publishes the real profile role', async () => {
        const client = makeClient({
            signInWithPassword: vi.fn(async () => ({ data: { user: user('buyer', 'Buyer A') }, error: null }))
        });
        const auth = new SupabaseAuthAdapter(client);
        const result = await auth.signIn('coordinator', { identifier: 'buyer@example.com', password: 'secret123' });

        expect(result).toEqual({ ok: true, displayName: 'Buyer A' });
        expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'buyer@example.com',
            password: 'secret123'
        });
        /* The role comes from the profile, so the guard can forbid the wrong app. */
        expect(getLiveSession()).toMatchObject({ role: 'buyer', id: 'Buyer A', profileId: 'u-1' });
    });

    it('signs in with a mobile identifier as a phone', async () => {
        const client = makeClient({
            signInWithPassword: vi.fn(async () => ({ data: { user: user('farmer', 'Farmer F-014') }, error: null }))
        });
        const auth = new SupabaseAuthAdapter(client);
        await auth.signIn('farmer', { identifier: '+639171234567', password: 'secret123' });
        expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
            phone: '+639171234567',
            password: 'secret123'
        });
    });

    it('maps a bad password to invalid_credentials without a session', async () => {
        const client = makeClient({
            signInWithPassword: vi.fn(async () => ({
                data: { user: null },
                error: { code: 'invalid_credentials', status: 400, message: 'Invalid login credentials' }
            }))
        });
        const auth = new SupabaseAuthAdapter(client);
        expect(await auth.signIn('buyer', { identifier: 'a@b.co', password: 'nope' })).toEqual({
            ok: false,
            code: 'invalid_credentials'
        });
        expect(getLiveSession()).toBeNull();
    });

    it('passes the role and profile to signUp and maps an existing account', async () => {
        const signUp = vi.fn(async () => ({
            data: { user: user('farmer', 'New Farmer'), session: null },
            error: null
        }));
        const client = makeClient({ signUp });
        const auth = new SupabaseAuthAdapter(client);
        const result = await auth.signUp('farmer', {
            identifier: '+639171234567',
            password: 'secret123',
            name: 'New Farmer',
            profile: { barangay: 'Licu-an' }
        });
        expect(result).toEqual({ ok: true, displayName: 'New Farmer' });
        expect(signUp).toHaveBeenCalledWith({
            phone: '+639171234567',
            password: 'secret123',
            options: { data: { role: 'farmer', display_name: 'New Farmer', barangay: 'Licu-an' } }
        });
        /* Email confirmation is on in real projects, so signUp may return no session: no live session yet. */
        expect(getLiveSession()).toBeNull();

        const existing = makeClient({
            signUp: vi.fn(async () => ({
                data: { user: null, session: null },
                error: { code: 'user_already_exists', status: 422, message: 'already registered' }
            }))
        });
        expect(
            await new SupabaseAuthAdapter(existing).signUp('farmer', {
                identifier: '+639171234567',
                password: 'secret123',
                name: 'New Farmer',
                profile: {}
            })
        ).toEqual({ ok: false, code: 'account_exists' });
    });

    it('clears the live session on sign out', async () => {
        const client = makeClient({
            signInWithPassword: vi.fn(async () => ({ data: { user: user('driver', 'Driver One') }, error: null }))
        });
        const auth = new SupabaseAuthAdapter(client);
        await auth.signIn('driver', { identifier: 'd@example.com', password: 'secret123' });
        expect(getLiveSession()).not.toBeNull();
        await auth.signOut('driver');
        expect(getLiveSession()).toBeNull();
        expect(client.auth.signOut).toHaveBeenCalled();
    });
});
