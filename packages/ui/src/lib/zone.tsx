'use client';
import { createContext, useCallback, useContext, type AnchorHTMLAttributes, type PropsWithChildren } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* Multi-zone routing (prototype addition). Every screen keeps writing the original URLs ("/farm/F-014", "/sms",
   "/buyer/orders"); resolveZone() maps them to the part of the product that owns them, and appOf() to the app
   that serves it. The main app serves the public site and the coordinator (no basePath, coordinator pages under
   /coordinator); buyer, driver and farmer are their own apps (basePath /buyer, /driver, /farmer). Inside one app
   we use next/link; across apps a plain <a> to the main-origin path, which is a full page load on the same
   origin, so localStorage and BroadcastChannel state carry over. */
export type Zone = 'main' | 'buyer' | 'driver' | 'farmer';
type Part = 'marketing' | 'coordinator' | 'buyer' | 'driver' | 'farmer';
const COORDINATOR = ['/farm', '/plan', '/market', '/dry', '/haul', '/pay', '/demo', '/home'];

/** Original URL → { zone, path inside that zone }. Query and hash are kept. */
export function resolveZone(href: string): { zone: Part; path: string } {
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
/** The app that serves a part of the product. */
export const appOf = (part: Part): Zone => (part === 'marketing' || part === 'coordinator' ? 'main' : part);
/** The full main-origin URL of an original URL (e.g. "/sms" → "/farmer", "/farm" → "/coordinator/farm"). */
export function gatewayPath(href: string) {
    const { zone, path } = resolveZone(href);
    if (zone === 'marketing') return path;
    return `/${zone}${path === '/' ? '' : path.startsWith('/?') || path.startsWith('/#') ? path.slice(1) : path}`;
}
/** Where a link should point from the current app, and whether next/link can handle it. */
export function zoneHref(current: Zone, href: string): { href: string; same: boolean } {
    if (href.startsWith('#') || /^[a-z]+:/i.test(href)) return { href, same: true };
    const { zone, path } = resolveZone(href);
    const app = appOf(zone);
    if (app !== current) return { href: gatewayPath(href), same: false };
    /* main has no basePath, so its links are the full path; the zone apps' links are basePath-relative. */
    return { href: app === 'main' ? gatewayPath(href) : path, same: true };
}

const ZoneCtx = createContext<Zone>('main');
export const ZoneProvider = ({ zone, children }: PropsWithChildren<{ zone: Zone }>) => (
    <ZoneCtx.Provider value={zone}>{children}</ZoneCtx.Provider>
);
export const useZone = () => useContext(ZoneCtx);

/** A link written with the original URL; works inside an app and across apps. */
export function ZLink({
    href,
    children,
    replace,
    scroll,
    ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; replace?: boolean; scroll?: boolean }) {
    const z = zoneHref(useZone(), href);
    if (z.same)
        return (
            <Link href={z.href} replace={replace} scroll={scroll} {...rest}>
                {children}
            </Link>
        );
    return (
        <a href={z.href} {...rest}>
            {children}
        </a>
    );
}
/** Navigate to an original URL from code (same zone: client-side; other zone: full page load on the same origin). */
export function useZoneNav() {
    const zone = useZone();
    const router = useRouter();
    return useCallback(
        (href: string) => {
            const z = zoneHref(zone, href);
            if (z.same) router.push(z.href);
            else window.location.assign(z.href);
        },
        [zone, router]
    );
}
