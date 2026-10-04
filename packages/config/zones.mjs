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

/** For a zone app (buyer, driver, farmer): its own domain's "/" sends visitors to the same page on the main
    origin, where state is shared. Without it the bare domain is a 404 (the app lives under its basePath). */
export const rootToMain = (zone) => ({
  source: '/', destination: `${zoneOrigins().main}/${zone}`, basePath: false, permanent: false,
});
