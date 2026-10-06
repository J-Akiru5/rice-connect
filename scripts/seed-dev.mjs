// pnpm seed:dev — idempotent live-test fixture for the Supabase dev project.
// Demo mode keeps the deterministic @rc/domain seed; this script only fills the dev database with clearly
// simulated accounts and rows so live screens can be tested (filters, pagination, RLS isolation). Run it with
// the service key available in apps/main/.env.local. Nothing here is real personal data.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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
/* curl.exe instead of fetch: this machine's Node resolver cannot see the Supabase API host (IPv6-only AAAA),
   while curl uses the system resolver fine. */
const api = (method, path, body) => {
  const args = [
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
    '-H',
    'Prefer: resolution=merge-duplicates'
  ];
  if (body) args.push('--data-binary', JSON.stringify(body));
  const out = execFileSync('curl.exe', args, { encoding: 'utf8' });
  if (!out.trim()) return null;
  if (out.includes('"code":"') && out.includes('"message":"') && !out.trimStart().startsWith('[')) {
    throw new Error(`${method} ${path} -> ${out.slice(0, 300)}`);
  }
  return JSON.parse(out);
};

const CLUSTER = '30000000-0000-0000-0000-000000000003';
const PASSWORD = 'password123';
const FARMERS = 3;
const FARMS = 8;
const BARANGAYS = ['Licu-an', 'San Matias', 'Ilajas'];
const VARIETIES = ['NSIC Rc 222', 'NSIC Rc 160', 'NSIC Rc 402'];

const users = await api('GET', '/auth/v1/admin/users?per_page=200');
const byEmail = new Map(users.users.map((u) => [u.email, u.id]));
for (let i = 1; i <= FARMERS; i += 1) {
  const email = `dev-farmer-${i}@example.com`;
  if (!byEmail.has(email)) {
    const created = await api('POST', '/auth/v1/admin/users', {
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { role: 'farmer', display_name: `Dev Farmer ${i}` }
    });
    byEmail.set(email, created.id);
  }
}
const farmers = Array.from({ length: FARMERS }, (_, i) => byEmail.get(`dev-farmer-${i + 1}@example.com`));

await api('POST', '/rest/v1/clusters?on_conflict=id', [
  { id: CLUSTER, name: 'Dev Cluster (simulated)', municipality: 'Dingle' }
]);
for (const id of farmers)
  await api('PATCH', `/rest/v1/profiles?id=eq.${id}`, { cluster_id: CLUSTER, barangay: 'Licu-an' });

const farmRows = Array.from({ length: FARMS }, (_, i) => {
  const n = i + 1;
  return {
    id: `F-${String(300 + n)}`,
    cluster_id: CLUSTER,
    farmer_id: farmers[i % FARMERS],
    name: `Dev Farm ${n} (simulated)`,
    barangay: BARANGAYS[i % BARANGAYS.length],
    area_ha: (1 + (i % 5) * 0.25).toFixed(2),
    variety: VARIETIES[i % VARIETIES.length],
    harvest_week: `W${(i % 4) + 1}`,
    status: i % 3 === 0 ? 'verified' : 'cluster'
  };
});
await api('POST', '/rest/v1/farms?on_conflict=id', farmRows);

await api(
  'POST',
  '/rest/v1/lots?on_conflict=id',
  farmRows.map((f, i) => ({
    id: `L-${String(300 + i + 1)}`,
    farm_id: f.id,
    sacks: 8 + (i % 4),
    wet_kg: 400 + i * 10,
    dried_kg: 360 + i * 9,
    grade: 'Grade 1',
    moisture_pct: 14,
    status: 'weighed',
    actual: true,
    harvest_date: `2026-10-${String(19 + (i % 5)).padStart(2, '0')}`
  }))
);

await api(
  'POST',
  '/rest/v1/dryer_slots?on_conflict=id',
  farmRows.map((f, i) => ({
    id: `D-${String(300 + i + 1)}`,
    cluster_id: CLUSTER,
    day: `2026-10-${String(20 + (i % 5)).padStart(2, '0')}`,
    capacity_kg: 8000,
    lot_id: `L-${String(300 + i + 1)}`,
    kg: 360 + i * 9,
    status: 'scheduled',
    dryer: 'Dev Dryer (simulated)',
    slot_time: i % 2 === 0 ? 'morning' : 'afternoon'
  }))
);

const settlementRows = farmRows.slice(0, 3).map((f, i) => ({
  id: `S-${String(300 + i + 1)}`,
  lot_id: `L-${String(300 + i + 1)}`,
  gross_centavos: 10000000,
  advance_centavos: 8000000,
  balance_centavos: 2000000
}));
await api('POST', '/rest/v1/settlements?on_conflict=id', settlementRows);

const drivers = await api('GET', '/rest/v1/drivers?select=profile_id,vehicle_id&limit=1');
if (drivers.length > 0) {
  const d = drivers[0];
  await api(
    'POST',
    '/rest/v1/hauls?on_conflict=id',
    farmRows.slice(0, 3).map((f, i) => ({
      id: `H-${String(300 + i + 1)}`,
      lot_id: `L-${String(300 + i + 1)}`,
      driver_id: d.profile_id,
      vehicle_id: d.vehicle_id,
      sacks: 8 + i,
      status: i === 0 ? 'assigned' : 'requested',
      pickup_date: '2026-10-23',
      route_via: 'Dev Dryer (simulated)',
      route_to: 'Dev Buyer (simulated)',
      km: 5 + i
    }))
  );
}

console.log(
  `seed:dev done — ${FARMERS} farmers, ${FARMS} farms, ${FARMS} lots/slots, ${settlementRows.length} settlements` +
    (drivers.length > 0 ? ', 3 hauls' : ', no driver found (hauls skipped)')
);
