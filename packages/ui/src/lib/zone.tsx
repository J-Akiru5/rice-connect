'use client';
import { createContext, useCallback, useContext, type AnchorHTMLAttributes, type PropsWithChildren } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* Multi-zone routing (prototype addition). Every screen keeps writing the original URLs ("/farm/F-014", "/sms",
   "/buyer/orders"); resolveZone() maps them to the app (zone) that owns them. Inside the same zone we use next/link
   (basePath is added by Next); across zones we use a plain <a> to the gateway path, which is a full page load on the
   same origin, so localStorage and BroadcastChannel state carry over. Zone "web" is the single-app fallback: URLs stay as written. */
export type Zone = 'web' | 'marketing' | 'coordinator' | 'buyer' | 'driver' | 'farmer';
export const ZONES: Exclude<Zone, 'web' | 'marketing'>[] = ['coordinator', 'buyer', 'driver', 'farmer'];
const COORDINATOR = ['/farm', '/plan', '/market', '/dry', '/haul', '/pay', '/demo', '/home'];

/** Original URL → { zone, path inside that zone }. Query and hash are kept. */
export function resolveZone(href: string): { zone: Exclude<Zone, 'web'>; path: string } {
    const m = href.match(/^([^?#]*)(.*)$/)!;
    const p = m[1] || '/';
    const rest = m[2];
    const under = (base: string) => p === base || p.startsWith(base + '/');
    if (under('/coordinator')) return { zone: 'coordinator', path: (p.slice(12) || '/') + rest };
    if (under('/buyer')) return { zone: 'buyer', path: (p.slice(6) || '/') + rest };
    if (under('/driver')) return { zone: 'driver', path: (p.slice(7) || '/') + rest };
    if (under('/farmer')) return { zone: 'farmer', path: (p.slice(7) || '/') + rest };
    if (under('/haul/driver')) return { zone: 'driver', path: (p.slice(12) || '/') + rest };
    if (under('/sms')) return { zone: 'farmer', path: (p.slice(4) || '/') + rest };
    if (under('/slip')) return { zone: 'farmer', path: p + rest };
    if (COORDINATOR.some(under)) return { zone: 'coordinator', path: p + rest };
    return { zone: 'marketing', path: p + rest };
}
/** The full gateway URL of an original URL (e.g. "/sms" → "/farmer", "/farm" → "/coordinator/farm"). */
export function gatewayPath(href: string) {
    const { zone, path } = resolveZone(href);
    if (zone === 'marketing') return path;
    return `/${zone}${path === '/' ? '' : path.startsWith('/?') || path.startsWith('/#') ? path.slice(1) : path}`;
}
/** Where a link should point from the current zone, and whether next/link can handle it. */
export function zoneHref(current: Zone, href: string): { href: string; same: boolean } {
    if (current === 'web' || href.startsWith('#') || /^[a-z]+:/i.test(href)) return { href, same: true };
    const { zone, path } = resolveZone(href);
    return zone === current ? { href: path, same: true } : { href: gatewayPath(href), same: false };
}

const ZoneCtx = createContext<Zone>('web');
export const ZoneProvider = ({ zone, children }: PropsWithChildren<{ zone: Zone }>) => <ZoneCtx.Provider value={zone}>{children}</ZoneCtx.Provider>;
export const useZone = () => useContext(ZoneCtx);

/** A link written with the original URL; works in the single app and across zones. */
export function ZLink({ href, children, replace, scroll, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; replace?: boolean; scroll?: boolean }) {
    const z = zoneHref(useZone(), href);
    if (z.same) return <Link href={z.href} replace={replace} scroll={scroll} {...rest}>{children}</Link>;
    return <a href={z.href} {...rest}>{children}</a>;
}
/** Navigate to an original URL from code (same zone: client-side; other zone: full page load on the same origin). */
export function useZoneNav() {
    const zone = useZone();
    const router = useRouter();
    return useCallback((href: string) => {
        const z = zoneHref(zone, href);
        if (z.same) router.push(z.href); else window.location.assign(z.href);
    }, [zone, router]);
}
