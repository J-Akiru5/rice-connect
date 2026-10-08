'use client';
import { useMemo } from 'react';
import { ZLink } from '@rc/ui';
import {
    AppShell,
    BigStat,
    ErrorState,
    LoadingState,
    Pagination,
    RankedBars,
    SectionHead,
    ShareBar,
    TrendBars,
    useI18n,
    type ChartTone,
    type Point,
    type Segment
} from '@rc/ui';
import { paginate, sortBy } from '@rc/domain/list';
import { staticListState, type ListState } from './list-state';
import { BARANGAYS, HERO_FARM, WEEKS, type Farm } from '@rc/domain/seed';
import { DRYING_FACTOR_PER_MILLE, LOSS_PCT, MUNICIPALITY, YIELD_WET_KG_PER_HA } from '@rc/domain/params';
import { dayLabel } from '@rc/domain/calendar';
import { ResponsiveTable, type Col } from './ui';
import { PlanCalendar, t1, usePlanCalendar } from './plan-calendar';

const TONES: ChartTone[] = ['brand', 'accent', 'gold'];

/** /plan — the cluster's harvest calendar, W1-W4, dried tonnes per week per barangay (desktop). */
export function PlanScreen({ list }: { list?: ListState }) {
    const { t } = useI18n();
    const L = list ?? staticListState('/plan');
    /* Gate 3: farms and lots come from the repositories (mock in demo, Supabase in live). */
    const cal = usePlanCalendar();
    const farms = cal.farms;
    const plan = cal.rows;
    const lotOfFarm = useMemo(() => new Map(cal.lots.map((l) => [l.farm, l])), [cal.lots]);
    const byDate = useMemo(
        () =>
            sortBy(
                sortBy(farms, (f) => f.id),
                (f) => f.harvestDay
            ),
        [farms]
    );
    const totals = useMemo(
        () => ({
            farms: farms.length,
            areaTenths: farms.reduce((s, f) => s + f.areaTenths, 0),
            driedKg: farms.reduce((s, f) => s + f.driedKg, 0),
            wetKg: farms.reduce((s, f) => s + f.areaTenths * YIELD_WET_KG_PER_HA, 0) / 10
        }),
        [farms]
    );
    const weekKg = useMemo(
        () => WEEKS.map((w) => farms.filter((f) => f.harvestWeek === w).reduce((s, f) => s + f.driedKg, 0)),
        [farms]
    );
    const loading = cal.isPending;
    const failed = cal.isError;
    const retry = cal.retry;
    if (loading)
        return (
            <AppShell title="plan.title" active="plan">
                <LoadingState rows={3} />
            </AppShell>
        );
    if (failed)
        return (
            <AppShell title="plan.title" active="plan">
                <ErrorState onRetry={retry} />
            </AppShell>
        );
    const pg = paginate(byDate, L.page, L.size);
    const { max, highlight, heroLot } = cal;
    const cols: Col<Farm>[] = [
        {
            key: 'farm',
            label: t('farm.id'),
            cell: (f) => (
                <ZLink
                    href={`/farm/${f.id}`}
                    className="inline-flex items-center min-h-[40px] text-[var(--text-accent)] underline underline-offset-4"
                >
                    {f.id}
                </ZLink>
            )
        },
        { key: 'barangay', label: t('farm.barangay'), cell: (f) => f.barangay },
        { key: 'harvest', label: t('farm.harvest'), cell: (f) => `${f.harvestWeek} · ${f.harvestLabel}` },
        { key: 'area', label: t('farm.area'), align: 'right', nowrap: true, cell: (f) => `${f.areaHa.toFixed(1)} ha` },
        {
            key: 'kg',
            label: t('farm.forecast'),
            align: 'right',
            nowrap: true,
            cell: (f) => `${f.driedKg.toLocaleString('en-US')} kg`
        },
        { key: 'lot', label: t('farm.lot'), cell: (f) => lotOfFarm.get(f.id)?.id ?? '—' }
    ];
    const peak = weekKg.indexOf(Math.max(...weekKg));
    const unit = t('unit.t');
    /* Ranked largest first, each barangay taking the colour it keeps in the weekly stack above and in the
       share bar below: same order, same colour, same figure, so all three charts read as one picture. */
    const ranking: (Point & { tone: ChartTone })[] = plan
        .map((r) => ({
            key: r.barangay,
            label: r.barangay,
            value: Number(r.weeks.reduce((a, b) => a + b, 0).toFixed(1))
        }))
        .sort((a, b) => b.value - a.value)
        .map((p, i) => ({ ...p, tone: TONES[i % TONES.length] ?? 'brand' }));
    const share = ranking;
    const toneOf = new Map(ranking.map((p) => [p.key, p.tone]));
    /* Three readings of the same forecast: the week's shape and who is in it, who carries the season,
       and how each week divides. A week's printed total is the sum of its own stack, never a
       separately-rounded figure that misses the parts by a tenth. */
    const trend: Point[] = WEEKS.map((w, i) => {
        const parts: Segment[] = plan.map((r) => ({
            key: r.barangay,
            label: r.barangay,
            value: Number((r.weeks[i] ?? 0).toFixed(1)),
            tone: toneOf.get(r.barangay) ?? 'brand'
        }));
        return { key: w, label: w, value: Number(parts.reduce((s, p) => s + p.value, 0).toFixed(1)), parts };
    });
    const peakW = trend.reduce<Point>((a, b) => (b.value > a.value ? b : a), { key: 'none', label: '—', value: -1 });
    const totalT = Number(ranking.reduce((s, p) => s + p.value, 0).toFixed(1));
    const top3 = [...ranking]
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .reduce((s, p) => s + p.value, 0);
    const top3Pct = totalT > 0 ? Math.round((top3 / totalT) * 100) : 0;
    /* Printed largest first, exactly as the ranking above it draws them. */
    const rankList = ranking
        .slice()
        .sort((a, b) => b.value - a.value)
        .map((p) => `${p.label} ${p.value.toFixed(1)} ${unit}`)
        .join('; ');
    return (
        <AppShell
            title="plan.title"
            active="plan"
            eyebrow={t('plan.eyebrow', { barangays: `${MUNICIPALITY} · ${BARANGAYS.join(', ')}`, start: dayLabel(0) })}
        >
            <div className="flex flex-col gap-10 max-w-[1600px]">
                <p className="rc-lede">
                    {t('plan.lead', { place: MUNICIPALITY, farms: totals.farms, weeks: WEEKS.length })}
                </p>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="plan.stat.farms"
                        value={totals.farms}
                        icon="Farm"
                        note={t('plan.note.farms', {
                            b: plan.length,
                            split: plan.map((p) => p.farms).join('/')
                        })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="plan.stat.area"
                        value={(totals.areaTenths / 10).toFixed(1)}
                        unit="ha"
                        icon="MapPin"
                        note={t('plan.note.area', {
                            avg: totals.farms ? (totals.areaTenths / 10 / totals.farms).toFixed(1) : '0.0'
                        })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="plan.stat.tonnes"
                        value={t1(totals.driedKg)}
                        unit="t"
                        icon="Wheat"
                        note={t('plan.note.tonnes', {
                            wet: t1(totals.wetKg),
                            yield: YIELD_WET_KG_PER_HA.toLocaleString('en-US'),
                            loss: LOSS_PCT,
                            factor: (DRYING_FACTOR_PER_MILLE / 1000).toFixed(3)
                        })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="plan.stat.peak"
                        value={WEEKS[peak]}
                        icon="Plan"
                        note={t('plan.note.peak', { t: t1(weekKg[peak] ?? 0) })}
                    />
                </div>
                <section
                    aria-labelledby="plan-look"
                    className="panel-solid rounded-[1.75rem] p-5 md:p-7 flex flex-col gap-7"
                >
                    <SectionHead id="plan-look" title={t('plan.look.title')} hint={t('plan.look.hint')} />
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
                        <TrendBars
                            title={t('plan.trend.title')}
                            unit={unit}
                            current={peakW.label}
                            points={trend}
                            tone="brand"
                            pct
                            summary={t('plan.trend.summary', {
                                week: peakW.label,
                                value: peakW.value.toFixed(1),
                                pct: Math.round((peakW.value / Math.max(1, totalT)) * 100),
                                unit
                            })}
                        />
                        <RankedBars
                            title={t('plan.rank.title')}
                            unit={unit}
                            items={ranking}
                            tone="accent"
                            summary={t('plan.rank.summary', { n: ranking.length, list: rankList })}
                        />
                    </div>
                    <div className="border-t rule-ink pt-6">
                        <ShareBar
                            title={t('plan.share.title')}
                            unit={unit}
                            items={share}
                            summary={t('plan.share.summary', {
                                pct: top3Pct,
                                total: totalT.toFixed(1),
                                unit,
                                n: ranking.length
                            })}
                        />
                    </div>
                </section>
                <PlanCalendar rows={plan} max={max} highlight={highlight} lotId={heroLot?.id} />

                <section aria-labelledby="plan-farms" className="flex flex-col gap-3">
                    <SectionHead id="plan-farms" title={t('plan.farms')} />
                    <ResponsiveTable
                        caption={t('plan.farms')}
                        cols={cols}
                        rows={pg.rows}
                        rowKey={(f) => f.id}
                        highlight={(f) => f.id === HERO_FARM.id}
                    />
                    <Pagination
                        total={pg.total}
                        page={pg.page}
                        pageSize={pg.size}
                        hrefFor={L.pageHref}
                        onSizeChange={(n) => L.set({ size: n })}
                    />
                </section>
            </div>
        </AppShell>
    );
}
