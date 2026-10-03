'use client';
import Link from 'next/link';
import { AppShell, BigStat, HarvestCalendar, Pagination, useI18n } from '@/components/riceconnect';
import { paginate, sortBy } from '@/lib/list';
import { staticListState, type ListState } from './list-state';
import { BARANGAYS, FARMS, HERO_FARM, HERO_LOT, PLAN, TOTALS, WEEKS, WEEK_KG, lotOfFarm, type Farm } from '@/data/seed';
import { BARANGAY_SPLIT, DRYING_FACTOR_PER_MILLE, LOSS_PCT, YIELD_WET_KG_PER_HA } from '@/data/params';
import { dayLabel } from '@/data/calendar';
import { SectionPill, Note, ResponsiveTable, type Col } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);

/** /plan — 100-farm harvest calendar, W1-W4, dried tonnes per week per barangay (desktop). */
export function PlanScreen({ list }: { list?: ListState }) {
    const { t } = useI18n();
    const L = list ?? staticListState('/plan');
    const byDate = sortBy(sortBy(FARMS, (f) => f.id), (f) => f.harvestDay);
    const pg = paginate(byDate, L.page, L.size);
    const max = Math.max(...PLAN.flatMap((r) => r.weeks));
    const cols: Col<Farm>[] = [
        { key: 'farm', label: t('farm.id'), cell: (f) => <Link href={`/farm/${f.id}`} className="inline-flex items-center min-h-[40px] text-[var(--text-accent)] underline underline-offset-4">{f.id}</Link> },
        { key: 'barangay', label: t('farm.barangay'), cell: (f) => f.barangay },
        { key: 'harvest', label: t('farm.harvest'), cell: (f) => `${f.harvestWeek} · ${f.harvestLabel}` },
        { key: 'area', label: t('farm.area'), align: 'right', nowrap: true, cell: (f) => `${f.areaHa.toFixed(1)} ha` },
        { key: 'kg', label: t('farm.forecast'), align: 'right', nowrap: true, cell: (f) => `${f.driedKg.toLocaleString('en-US')} kg` },
        { key: 'lot', label: t('farm.lot'), cell: (f) => lotOfFarm(f.id).id },
    ];
    const peak = WEEK_KG.indexOf(Math.max(...WEEK_KG));
    const heroRow = BARANGAYS.indexOf(HERO_FARM.barangay as (typeof BARANGAYS)[number]);
    const heroWeek = WEEKS.indexOf(HERO_FARM.harvestWeek as (typeof WEEKS)[number]);
    const short = BARANGAYS.map((b) => b.replace('Barangay ', '').replace(' (placeholder)', '')).join(', ');
    return (
        <AppShell title="plan.title" active="plan"
            eyebrow={t('plan.eyebrow', { barangays: `Barangay ${short} (placeholder)`, start: dayLabel(0) })}>
            <div className="flex flex-col gap-6 max-w-[1600px]">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                    <BigStat label="plan.stat.farms" value={TOTALS.farms} icon="Farm" note={t('plan.note.farms', { b: BARANGAYS.length, split: BARANGAY_SPLIT.join('/') })} />
                    <BigStat label="plan.stat.area" value={(TOTALS.areaTenths / 10).toFixed(1)} unit="ha" icon="MapPin" note={t('plan.note.area', { avg: (TOTALS.areaTenths / 10 / FARMS.length).toFixed(1) })} />
                    <BigStat label="plan.stat.tonnes" value={t1(TOTALS.driedKg)} unit="t" icon="Wheat"
                        note={t('plan.note.tonnes', { wet: t1(TOTALS.wetKg), yield: YIELD_WET_KG_PER_HA.toLocaleString('en-US'), loss: LOSS_PCT, factor: (DRYING_FACTOR_PER_MILLE / 1000).toFixed(3) })} />
                    <BigStat label="plan.stat.peak" value={WEEKS[peak]} icon="Plan" note={t('plan.note.peak', { t: t1(WEEK_KG[peak]) })} />
                </div>
                <section aria-labelledby="plan-cal">
                    <SectionPill id="plan-cal">{t('plan.section')}</SectionPill>
                    <div className="cq-wide-only">
                        <HarvestCalendar rows={PLAN} caption={t('plan.caption')}
                            highlight={{ row: heroRow, week: heroWeek, label: `${HERO_FARM.id} · ${HERO_LOT.id} · ${t1(HERO_FARM.driedKg)} t` }} />
                    </div>
                    {/* narrow: one glass card per barangay, the same bars stacked by week (derived, not in canvas) */}
                    <ul className="cq-narrow-only flex flex-col gap-3" aria-label={t('plan.caption')}>
                        {PLAN.map((r, ri) => (
                            <li key={r.barangay} className="glass-panel rounded-[1.5rem] p-4">
                                <div className="text-[16px] leading-6 font-extrabold break-words">{r.barangay}</div>
                                <div className="text-[14px] font-semibold text-[var(--text-secondary)]">{t('cal.farms', { n: r.farms })} · {r.weeks.reduce((a, b) => a + b, 0).toFixed(1)} t</div>
                                <dl className="mt-2 flex flex-col gap-2 tabular">
                                    {r.weeks.map((v, wi) => {
                                        const hl = ri === heroRow && wi === heroWeek;
                                        return (
                                            <div key={wi} className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2">
                                                <dt className="text-[13px] font-extrabold">{WEEKS[wi]}</dt>
                                                <dd className={`relative h-11 rounded-xl overflow-hidden bg-[rgba(2,70,53,.08)] ${hl ? 'outline outline-[3px] outline-[color:var(--brand-gold)]' : ''}`}>
                                                    <span className="absolute inset-y-0 left-0 bg-[var(--fill-strong)] opacity-90" style={{ width: `${(v / max) * 100}%` }} />
                                                    <span className="relative h-full flex items-center px-3 text-[15px] font-extrabold" style={{ color: v / max > 0.45 ? 'var(--on-fill-strong)' : 'var(--ink)' }}>{v.toFixed(1)} t</span>
                                                </dd>
                                                {hl && <dd className="col-start-2 text-[13px] font-bold text-[var(--gold-ink)]">{HERO_FARM.id} · {HERO_LOT.id} · {t1(HERO_FARM.driedKg)} t</dd>}
                                            </div>
                                        );
                                    })}
                                </dl>
                            </li>
                        ))}
                    </ul>
                    <Note className="mt-3">{t('plan.legend', { farm: HERO_FARM.id, lot: HERO_LOT.id })}</Note>
                </section>
                <section aria-labelledby="plan-farms" className="flex flex-col gap-3">
                    <div><SectionPill id="plan-farms">{t('plan.farms')}</SectionPill></div>
                    <ResponsiveTable caption={t('plan.farms')} cols={cols} rows={pg.rows} rowKey={(f) => f.id} highlight={(f) => f.id === HERO_FARM.id} />
                    <Pagination total={pg.total} page={pg.page} pageSize={pg.size} hrefFor={L.pageHref} onSizeChange={(n) => L.set({ size: n })} />
                </section>
            </div>
        </AppShell>
    );
}
