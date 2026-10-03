'use client';
import { useI18n } from '@/components/riceconnect';
import { BARANGAYS, DRYER } from '@/data/seed';

/* Supply map (prototype addition, derived, not in canvas): three stylized barangay shapes, shaded by supply,
   with the cluster dryer in Barangay B. Aggregated per barangay on purpose: no farm pins, so buyers cannot
   go around the cluster and farmers' homes stay private. No map tiles, no network. Not to scale. */
const SHAPES = [
    { d: 'M30 70 L190 40 L230 150 L200 300 L60 320 L20 200 Z', cx: 120, cy: 180 },
    { d: 'M240 60 L380 50 L400 170 L370 320 L230 310 L250 170 Z', cx: 315, cy: 185 },
    { d: 'M410 40 L570 70 L585 210 L550 330 L390 320 L415 180 Z', cx: 495, cy: 190 },
];

export function SupplyMap({ values, unit, label }: { values: number[]; unit: string; label: string }) {
    const { t } = useI18n();
    const max = Math.max(1, ...values);
    const summary = BARANGAYS.map((b, i) => `${b}: ${values[i].toFixed(1)} ${unit}`).join('; ');
    return (
        <figure className="glass-panel rounded-[1.5rem] p-4 m-0">
            <svg viewBox="0 0 600 360" className="w-full h-auto block" role="img" aria-label={`${label}. ${summary}`}>
                {SHAPES.map((s, i) => (
                    <g key={i}>
                        <path d={s.d} style={{ fill: 'var(--fill-strong)', fillOpacity: 0.12 + 0.7 * (values[i] / max), stroke: 'var(--text-accent)', strokeWidth: 2 }} />
                        {i !== 1 && <line x1={s.cx} y1={s.cy + 40} x2={SHAPES[1].cx} y2={SHAPES[1].cy + 60} style={{ stroke: 'var(--text-muted)', strokeWidth: 3, strokeDasharray: '8 6' }} />}
                        <rect x={s.cx - 74} y={s.cy - 44} width={148} height={64} rx={14} style={{ fill: 'var(--glass-fill-strong)', stroke: 'var(--glass-border-strong)' }} />
                        <text x={s.cx} y={s.cy - 20} textAnchor="middle" style={{ fill: 'var(--ink)', fontSize: 15, fontWeight: 800 }}>{BARANGAYS[i].replace(' (placeholder)', '')}</text>
                        <text x={s.cx} y={s.cy + 6} textAnchor="middle" className="tabular" style={{ fill: 'var(--ink)', fontSize: 20, fontWeight: 800 }}>{values[i].toFixed(1)} {unit}</text>
                    </g>
                ))}
                <g transform={`translate(${SHAPES[1].cx - 20} ${SHAPES[1].cy + 44})`}>
                    <rect width={40} height={40} rx={10} style={{ fill: 'var(--brand-gold)', stroke: 'var(--black)', strokeWidth: 2 }} />
                    <path d="M20 10v4M20 26v4M10 20h4M26 20h4M13 13l3 3M24 24l3 3M13 27l3-3M24 16l3-3" style={{ stroke: 'var(--black)', strokeWidth: 2.5, strokeLinecap: 'round' }} />
                    <circle cx={20} cy={20} r={4} style={{ fill: 'none', stroke: 'var(--black)', strokeWidth: 2.5 }} />
                </g>
                <text x={SHAPES[1].cx} y={SHAPES[1].cy + 104} textAnchor="middle" style={{ fill: 'var(--ink)', fontSize: 14, fontWeight: 800 }}>{DRYER.name}</text>
            </svg>
            <figcaption className="mt-2 text-[14px] leading-5 font-semibold text-[var(--text-secondary)]">{t('supply.mapNote')}</figcaption>
        </figure>
    );
}
