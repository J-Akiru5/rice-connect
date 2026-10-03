/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@rc/ui', '@rc/domain', '@rc/i18n', '@rc/store'],
};
export default nextConfig;
