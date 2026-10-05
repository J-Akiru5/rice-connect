export type RcMode = 'demo' | 'live';

declare global {
    interface Window {
        __RC_MODE__?: string;
    }
}

/* `NEXT_PUBLIC_RC_MODE=demo|live`; default demo until Phase 3. The server bundle inlines the env var, but
   Turbopack does not replace NEXT_PUBLIC_* inside transpiled workspace packages in the client bundle, so each app
   layout also renders MODE_BOOT (the build-time value) before hydration and this module reads it back. */
const bootMode = typeof window === 'undefined' ? undefined : window.__RC_MODE__;
export const RC_MODE: RcMode = (bootMode ?? process.env.NEXT_PUBLIC_RC_MODE) === 'live' ? 'live' : 'demo';
export const isDemo = RC_MODE === 'demo';
export const isLive = RC_MODE === 'live';
/** Inline script that stamps the build-time mode on the page; every app layout imports this one copy. */
export const MODE_BOOT = `window.__RC_MODE__=${JSON.stringify(RC_MODE)};`;

/** The environment ribbon label: absent in production; Demo in demo mode; else Staging (preview) or Local. */
export function envLabel(mode: RcMode, vercelEnv: string | undefined): 'demo' | 'staging' | 'local' | null {
    if (vercelEnv === 'production') return null;
    if (mode === 'demo') return 'demo';
    return vercelEnv === 'preview' ? 'staging' : 'local';
}
