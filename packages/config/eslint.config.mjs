import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export const APP_IGNORES = ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'];
export const PACKAGE_IGNORES = ['.next/**', 'out/**', 'build/**'];

const CONFIRM_ALERT_PROMPT = [
    { name: 'confirm', message: 'Never use window.confirm; use the AlertDialog from @rc/ui.' },
    { name: 'alert', message: 'Never use window.alert; use the Toast/AlertDialog from @rc/ui.' },
    { name: 'prompt', message: 'Never use window.prompt; build a form with the form kit.' }
];

const STORAGE_PROPERTIES = [
    {
        object: 'window',
        property: 'localStorage',
        message: 'Storage lives in @rc/store, @rc/i18n or the theme module, never in a screen or app.'
    },
    {
        object: 'window',
        property: 'sessionStorage',
        message: 'Storage lives in @rc/store, @rc/i18n or the theme module, never in a screen or app.'
    }
];

const LINK_SELECTORS = [
    {
        selector: 'JSXOpeningElement[name.name="dialog"]',
        message: 'Dialogs come from @rc/ui, not a hand-rolled <dialog>.'
    },
    {
        selector: 'JSXAttribute[name.name="role"][value.value="listbox"]',
        message: 'Menus come from @rc/ui, not a hand-rolled listbox.'
    },
    {
        selector: 'JSXOpeningElement[name.name="a"] > JSXAttribute[name.name="href"][value.value=/^\\//]',
        message: 'Internal links use ZLink from @rc/ui.'
    }
];

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
    screens: ['@rc/config', 'next/link'],
    data: ['@rc/ui', '@rc/screens', '@rc/i18n', '@rc/config']
};

/* Storage is allowed in @rc/store, @rc/i18n and the theme module (@rc/ui); dialogs in @rc/ui. */
const LAYER_RULES = {
    domain: { storage: true, syntax: true },
    store: { storage: false, syntax: false },
    i18n: { storage: false, syntax: false },
    ui: { storage: false, syntax: false },
    screens: { storage: true, syntax: true },
    data: { storage: true, syntax: true }
};

export function packageConfig(name) {
    const layer = LAYER_RULES[name] ?? { storage: true, syntax: true };
    return [
        ...nextTs,
        {
            files: ['**/*.{ts,tsx}'],
            rules: {
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
                ],
                'no-restricted-globals': ['error', ...CONFIRM_ALERT_PROMPT],
                ...(layer.storage ? { 'no-restricted-properties': ['error', ...STORAGE_PROPERTIES] } : {}),
                ...(layer.syntax ? { 'no-restricted-syntax': ['error', ...LINK_SELECTORS] } : {}),
                ...boundaryRules(BOUNDARIES[name] ?? [])
            }
        },
        { ignores: PACKAGE_IGNORES }
    ];
}

export default [
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            '@next/next/no-img-element': 'off',
            'no-restricted-globals': ['error', ...CONFIRM_ALERT_PROMPT],
            'no-restricted-properties': ['error', ...STORAGE_PROPERTIES],
            'no-restricted-syntax': ['error', ...LINK_SELECTORS],
            ...boundaryRules(['@rc/store', 'next/link'])
        }
    },
    { ignores: APP_IGNORES }
];
