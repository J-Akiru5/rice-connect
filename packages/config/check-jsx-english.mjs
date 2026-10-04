import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..', '..');
const ALLOW = new Set(['RiceConnect', 'RICECONNECT', 'Team Syntaxure Labs · ISUFST', 'ISUFST']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.turbo', 'dist', 'build', 'exports', 'fixtures']);

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            if (!SKIP_DIRS.has(entry)) yield* walk(full);
        } else if (full.endsWith('.tsx')) {
            yield full;
        }
    }
}

function violations(file) {
    const text = readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const found = [];
    const visit = (node) => {
        if (ts.isJsxText(node)) {
            const value = node.text.replace(/\s+/g, ' ').trim();
            if (/[A-Za-z]/.test(value) && !ALLOW.has(value)) {
                const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
                found.push(`${relative(ROOT, file)}:${line + 1}: "${value}"`);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sf);
    return found;
}

const fixture = join(here, 'fixtures', 'jsx-english-violation.tsx');
if (violations(fixture).length === 0) {
    console.error('jsx-english check: the deliberate hardcoded string was not found');
    process.exit(1);
}

const files = [...walk(join(ROOT, 'apps')), ...walk(join(ROOT, 'packages'))].filter(
    (f) => !relative(ROOT, f).startsWith(join('packages', 'i18n'))
);
const all = files.flatMap(violations);
if (all.length > 0) {
    console.error(`jsx-english check: hardcoded JSX text (use i18n keys, EN/TL/HIL):\n${all.join('\n')}`);
    process.exit(1);
}
console.log('jsx-english check ok');
