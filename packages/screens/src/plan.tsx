'use client';
import { ZLink } from '@rc/ui';
import {
    AppShell,
    BigStat,
    HarvestCalendar,
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
import {
    BARANGAYS,
    FARMS,
    HERO_FARM,
    HERO_LOT,
    PLAN,
    TOTALS,
    WEEKS,
    WEEK_KG,
    lotOfFarm,
    type Farm
} from '@rc/domain/seed';
import {
    BARANGAY_SPLIT,
    DRYING_FACTOR_PER_MILLE,
    LOSS_PCT,
    MUNICIPALITY,
    YIELD_WET_KG_PER_HA
} from '@rc/domain/params';
import { dayLabel } from '@rc/domain/calendar';
import { Note, ResponsiveTable, type Col } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
const TONES: ChartTone[] = ['brand', 'accent', 'gold'];

/** /plan — 100-farm harvest calendar, W1-W4, dried tonnes per week per barangay (desktop). */
export function PlanScreen({ list }: { list?: ListState }) {
    const { t } = useI18n();
    const L = list ?? staticListState('/plan');
    const byDate = sortBy(
        sortBy(FARMS, (f) => f.id),
        (f) => f.harvestDay
    );
    const pg = paginate(byDate, L.page, L.size);
    const max = Math.max(...PLAN.flatMap((r) => r.weeks));
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
        { key: 'lot', label: t('farm.lot'), cell: (f) => lotOfFarm(f.id).id }
    ];
    const peak = WEEK_KG.indexOf(Math.max(...WEEK_KG));
    const heroRow = BARANGAYS.indexOf(HERO_FARM.barangay as (typeof BARANGAYS)[number]);
    const heroWeek = WEEKS.indexOf(HERO_FARM.harvestWeek as (typeof WEEKS)[number]);
    const unit = t('unit.t');
    /* Ranked largest first, each barangay taking the colour it keeps in the weekly stack above and in the
       share bar below: same order, same colour, same figure, so all three charts read as one picture. */
    const ranking: (Point & { tone: ChartTone })[] = PLAN.map((r) => ({
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
        const parts: Segment[] = PLAN.map((r) => ({
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
                    {t('plan.lead', { place: MUNICIPALITY, farms: TOTALS.farms, weeks: WEEKS.length })}
                </p>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="plan.stat.farms"
                        value={TOTALS.farms}
                        icon="Farm"
                        note={t('plan.note.farms', { b: BARANGAYS.length, split: BARANGAY_SPLIT.join('/') })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="plan.stat.area"
                        value={(TOTALS.areaTenths / 10).toFixed(1)}
                        unit="ha"
                        icon="MapPin"
                        note={t('plan.note.area', { avg: (TOTALS.areaTenths / 10 / FARMS.length).toFixed(1) })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="plan.stat.tonnes"
                        value={t1(TOTALS.driedKg)}
                        unit="t"
                        icon="Wheat"
                        note={t('plan.note.tonnes', {
                            wet: t1(TOTALS.wetKg),
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
                        note={t('plan.note.peak', { t: t1(WEEK_KG[peak] ?? 0) })}
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
                <section aria-labelledby="plan-cal">
                    <SectionHead id="plan-cal" title={t('plan.section')} />
                    <div className="cq-wide-only">
                        <HarvestCalendar
                            rows={PLAN}
                            caption={t('plan.caption')}
                            highlight={{
                                row: heroRow,
                                week: heroWeek,
                                label: `${HERO_FARM.id} · ${HERO_LOT.id} · ${t1(HERO_FARM.driedKg)} t`
                            }}
                        />
                    </div>
                    {/* narrow: one glass card per barangay, the same bars stacked by week (derived, not in canvas) */}
                    <ul className="cq-narrow-only flex flex-col gap-3" aria-label={t('plan.caption')}>
                        {PLAN.map((r, ri) => (
                            <li key={r.barangay} className="glass-panel rounded-[1.5rem] p-4">
                                <div className="text-[16px] leading-6 font-extrabold break-words">{r.barangay}</div>
                                <div className="text-[14px] font-semibold text-[var(--text-secondary)]">
                                    {t('cal.farms', { n: r.farms })} · {r.weeks.reduce((a, b) => a + b, 0).toFixed(1)}{' '}
                                    {t('unit.t')}
                                </div>
                                <dl className="mt-2 flex flex-col gap-2 tabular">
                                    {r.weeks.map((v, wi) => {
                                        const hl = ri === heroRow && wi === heroWeek;
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
                                                        style={{ width: `${(v / max) * 100}%` }}
                                                    />
                                                    <span
                                                        className="relative h-full flex items-center px-3 text-[15px] font-extrabold"
                                                        style={{
                                                            color:
                                                                v / max > 0.45 ? 'var(--on-fill-strong)' : 'var(--ink)'
                                                        }}
                                                    >
                                                        {v.toFixed(1)} {t('unit.t')}
                                                    </span>
                                                </dd>
                                                {hl && (
                                                    <dd className="col-start-2 text-[13px] font-bold text-[var(--gold-ink)]">
                                                        {HERO_FARM.id} · {HERO_LOT.id} · {t1(HERO_FARM.driedKg)}{' '}
                                                        {t('unit.t')}
                                                    </dd>
                                                )}
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
