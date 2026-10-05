import { describe, expect, it } from 'vitest';
import { envLabel } from './mode';

describe('environment ribbon label', () => {
    it('is absent in production', () => {
        expect(envLabel('live', 'production')).toBeNull();
        expect(envLabel('demo', 'production')).toBeNull();
    });
    it('shows Demo in demo mode outside production', () => {
        expect(envLabel('demo', undefined)).toBe('demo');
        expect(envLabel('demo', 'preview')).toBe('demo');
    });
    it('distinguishes staging from local in live mode', () => {
        expect(envLabel('live', 'preview')).toBe('staging');
        expect(envLabel('live', 'development')).toBe('local');
        expect(envLabel('live', undefined)).toBe('local');
    });
});
