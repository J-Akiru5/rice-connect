'use client';
import { useState, type ReactNode } from 'react';
import {
    AppShell,
    BigStat,
    EmptyState,
    ErrorState,
    LoadingState,
    PrimaryButton,
    SecondaryButton,
    StatusChip,
    useI18n,
    useToast
} from '@rc/ui';
import { useSetSlotStatus, useSlotStatus, useSlots } from '@rc/data';
import { MILLING, milledKg, riceSacks } from '@rc/domain/buyers';
import { SectionPill, Note } from './ui';
import { t1 } from './plan-calendar';
import { useMyFarm } from './my-farm';

/** One summary row: a translated label over a value. Values carry their unit; nothing is truncated. */
function Del({ k, children }: { k: string; children: ReactNode }) {
    const { t } = useI18n();
    return (
        <div className="min-w-0 py-2 border-b border-[color:var(--glass-border-strong)]">
            <dt className="text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {t(k)}
            </dt>
            <dd className="mt-0.5 text-[15px] leading-6 font-bold tabular break-words">{children}</dd>
        </div>
    );
}

/** /farmer/milling â€” the farmer's dryer slot (confirm it or ask to move it) and what milling gives back. */
export function FarmerMillingScreen() {
    const { t } = useI18n();
    const toast = useToast();
    /* Gate 3: the farmer's lot and the dryer slots come from the repositories (mock in demo, Supabase in live). */
    const mine = useMyFarm();
    const slotsQuery = useSlots({ size: 500 });
    const slots = slotsQuery.data?.rows ?? [];
    const lot = mine.lot;
    const slot = slots.find((s) => s.lot === lot?.id);
    const statusQuery = useSlotStatus(slot?.id ?? '');
    const setSlot = useSetSlotStatus();
    const [last, setLast] = useState<'confirm' | 'move' | null>(null);

    const loading = slotsQuery.isPending || mine.isPending;
    const failed = slotsQuery.isError || mine.isError;
    const retry = () => {
        void slotsQuery.refetch();
        mine.retry();
    };
    if (loading)
        return (
            <AppShell role="farmer" title="milling.title" active="milling">
                <LoadingState rows={3} />
            </AppShell>
        );
    if (failed)
        return (
            <AppShell role="farmer" title="milling.title" active="milling">
                <ErrorState onRetry={retry} />
            </AppShell>
        );
    if (!lot)
        return (
            <AppShell role="farmer" title="milling.title" active="milling">
                <EmptyState variant="empty" title="plan.noFarm.title" body="plan.noFarm.body" />
            </AppShell>
        );
    /* The seed slot answers while the status query resolves (same rule as Dry). */
    const status = statusQuery.data ?? 'scheduled';
    const riceKg = milledKg(lot.driedKg);

    const confirm = () => {
        if (!slot) return;
        setLast('confirm');
        setSlot.mutate(
            { id: slot.id, status: 'confirmed' },
            {
                onSuccess: () =>
                    toast.show(t('slot.confirmed', { id: slot.id }), {
                        label: t('action.undo'),
                        onClick: () => setSlot.mutate({ id: slot.id, status: 'scheduled' })
                    })
            }
        );
    };
    const askMove = () => {
        if (!slot) return;
        setLast('move');
        setSlot.mutate(
            { id: slot.id, status: 'move-requested' },
            {
                onSuccess: () =>
                    toast.show(t('slot.move-requested', { id: slot.id }), {
                        label: t('action.undo'),
                        onClick: () => setSlot.mutate({ id: slot.id, status: 'confirmed' })
                    })
            }
        );
    };
    const retryWrite = () => (last === 'move' ? askMove() : confirm());

    return (
        <AppShell
            role="farmer"
            title="milling.title"
            active="milling"
            eyebrow={t('milling.eyebrow', { lot: lot.id, dryer: slot?.dryer ?? t('milling.dryer') })}
        >
            <div className="flex flex-col gap-6 max-w-[1600px]">
                <section aria-labelledby="mill-dry">
                    <SectionPill id="mill-dry">{t('milling.drying')}</SectionPill>
                    {slot ? (
                        <div className="glass-panel rounded-[1.5rem] p-5">
                            <div aria-live="polite">
                                <StatusChip
                                    status={
                                        status === 'confirmed'
                                            ? 'paid'
                                            : status === 'move-requested'
                                              ? 'pending'
                                              : 'open'
                                    }
                                    label={t('slot.' + status, { id: slot.id })}
                                />
                            </div>
                            <dl className="mt-2 grid gap-x-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                                <Del k="dry.col.slot">{slot.id}</Del>
                                <Del k="milling.time">{slot.time}</Del>
                                <Del k="dry.col.day">{slot.day}</Del>
                                <Del k="milling.dryer">{slot.dryer}</Del>
                                <Del k="haul.sacks">{`${slot.sacks} ${t('unit.sacks')}`}</Del>
                                <Del k="pay.col.kg">{`${slot.kg.toLocaleString('en-US')} ${t('unit.kg')}`}</Del>
                            </dl>
                            {setSlot.isError && <ErrorState onRetry={retryWrite} className="mt-3" />}
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                {status !== 'confirmed' && (
                                    <PrimaryButton icon="Check" onClick={confirm} disabled={setSlot.isPending}>
                                        {t('milling.confirm')}
                                    </PrimaryButton>
                                )}
                                {status === 'confirmed' && (
                                    <SecondaryButton icon="Clock" onClick={askMove} disabled={setSlot.isPending}>
                                        {t('milling.move')}
                                    </SecondaryButton>
                                )}
                            </div>
                        </div>
                    ) : (
                        <EmptyState title="milling.empty.title" body="milling.empty.body" />
                    )}
                </section>
                <section aria-labelledby="mill-rice">
                    <SectionPill id="mill-rice">{t('milling.section')}</SectionPill>
                    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                        <BigStat
                            label="pay.col.kg"
                            value={lot.driedKg.toLocaleString('en-US')}
                            unit={t('unit.kg')}
                            icon="Scale"
                            note={t('haul.about', { n: lot.sacks, t: t1(lot.driedKg) })}
                        />
                        <BigStat
                            label="milling.milled"
                            value={riceKg.toLocaleString('en-US')}
                            unit={t('unit.kg')}
                            icon="Wheat"
                            note={t('milling.recovery.note', { pct: MILLING.recoveryPct })}
                        />
                        <BigStat
                            label="milling.rice.sacks"
                            value={riceSacks(riceKg)}
                            unit={t('unit.sacks')}
                            icon="Sack"
                            note={t('milling.sack.note', { kg: MILLING.sackKg })}
                        />
                    </div>
                    <Note className="mt-3">
                        {t('milling.assumed', { pct: MILLING.recoveryPct, kg: MILLING.sackKg })}
                    </Note>
                    <Note className="mt-1">{t('milling.partner', { miller: MILLING.partnerMiller })}</Note>
                </section>
            </div>
        </AppShell>
    );
}
