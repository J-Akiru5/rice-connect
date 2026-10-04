/* Zone "buyer": served under /buyer on the gateway origin (apps/marketing rewrites /buyer/* here).
   App routes are not for search engines. */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath: '/buyer',
  transpilePackages: ['@rc/ui', '@rc/domain', '@rc/i18n', '@rc/store', '@rc/screens'],
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};
export default nextConfig;
