/* Zone "coordinator": served under /coordinator on the gateway origin (apps/marketing rewrites /coordinator/* here).
   App routes are not for search engines. */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath: '/coordinator',
  transpilePackages: ['@rc/ui', '@rc/domain', '@rc/i18n', '@rc/store', '@rc/screens'],
  async redirects() {
    return [{ source: '/', destination: '/home', permanent: false }];
  },
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};
export default nextConfig;
