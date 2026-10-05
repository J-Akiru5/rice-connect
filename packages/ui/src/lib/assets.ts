/* Asset URLs the components render. Prototype: the logo set is self-hosted in public/brand/.
   The photo ground is retired and has no entry here. */
export const ASSETS = {
    logo: '/brand/riceconnect-logo.svg',
    logoReversed: '/brand/riceconnect-logo-reversed.svg',
    logoMono: '/brand/riceconnect-logo-mono.svg',
    mark: '/brand/riceconnect-mark.svg',
    markReversed: '/brand/riceconnect-mark-reversed.svg'
};
export function setAssets(next: Partial<typeof ASSETS>) {
    Object.assign(ASSETS, next);
}
