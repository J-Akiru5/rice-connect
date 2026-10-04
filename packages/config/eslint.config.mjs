import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export const APP_IGNORES = ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'];
export const PACKAGE_IGNORES = ['.next/**', 'out/**', 'build/**'];

const boundaryRules = (patterns) => ({
    'no-restricted-imports': [
        'error',
        {
            patterns: patterns.map((group) => ({
                group: [group],
                message: `Layer boundary: this package must not import ${group} (docs/plan/05-engineering-standards.md#package-boundaries)`
            }))
        }
    ]
});

const BOUNDARIES = {
    domain: ['@rc/*', 'react', 'react-dom', 'next', 'next/*'],
    store: ['@rc/ui', '@rc/screens', '@rc/data', '@rc/config', 'next', 'next/*'],
    i18n: ['@rc/domain', '@rc/store', '@rc/ui', '@rc/screens', '@rc/data', '@rc/config', 'next', 'next/*'],
    ui: ['@rc/screens', '@rc/data', '@rc/config'],
    screens: ['@rc/config']
};

export function packageConfig(name) {
    return [
        ...nextTs,
        {
            files: ['**/*.{ts,tsx}'],
            rules: {
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
                ],
                ...boundaryRules(BOUNDARIES[name] ?? [])
            }
        },
        { ignores: PACKAGE_IGNORES }
    ];
}

export default [
    ...nextVitals,
    ...nextTs,
    { rules: { '@next/next/no-img-element': 'off', ...boundaryRules(['@rc/store', '@rc/data']) } },
    { ignores: APP_IGNORES }
];
