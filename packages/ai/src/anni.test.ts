import { describe, expect, it, vi } from 'vitest';
import type { AnniContext, AnniTool } from './anni';

vi.mock('@google/genai', () => ({
    GoogleGenAI: class {
        models = { generateContent: vi.fn(async () => ({ text: '  Hello from ANNI  ' })) };
    },
    ThinkingLevel: { MINIMAL: 'MINIMAL', LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' },
    Type: { OBJECT: 'OBJECT', STRING: 'STRING', INTEGER: 'INTEGER' }
}));

import { ANNI_DEFAULT_MODEL, anniModel, anniThinkingLevel, askAnni } from './anni';

const body = { messages: [{ role: 'user', text: 'When is my harvest?' }] };
const genai = (generateContent: ReturnType<typeof vi.fn>) => ({ models: { generateContent } });

describe('ANNI runner (A-02)', () => {
    it('rejects a malformed body before anything else', async () => {
        expect(await askAnni({ messages: [] })).toEqual({ ok: false, code: 'validation' });
        expect(await askAnni({ messages: [{ role: 'system', text: 'x' }] })).toEqual({
            ok: false,
            code: 'validation'
        });
    });

    it('reports a missing key as not_configured', async () => {
        expect(await askAnni(body, undefined, {})).toEqual({ ok: false, code: 'not_configured' });
    });

    it('returns the trimmed reply with a key', async () => {
        expect(await askAnni(body, undefined, { GEMINI_API_KEY: 'k' })).toEqual({
            ok: true,
            text: 'Hello from ANNI'
        });
    });

    it('runs read tools then answers, capped at three rounds', async () => {
        const tool: AnniTool = {
            name: 'count_farms',
            description: 'How many farms',
            parameters: { type: 'OBJECT', properties: {} },
            run: vi.fn(async () => ({ farms: 100 }))
        };
        const generateContent = vi
            .fn()
            .mockResolvedValueOnce({
                functionCalls: [{ name: 'count_farms', args: {} }],
                candidates: [{ content: { parts: [{ functionCall: { name: 'count_farms' } }] } }]
            })
            .mockResolvedValueOnce({ text: 'There are 100 farms.' });
        const ctx: AnniContext = { tools: [tool], proposalKinds: [] };
        const result = await askAnni(body, ctx, {}, { client: genai(generateContent) });
        expect(tool.run).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ ok: true, text: 'There are 100 farms.' });

        const loop = vi.fn().mockResolvedValue({
            functionCalls: [{ name: 'count_farms', args: {} }],
            candidates: [{ content: { parts: [{ functionCall: { name: 'count_farms' } }] } }]
        });
        expect(await askAnni(body, ctx, {}, { client: genai(loop) })).toEqual({ ok: false, code: 'provider' });
        expect(loop).toHaveBeenCalledTimes(3);
    });

    it('returns a validated proposal instead of executing it', async () => {
        const generateContent = vi.fn().mockResolvedValueOnce({
            functionCalls: [
                {
                    name: 'propose_action',
                    args: { kind: 'create_order', params: { type: 'miller', sacks: 40, week: 'W3' } }
                }
            ]
        });
        const ctx: AnniContext = { tools: [], proposalKinds: ['create_order'] };
        const result = await askAnni(body, ctx, {}, { client: genai(generateContent) });
        expect(result).toEqual({
            ok: true,
            text: '',
            proposal: { kind: 'create_order', params: { type: 'miller', sacks: 40, week: 'W3' } }
        });

        const bad = vi.fn().mockResolvedValueOnce({
            functionCalls: [{ name: 'propose_action', args: { kind: 'mark_paid', params: { lotId: 'L-03' } } }]
        });
        expect(await askAnni(body, ctx, {}, { client: genai(bad) })).toEqual({ ok: false, code: 'validation' });
    });

    it('defaults the model and thinking level, with env overrides', () => {
        expect(anniModel({})).toBe(ANNI_DEFAULT_MODEL);
        expect(anniModel({ GEMINI_MODEL: 'gemini-3.6-flash' })).toBe('gemini-3.6-flash');
        expect(anniThinkingLevel({})).toBe('LOW');
        expect(anniThinkingLevel({ GEMINI_THINKING_LEVEL: 'high' })).toBe('HIGH');
        expect(anniThinkingLevel({ GEMINI_THINKING_LEVEL: 'nonsense' })).toBe('LOW');
    });
});
