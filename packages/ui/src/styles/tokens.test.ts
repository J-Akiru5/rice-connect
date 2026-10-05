import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');
const tokens = JSON.parse(readFileSync(path.join(root, 'design/tokens.json'), 'utf8'));
const css = readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');

describe('tokens.css', () => {
    it('carries every light color value from tokens.json unchanged (photo tokens excluded)', () => {
        for (const t of tokens.color.tokens) {
            if (t.name.startsWith('photo-')) continue;
            const v = typeof t.value === 'string' ? t.value : t.value.light;
            expect(css).toContain(`--${t.name}: ${v};`);
        }
    });
    it('defines a dark theme block', () => {
        expect(css).toMatch(/\[data-theme="dark"\] \{[\s\S]*--canvas: #04130f;/);
    });
    it('has no retired photo tokens', () => {
        expect(css).not.toMatch(/photo/);
    });
});
