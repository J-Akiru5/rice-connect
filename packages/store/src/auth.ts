import { getStore } from './local';
import { signIn as recordSignIn, signOut as recordSignOut } from './actions';
import type { DataAdapter, SessionRole } from './types';

/* AuthAdapter: the swap point for real sign-in (prototype addition, docs/DECISIONS.md M23), like DataAdapter is
   for data. The auth pages only call these three methods. MockAuthAdapter is what the prototype ships: it checks
   nothing, keeps nothing that was typed (no password, no email, no mobile) and signs in as the app's one demo
   identity. A Supabase adapter would map them to supabase.auth.signInWithPassword({ email | phone, password }),
   supabase.auth.signUp({ ..., options: { data: { role, ...profile } } }) and supabase.auth.signOut(). */
export interface SignInInput {
    identifier: string;
    password: string;
}
export interface SignUpInput extends SignInInput {
    name: string;
    profile: Record<string, string>;
}
export type AuthErrorCode = 'invalid_credentials' | 'account_exists' | 'network' | 'unknown';
export type AuthResult = { ok: true; displayName: string } | { ok: false; code: AuthErrorCode };

export interface AuthAdapter {
    signIn(role: SessionRole, input: SignInInput): Promise<AuthResult>;
    signUp(role: SessionRole, input: SignUpInput): Promise<AuthResult>;
    signOut(role: SessionRole): Promise<void>;
}

export class MockAuthAdapter implements AuthAdapter {
    /** demoIds: the identity each app signs in as; delayMs: a short wait so loading states show as they would live. */
    constructor(
        private demoIds: Record<SessionRole, string>,
        private delayMs = 450,
        private store: () => DataAdapter = getStore
    ) {}
    private wait = () => new Promise<void>((r) => setTimeout(r, this.delayMs));
    private enter(role: SessionRole): AuthResult {
        this.store().update(recordSignIn(role, this.demoIds[role]));
        return { ok: true, displayName: this.demoIds[role] };
    }
    async signIn(role: SessionRole, _input: SignInInput) {
        await this.wait();
        return this.enter(role);
    }
    async signUp(role: SessionRole, _input: SignUpInput) {
        await this.wait();
        return this.enter(role);
    }
    async signOut(role: SessionRole) {
        this.store().update(recordSignOut(role));
    }
}
