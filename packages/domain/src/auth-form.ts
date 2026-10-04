/* Sign-in / sign-up form checks (prototype addition, docs/DECISIONS.md M23). Pure functions shared by every
   app's auth pages, so a real backend (e.g. Supabase) gets the same input the mock accepts. Each check returns
   an i18n key for the error, or null when the value is fine. */
export type Identifier = 'email' | 'mobile';
export const PASSWORD_MIN = 8;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Philippine mobile: 09XXXXXXXXX or +639XXXXXXXXX; spaces and dashes allowed. */
const MOBILE = /^(?:09|\+639)\d{9}$/;

export const cleanMobile = (v: string) => v.replace(/[\s-]/g, '');
/** E.164 form of a valid PH mobile (+639XXXXXXXXX), the shape an SMS or phone-auth provider expects. */
export const toE164 = (v: string) => { const m = cleanMobile(v); return m.startsWith('09') ? '+63' + m.slice(1) : m; };

export function checkIdentifier(kind: Identifier, v: string): string | null {
    const s = v.trim();
    if (!s) return kind === 'email' ? 'auth.err.email.required' : 'auth.err.mobile.required';
    if (kind === 'email') return EMAIL.test(s) ? null : 'auth.err.email.invalid';
    return MOBILE.test(cleanMobile(s)) ? null : 'auth.err.mobile.invalid';
}
export function checkPassword(v: string, isNew: boolean): string | null {
    if (!v) return 'auth.err.password.required';
    return isNew && v.length < PASSWORD_MIN ? 'auth.err.password.short' : null;
}
export const checkRequired = (v: string) => (v.trim() ? null : 'auth.err.required');
export const checkConsent = (v: boolean) => (v ? null : 'auth.err.consent');
