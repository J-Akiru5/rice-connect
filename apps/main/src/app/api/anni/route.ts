import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { z } from 'zod';

/* ANNI, the RiceConnect Farm Assistant (out-of-plan owner request, docs/DECISIONS.md M42). Server-only:
   the Gemini key comes from `apps/main/.env.local` (GEMINI_API_KEY) or the deployment's environment, and
   never reaches the client bundle. Model and thinking level are env-tunable with the owner's defaults. */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MessageSchema = z.object({
  role: z.enum(['user', 'anni']),
  text: z.string().trim().min(1).max(4000)
});
const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40)
});

const MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash';
const LEVELS: Record<string, ThinkingLevel> = {
  minimal: ThinkingLevel.MINIMAL,
  low: ThinkingLevel.LOW,
  medium: ThinkingLevel.MEDIUM,
  high: ThinkingLevel.HIGH
};
const level = () => LEVELS[(process.env.GEMINI_THINKING_LEVEL ?? 'low').trim().toLowerCase()] ?? ThinkingLevel.LOW;

const SYSTEM = [
  'You are ANNI, the RiceConnect Farm Assistant for a smallholder rice-farming cluster in Dingle, Iloilo, Philippines.',
  'RiceConnect helps the cluster plan harvests, dry palay, haul it and sell it to buyers; farmers are reached by SMS.',
  'Answer briefly and in plain language. Reply in the language of the question (English, Tagalog or Hiligaynon).',
  'Never invent numbers, prices, dates or names: if you do not know, say so and point to the right RiceConnect screen.',
  'Never ask for personal data. Money is in Philippine pesos; weights in kg or tonnes.'
].join(' ');

const fail = (status: number, code: string) => Response.json({ ok: false, code }, { status });

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return fail(503, 'not_configured');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'validation');
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return fail(400, 'validation');

  const contents = parsed.data.messages.map((m) => ({
    role: m.role === 'anni' ? ('model' as const) : ('user' as const),
    parts: [{ text: m.text }]
  }));

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM,
        thinkingConfig: { thinkingLevel: level() }
      }
    });
    const text = response.text?.trim();
    if (!text) return fail(502, 'provider');
    return Response.json({ ok: true, text });
  } catch {
    /* No error details in the response or logs: they may echo the conversation. */
    return fail(502, 'provider');
  }
}
