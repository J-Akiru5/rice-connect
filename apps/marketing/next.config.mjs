import { zoneOrigins } from './zones.mjs';

/* Gateway: marketing owns "/" and "/launch"; every zone is rewritten onto this one origin so all apps share
   localStorage and BroadcastChannel. The original single-app URLs redirect to their new homes. */
const z = zoneOrigins();
const zone = (name) => [
  { source: `/${name}`, destination: `${z[name]}/${name}` },
  { source: `/${name}/:path*`, destination: `${z[name]}/${name}/:path*` },
];
const legacy = [
  ['/farm', '/coordinator/farm'], ['/farm/:id', '/coordinator/farm/:id'], ['/plan', '/coordinator/plan'],
  ['/market', '/coordinator/market'], ['/dry', '/coordinator/dry'], ['/haul', '/coordinator/haul'],
  ['/haul/driver', '/driver'], ['/pay', '/coordinator/pay'], ['/pay/:lotId', '/coordinator/pay/:lotId'],
  ['/sms', '/farmer'], ['/demo', '/coordinator/demo'], ['/home', '/coordinator/home'],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@rc/ui', '@rc/domain', '@rc/i18n', '@rc/store', '@rc/screens'],
  async rewrites() {
    return [...zone('coordinator'), ...zone('buyer'), ...zone('driver'), ...zone('farmer')];
  },
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: false }));
  },
};
export default nextConfig;
