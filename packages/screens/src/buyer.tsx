'use client';
import { ZLink } from '@rc/ui';
import {
    AppShell,
    BigStat,
    Icon,
    RankedBars,
    SectionHead,
    ShareBar,
    TrendBars,
    useI18n,
    type ChartTone,
    type Point,
    type Segment
} from '@rc/ui';
import { WEEKS } from '@rc/domain/seed';
import {
    MILLING,
    SUPPLY,
    SUPPLY_WEEK_TOTAL,
    UNCOMMITTED_LOTS,
    RICE_AVAILABLE_KG,
    buysPalay,
    type BuyerType
} from '@rc/domain/buyers';
import { MUNICIPALITY } from '@rc/domain/params';
import { peso } from '@rc/domain/money';
import dynamic from 'next/dynamic';
const SupplyMap = dynamic(() => import('./supply-map').then((m) => m.SupplyMap), {
    ssr: false,
    loading: () => <div className="panel-solid rounded-[1.75rem] h-[384px] md:h-[444px]" aria-hidden />
});
import { BuyerTypePicker } from './buyer-type';
import { Note, ResponsiveTable } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
const TONES: ChartTone[] = ['brand', 'accent', 'gold'];

/** /buyer — what the cluster can supply, for the chosen buyer type (derived, not in canvas).
    Layout for a first-time buyer: who you are buying as, then the two headline figures, then a
    week-at-a-glance panel (trend, ranking, share) that lets one week be read three ways, then the map
    and the week-by-week table. One control — the harvest week — drives every figure on the page, and
    the same rounded numbers appear in the chart, the ranking, the map and the table. */
