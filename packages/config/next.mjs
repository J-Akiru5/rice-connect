// Runs the Next.js CLI with its anonymous CLI telemetry switched off (prototype rule: no analytics).
// A node wrapper instead of an inline env var so the scripts also work in Windows shells.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';

// Resolve Next.js from the app that runs this script (cwd), not from @rc/config.
const require = createRequire(join(process.cwd(), 'package.json'));
const bin = require.resolve('next/dist/bin/next');
const child = spawn(process.execPath, [bin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
});
child.on('exit', (code) => process.exit(code ?? 1));
