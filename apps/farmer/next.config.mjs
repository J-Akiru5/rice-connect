/* Zone "farmer": served under /farmer on the gateway origin (apps/main rewrites /farmer/* here).
   App routes are not for search engines. */
import { zoneRedirects } from '@rc/config/zones.mjs';
import { securityHeaders } from '@rc/config/security-headers.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath: '/farmer',
  transpilePackages: ['@rc/ui', '@rc/domain', '@rc/i18n', '@rc/store', '@rc/screens'],
  async redirects() {
    return zoneRedirects('farmer');
  },
  async headers() {
    return [
      { source: '/:path*', headers: [...securityHeaders(), { key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }
    ];
  }
};
export default nextConfig;
