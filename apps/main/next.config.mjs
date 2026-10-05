import { zoneOrigins } from '@rc/config/zones.mjs';
import { securityHeaders } from '@rc/config/security-headers.mjs';

/* Main app: the public site ("/", "/launch", "/login"), the coordinator ("/coordinator/*") and the super admin
   ("/admin/*") in one Next.js app.
   It is also the one origin users visit: /buyer, /driver and /farmer are rewritten to their own apps, so
   every app shares localStorage and BroadcastChannel. The original single-app URLs redirect to their homes. */
const z = zoneOrigins();
const zone = (name) => [
  { source: `/${name}`, destination: `${z[name]}/${name}` },
  { source: `/${name}/:path*`, destination: `${z[name]}/${name}/:path*` }
];
const legacy = [
  ['/coordinator', '/coordinator/home'],
  ['/farm', '/coordinator/farm'],
  ['/farm/:id', '/coordinator/farm/:id'],
  ['/plan', '/coordinator/plan'],
  ['/market', '/coordinator/market'],
  ['/dry', '/coordinator/dry'],
  ['/haul', '/coordinator/haul'],
  ['/haul/driver', '/driver'],
  ['/pay', '/coordinator/pay'],
  ['/pay/:lotId', '/coordinator/pay/:lotId'],
  ['/sms', '/farmer'],
  ['/slip', '/farmer/slip'],
  ['/demo', '/coordinator/demo'],
  ['/home', '/coordinator/home']
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@rc/ui', '@rc/domain', '@rc/i18n', '@rc/store', '@rc/screens'],
  async rewrites() {
    return [...zone('buyer'), ...zone('driver'), ...zone('farmer')];
  },
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: false }));
  },
  /* The coordinator and super admin pages are not for search engines; the public site is. */
  async headers() {
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
    return [
      { source: '/:path*', headers: securityHeaders() },
      { source: '/coordinator/:path*', headers: noindex },
      { source: '/admin/:path*', headers: noindex },
      { source: '/admin', headers: noindex },
      { source: '/__kit', headers: noindex }
    ];
  }
};
export default nextConfig;
