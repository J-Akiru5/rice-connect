'use client';
import { useMemo } from 'react';
import { HarvestCalendar, useI18n } from '@rc/ui';
import { useFarms, useLots } from '@rc/data';
import { BARANGAYS, HERO_FARM, WEEKS, type Farm } from '@rc/domain/seed';
import { SectionPill, Note } from './ui';

/** Dried tonnes, one decimal (0.4 t). */
export const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);

export type PlanRow = { barangay: string; weeks: number[]; farms: number };
export type PlanHighlight = { row: number; week: number; label: string };

/** The cluster's harvest rows, from the repositories (mock in demo, Supabase in live). The coordinator's
    /plan and the farmer's /farmer/plan share this so the one calendar reads the same for both (L4). */
export function usePlanCalendar() {
    const farmsQuery = useFarms({ size: 500 });
    const lotsQuery = useLots({ size: 500 });
    const farms = useMemo(() => farmsQuery.data?.rows ?? [], [farmsQuery.data]);
    const lots = useMemo(() => lotsQuery.data?.rows ?? [], [lotsQuery.data]);
    const rows = useMemo<PlanRow[]>(
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
    /* The demo's hero farm (F-014 · L-03) marks its barangay/week; live rows have no pinned hero. */
    const heroFarm: Farm | undefined = farms.find((f) => f.id === HERO_FARM.id);
    const heroLot = lots.find((l) => l.farm === heroFarm?.id);
    const highlight: PlanHighlight | undefined =
        heroFarm && heroLot
            ? {
                  row: BARANGAYS.indexOf(heroFarm.barangay as (typeof BARANGAYS)[number]),
                  week: WEEKS.indexOf(heroFarm.harvestWeek as (typeof WEEKS)[number]),
                  label: `${heroFarm.id} · ${heroLot.id} · ${t1(heroFarm.driedKg)} t`
              }
            : undefined;
    return {
        farms,
        lots,
        rows,
        max: Math.max(0, ...rows.flatMap((r) => r.weeks)),
        highlight,
        heroFarm,
        heroLot,
        isPending: farmsQuery.isPending || lotsQuery.isPending,
        isError: farmsQuery.isError || lotsQuery.isError,
        retry: () => {
            void farmsQuery.refetch();
            void lotsQuery.refetch();
        }
    };
}

/** The harvest calendar section: the chart wide, the same bars as narrow cards, gold on the hero lot. */
export function PlanCalendar({
    rows,
    max,
    highlight,
    lotId
}: {
    rows: PlanRow[];
    max: number;
    highlight?: PlanHighlight;
    lotId?: string;
}) {
    const { t } = useI18n();
    return (
        <section aria-labelledby="plan-cal">
            <SectionPill id="plan-cal">{t('plan.section')}</SectionPill>
            <div className="cq-wide-only">
                <HarvestCalendar rows={rows} caption={t('plan.caption')} highlight={highlight} />
            </div>
            {/* narrow: one glass card per barangay, the same bars stacked by week (derived, not in canvas) */}
            <ul className="cq-narrow-only flex flex-col gap-3" aria-label={t('plan.caption')}>
                {rows.map((r, ri) => (
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
                                    <div key={wi} className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2">
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
                <Note className="mt-3">{t('plan.legend', { farm: HERO_FARM.id, lot: lotId ?? HERO_FARM.id })}</Note>
            )}
        </section>
    );
}
