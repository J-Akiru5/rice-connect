'use client';
import { useMemo } from 'react';
import { ZLink } from '@rc/ui';
import { AppShell, BigStat, ErrorState, LoadingState, Pagination, useI18n } from '@rc/ui';
import { paginate, sortBy } from '@rc/domain/list';
import { staticListState, type ListState } from './list-state';
import { BARANGAYS, HERO_FARM, WEEKS, type Farm } from '@rc/domain/seed';
import { DRYING_FACTOR_PER_MILLE, LOSS_PCT, MUNICIPALITY, YIELD_WET_KG_PER_HA } from '@rc/domain/params';
import { dayLabel } from '@rc/domain/calendar';
import { SectionPill, ResponsiveTable, type Col } from './ui';
import { PlanCalendar, t1, usePlanCalendar } from './plan-calendar';

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
    return (
        <AppShell
            title="plan.title"
            active="plan"
            eyebrow={t('plan.eyebrow', { barangays: `${MUNICIPALITY} · ${BARANGAYS.join(', ')}`, start: dayLabel(0) })}
        >
            <div className="flex flex-col gap-6 max-w-[1600px]">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                    <BigStat
                        label="plan.stat.farms"
                        value={totals.farms}
                        icon="Farm"
                        note={t('plan.note.farms', {
                            b: plan.length,
                            split: plan.map((p) => p.farms).join('/')
                        })}
                    />
                    <BigStat
                        label="plan.stat.area"
                        value={(totals.areaTenths / 10).toFixed(1)}
                        unit="ha"
                        icon="MapPin"
                        note={t('plan.note.area', {
                            avg: totals.farms ? (totals.areaTenths / 10 / totals.farms).toFixed(1) : '0.0'
                        })}
                    />
                    <BigStat
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
                        label="plan.stat.peak"
                        value={WEEKS[peak]}
                        icon="Plan"
                        note={t('plan.note.peak', { t: t1(weekKg[peak] ?? 0) })}
                    />
                </div>
                <PlanCalendar rows={plan} max={max} highlight={highlight} lotId={heroLot?.id} />
                <section aria-labelledby="plan-farms" className="flex flex-col gap-3">
                    <div>
                        <SectionPill id="plan-farms">{t('plan.farms')}</SectionPill>
                    </div>
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
