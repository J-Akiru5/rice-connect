import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { z } from 'zod';

/* ANNI, the RiceConnect Farm Assistant (out-of-plan owner request, docs/DECISIONS.md M42). Server-side only:
   every app hosts a thin `/api/anni` route that calls this, and the Gemini key comes from the environment
   (`GEMINI_API_KEY` in the app's `.env.local` locally, or the deployment's environment). The prompt is
   advice-only for now; actions can be added later behind typed confirmations. */

export const AnniMessageSchema = z.object({
    role: z.enum(['user', 'anni']),
    text: z.string().trim().min(1).max(4000)
});
export const AnniBodySchema = z.object({
    messages: z.array(AnniMessageSchema).min(1).max(20)
});
export type AnniMessage = z.infer<typeof AnniMessageSchema>;
export type AnniErrorCode = 'validation' | 'not_configured' | 'provider';
export type AnniResult = { ok: true; text: string } | { ok: false; code: AnniErrorCode };
export interface AnniEnv {
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
    GEMINI_THINKING_LEVEL?: string;
    [key: string]: string | undefined;
}

export const ANNI_DEFAULT_MODEL = 'gemini-3.6-flash';
export const ANNI_DEFAULT_THINKING = 'low';
const LEVELS: Record<string, ThinkingLevel> = {
    minimal: ThinkingLevel.MINIMAL,
    low: ThinkingLevel.LOW,
    medium: ThinkingLevel.MEDIUM,
    high: ThinkingLevel.HIGH
};

export const anniModel = (env: AnniEnv = process.env) => env.GEMINI_MODEL?.trim() || ANNI_DEFAULT_MODEL;
export const anniThinkingLevel = (env: AnniEnv = process.env) =>
    LEVELS[(env.GEMINI_THINKING_LEVEL ?? ANNI_DEFAULT_THINKING).trim().toLowerCase()] ?? ThinkingLevel.LOW;

const SYSTEM = [
    'You are ANNI, the RiceConnect Farm Assistant for a smallholder rice-farming cluster in Dingle, Iloilo, Philippines.',
    'RiceConnect helps the cluster plan harvests, dry palay, haul it and sell it to buyers; farmers are reached by SMS.',
    'Answer briefly and in plain language. Reply in the language of the question (English, Tagalog or Hiligaynon).',
    'Never invent numbers, prices, dates or names: if you do not know, say so and point to the right RiceConnect screen.',
    'Never ask for personal data. Money is in Philippine pesos; weights in kg or tonnes.',
    'You only answer and guide for now: you cannot change any data.'
].join(' ');

/** One ANNI turn. Pure enough to unit-test: no key -> not_configured, bad body -> validation, provider errors -> provider. */
export async function askAnni(body: unknown, env: AnniEnv = process.env): Promise<AnniResult> {
    const parsed = AnniBodySchema.safeParse(body);
    if (!parsed.success) return { ok: false, code: 'validation' };
    const key = env.GEMINI_API_KEY?.trim();
    if (!key) return { ok: false, code: 'not_configured' };

    const contents = parsed.data.messages.map((m) => ({
        role: m.role === 'anni' ? ('model' as const) : ('user' as const),
        parts: [{ text: m.text }]
    }));

    try {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
            model: anniModel(env),
            contents,
            config: {
                systemInstruction: SYSTEM,
                thinkingConfig: { thinkingLevel: anniThinkingLevel(env) }
            }
        });
        const text = response.text?.trim();
        return text ? { ok: true, text } : { ok: false, code: 'provider' };
    } catch {
        /* Never surface provider details: they can echo the conversation. */
        return { ok: false, code: 'provider' };
    }
}
