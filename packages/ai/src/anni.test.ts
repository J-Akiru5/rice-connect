import { describe, expect, it, vi } from 'vitest';

vi.mock('@google/genai', () => ({
    GoogleGenAI: class {
        models = { generateContent: vi.fn(async () => ({ text: '  Hello from ANNI  ' })) };
    },
    ThinkingLevel: { MINIMAL: 'MINIMAL', LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' }
}));

import { ANNI_DEFAULT_MODEL, anniModel, anniThinkingLevel, askAnni } from './anni';

const body = { messages: [{ role: 'user', text: 'When is my harvest?' }] };

describe('ANNI', () => {
    it('rejects a malformed body before anything else', async () => {
        expect(await askAnni({ messages: [] })).toEqual({ ok: false, code: 'validation' });
        expect(await askAnni({ messages: [{ role: 'system', text: 'x' }] })).toEqual({
            ok: false,
            code: 'validation'
        });
    });

    it('reports a missing key as not_configured', async () => {
        expect(await askAnni(body, {})).toEqual({ ok: false, code: 'not_configured' });
    });

    it('returns the trimmed reply with a key', async () => {
        expect(await askAnni(body, { GEMINI_API_KEY: 'k' })).toEqual({ ok: true, text: 'Hello from ANNI' });
    });

    it('defaults the model and thinking level, with env overrides', () => {
        expect(anniModel({})).toBe(ANNI_DEFAULT_MODEL);
        expect(anniModel({ GEMINI_MODEL: 'gemini-3.6-flash' })).toBe('gemini-3.6-flash');
        expect(anniThinkingLevel({})).toBe('LOW');
        expect(anniThinkingLevel({ GEMINI_THINKING_LEVEL: 'high' })).toBe('HIGH');
        expect(anniThinkingLevel({ GEMINI_THINKING_LEVEL: 'nonsense' })).toBe('LOW');
    });
});
