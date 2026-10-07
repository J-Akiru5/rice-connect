'use client';
import { useState, type ReactNode } from 'react';
import {
    AlertDialog,
    AppShell,
    BigStat,
    EmptyState,
    ErrorState,
    Icon,
    LoadingState,
    PrimaryButton,
    SecondaryButton,
    StatusChip,
    useI18n,
    useToast
} from '@rc/ui';
import { useHaulStatus } from '@rc/data';
import { VEHICLES } from '@rc/domain/seed';
import { SectionPill, Note } from './ui';
import { PlanCalendar, t1, usePlanCalendar } from './plan-calendar';
import { useMyFarm, useMyHaul } from './my-farm';

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

/** /farmer/plan — the farmer's own harvest week, the cluster calendar with their row in gold, and the
    repeat delivery for the haul they already have. Booking is demo-local until it reaches the repo. */
export function FarmerPlanScreen() {
    const { t } = useI18n();
    const toast = useToast();
    /* Gate 3: the farmer's own farm, lot and haul come from the repositories (mock in demo, Supabase in live). */
    const mine = useMyFarm();
    const haulQuery = useMyHaul(mine.lot?.id);
    const statusQuery = useHaulStatus(haulQuery.haul?.id ?? '');
    const cal = usePlanCalendar();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [booked, setBooked] = useState(false);

    const loading = mine.isPending || haulQuery.isPending || cal.isPending;
    const failed = mine.isError || haulQuery.isError || cal.isError;
    const retry = () => {
        mine.retry();
        haulQuery.retry();
        cal.retry();
    };
    const farm = mine.farm;
    const haul = haulQuery.haul;
    if (loading)
        return (
            <AppShell role="farmer" title="plan.title" active="plan">
                <LoadingState rows={3} />
            </AppShell>
        );
    if (failed)
        return (
            <AppShell role="farmer" title="plan.title" active="plan">
                <ErrorState onRetry={retry} />
            </AppShell>
        );
    if (!farm || !mine.lot)
        return (
            <AppShell role="farmer" title="plan.title" active="plan">
                <EmptyState variant="empty" title="plan.noFarm.title" body="plan.noFarm.body" />
            </AppShell>
        );
    if (!haul)
        return (
            <AppShell role="farmer" title="plan.title" active="plan">
                <EmptyState variant="empty" title="state.haul.empty.title" body="state.haul.empty.body" />
            </AppShell>
        );
    /* The seed haul keeps the row rendered while the status query resolves (same rule as Haul). */
    const status = statusQuery.data ?? 'assigned';
    const vehicle = VEHICLES.find((v) => v.id === haul.vehicle);
    const lot = mine.lot;

    const book = () => {
        setBooked(true);
        setConfirmOpen(false);
        toast.show(t('plan.booked'));
    };
    const cancelBooking = () => {
        setBooked(false);
        toast.show(t('plan.book.cancelled'), { label: t('action.undo'), onClick: () => setBooked(true) });
    };

    return (
        <AppShell
            role="farmer"
            title="plan.title"
            active="plan"
            eyebrow={t('plan.eyebrow.farmer', {
                farm: farm.id,
                barangay: farm.barangay,
                week: farm.harvestWeek,
                date: farm.harvestLabel
            })}
        >
            <div className="flex flex-col gap-6 max-w-[1600px]">
                <section aria-labelledby="fp-mine">
                    <SectionPill id="fp-mine">{t('plan.mine')}</SectionPill>
                    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                        <BigStat
                            label="farm.harvest"
                            value={farm.harvestWeek}
                            icon="Wheat"
                            note={t('farm.harvestLine', { week: farm.harvestWeek, date: farm.harvestLabel })}
                        />
                        <BigStat label="farm.forecast" value={t1(farm.driedKg)} unit="t" icon="Scale" />
                        <BigStat
                            label="farm.lot"
                            value={lot?.id ?? '—'}
                            icon="Sack"
                            note={lot ? t('haul.about', { n: lot.sacks, t: t1(lot.driedKg) }) : undefined}
                        />
                    </div>
                </section>
                <PlanCalendar rows={cal.rows} max={cal.max} highlight={cal.highlight} lotId={lot?.id} />
                <section aria-labelledby="fp-delivery">
                    <SectionPill id="fp-delivery">{t('plan.delivery')}</SectionPill>
                    <div className="glass-panel rounded-[1.5rem] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="eyebrow">{t('haul.route')}</span>
                            <span role="status" aria-live="polite">
                                <StatusChip status={status} />
                            </span>
                        </div>
                        <dl className="mt-2 grid gap-x-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                            <Del k="haul.from">{`${haul.from.label} · ${haul.from.place}`}</Del>
                            <Del k="haul.via">{`${haul.via.label} · ${haul.via.place}`}</Del>
                            <Del k="haul.to">{`${haul.to.label} · ${haul.to.place}`}</Del>
                            <Del k="haul.eta">{haul.pickup}</Del>
                            <Del k="haul.sacks">{`${haul.sacks} ${t('unit.sacks')}`}</Del>
                            <Del k="haul.vehicle">
                                {vehicle ? `${vehicle.id} · ${vehicle.capacity} ${t('unit.sacks')}` : '—'}
                            </Del>
                        </dl>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {booked ? (
                            <SecondaryButton icon="X" onClick={cancelBooking}>
                                {t('plan.book.cancel')}
                            </SecondaryButton>
                        ) : (
                            <PrimaryButton icon="Truck" onClick={() => setConfirmOpen(true)}>
                                {t('plan.book')}
                            </PrimaryButton>
                        )}
                    </div>
                    {booked && (
                        <div
                            role="status"
                            className="mt-3 glass-panel glass-fill-strong rounded-[1.5rem] p-4 flex items-start gap-2"
                        >
                            <Icon name="CircleCheck" size={20} className="shrink-0 mt-0.5 text-[var(--text-accent)]" />
                            <div className="min-w-0">
                                <p className="m-0 text-[15px] leading-6 font-extrabold break-words">
                                    {t('plan.booked')}
                                </p>
                                <p className="m-0 text-[14px] leading-5 font-semibold text-[var(--text-secondary)] break-words tabular">
                                    {t('plan.booked.note', { sacks: haul.sacks, via: haul.via.label })}
                                </p>
                            </div>
                        </div>
                    )}
                    <Note className="mt-3">{t('plan.delivery.help')}</Note>
                    <AlertDialog
                        open={confirmOpen}
                        onOpenChange={setConfirmOpen}
                        title={t('plan.book.title')}
                        description={t('plan.book.desc', {
                            sacks: haul.sacks,
                            farm: haul.from.label,
                            via: haul.via.label
                        })}
                        confirmLabel={t('plan.book')}
                        onConfirm={book}
                    />
                </section>
            </div>
        </AppShell>
    );
}
