'use client';
import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useI18n } from '@/components/riceconnect';
import { BARANGAYS } from '@/data/seed';
import { MUNICIPALITY } from '@/data/params';
import { PLACES } from '@/data/places';

/* Supply map (prototype addition, derived, not in canvas; requested by the team): a real MapLibre GL map of Dingle, Iloilo
   with one marker per barangay (San Matias, Licu-an, Ilajas) sized and labeled by supply.
   Aggregated per barangay on purpose: no farm pins, so buyers cannot go around the cluster and farmers' homes stay private.
   Tiles: OpenFreeMap (free, no API key, OpenStreetMap data). This is the prototype's only runtime network call; if the tiles
   cannot load (offline, weak signal), the markers and the table beside the map still show every number. */
const STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export function SupplyMap({ values, unit, label }: { values: number[]; unit: string; label: string }) {
    const { t } = useI18n();
    const box = useRef<HTMLDivElement>(null);
    const map = useRef<import('maplibre-gl').Map | null>(null);
    const markers = useRef<HTMLDivElement[]>([]);
    const [offline, setOffline] = useState(false);
    const summary = BARANGAYS.map((b, i) => `${b}: ${values[i].toFixed(1)} ${unit}`).join('; ');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const maplibregl = (await import('maplibre-gl')).default;
            if (cancelled || !box.current) return;
            const pts = BARANGAYS.map((b) => PLACES[b]);
            const m = new maplibregl.Map({
                container: box.current,
                style: STYLE,
                bounds: [[Math.min(...pts.map((p) => p.lng)), Math.min(...pts.map((p) => p.lat))], [Math.max(...pts.map((p) => p.lng)), Math.max(...pts.map((p) => p.lat))]],
                fitBoundsOptions: { padding: 72, maxZoom: 14 },
                attributionControl: { compact: true },
                cooperativeGestures: true,
            });
            m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
            m.on('error', () => setOffline(true));
            markers.current = BARANGAYS.map((b) => {
                const el = document.createElement('div');
                el.className = 'rc-map-marker';
                el.setAttribute('role', 'img');
                new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([PLACES[b].lng, PLACES[b].lat]).addTo(m);
                return el;
            });
            map.current = m;
            setMarkers();
        })();
        return () => { cancelled = true; map.current?.remove(); map.current = null; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Marker contents follow the selected week and buyer type (no map reload). */
    const max = Math.max(1, ...values);
    function setMarkers() {
        markers.current.forEach((el, i) => {
            const size = 18 + Math.round(26 * (values[i] / max));
            el.innerHTML = '';
            const tag = document.createElement('span');
            tag.className = 'rc-map-tag tabular';
            tag.textContent = `${BARANGAYS[i]} · ${values[i].toFixed(1)} ${unit}`;
            const dot = document.createElement('span');
            dot.className = 'rc-map-dot';
            dot.style.width = dot.style.height = `${size}px`;
            el.append(tag, dot);
            el.setAttribute('aria-label', `${BARANGAYS[i]}: ${values[i].toFixed(1)} ${unit}`);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setMarkers, [values.join('|'), unit]);

    return (
        <figure className="glass-panel rounded-[1.5rem] p-3 m-0">
            <div ref={box} role="region" aria-label={`${label} · ${MUNICIPALITY}. ${summary}`} className="w-full h-[360px] md:h-[420px] rounded-[1rem] overflow-hidden bg-[var(--glass-fill)]" />
            {offline && <p role="status" className="mt-2 m-0 text-[14px] font-bold text-[var(--warning-ink)]">{t('supply.mapOffline')}</p>}
            <figcaption className="mt-2 px-1 text-[14px] leading-5 font-semibold text-[var(--text-secondary)]">{t('supply.mapNote', { place: MUNICIPALITY })}</figcaption>
        </figure>
    );
}
