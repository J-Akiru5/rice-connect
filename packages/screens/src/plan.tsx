'use client';
import { useMemo } from 'react';
import { ZLink } from '@rc/ui';
import { AppShell, BigStat, ErrorState, HarvestCalendar, LoadingState, Pagination, useI18n } from '@rc/ui';
import { useFarms, useLots } from '@rc/data';
import { paginate, sortBy } from '@rc/domain/list';
import { staticListState, type ListState } from './list-state';
import { BARANGAYS, HERO_FARM, WEEKS, type Farm } from '@rc/domain/seed';
import { DRYING_FACTOR_PER_MILLE, LOSS_PCT, MUNICIPALITY, YIELD_WET_KG_PER_HA } from '@rc/domain/params';
import { dayLabel } from '@rc/domain/calendar';
import { SectionPill, Note, ResponsiveTable, type Col } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);

/** /plan — the cluster's harvest calendar, W1-W4, dried tonnes per week per barangay (desktop). */
export function PlanScreen({ list }: { list?: ListState }) {
    const { t } = useI18n();
    const L = list ?? staticListState('/plan');
    /* Gate 3: farms and lots come from the repositories (mock in demo, Supabase in live). */
    const farmsQuery = useFarms({ size: 500 });
    const lotsQuery = useLots({ size: 500 });
    const farms = useMemo(() => farmsQuery.data?.rows ?? [], [farmsQuery.data]);
    const lots = useMemo(() => lotsQuery.data?.rows ?? [], [lotsQuery.data]);
    const lotOfFarm = useMemo(() => new Map(lots.map((l) => [l.farm, l])), [lots]);
    const byDate = useMemo(
        () =>
            sortBy(
                sortBy(farms, (f) => f.id),
                (f) => f.harvestDay
            ),
        [farms]
    );
    const plan = useMemo(
        () =>
            BARANGAYS.map((b) => {
                const inBarangay = farms.filter((f) => f.barangay === b);
                return {
                    barangay: b,
                    weeks: WEEKS.map(
                        (w) =>
                            Math.round(
                                inBarangay.filter((f) => f.harvestWeek === w).reduce((s, f) => s + f.driedKg, 0) / 100
                            ) / 10
                    ),
                    farms: inBarangay.length
                };
            }),
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
    const loading = farmsQuery.isPending || lotsQuery.isPending;
    const failed = farmsQuery.isError || lotsQuery.isError;
    const retry = () => {
        void farmsQuery.refetch();
        void lotsQuery.refetch();
    };
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
    const max = Math.max(...plan.flatMap((r) => r.weeks));
    /* The demo's hero farm (F-014 · L-03) marks its barangay/week; live rows have no pinned hero. */
    const heroFarm = farms.find((f) => f.id === HERO_FARM.id);
    const heroLot = heroFarm ? lotOfFarm.get(heroFarm.id) : undefined;
    const highlight =
        heroFarm && heroLot
            ? {
                  row: BARANGAYS.indexOf(heroFarm.barangay as (typeof BARANGAYS)[number]),
                  week: WEEKS.indexOf(heroFarm.harvestWeek as (typeof WEEKS)[number]),
                  label: `${heroFarm.id} · ${heroLot.id} · ${t1(heroFarm.driedKg)} t`
              }
            : undefined;
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
                <section aria-labelledby="plan-cal">
                    <SectionPill id="plan-cal">{t('plan.section')}</SectionPill>
                    <div className="cq-wide-only">
                        <HarvestCalendar rows={plan} caption={t('plan.caption')} highlight={highlight} />
                    </div>
                    {/* narrow: one glass card per barangay, the same bars stacked by week (derived, not in canvas) */}
                    <ul className="cq-narrow-only flex flex-col gap-3" aria-label={t('plan.caption')}>
                        {plan.map((r, ri) => (
                            <li key={r.barangay} className="glass-panel rounded-[1.5rem] p-4">
                                <div className="text-[16px] leading-6 font-extrabold break-words">{r.barangay}</div>
                                <div className="text-[14px] font-semibold text-[var(--text-secondary)]">
                                    {t('cal.farms', { n: r.farms })} · {r.weeks.reduce((a, b) => a + b, 0).toFixed(1)}{' '}
                                    {t('unit.t')}
                                </div>
                                <dl className="mt-2 flex flex-col gap-2 tabular">
                                    {r.weeks.map((v, wi) => {
                                        const hl = highlight?.row === ri && highlight.week === wi;
                                        return (
                                            <div
                                                key={wi}
                                                className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2"
                                            >
                                                <dt className="text-[13px] font-extrabold">{WEEKS[wi]}</dt>
                                                <dd
                                                    className={`relative h-11 rounded-xl overflow-hidden rc-bg-highlight ${hl ? 'outline outline-[3px] outline-[color:var(--brand-gold)]' : ''}`}
                                                >
                                                    <span
                                                        className="absolute inset-y-0 left-0 bg-[var(--fill-strong)] opacity-90"
                                                        style={{ width: max > 0 ? `${(v / max) * 100}%` : '0%' }}
                                                    />
                                                    <span
                                                        className="relative h-full flex items-center px-3 text-[15px] font-extrabold"
                                                        style={{
                                                            color:
                                                                max > 0 && v / max > 0.45
                                                                    ? 'var(--on-fill-strong)'
                                                                    : 'var(--ink)'
                                                        }}
                                                    >
                                                        {v.toFixed(1)} {t('unit.t')}
                                                    </span>
                                                </dd>
                                                {hl && (
                                                    <dd className="col-start-2 text-[13px] font-bold text-[var(--gold-ink)]">
                                                        {highlight.label}
                                                    </dd>
                                                )}
                                            </div>
                                        );
                                    })}
                                </dl>
                            </li>
                        ))}
                    </ul>
                    {highlight && (
                        <Note className="mt-3">
                            {t('plan.legend', { farm: HERO_FARM.id, lot: heroLot?.id ?? HERO_FARM.id })}
                        </Note>
                    )}
                </section>
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
