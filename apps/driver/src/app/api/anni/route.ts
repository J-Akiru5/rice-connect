import { askAnni } from '@rc/ai/anni';

/* ANNI, the RiceConnect Farm Assistant (docs/DECISIONS.md M42). Server-only: the Gemini key never reaches
   the client. One thin route per app so each zone's own origin can answer. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const result = await askAnni(body);
  const status = result.ok ? 200 : result.code === 'validation' ? 400 : result.code === 'not_configured' ? 503 : 502;
  return Response.json(result, { status });
}
