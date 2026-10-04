export type RcMode = 'demo' | 'live';

/** `NEXT_PUBLIC_RC_MODE=demo|live`; default demo until Phase 3. Read at build time and inlined by Next.js. */
export const RC_MODE: RcMode = process.env.NEXT_PUBLIC_RC_MODE === 'live' ? 'live' : 'demo';
export const isDemo = RC_MODE === 'demo';
export const isLive = RC_MODE === 'live';

/** The environment ribbon label: absent in production; Demo in demo mode; else Staging (preview) or Local. */
export function envLabel(mode: RcMode, vercelEnv: string | undefined): 'demo' | 'staging' | 'local' | null {
    if (vercelEnv === 'production') return null;
    if (mode === 'demo') return 'demo';
    return vercelEnv === 'preview' ? 'staging' : 'local';
}
