import { askAnni } from '@rc/ai/anni';
import { resolveAnniContext } from '@rc/data/anni-server';
import { isLive } from '@rc/ui/mode';

/* ANNI route (A-04/M50): live callers must present their Supabase JWT so every read tool runs under RLS;
   demo callers pass their app role and read the deterministic seed. The runner never writes. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const hits = new Map<string, number[]>();
const limited = (key: string) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 20;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const auth = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || undefined;
  const role =
    typeof body === 'object' && body !== null && typeof (body as { role?: unknown }).role === 'string'
      ? (body as { role: string }).role
      : undefined;
  if (limited(auth ?? request.headers.get('x-forwarded-for') ?? 'anon'))
    return Response.json({ ok: false, code: 'rate_limited' }, { status: 429 });
  const resolved = await resolveAnniContext({
    live: isLive,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    accessToken: auth,
    demoRole: role
  });
  if (!resolved.ok)
    return Response.json({ ok: false, code: resolved.code }, { status: resolved.code === 'forbidden' ? 401 : 400 });
  const result = await askAnni(body, { ...resolved.ctx }, process.env);
  const status = result.ok ? 200 : result.code === 'validation' ? 400 : result.code === 'not_configured' ? 503 : 502;
  return Response.json(result, { status });
}