export function BuyerSupplyScreen({
    type,
    onType,
    week,
    onWeek
}: {
    type: BuyerType;
    onType: (t: BuyerType) => void;
    week: number;
    onWeek: (w: number) => void;
}) {
    const { t } = useI18n();
    const palay = buysPalay(type);
    const rows = SUPPLY.map((r) => ({ ...r, v: palay ? r.palay : r.rice }));
    const openKg = UNCOMMITTED_LOTS.reduce((s, l) => s + l.driedKg, 0);
    const unit = 't';
    const weekLabel = WEEKS[week] ?? WEEKS[0];

    /* Ranked largest first, each barangay taking the colour it keeps in the weekly stack and in the share
       bar below: same order, same colour, same figure, so all three charts read as one picture. */
    const ranking: (Point & { tone: ChartTone })[] = rows
        .map((r) => ({
            key: r.barangay,
            label: r.barangay,
            value: Number(t1(r.v[week] ?? 0))
        }))
        .sort((a, b) => b.value - a.value)
        .map((p, i) => ({ ...p, tone: TONES[i % TONES.length] ?? 'brand' }));
    const share = ranking;
    const toneOf = new Map(ranking.map((p) => [p.key, p.tone]));
    /* Every series is rounded exactly as the table rounds it, and a week's printed total is the sum of
       its own stack, so the chart, the stack and the table can never disagree by a tenth. */
    const trend: Point[] = WEEKS.map((w, i) => {
        const parts: Segment[] = rows.map((r) => ({
            key: r.barangay,
            label: r.barangay,
            value: Number(t1(r.v[i] ?? 0)),
            tone: toneOf.get(r.barangay) ?? 'brand'
        }));
        return { key: w, label: w, value: Number(parts.reduce((s, p) => s + p.value, 0).toFixed(1)), parts };
    });
    const peak = trend.reduce<Point>((a, b) => (b.value > a.value ? b : a), { key: 'none', label: '—', value: -1 });
    const seasonTotal = Number(trend.reduce((s, p) => s + p.value, 0).toFixed(1));
    const weekTotal = trend[week]?.value ?? 0;
    const list = ranking.map((p) => `${p.label} ${p.value.toFixed(1)} ${unit}`).join('; ');

    return (
        <AppShell role="buyer" title="supply.title" eyebrow="supply.eyebrow" active="supply">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                    <p className="rc-lede">{t('supply.lead', { place: MUNICIPALITY })}</p>
                    <BuyerTypePicker value={type} onChange={onType} />
                </div>

                <section aria-labelledby="sup-figures" className="flex flex-col gap-4">
                    <h2 id="sup-figures" className="sr-only">
                        {t('supply.look.title')}
                    </h2>
                    <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
                        {palay ? (
                            <>
                                <BigStat
                                    size="xl"
                                    label="supply.stat.palay"
                                    value={t1(SUPPLY_WEEK_TOTAL.reduce((a, b) => a + b, 0))}
                                    unit={t('unit.t')}
                                    icon="Wheat"
                                    className="panel-solid"
                                    note={t('supply.note.palay', {
                                        n: SUPPLY.reduce((s, r) => s + r.farms, 0),
                                        w: WEEKS.length
                                    })}
                                />
                                <BigStat
                                    size="xl"
                                    label="supply.stat.open"
                                    value={t1(openKg)}
                                    unit={t('unit.t')}
                                    icon="Sack"
                                    className="panel-solid"
                                    note={t('supply.note.palay', { n: UNCOMMITTED_LOTS.length, w: WEEKS.length })}
                                />
                            </>
                        ) : (
                            <>
                                <BigStat
                                    size="xl"
                                    label="supply.stat.rice"
                                    value={t1(RICE_AVAILABLE_KG)}
                                    unit={t('unit.t')}
                                    icon="Sack"
                                    className="panel-solid"
                                    note={t('supply.note.rice', {
                                        miller: MILLING.partnerMiller,
                                        pct: MILLING.recoveryPct
                                    })}
                                />
                                <BigStat
                                    size="xl"
                                    label="supply.stat.price"
                                    value={peso(MILLING.price)}
                                    unit="/kg"
                                    icon="Pay"
                                    className="panel-solid"
                                    note={t('supply.note.price', { sack: MILLING.sackKg })}
                                />
                            </>
                        )}
                    </div>
                </section>

                <section
                    aria-labelledby="sup-look"
                    className="panel-solid rounded-[1.75rem] p-5 md:p-7 flex flex-col gap-7"
                >
                    <SectionHead
                        id="sup-look"
                        title={t('supply.look.title')}
                        hint={t('supply.week.help')}
                        action={
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[16px] font-bold text-[var(--text-secondary)]">
                                    {t('dry.weeks')}
                                </span>
                                <div
                                    role="radiogroup"
                                    aria-label={t('dry.weeks')}
                                    className="inline-flex gap-1 p-1 rounded-[2rem] border-2 border-[color:var(--text-muted)]"
                                >
                                    {WEEKS.map((w, i) => (
                                        <button
                                            key={w}
                                            type="button"
                                            role="radio"
                                            aria-checked={week === i}
                                            onClick={() => onWeek(i)}
                                            className={`inline-flex items-center justify-center gap-1.5 min-w-[64px] min-h-[48px] px-4 rounded-full text-[17px] font-extrabold tracking-[0.02em] ${
                                                week === i
                                                    ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]'
                                                    : 'text-[var(--ink)] rc-hover-accent'
                                            }`}
                                        >
                                            {week === i && <Icon name="Check" size={18} strokeWidth={3} />}
                                            {w}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        }
                    />
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
                        <TrendBars
                            title={t(palay ? 'supply.trend.palay' : 'supply.trend.rice')}
                            unit={unit}
                            current={weekLabel}
                            points={trend}
                            tone={palay ? 'brand' : 'accent'}
                            pct
                            summary={t('supply.trend.summary', {
                                week: peak.label,
                                value: peak.value.toFixed(1),
                                pct: Math.round((peak.value / Math.max(1, seasonTotal)) * 100),
                                unit
                            })}
                        />
                        <RankedBars
                            title={t('supply.rank.title', { week: weekLabel })}
                            unit={unit}
                            items={ranking}
                            tone={palay ? 'accent' : 'brand'}
                            summary={t('supply.rank.summary', { week: weekLabel, list })}
                        />
                    </div>
                    <div className="border-t rule-ink pt-6">
                        <ShareBar
                            title={t('supply.share.title', { week: weekLabel })}
                            unit={unit}
                            items={share}
                            summary={t('supply.share.summary', {
                                value: weekTotal.toFixed(1),
                                unit,
                                week: weekLabel,
                                n: ranking.length
                            })}
                        />
                    </div>
                </section>

                <section aria-labelledby="sup-map" className="flex flex-col gap-5">
                    <SectionHead id="sup-map" title={t('supply.map', { week: weekLabel })} />
                    <div className="cq-two">
                        <SupplyMap
                            values={rows.map((r) => Number(t1(r.v[week] ?? 0)))}
                            unit={unit}
                            label={t('supply.map', { week: weekLabel })}
                        />
                        <div className="flex flex-col gap-5">
                            <ResponsiveTable
                                surface="solid"
                                caption={t('supply.table')}
                                rows={rows}
                                rowKey={(r) => r.barangay}
                                cols={[
                                    { key: 'b', label: t('farm.barangay'), cell: (r) => r.barangay },
                                    ...WEEKS.map((w, i) => ({
                                        key: w,
                                        label: w,
                                        align: 'right' as const,
                                        nowrap: true,
                                        cell: (r: (typeof rows)[number]) => (
                                            <span
                                                className={
                                                    i === week ? 'underline decoration-[3px] underline-offset-4' : ''
                                                }
                                            >
                                                {t1(r.v[i] ?? 0)} {t('unit.t')}
                                            </span>
                                        )
                                    }))
                                ]}
                            />
                            <Note className="!text-[16px] !leading-6">
                                {t('supply.mapNote', { place: MUNICIPALITY })}.
                            </Note>
                            <ZLink href={`/buyer/orders?type=${type}`} className="btn-2026 self-start !text-[15px]">
                                <Icon name={palay ? 'Plus' : 'Sack'} size={22} />
                                <span>{t(palay ? 'supply.cta.palay' : 'supply.cta.rice')}</span>
                            </ZLink>
                        </div>
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
