import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { AuthAdapter, AuthErrorCode, AuthResult, SignInInput, SignUpInput } from './auth';
import { resetLiveSessionReady, setLiveSession } from './session';
import type { SessionRole } from './types';

/* B-04: SupabaseAuthAdapter behind the same AuthAdapter the mock implements (docs/plan/03-architecture.md).
   Email or phone identifier + password; the profile rides in `options.data` and the database trigger
   `handle_new_user` (B-02) copies it into `profiles`. The live session is published through @rc/store/session
   so the route guard and the shells can read it without knowing about Supabase. */

const ROLES: SessionRole[] = ['coordinator', 'buyer', 'driver', 'farmer', 'admin'];

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createSupabaseClient = (url: string, anonKey: string): SupabaseClient =>
    createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });

const roleOf = (user: User): SessionRole => {
    const role = user.user_metadata?.role;
    return typeof role === 'string' && (ROLES as string[]).includes(role) ? (role as SessionRole) : 'farmer';
};

const nameOf = (user: User): string => {
    const name = user.user_metadata?.display_name;
    if (typeof name === 'string' && name.trim()) return name.trim();
    return user.email ?? user.phone ?? 'Account';
};

function mapAuthError(error: { code?: string; status?: number; message?: string }): AuthErrorCode {
    const code = error.code ?? '';
    if (code === 'invalid_credentials') return 'invalid_credentials';
    if (code === 'user_already_exists' || code === 'email_exists' || code === 'phone_exists') return 'account_exists';
    if (error.status === 0 || /fetch|network/i.test(error.message ?? '')) return 'network';
    return 'unknown';
}

export class SupabaseAuthAdapter implements AuthAdapter {
    constructor(private client: SupabaseClient) {
        resetLiveSessionReady();
        void this.restore();
        this.client.auth.onAuthStateChange((_event, session) => {
            this.publish(session?.user ?? null);
        });
    }

    private async restore() {
        const { data } = await this.client.auth.getSession();
        this.publish(data.session?.user ?? null);
    }

    private publish(user: User | null) {
        setLiveSession(
            user ? { role: roleOf(user), id: nameOf(user), displayName: nameOf(user), profileId: user.id } : null
        );
    }

    async signIn(_role: SessionRole, input: SignInInput): Promise<AuthResult> {
        const credentials = input.identifier.includes('@')
            ? { email: input.identifier.trim() }
            : { phone: input.identifier.trim() };
        const { data, error } = await this.client.auth.signInWithPassword({ ...credentials, password: input.password });
        if (error) return { ok: false, code: mapAuthError(error) };
        this.publish(data.user);
        return { ok: true, displayName: nameOf(data.user) };
    }

    async signUp(role: SessionRole, input: SignUpInput): Promise<AuthResult> {
        const credentials = input.identifier.includes('@')
            ? { email: input.identifier.trim() }
            : { phone: input.identifier.trim() };
        const { data, error } = await this.client.auth.signUp({
            ...credentials,
            password: input.password,
            options: {
                data: {
                    role,
                    display_name: input.name.trim(),
                    ...input.profile
                }
            }
        });
        if (error) return { ok: false, code: mapAuthError(error) };
        if (!data.user) return { ok: false, code: 'unknown' };
        /* With email/phone confirmation on, signUp returns a user but no session; the form still reports
           success and the user confirms first. */
        if (data.session) this.publish(data.user);
        return { ok: true, displayName: nameOf(data.user) };
    }

    async signOut(_role: SessionRole) {
        await this.client.auth.signOut();
        setLiveSession(null);
    }
}

export interface SupabaseRuntime {
    client: SupabaseClient;
    auth: SupabaseAuthAdapter;
}

/** Build the live runtime once per app load (called from each app's providers when mode is live). */
export function createSupabaseRuntime(url: string, anonKey: string): SupabaseRuntime {
    const client = createSupabaseClient(url, anonKey);
    return { client, auth: new SupabaseAuthAdapter(client) };
}

/* The auth swap seam. @rc/ui's `auth` delegates here; @rc/data's configureLiveAuth swaps in Supabase. */
let activeAuth: AuthAdapter | null = null;
export const setAuthAdapter = (next: AuthAdapter) => {
    activeAuth = next;
};
export const getAuthAdapter = (fallback: () => AuthAdapter): AuthAdapter => activeAuth ?? fallback();
