'use client';
import { AppShell, BigStat, HarvestCalendar, useI18n } from '@/components/riceconnect';
import { BARANGAYS, FARMS, HERO_FARM, HERO_LOT, PLAN, TOTALS, WEEKS, WEEK_KG } from '@/data/seed';
import { BARANGAY_SPLIT, DRYING_FACTOR_PER_MILLE, LOSS_PCT, YIELD_WET_KG_PER_HA } from '@/data/params';
import { dayLabel } from '@/data/calendar';
import { SectionPill, Note } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);

/** /plan — 100-farm harvest calendar, W1-W4, dried tonnes per week per barangay (desktop). */
export function PlanScreen() {
    const { t } = useI18n();
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
                    <HarvestCalendar rows={PLAN} caption={t('plan.caption')}
                        highlight={{ row: heroRow, week: heroWeek, label: `${HERO_FARM.id} · ${HERO_LOT.id} · ${t1(HERO_FARM.driedKg)} t` }} />
                    <Note className="mt-3">{t('plan.legend', { farm: HERO_FARM.id, lot: HERO_LOT.id })}</Note>
                </section>
            </div>
        </AppShell>
    );
}
