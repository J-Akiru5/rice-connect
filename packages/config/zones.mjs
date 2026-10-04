/* Where each app is deployed. Production: each Vercel project's domain (hard-coded, no env vars).
   RC_LOCAL=1 (pnpm demo:local): every app on localhost, so the whole demo runs with the network off.
   RC_LOCAL is read at build time: rewrites and redirects are baked into the build.
   "main" (marketing + coordinator) is the one origin users visit; it rewrites /buyer, /driver and /farmer
   to their apps so all of them share localStorage and BroadcastChannel. */
export const PRODUCTION = {
  main: 'https://rice-connect-opal.vercel.app',
  buyer: 'https://riceconnect-buyer.vercel.app',
  driver: 'https://riceconnect-driver.vercel.app',
  farmer: 'https://riceconnect-farmer.vercel.app',
};
export const LOCAL = {
  main: 'http://localhost:3000',
  buyer: 'http://localhost:3002',
  driver: 'http://localhost:3003',
  farmer: 'http://localhost:3004',
};
export const zoneOrigins = () => (process.env.RC_LOCAL === '1' ? LOCAL : PRODUCTION);

/** Redirects for a zone app (buyer, driver, farmer) when someone opens the app's own domain directly
    (e.g. a Vercel "Visit" or preview link) instead of going through the main origin:
    - "/" opens the app's own page on the same host, so it works on production and on staging previews alike
      (before: "/" went to the main production origin, which 404s while production still runs an older build);
    - paths that belong to another app (/coordinator, /admin, /login, other zones, ...) go to the main origin. */
const OTHER_PATHS = ['coordinator', 'admin', 'login', 'launch', 'buyer', 'driver', 'farmer'];
export const zoneRedirects = (zone) => [
  { source: '/', destination: `/${zone}`, basePath: false, permanent: false },
  ...OTHER_PATHS.filter((p) => p !== zone).flatMap((p) => [
    { source: `/${p}`, destination: `${zoneOrigins().main}/${p}`, basePath: false, permanent: false },
    { source: `/${p}/:path*`, destination: `${zoneOrigins().main}/${p}/:path*`, basePath: false, permanent: false },
  ]),
];
