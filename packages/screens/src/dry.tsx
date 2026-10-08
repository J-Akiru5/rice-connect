'use client';
import { useMemo } from 'react';
import {
    AppShell,
    BigStat,
    ErrorState,
    LoadingState,
    Pagination,
    SectionHead,
    ShareBar,
    SlotTimeline,
    StatusChip,
    useI18n
} from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { useFarms, useLots, useSlots, useSlotStatus } from '@rc/data';
import { paginate } from '@rc/domain/list';
import { staticListState, type ListState } from './list-state';
import { DRYER, HERO_LOT, KG_PER_SACK, WEEKS, type Slot } from '@rc/domain/seed';
import { dayLabel } from '@rc/domain/calendar';
import { SectionPill, Note, ResponsiveTable, type Col } from './ui';

/** /dry — dryer capacity per day and the slots assigned to harvest dates (desktop). */
export function DryScreen({ list, week: weekParam }: { list?: ListState; week?: number }) {
    const { t } = useI18n();
    const L = list ?? staticListState('/dry');
    /* Gate 3: the slots (and their lots and farms) come from the repositories (mock in demo, Supabase in live). */
    const slotsQuery = useSlots({ size: 500 });
    const lotsQuery = useLots({ size: 500 });
    const farmsQuery = useFarms({ size: 500 });
    const slots = useMemo(() => slotsQuery.data?.rows ?? [], [slotsQuery.data]);
    const lots = useMemo(() => lotsQuery.data?.rows ?? [], [lotsQuery.data]);
    const farms = useMemo(() => farmsQuery.data?.rows ?? [], [farmsQuery.data]);
    const lotById = useMemo(() => new Map(lots.map((l) => [l.id, l])), [lots]);
    const farmById = useMemo(() => new Map(farms.map((f) => [f.id, f])), [farms]);
    const farmOfSlot = (s: Slot) => {
        const lot = lotById.get(s.lot);
        return lot ? farmById.get(lot.farm) : undefined;
    };
    /* Demo shows the hero slot (L-03); live follows the earliest slot that exists. */
    const heroSlot = slots.find((s) => s.lot === HERO_LOT.id);
    const earliest = [...slots].sort((a, b) => a.dayIndex - b.dayIndex || a.id.localeCompare(b.id))[0];
    const heroWeek = Math.floor(((heroSlot ?? earliest)?.dayIndex ?? 0) / 7);
    const week = weekParam !== undefined && weekParam >= 0 && weekParam < WEEKS.length ? weekParam : heroWeek;
    const weekSlots = slots.filter((s) => Math.floor(s.dayIndex / 7) === week);
    const focusSlot = heroSlot ?? weekSlots[0];
    const slotQuery = useSlotStatus(focusSlot?.id ?? '');
    const slotState = slotQuery.data ?? 'scheduled';
    const loading = slotsQuery.isPending || lotsQuery.isPending || farmsQuery.isPending;
    const failed = slotsQuery.isError || lotsQuery.isError || farmsQuery.isError;
    const retry = () => {
        void slotsQuery.refetch();
        void lotsQuery.refetch();
        void farmsQuery.refetch();
    };
    const setWeek = (i: number) => L.set({ week: i + 1, page: null });
    if (loading)
        return (
            <AppShell title="dry.title" active="dry">
                <LoadingState rows={3} />
            </AppShell>
        );
    if (failed)
        return (
            <AppShell title="dry.title" active="dry">
                <ErrorState onRetry={retry} />
            </AppShell>
        );
    /* Capacity and dryer label come from the slots; the seed values are the demo fallback when none exist yet. */
    const capacity = slots[0]?.capacityPerDay ?? DRYER.capacitySacks;
    const cap = capacity * 7;
    const dryer = slots[0]?.dryer ?? DRYER.name;
    /* The live schema has no dryer location yet, so the eyebrow carries the label only in live mode. */
    const eyebrow = isLive ? dryer : t('dry.eyebrow', { dryer, place: DRYER.place });
    const days = Array.from({ length: 7 }, (_, i) => {
        const day = week * 7 + i;
        return {
            day: dayLabel(day),
            slots: weekSlots
                .filter((s) => s.dayIndex === day)
                .map((s) => ({ id: s.id, lot: s.lot, sacks: s.sacks, time: s.time, hero: s.lot === HERO_LOT.id }))
        };
    });
    const booked = days.reduce((s, d) => s + d.slots.reduce((a, x) => a + x.sacks, 0), 0);
    const free = Math.max(0, cap - booked);
    const pg = paginate(weekSlots, L.page, L.size);
    const cols: Col<Slot>[] = [
        { key: 'slot', label: t('dry.col.slot'), cell: (s) => s.id },
        { key: 'lot', label: t('farm.lot'), cell: (s) => s.lot },
        { key: 'farm', label: t('farm.id'), cell: (s) => lotById.get(s.lot)?.farm ?? '—' },
        { key: 'harvest', label: t('farm.harvest'), cell: (s) => farmOfSlot(s)?.harvestLabel ?? '—' },
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
    return (
        <AppShell title="dry.title" active="dry" eyebrow={eyebrow}>
            <div className="flex flex-col gap-6 max-w-[1600px]">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                    <BigStat
                        label="dry.stat.capacity"
                        value={capacity}
                        unit={t('unit.sacks')}
                        icon="Dry"
                        note={t('dry.note.capacity', { t: (capacity * KG_PER_SACK) / 1000 })}
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
                        label={focusSlot ? t('dry.hero.label', { lot: focusSlot.lot }) : '—'}
                        value={focusSlot?.id ?? '—'}
                        icon="Sack"
                        note={
                            focusSlot
                                ? t('dry.hero.note', {
                                      day: focusSlot.day,
                                      kg: focusSlot.kg.toLocaleString('en-US'),
                                      sacks: Math.ceil(focusSlot.kg / KG_PER_SACK)
                                  })
                                : undefined
                        }
                    />
                </div>
                <div aria-live="polite">
                    {focusSlot ? (
                        slotQuery.isPending ? (
                            <LoadingState rows={1} />
                        ) : slotQuery.isError ? (
                            <ErrorState onRetry={() => void slotQuery.refetch()} />
                        ) : (
                            <StatusChip
                                status={
                                    slotState === 'confirmed'
                                        ? 'paid'
                                        : slotState === 'move-requested'
                                          ? 'pending'
                                          : 'open'
                                }
                                label={t('slot.' + slotState, { id: focusSlot.id })}
                            />
                        )
                    ) : null}
                </div>
                <section
                    aria-labelledby="dry-cap"
                    className="panel-solid rounded-[1.75rem] p-5 md:p-7 flex flex-col gap-6"
                >
                    <SectionHead id="dry-cap" title={t('dry.share.title')} />
                    <ShareBar
                        title={`${t('dry.weeks')} ${WEEKS[week] ?? ''}`}
                        unit={t('unit.sacks')}
                        format={(v) => v.toLocaleString('en-US')}
                        items={[
                            { key: 'booked', label: t('dry.stat.booked'), value: booked, tone: 'brand' },
                            { key: 'free', label: t('dry.share.free'), value: free, tone: 'gold' }
                        ]}
                        summary={t('dry.share.summary', {
                            booked: booked.toLocaleString('en-US'),
                            cap: cap.toLocaleString('en-US'),
                            free: free.toLocaleString('en-US')
                        })}
                    />
                </section>
                <section aria-labelledby="dry-sec">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <SectionPill id="dry-sec">
                            {t('dry.weeks')} {WEEKS[week]} · {dryer}
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
                                    className={`min-w-[52px] min-h-[44px] px-4 rounded-full text-[15px] font-extrabold tracking-[0.06em] ${week === i ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)]'}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>
                    <SlotTimeline days={days} capacity={capacity} />
                    <Note className="mt-3">
                        {t('dry.free', { free: free.toLocaleString('en-US'), cap: cap.toLocaleString('en-US') })}
                    </Note>
                    <Note className="mt-1">{t('dry.rule', { t: (capacity * KG_PER_SACK) / 1000 })}</Note>
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
