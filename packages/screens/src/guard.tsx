'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ACCOUNTS, ForbiddenState, LoadingState, useI18n, useZoneNav } from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { useDemoState, useLiveSession, useLiveSessionReady } from '@rc/store/react';
import type { SessionRole } from '@rc/store';

/* S-12: the real route guard, behind the mode switch. Demo mode must stay open (the demo video, deep links and
   screenshots keep working). Live mode, signed out: redirect to that app's sign-in with ?next=<the page>, which
   AuthScreen returns to after sign-in. Live mode with a different role session: the kit ForbiddenState, with a
   Sign In action for the right role. The session comes from the shared store for now; Phase 3 replaces it with the
   Supabase session behind the same `session[role]` check. Mounted in each app's layout; the sign-in pages pass
   `allow` so they keep working. */
export function RoleGuard({
    role,
    allow = [],
    children
}: {
    role: SessionRole;
    allow?: string[];
    children: ReactNode;
}) {
    const { t } = useI18n();
    const nav = useZoneNav();
    const pathname = usePathname();
    const session = useDemoState().session;
    const live = useLiveSession();
    const liveReady = useLiveSessionReady();
    /* window.location keeps the basePath of the zone apps, so `next` is the public URL; it refreshes on
       client-side navigation (pathname change). */
    const [url, setUrl] = useState<string | null>(null);
    useEffect(() => {
        setUrl(window.location.pathname + window.location.search);
    }, [pathname]);
    const allowed = url !== null && allow.some((p) => url === p || url.startsWith(p + '/'));
    /* Live mode reads the Supabase session (B-04); demo mode keeps the per-app demo session. */
    const signedIn = isLive ? live?.role === role : Boolean(session[role]);
    const otherRole = isLive ? Boolean(live) && live?.role !== role : Object.values(session).some(Boolean);
    useEffect(() => {
        if (!isLive || !liveReady || url === null || allowed || signedIn || otherRole) return;
        nav(`${ACCOUNTS[role].signIn}?next=${encodeURIComponent(url)}`);
    }, [allowed, liveReady, nav, otherRole, role, signedIn, url]);
    if (!isLive) return <>{children}</>;
    /* Wait for the stored Supabase session before deciding: redirecting early would bounce signed-in users. */
    if (url === null || !liveReady || (!allowed && !signedIn && !otherRole)) return <LoadingState rows={2} />;
    if (allowed || signedIn) return <>{children}</>;
    return (
        <div className="rc-ground min-h-screen w-full flex items-start justify-center p-4 md:p-8">
            <div className="w-full max-w-[520px]">
                <ForbiddenState
                    role={t(ACCOUNTS[role].name)}
                    onSignIn={() => url && nav(`${ACCOUNTS[role].signIn}?next=${encodeURIComponent(url)}`)}
                />
            </div>
        </div>
    );
}
