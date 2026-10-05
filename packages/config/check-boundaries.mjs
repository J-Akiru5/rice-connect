import { ESLint } from 'eslint';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageConfig } from './eslint.config.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const eslint = new ESLint({
    cwd: here,
    overrideConfigFile: true,
    overrideConfig: packageConfig('domain')
});
const results = await eslint.lintFiles([join(here, 'fixtures/boundary-violation.ts')]);
const errors = results.reduce((n, r) => n + r.errorCount, 0);
if (errors === 0) {
    console.error('boundary check: the deliberate bad import did not fail lint');
    process.exit(1);
}
console.log('boundary check ok');
