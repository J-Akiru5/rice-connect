import { describe, expect, it } from 'vitest';
import { checkConsent, checkIdentifier, checkPassword, checkRequired, toE164 } from './auth-form';

describe('auth form checks', () => {
    it('accepts emails and rejects malformed ones', () => {
        expect(checkIdentifier('email', 'buyer@example.com')).toBeNull();
        expect(checkIdentifier('email', '  ')).toBe('auth.err.email.required');
        expect(checkIdentifier('email', 'buyer@example')).toBe('auth.err.email.invalid');
        expect(checkIdentifier('email', 'buyer example.com')).toBe('auth.err.email.invalid');
    });
    it('accepts PH mobiles in local or +63 form, with spaces or dashes', () => {
        expect(checkIdentifier('mobile', '0917 123 4567')).toBeNull();
        expect(checkIdentifier('mobile', '+63-917-123-4567')).toBeNull();
        expect(checkIdentifier('mobile', '')).toBe('auth.err.mobile.required');
        expect(checkIdentifier('mobile', '0917 123 456')).toBe('auth.err.mobile.invalid');
        expect(checkIdentifier('mobile', '0817 123 4567')).toBe('auth.err.mobile.invalid');
        expect(toE164('0917 123 4567')).toBe('+639171234567');
        expect(toE164('+63 917 123 4567')).toBe('+639171234567');
    });
    it('needs a password; new ones need 8 characters', () => {
        expect(checkPassword('', false)).toBe('auth.err.password.required');
        expect(checkPassword('short', false)).toBeNull();
        expect(checkPassword('short', true)).toBe('auth.err.password.short');
        expect(checkPassword('long enough', true)).toBeNull();
    });
    it('checks required fields and consent', () => {
        expect(checkRequired(' ')).toBe('auth.err.required');
        expect(checkRequired('x')).toBeNull();
        expect(checkConsent(false)).toBe('auth.err.consent');
        expect(checkConsent(true)).toBeNull();
    });
});
