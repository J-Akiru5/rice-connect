/* Where each zone is deployed. Production: the zone's own Vercel project domain (hard-coded, no env vars).
   RC_LOCAL=1 (pnpm demo:local): every zone on localhost, so the whole demo runs with the network off.
   RC_LOCAL is read at build time too: rewrites are baked into the build. */
export const PRODUCTION = {
  coordinator: 'https://riceconnect-coordinator.vercel.app',
  buyer: 'https://riceconnect-buyer.vercel.app',
  driver: 'https://riceconnect-driver.vercel.app',
  farmer: 'https://riceconnect-farmer.vercel.app',
};
export const LOCAL = {
  coordinator: 'http://localhost:3001',
  buyer: 'http://localhost:3002',
  driver: 'http://localhost:3003',
  farmer: 'http://localhost:3004',
};
export const zoneOrigins = () => (process.env.RC_LOCAL === '1' ? LOCAL : PRODUCTION);
