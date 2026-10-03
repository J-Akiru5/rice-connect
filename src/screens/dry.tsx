'use client';
import { useState } from 'react';
import { AppShell, BigStat, SlotTimeline, useI18n } from '@/components/riceconnect';
import { DRYER, HERO_LOT, KG_PER_SACK, SLOT, SLOTS, WEEKS } from '@/data/seed';
import { dayLabel } from '@/data/calendar';
import { SectionPill, Note } from './ui';

/** Seven day columns for a harvest week; L-03's slot is the hero. */
export function weekDays(week: number) {
    return Array.from({ length: 7 }, (_, i) => {
        const day = week * 7 + i;
        return {
            day: dayLabel(day),
            slots: SLOTS.filter((s) => s.dayIndex === day).map((s) => ({ id: s.id, lot: s.lot, sacks: s.sacks, time: s.time, hero: s.lot === HERO_LOT.id })),
        };
    });
}

/** /dry — dryer capacity per day and the slots assigned to harvest dates (desktop). */
export function DryScreen() {
    const { t } = useI18n();
    const heroWeek = Math.floor(SLOT.dayIndex / 7);
    const [week, setWeek] = useState(heroWeek);
    const days = weekDays(week);
    const booked = days.reduce((s, d) => s + d.slots.reduce((a, x) => a + x.sacks, 0), 0);
    const cap = DRYER.capacitySacks * 7;
    return (
        <AppShell title="dry.title" active="dry" eyebrow={t('dry.eyebrow', { dryer: DRYER.name, place: DRYER.place })}>
            <div className="flex flex-col gap-6 max-w-[1600px]">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                    <BigStat label="dry.stat.capacity" value={DRYER.capacitySacks} unit={t('unit.sacks')} icon="Dry" note={t('dry.note.capacity', { t: DRYER.capacityKg / 1000 })} />
                    <BigStat label="dry.stat.booked" value={booked.toLocaleString('en-US')} unit={t('unit.sacks')} icon="Plan" note={t('dry.note.booked', { pct: Math.round((booked / cap) * 100), cap: cap.toLocaleString('en-US') })} />
                    <BigStat label={t('dry.hero.label', { lot: HERO_LOT.id })} value={SLOT.id} icon="Sack" note={t('dry.hero.note', { day: SLOT.day, kg: SLOT.kg.toLocaleString('en-US'), sacks: Math.ceil(SLOT.kg / KG_PER_SACK) })} />
                </div>
                <section aria-labelledby="dry-sec">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <SectionPill id="dry-sec">{t('dry.weeks')} {WEEKS[week]} · {DRYER.name}</SectionPill>
                        <div role="radiogroup" aria-label={t('dry.weeks')} className="mb-3 inline-flex p-1 rounded-full glass-panel !shadow-none">
                            {WEEKS.map((w, i) => (
                                <button key={w} type="button" role="radio" aria-checked={week === i} onClick={() => setWeek(i)}
                                    className={`min-w-[44px] min-h-[40px] px-3 rounded-full text-[13px] font-extrabold tracking-[0.06em] ${week === i ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)]'}`}>{w}</button>
                            ))}
                        </div>
                    </div>
                    <SlotTimeline days={days} capacity={DRYER.capacitySacks} />
                    <Note className="mt-3">{t('dry.rule', { t: DRYER.capacityKg / 1000 })}</Note>
                </section>
            </div>
        </AppShell>
    );
}
