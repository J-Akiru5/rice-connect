'use client';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import { useI18n } from '@rc/i18n';

/* Prototype addition (logged in docs/DECISIONS.md): light is the default; dark sets data-theme="dark" on <html>.
   The choice is kept in localStorage inside try/catch, so a blocked store just falls back to light. */
export const THEME_KEY = 'rc-theme';
export type Theme = 'light' | 'dark';

export function readTheme(): Theme {
    try { return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
}
export function applyTheme(theme: Theme) {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
}

export default function ThemeToggle({ className = '', iconSize = 20 }: { className?: string; iconSize?: number }) {
    const { t } = useI18n();
    const [theme, setTheme] = useState<Theme>('light');
    useEffect(() => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'), []);
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const toggle = () => {
        applyTheme(next);
        setTheme(next);
        try { window.localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked */ }
    };
    return (
        <button type="button" onClick={toggle} aria-pressed={theme === 'dark'}
            className={'inline-flex items-center gap-2 min-h-[44px] md:min-h-[40px] px-4 rounded-full glass-panel !shadow-none text-[13px] font-extrabold uppercase tracking-[0.06em] ' + className}>
            <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={iconSize} /><span>{t(theme === 'dark' ? 'theme.light' : 'theme.dark')}</span>
        </button>
    );
}
