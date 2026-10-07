'use client';
import { useI18n } from '@rc/i18n';
import { STATUS_KIND } from './Enactus';

/* Owner-requested dashboard charts (design-system only, no chart library): SVG, token fills,
   tabular numbers, a screen-reader label plus a visually hidden data table, and no animation
   (so prefers-reduced-motion needs no special case). */

type Kind = 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'brand';
const KIND_FILL: Record<Kind, string> = {
    success: 'var(--success)',
    warning: 'var(--warning)',
    info: 'var(--info)',
    danger: 'var(--danger-strong)',
    brand: 'var(--fill-strong)',
    neutral: 'var(--text-muted)'
};
export const chartFill = (status: string) => KIND_FILL[STATUS_KIND[status] ?? 'neutral'];

function DataTable({ caption, rows }: { caption: string; rows: { label: string; value: string }[] }) {
    const { t } = useI18n();
    return (
        <table className="sr-only">
            <caption>{caption}</caption>
            <thead>
                <tr>
                    <th scope="col">{t('chart.label')}</th>
                    <th scope="col">{t('chart.value')}</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={i}>
                        <th scope="row">{r.label}</th>
                        <td>{r.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/** Bars for a short series (weeks, days). Values are drawn on top and repeated in the hidden table. */
export function BarChart({
    title,
    data,
    unit = '',
    className = ''
}: {
    title: string;
    data: { label: string; value: number }[];
    unit?: string;
    className?: string;
}) {
    const max = Math.max(1, ...data.map((d) => d.value));
    const barW = 46;
    const gap = 18;
    const padX = 8;
    const valueH = 18;
    const plotH = 96;
    const labelH = 20;
    const width = padX * 2 + data.length * barW + Math.max(0, data.length - 1) * gap;
    const height = valueH + plotH + labelH;
    return (
        <figure className={'m-0 flex flex-col gap-2 min-w-0 ' + className}>
            <figcaption className="text-[13px] leading-5 font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                {title}
            </figcaption>
            <div role="img" aria-label={title}>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto tabular" aria-hidden focusable="false">
                    {data.map((d, i) => {
                        const h = Math.max(d.value > 0 ? 3 : 0, Math.round((d.value / max) * plotH));
                        const x = padX + i * (barW + gap);
                        return (
                            <g key={d.label + i}>
                                <rect
                                    x={x}
                                    y={valueH + plotH - h}
                                    width={barW}
                                    height={h}
                                    rx={6}
                                    fill="var(--fill-strong)"
                                />
                                <text
                                    x={x + barW / 2}
                                    y={valueH - 4}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fontWeight="700"
                                    fill="var(--ink)"
                                >
                                    {d.value}
                                </text>
                                <text
                                    x={x + barW / 2}
                                    y={height - 5}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fontWeight="800"
                                    fill="var(--text-muted)"
                                >
                                    {d.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
            <DataTable
                caption={title}
                rows={data.map((d) => ({ label: d.label, value: `${d.value}${unit ? ` ${unit}` : ''}` }))}
            />
        </figure>
    );
}

/** One done/target bar (a commitment or a quota). */
export function ProgressBar({
    title,
    value,
    max,
    unit = '',
    className = ''
}: {
    title: string;
    value: number;
    max: number;
    unit?: string;
    className?: string;
}) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return (
        <figure className={'m-0 flex flex-col gap-1.5 min-w-0 ' + className}>
            <figcaption className="flex items-baseline justify-between gap-2 text-[14px] leading-5 font-bold">
                <span className="min-w-0 break-words">{title}</span>
                <span className="tabular text-[var(--text-secondary)] whitespace-nowrap">
                    {value} / {max} {unit}
                </span>
            </figcaption>
            <div role="img" aria-label={`${title}: ${pct}%`}>
                <svg
                    viewBox="0 0 100 10"
                    className="w-full h-2.5"
                    preserveAspectRatio="none"
                    aria-hidden
                    focusable="false"
                >
                    <rect x="0" y="0" width="100" height="10" fill="var(--glass-border-strong)" />
                    <rect x="0" y="0" width={pct} height="10" fill="var(--fill-strong)" />
                </svg>
            </div>
            <DataTable caption={title} rows={[{ label: title, value: `${value} / ${max}${unit ? ` ${unit}` : ''}` }]} />
        </figure>
    );
}

/** A stacked bar with a legend: how many records sit in each status. */
export function StatusDistribution({
    title,
    segments,
    className = ''
}: {
    title: string;
    segments: { status: string; label: string; value: number }[];
    className?: string;
}) {
    const { t } = useI18n();
    const shown = segments.filter((s) => s.value > 0);
    const total = shown.reduce((s, x) => s + x.value, 0);
    let x = 0;
    const bars = shown.map((s) => {
        const w = total > 0 ? (s.value / total) * 100 : 0;
        const bar = { ...s, x, w };
        x += w;
        return bar;
    });
    return (
        <figure className={'m-0 flex flex-col gap-2 min-w-0 ' + className}>
            <figcaption className="text-[13px] leading-5 font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                {title}
            </figcaption>
            {total === 0 ? (
                <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)]">{t('chart.noData')}</p>
            ) : (
                <>
                    <div role="img" aria-label={title}>
                        <svg
                            viewBox="0 0 100 12"
                            className="w-full h-3"
                            preserveAspectRatio="none"
                            aria-hidden
                            focusable="false"
                        >
                            <rect x="0" y="0" width="100" height="12" fill="var(--glass-border-strong)" />
                            {bars.map((b) => (
                                <rect key={b.status} x={b.x} y="0" width={b.w} height="12" fill={chartFill(b.status)} />
                            ))}
                        </svg>
                    </div>
                    <ul className="m-0 p-0 list-none flex flex-wrap gap-x-4 gap-y-1.5">
                        {bars.map((b) => (
                            <li key={b.status} className="flex items-center gap-2 text-[14px] leading-5 font-bold">
                                <span
                                    aria-hidden
                                    className="w-3 h-3 shrink-0 rounded-sm"
                                    style={{ background: chartFill(b.status) }}
                                />
                                <span className="break-words">{b.label}</span>
                                <span className="tabular text-[var(--text-secondary)]">{b.value}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <DataTable caption={title} rows={segments.map((s) => ({ label: s.label, value: String(s.value) }))} />
        </figure>
    );
}
