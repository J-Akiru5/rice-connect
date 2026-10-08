'use client';
import type { CSSProperties, ReactNode } from 'react';

/* ================================================================
   Analytics primitives (prototype addition, requested for the buyer
   and coordinator screens). Deliberately dependency-free: plain
   SVG/CSS over the existing tokens, so no chart library enters the
   approved stack and every surface follows the theme switch.

   Rules they keep, from the UX standards:
     - a figure is never carried by colour alone: every series has its
       own visible number and the chart carries a text summary for
       screen readers;
     - numbers are .tabular, units are always printed;
     - motion is a reveal only (transform), suppressed under
       prefers-reduced-motion, and the chart is fully readable if the
       animation never runs.
   ================================================================ */

export type ChartTone = 'brand' | 'accent' | 'gold' | 'info' | 'warning' | 'success';

/* Series tones are tokens, never literals (CI guard). Each is a solid fill with a
   contrast-checked partner in both themes, because the tokens flip with the theme. */
const TONE: Record<ChartTone, string> = {
    brand: 'var(--brand-green)',
    accent: 'var(--emerald-500)',
    gold: 'var(--brand-gold)',
    info: 'var(--info)',
    warning: 'var(--warning)',
    success: 'var(--success)'
};

/* One piece of a period: the same categories the ranking and the share bar use, so a barangay
   keeps its own colour in all three charts and the reader can follow it across the page. */
export interface Segment {
    key: string;
    label: string;
    value: number;
    tone: ChartTone;
}

export interface Point {
    key: string;
    label: string;
    value: number;
    /* Optional per-row tone. A ranked chart and a share bar beside it describe the same
       categories, so a barangay (or a status) is allowed to carry its own colour and keep it
       in both: the reader matches the two figures by colour as well as by name. Left out, the
       row takes the chart's single series tone. */
    tone?: ChartTone;
    /* Optional breakdown of this period. A column with parts is drawn as a stack in the part
       colours, with the period's own total riding above it: one column then says both "how big
       was this week" and "who carried it", in the same colours as the rest of the page. */
    parts?: Segment[];
}

const fmt = (n: number, digits = 1) => n.toFixed(digits);

/* ---------- Trend columns: a figure per period, current period marked ---------- */
export function TrendBars({
    points,
    unit,
    current,
    tone = 'brand',
    title,
    height = 172,
    summary,
    pct = false,
    format
}: {
    points: Point[];
    unit: string;
    current?: string;
    tone?: ChartTone;
    title: string;
    height?: number;
    summary?: string;
    /* Print each period's share of the whole period total beside its own figure. */
    pct?: boolean;
    /* A count is a whole number (34 farms, never 34.0). Money is formatted by the money module. */
    format?: (value: number) => string;
}) {
    const print = format ?? fmt;
    const max = Math.max(1, ...points.map((p) => p.value));
    const total = points.reduce((s, p) => s + p.value, 0);
    /* One legend for the stack, taken from the first column that carries parts. */
    const legend = points.find((p) => p.parts && p.parts.length > 0)?.parts ?? [];
    return (
        <figure className="rc-chart m-0" role="group" aria-label={summary ?? title}>
            <figcaption className="rc-chart-title">{title}</figcaption>
            <div className="rc-chart-body" style={{ height }}>
                {points.map((p) => {
                    /* The tallest bar stops short of the top so its value never leaves the figure box;
                       the value rides on top of its own bar rather than floating at the top of the column. */
                    const h = Math.max(3, Math.min(90, Math.round((p.value / max) * 100)));
                    const on = p.key === current;
                    const share = total > 0 ? Math.round((p.value / total) * 100) : 0;
                    return (
                        <div
                            key={p.key}
                            className={`rc-col${on ? ' rc-col-on' : ''}`}
                            style={{ '--rc-pct': `${h}%` } as CSSProperties}
                        >
                            <span className="rc-col-track">
                                <span className="rc-col-bar" style={{ background: TONE[tone] }} aria-hidden>
                                    {p.parts?.map((s) => (
                                        <span
                                            key={s.key}
                                            className="rc-col-seg"
                                            style={{
                                                background: TONE[s.tone],
                                                flexGrow: Math.max(0.02, s.value)
                                            }}
                                        />
                                    ))}
                                </span>
                                <span className="rc-col-value tabular">
                                    {print(p.value)}
                                    <span className="rc-col-unit"> {unit}</span>
                                    {pct && total > 0 && <span className="rc-col-pct"> · {share}%</span>}
                                </span>
                            </span>
                            <span className="rc-col-label">{p.label}</span>
                        </div>
                    );
                })}
            </div>
            {legend.length > 0 && (
                <ul className="rc-legend rc-legend-inline">
                    {legend.map((s) => (
                        <li key={s.key} className="rc-legend-item">
                            <span className="rc-legend-key" style={{ background: TONE[s.tone] }} aria-hidden />
                            <span className="rc-legend-label">{s.label}</span>
                        </li>
                    ))}
                </ul>
            )}
            {summary && <p className="rc-chart-note">{summary}</p>}
        </figure>
    );
}

