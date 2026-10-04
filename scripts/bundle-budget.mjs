// Bundle budget (Q-05). Next 16 removed per-route size output (upgrade guide: use Lighthouse/Vercel
// Analytics instead) and Turbopack writes no per-route chunk manifest, so the budget measures the client
// JS per app: all of `.next/static/chunks` plus the shared root files from `build-manifest.json`.
// CI runs this after `pnpm build` and fails when an app grows more than 10% over the recorded baseline.
// Usage: node scripts/bundle-budget.mjs            (check)
//        node scripts/bundle-budget.mjs --update   (record a new baseline)
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const APPS = ['main', 'buyer', 'driver', 'farmer'];
const BASELINE = 'scripts/bundle-baseline.json';
const LIMIT = 0.1;

const walk = (dir) => {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        return statSync(full).isDirectory() ? walk(full) : full.endsWith('.js') ? [full] : [];
    });
};

const measure = (app) => {
    const dir = join('apps', app, '.next');
    const manifest = JSON.parse(readFileSync(join(dir, 'build-manifest.json'), 'utf8'));
    const chunks = walk(join(dir, 'static', 'chunks'));
    const total = chunks.reduce((sum, file) => sum + statSync(file).size, 0);
    const shared = (manifest.rootMainFiles ?? []).reduce((sum, file) => sum + statSync(join(dir, file)).size, 0);
    return { total, shared };
};

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;
const current = Object.fromEntries(APPS.map((app) => [app, measure(app)]));

if (process.argv.includes('--update') || !existsSync(BASELINE)) {
    writeFileSync(BASELINE, `${JSON.stringify(current, null, 4)}\n`);
    console.log('bundle budget: baseline written');
    for (const app of APPS) console.log(`  ${app}: total ${kb(current[app].total)}, shared ${kb(current[app].shared)}`);
} else {
    const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
    let failed = false;
    for (const app of APPS) {
        const base = baseline[app];
        if (!base) {
            console.error(`bundle budget: ${app} is missing from the baseline`);
            failed = true;
            continue;
        }
        for (const key of ['total', 'shared']) {
            const growth = (current[app][key] - base[key]) / base[key];
            const line = `${app} ${key}: ${kb(base[key])} -> ${kb(current[app][key])} (${(growth * 100).toFixed(1)}%)`;
            if (growth > LIMIT) {
                console.error(`bundle budget: FAIL ${line}`);
                failed = true;
            } else {
                console.log(`bundle budget: ok   ${line}`);
            }
        }
    }
    if (failed) {
        console.error('bundle budget: shrink the change or record a decision before updating the baseline');
        process.exit(1);
    }
    console.log('bundle budget: within limits');
}
