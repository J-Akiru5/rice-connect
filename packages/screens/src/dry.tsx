'use client';
import { AppShell, BigStat, Pagination, SlotTimeline, useI18n } from '@rc/ui';
import { paginate } from '@rc/domain/list';
import { staticListState, type ListState } from './list-state';
import { DRYER, HERO_LOT, KG_PER_SACK, SLOT, SLOTS, WEEKS, lotById, farmById, type Slot } from '@rc/domain/seed';
import { dayLabel } from '@rc/domain/calendar';
import { SectionPill, Note, ResponsiveTable, type Col } from './ui';
import { useDemoState } from '@rc/store/react';
import { StatusChip } from '@rc/ui';

/** Seven day columns for a harvest week; L-03's slot is the hero. */
export function weekDays(week: number) {
    return Array.from({ length: 7 }, (_, i) => {
        const day = week * 7 + i;
        return {
            day: dayLabel(day),
            slots: SLOTS.filter((s) => s.dayIndex === day).map((s) => ({
                id: s.id,
                lot: s.lot,
                sacks: s.sacks,
                time: s.time,
                hero: s.lot === HERO_LOT.id
            }))
        };
    });
}

/** /dry — dryer capacity per day and the slots assigned to harvest dates (desktop). */
export function DryScreen({ list, week: weekParam }: { list?: ListState; week?: number }) {
    const { t } = useI18n();
    const L = list ?? staticListState('/dry');
    const slotState = useDemoState().slots[SLOT.id] ?? 'scheduled';
    const heroWeek = Math.floor(SLOT.dayIndex / 7);
    const week = weekParam !== undefined && weekParam >= 0 && weekParam < WEEKS.length ? weekParam : heroWeek;
    const setWeek = (i: number) => L.set({ week: i + 1, page: null });
    const weekSlots = SLOTS.filter((s) => Math.floor(s.dayIndex / 7) === week);
    const pg = paginate(weekSlots, L.page, L.size);
    const cols: Col<Slot>[] = [
        { key: 'slot', label: t('dry.col.slot'), cell: (s) => s.id },
        { key: 'lot', label: t('farm.lot'), cell: (s) => s.lot },
        { key: 'farm', label: t('farm.id'), cell: (s) => lotById(s.lot)!.farm },
        { key: 'harvest', label: t('farm.harvest'), cell: (s) => farmById(lotById(s.lot)!.farm)!.harvestLabel },
        { key: 'day', label: t('dry.col.day'), cell: (s) => s.day },
        {
            key: 'kg',
            label: t('pay.col.kg'),
            align: 'right',
            nowrap: true,
            cell: (s) => `${s.kg.toLocaleString('en-US')} kg`
        },
        {
            key: 'sacks',
            label: t('haul.sacks'),
            align: 'right',
            nowrap: true,
            cell: (s) => `${s.sacks} ${t('unit.sacks')}`
        }
    ];
    const days = weekDays(week);
    const booked = days.reduce((s, d) => s + d.slots.reduce((a, x) => a + x.sacks, 0), 0);
    const cap = DRYER.capacitySacks * 7;
    return (
        <AppShell title="dry.title" active="dry" eyebrow={t('dry.eyebrow', { dryer: DRYER.name, place: DRYER.place })}>
            <div className="flex flex-col gap-6 max-w-[1600px]">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                    <BigStat
                        label="dry.stat.capacity"
                        value={DRYER.capacitySacks}
                        unit={t('unit.sacks')}
                        icon="Dry"
                        note={t('dry.note.capacity', { t: DRYER.capacityKg / 1000 })}
                    />
                    <BigStat
                        label="dry.stat.booked"
                        value={booked.toLocaleString('en-US')}
                        unit={t('unit.sacks')}
                        icon="Plan"
                        note={t('dry.note.booked', {
                            pct: Math.round((booked / cap) * 100),
                            cap: cap.toLocaleString('en-US')
                        })}
                    />
                    <BigStat
                        label={t('dry.hero.label', { lot: HERO_LOT.id })}
                        value={SLOT.id}
                        icon="Sack"
                        note={t('dry.hero.note', {
                            day: SLOT.day,
                            kg: SLOT.kg.toLocaleString('en-US'),
                            sacks: Math.ceil(SLOT.kg / KG_PER_SACK)
                        })}
                    />
                </div>
                <div aria-live="polite">
                    <StatusChip
                        status={
                            slotState === 'confirmed' ? 'paid' : slotState === 'move-requested' ? 'pending' : 'open'
                        }
                        label={t('slot.' + slotState, { id: SLOT.id })}
                    />
                </div>
                <section aria-labelledby="dry-sec">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <SectionPill id="dry-sec">
                            {t('dry.weeks')} {WEEKS[week]} · {DRYER.name}
                        </SectionPill>
                        <div
                            role="radiogroup"
                            aria-label={t('dry.weeks')}
                            className="mb-3 inline-flex p-1 rounded-full glass-panel !shadow-none"
                        >
                            {WEEKS.map((w, i) => (
                                <button
                                    key={w}
                                    type="button"
                                    role="radio"
                                    aria-checked={week === i}
                                    onClick={() => setWeek(i)}
                                    className={`min-w-[44px] min-h-[40px] px-3 rounded-full text-[13px] font-extrabold tracking-[0.06em] ${week === i ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)]'}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>
                    <SlotTimeline days={days} capacity={DRYER.capacitySacks} />
                    <Note className="mt-3">{t('dry.rule', { t: DRYER.capacityKg / 1000 })}</Note>
                </section>
                <section aria-labelledby="dry-list" className="flex flex-col gap-3">
                    <div>
                        <SectionPill id="dry-list">{t('dry.slots', { week: WEEKS[week] ?? WEEKS[0] })}</SectionPill>
                    </div>
                    <ResponsiveTable
                        caption={t('dry.slots', { week: WEEKS[week] ?? WEEKS[0] })}
                        cols={cols}
                        rows={pg.rows}
                        rowKey={(s) => s.id}
                        highlight={(s) => s.lot === HERO_LOT.id}
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
