/* Approximate barangay center points (WGS84) for the buyer supply map.
   Source: PhilAtlas barangay pages for Dingle, Iloilo (philatlas.com/visayas/r06/iloilo/dingle/…), read on 3 Oct 2026:
   San Matias 11.0002, 122.6599 · Licu-an 11.0097, 122.6519 · Ilajas 11.0007, 122.6870.
   These are barangay reference points, not farm locations: the map never shows individual farms. */
import { BARANGAYS } from './params';

export const PLACES: Record<(typeof BARANGAYS)[number], { lat: number; lng: number }> = {
    'San Matias': { lat: 11.0002, lng: 122.6599 },
    'Licu-an': { lat: 11.0097, lng: 122.6519 },
    Ilajas: { lat: 11.0007, lng: 122.687 },
};
