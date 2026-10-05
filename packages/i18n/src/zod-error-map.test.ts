import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { STRINGS } from './i18n';
import { ZOD_ERROR_KEYS, installZodErrorMap } from './zod-error-map';

describe('Zod i18n error map', () => {
    it('every key exists in EN, TL and HIL', () => {
        for (const key of Object.values(ZOD_ERROR_KEYS)) {
            const entry = STRINGS[key];
            expect(entry, `${key} is missing from STRINGS`).toBeDefined();
            expect(entry).toHaveLength(3);
            for (const lang of entry ?? []) expect(lang.length).toBeGreaterThan(0);
        }
    });

    it('returns keys, never English, for the common codes', () => {
        installZodErrorMap();
        const message = (fn: () => unknown) => {
            try {
                fn();
                return null;
            } catch (e) {
                return (e as z.ZodError).issues[0]?.message ?? null;
            }
        };
        expect(message(() => z.string().parse(123))).toBe(ZOD_ERROR_KEYS.invalidType);
        expect(message(() => z.string().min(5).parse('ab'))).toBe(ZOD_ERROR_KEYS.tooSmall);
        expect(message(() => z.string().max(2).parse('abcd'))).toBe(ZOD_ERROR_KEYS.tooBig);
        expect(message(() => z.string().regex(/^\d+$/).parse('x'))).toBe(ZOD_ERROR_KEYS.invalidFormat);
        expect(message(() => z.enum(['a', 'b']).parse('c'))).toBe(ZOD_ERROR_KEYS.invalidValue);
        expect(message(() => z.union([z.string(), z.number()]).parse(true))).toBe(ZOD_ERROR_KEYS.invalidUnion);
        expect(message(() => z.object({ a: z.string() }).strict().parse({ a: 'x', b: 1 }))).toBe(
            ZOD_ERROR_KEYS.unrecognizedKeys
        );
        expect(message(() => z.number().multipleOf(5).parse(3))).toBe(ZOD_ERROR_KEYS.notMultipleOf);
    });
});