/* ---------- Share bar: how one total divides between a few labelled parts ---------- */
export function ShareBar({
    items,
    unit,
    title,
    summary,
    format
}: {
    items: { key: string; label: string; value: number; tone: ChartTone }[];
    unit: string;
    title: string;
    summary?: string;
    /* Money is formatted by the money module (integer centavos, ₱, two decimals), never by the chart. */
    format?: (value: number) => string;
}) {
    const print = format ?? ((v: number) => fmt(v));
    const total = items.reduce((s, i) => s + i.value, 0);
    return (
        <figure className="rc-chart m-0" role="group" aria-label={summary ?? title}>
            <figcaption className="rc-chart-title">{title}</figcaption>
            <div className="rc-share" aria-hidden>
                {items.map((i) => (
                    <span
                        key={i.key}
                        className="rc-share-part"
                        style={{
                            background: TONE[i.tone],
                            flexGrow: Math.max(0.02, total === 0 ? 0 : i.value / total)
                        }}
                    />
                ))}
            </div>
            <ul className="rc-legend">
                {items.map((i) => (
                    <li key={i.key} className="rc-legend-item">
                        <span className="rc-legend-key" style={{ background: TONE[i.tone] }} aria-hidden />
                        <span className="rc-legend-label">{i.label}</span>
                        <span className="rc-legend-value tabular">
                            {print(i.value)}
                            {unit ? <span className="rc-col-unit"> {unit}</span> : null}
                            {total > 0 && (
                                <span className="rc-legend-pct"> · {Math.round((i.value / total) * 100)}%</span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
            {summary && <p className="rc-chart-note">{summary}</p>}
        </figure>
    );
}

/* ---------- Ranked bars: biggest first, value printed beside every bar ---------- */
export function RankedBars({
    items,
    unit,
    title,
    tone = 'accent',
    summary,
    heading,
    format
}: {
    items: Point[];
    unit: string;
    title: string;
    tone?: ChartTone;
    summary?: string;
    heading?: ReactNode;
    /* Money is formatted by the money module (integer centavos, ₱, two decimals), never by the chart. */
    format?: (value: number) => string;
}) {
    const sorted = [...items].sort((a, b) => b.value - a.value);
    const max = Math.max(1, ...sorted.map((p) => p.value));
    const print = format ?? fmt;
    return (
        <figure className="rc-chart m-0" role="group" aria-label={summary ?? title}>
            <figcaption className="rc-chart-title">{title}</figcaption>
            {heading}
            <ul className="rc-ranks">
                {sorted.map((p) => (
                    <li key={p.key} className="rc-rank">
                        <span className="rc-rank-label">{p.label}</span>
                        <span className="rc-rank-track" aria-hidden>
                            <span
                                className="rc-rank-fill"
                                style={{
                                    width: `${Math.max(2, Math.round((p.value / max) * 100))}%`,
                                    background: TONE[p.tone ?? tone]
                                }}
                            />
                        </span>
                        <span className="rc-rank-value tabular">
                            {print(p.value)}
                            {unit ? <span className="rc-col-unit"> {unit}</span> : null}
                        </span>
                    </li>
                ))}
            </ul>
            {summary && <p className="rc-chart-note">{summary}</p>}
        </figure>
    );
}

/* ---------- Sparkline: one small trend, for a panel header ---------- */
export function Sparkline({
    points,
    unit,
    title,
    tone = 'accent'
}: {
    points: Point[];
    unit: string;
    title: string;
    tone?: ChartTone;
}) {
    const max = Math.max(1, ...points.map((p) => p.value));
    const min = Math.min(...points.map((p) => p.value));
    const first = points[0];
    const last = points[points.length - 1];
    return (
        <svg
            className="rc-spark"
            viewBox="0 0 100 28"
            preserveAspectRatio="none"
            role="img"
            aria-label={`${title}: ${points.map((p) => `${p.label} ${fmt(p.value)} ${unit}`).join(', ')}`}
        >
            {points.map((p, i) => {
                const h = 4 + ((p.value - min) / Math.max(1, max - min)) * 22;
                const w = 100 / points.length;
                return (
                    <rect
                        key={p.key}
                        x={i * w + w * 0.18}
                        y={28 - h}
                        width={w * 0.64}
                        height={h}
                        rx="1"
                        fill={TONE[tone]}
                        opacity={p.key === last?.key ? 1 : 0.45}
                    />
                );
            })}
            {first && last && first.key !== last.key && (
                <title>{`${title}: ${fmt(first.value)} → ${fmt(last.value)} ${unit}`}</title>
            )}
        </svg>
    );
}
