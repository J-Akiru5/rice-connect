// Data subject request helper (docs/DSR.md): export one person's data, or withdraw + anonymise.
// Service-role only; reads keys from apps/main/.env.local. Prints counts, never row contents.
//   node scripts/dsr.mjs export --email <email> [--out exports/dsr-<date>-<id>.json]
//   node scripts/dsr.mjs erase  --email <email> --confirm <email>
// Uses curl.exe when present: this machine's Node resolver cannot see the Supabase API host (same note as
// scripts/seed-dev.mjs). Exports are written under exports/ (gitignored); delete them after handing them over.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const [command, ...args] = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const env = Object.fromEntries(
  readFileSync(new URL('../apps/main/.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const svc = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !svc) {
  console.error('missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in apps/main/.env.local');
  process.exit(1);
}

function request(method, path, body) {
  const parse = (out) => {
    const data = out.trim() ? JSON.parse(out) : null;
    if (data && typeof data === 'object' && !Array.isArray(data) && data.message && data.code)
      throw new Error(`${method} ${path.split('?')[0]} failed: ${data.message}`);
    return data;
  };
  if (process.platform === 'win32') {
    return parse(
      execFileSync('curl.exe', [
        '-sS',
        '-X',
        method,
        `${url}${path}`,
        '-H',
        `apikey: ${svc}`,
        '-H',
        `Authorization: Bearer ${svc}`,
        '-H',
        'Content-Type: application/json',
        ...(body ? ['--data-binary', JSON.stringify(body)] : [])
      ]).toString()
    );
  }
  return fetch(`${url}${path}`, {
    method,
    headers: { apikey: svc, Authorization: `Bearer ${svc}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {})
  }).then(async (r) => parse(await r.text()));
}

async function findUser(email) {
  const users = await request('GET', '/auth/v1/admin/users?per_page=200');
  const user = (users?.users ?? []).find((u) => u.email === email);
  if (!user) throw new Error(`no account for ${email}`);
  return user;
}

async function exportFor(profile) {
  const id = profile.id;
  const farms = await request('GET', `/rest/v1/farms?select=*&farmer_id=eq.${id}`);
  const farmIds = farms.map((f) => f.id);
  const inFarms = farmIds.length ? `(${farmIds.join(',')})` : '(null)';
  const lots = await request('GET', `/rest/v1/lots?select=*&farm_id=in.${inFarms}`);
  const lotIds = lots.map((l) => l.id);
  const inLots = lotIds.length ? `(${lotIds.join(',')})` : '(null)';
  const data = {
    exportedAt: new Date().toISOString(),
    profile,
    consents: await request('GET', `/rest/v1/consents?select=*&profile_id=eq.${id}`),
    farms,
    lots,
    dryer_slots: await request('GET', `/rest/v1/dryer_slots?select=*&lot_id=in.${inLots}`),
    hauls: await request('GET', `/rest/v1/hauls?select=*&lot_id=in.${inLots}`),
    settlements: await request('GET', `/rest/v1/settlements?select=*&lot_id=in.${inLots}`),
    commitments: await request('GET', `/rest/v1/commitments?select=*&buyer_id=eq.${id}`),
    rice_orders: await request('GET', `/rest/v1/rice_orders?select=*&buyer_id=eq.${id}`),
    sms_messages: await request('GET', `/rest/v1/sms_messages?select=*&profile_id=eq.${id}`)
  };
  return data;
}

const counts = (d) =>
  ['farms', 'lots', 'dryer_slots', 'hauls', 'settlements', 'commitments', 'rice_orders', 'sms_messages']
    .map((k) => `${k}=${(d[k] ?? []).length}`)
    .join(' ');

const email = arg('email');
if (!email) {
  console.error('usage: node scripts/dsr.mjs export --email <email>  |  erase --email <email> --confirm <email>');
  process.exit(1);
}

const user = await findUser(email);
const profile = await request('GET', `/rest/v1/profiles?select=*&id=eq.${user.id}&limit=1`).then((r) => r?.[0] ?? {});
console.log(`profile ${profile.id} role=${profile.role ?? '?'} (no personal fields printed)`);

if (command === 'export') {
  const data = await exportFor(profile);
  const out = arg('out') ?? `exports/dsr-${new Date().toISOString().slice(0, 10)}-${profile.id.slice(0, 8)}.json`;
  mkdirSync(out.split(/[\\/]/).slice(0, -1).join('/') || '.', { recursive: true });
  writeFileSync(out, JSON.stringify(data, null, 2), { mode: 0o600 });
  console.log(`export written: ${out}`);
  console.log(counts(data));
  console.log('hand it to the requester, then delete the file (and any copies) within 7 days');
} else if (command === 'erase') {
  const confirm = arg('confirm');
  if (confirm !== email) {
    console.error('erase needs --confirm <the same email>; nothing was changed');
    process.exit(2);
  }
  const before = await exportFor(profile);
  await request('PATCH', `/rest/v1/profiles?id=eq.${profile.id}`, {
    display_name: 'Deleted account',
    mobile_e164: null,
    barangay: null
  });
  await request('PATCH', `/rest/v1/consents?profile_id=eq.${profile.id}&withdrawn_at=is.null`, {
    withdrawn_at: new Date().toISOString()
  });
  console.log('withdrawn + anonymised (display name, mobile, barangay cleared)');
  console.log(`remaining linked records: ${counts(before)}`);
  console.log('hard deletion is a DPO decision after retention; see docs/DSR.md');
} else {
  console.error(`unknown command ${command ?? ''}`);
  process.exit(1);
}
