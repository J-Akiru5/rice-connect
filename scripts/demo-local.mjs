// pnpm demo:local — build every app with RC_LOCAL=1 and start the main app plus the buyer, driver and farmer apps.
// Open http://localhost:3000 (main app). Works with the network off (run `pnpm install` once beforehand).
// Flags: --skip-build (start only), --build-only.
import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...process.env, RC_LOCAL: '1', NEXT_TELEMETRY_DISABLED: '1' };
const APPS = [
  ['buyer', 3002], ['driver', 3003], ['farmer', 3004], ['main', 3000],
];
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

if (!process.argv.includes('--skip-build')) {
  const filters = APPS.flatMap(([a]) => ['--filter', `@rc/${a}`]);
  const r = spawnSync(pnpm, ['exec', 'turbo', 'run', 'build', ...filters], { cwd: root, env, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
if (process.argv.includes('--build-only')) process.exit(0);

const children = APPS.map(([app, port]) => {
  const c = spawn(pnpm, ['--filter', `@rc/${app}`, 'start'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' });
  const tag = `[${app}:${port}]`;
  c.stdout.on('data', (d) => process.stdout.write(`${tag} ${d}`));
  c.stderr.on('data', (d) => process.stderr.write(`${tag} ${d}`));
  return c;
});
console.log('\nRiceConnect demo: open http://localhost:3000  (main app incl. coordinator; buyer 3002, driver 3003, farmer 3004)\n');
const stop = () => { children.forEach((c) => c.kill('SIGTERM')); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
