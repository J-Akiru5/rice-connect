'use client';
import { useEffect, useState } from 'react';
import { ZLink } from '@rc/ui';
import {
    BigStat,
    DeliveryStatusStepper,
    DriverCard,
    EmptyState,
    ErrorState,
    HaulRequestCard,
    Icon,
    LoadingState,
    OfflineBanner,
    PrimaryButton,
    RankedBars,
    RouteLine,
    SecondaryButton,
    SectionHead,
    StatusChip,
    VehicleOption,
    useI18n,
    useToast,
    type Point
} from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { ModuleShell } from './shell';
import { useHauls, useHaulStatus, useHaulStatuses, useLot, useSetHaulStatus } from '@rc/data';
import { DRIVERS, DRYER, HAUL, HERO_LOT, KG_PER_SACK, SLOT, VEHICLES } from '@rc/domain/seed';
import { autoAssign, tripsFor, type Driver } from '@rc/domain/assign';
import { peso } from '@rc/domain/money';

export type HaulStatus = 'requested' | 'assigned' | 'accepted' | 'pickedup' | 'delivered';
const ORDER: HaulStatus[] = ['requested', 'assigned', 'accepted', 'pickedup', 'delivered'];
/** Route progress: at the farm until picked up, then at the dryer, then all done. */
const routeActive = (s: HaulStatus) => (s === 'delivered' ? 3 : s === 'pickedup' ? 1 : 0);
const tons = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
const nearestOf = (vehicle: string) =>
    [...DRIVERS]
        .filter((d) => d.vehicle === vehicle && d.available)
        .sort((a, b) => a.distanceKm - b.distanceKm || a.id.localeCompare(b.id))[0] ?? null;
/** The seed price table only; live vehicles have no price yet, so their pay row is hidden. */
const vehicleOf = (d: Driver | null) => (d ? (VEHICLES.find((v) => v.id === d.vehicle) ?? null) : null);
const stopsOf = (h: {
    from: { label: string; place: string };
    via: { label: string; place: string };
    to: { label: string; place: string };
}) => [
    { label: h.from.label, place: h.from.place, icon: 'Farm' },
    { label: h.via.label, place: h.via.place, icon: 'Dry' },
    { label: h.to.label, place: h.to.place, icon: 'Store' }
];

/** Hard-style row: label left, value right (black on white). */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-3 text-[16px] leading-6 font-extrabold text-[var(--ink)] tabular">
            <span>{label}</span>
            <span className="text-right">{children}</span>
        </div>
    );
}

/** /haul — coordinator: request, auto-assigned driver, override (phone). Hard logistics content inside the glass shell. */
export function HaulCoordinatorScreen({
    state = 'default',
    status: forced
}: {
    state?: 'default' | 'empty' | 'error' | 'success';
    status?: HaulStatus;
}) {
    const { t } = useI18n();
    const toast = useToast();
    const [view, setView] = useState<'form' | 'card' | 'empty' | 'error' | 'success'>(
        state === 'default' ? 'card' : state
    );
    /* Gate 3: the cluster's haul comes from the repository list (mock in demo, Supabase in live). */
    const haulsQuery = useHauls({ size: 20 });
    const haul = haulsQuery.data?.rows[0];
    const statusQuery = useHaulStatus(haul?.id ?? '');
    const [sacksOverride, setSacksOverride] = useState<number | null>(null);
    const [picked, setPicked] = useState<Driver | null>(null);
    const [listOpen, setListOpen] = useState(false);
    const shared: HaulStatus = statusQuery.data ?? 'assigned';
    const status: HaulStatus = forced ?? (view === 'form' ? 'requested' : shared);
    /* The seed haul keeps the demo player (/demo passes a forced status) rendering while the query resolves. */
    const viewHaul = haul ?? HAUL;
    const sacks = sacksOverride ?? viewHaul.sacks;
    const base: Driver | null = viewHaul.driver;
    const driver = picked ?? base;
    const overridden = Boolean(driver && base && driver.id !== base.id);
    const v = vehicleOf(driver);
    const stops = stopsOf(viewHaul);

    if (!forced && haulsQuery.isPending)
        return (
            <ModuleShell title="haul.title" active="logistics">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    if (!forced && haulsQuery.isError)
        return (
            <ModuleShell title="haul.title" active="logistics">
                <ErrorState onRetry={() => void haulsQuery.refetch()} />
            </ModuleShell>
        );
    if (!forced && !haul)
        return (
            <ModuleShell title="haul.title" active="logistics">
                <EmptyState
                    className="max-w-[640px] mx-auto"
                    variant="empty"
                    title="state.haul.empty.title"
                    body="state.haul.empty.body"
                />
            </ModuleShell>
        );
    if (!forced && statusQuery.isPending)
        return (
            <ModuleShell title="haul.title" active="logistics">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    if (!forced && statusQuery.isError)
        return (
            <ModuleShell title="haul.title" active="logistics">
                <ErrorState onRetry={() => void statusQuery.refetch()} />
            </ModuleShell>
        );
    if (view === 'empty')
        return (
            <ModuleShell title="haul.title" active="logistics">
                <EmptyState
                    className="max-w-[640px] mx-auto"
                    variant="empty"
                    title="state.haul.empty.title"
                    body="state.haul.empty.body"
                    action="state.haul.empty.action"
                    onAction={() => setView('form')}
                />
            </ModuleShell>
        );
    if (view === 'error')
        return (
            <ModuleShell title="haul.title" active="logistics">
                <EmptyState
                    className="max-w-[640px] mx-auto"
                    variant="error"
                    title="state.haul.error.title"
                    body="state.haul.error.body"
                    action="error.retry"
                    onAction={() => setView('form')}
                />
            </ModuleShell>
        );
    if (view === 'success')
        return (
            <ModuleShell title="haul.title" active="logistics">
                <div className="flex flex-col gap-4 max-w-[640px] mx-auto">
                    <EmptyState
                        variant="success"
                        title={t('state.haul.success.title', { haul: viewHaul.id })}
                        body={t('state.haul.success.body', {
                            sacks: viewHaul.sacks,
                            dryer: DRYER.name,
                            slot: SLOT.id,
                            day: SLOT.day
                        })}
                    />
                    <ZLink href="/dry" className="btn-2026 self-center">
                        <Icon name="ArrowRight" size={24} />
                        <span>{t('state.haul.success.action')}</span>
                    </ZLink>
                </div>
            </ModuleShell>
        );

    const send = () => {
        const d = autoAssign(sacks, DRIVERS, VEHICLES);
        setPicked(d);
        setView(d ? 'card' : 'error');
    };
    const pick = (d: Driver) => {
        const previous = driver;
        setPicked(d);
        setListOpen(false);
        if (previous && previous.id !== d.id)
            toast.show(t('haul.reassigned', { id: viewHaul.id, driver: d.name }), {
                label: t('action.undo'),
                onClick: () => setPicked(previous)
            });
    };

    /* Driver list: inside the card when "Change Driver" is open (narrow), always in the right column (wide).
       The seed driver directory only exists in demo; live assignment lands with the accounts flow. */
    const driverList = (closable: boolean) => (
        <div className="rc-subtle p-4 flex flex-col gap-3" aria-label={t('haul.drivers')} role="group">
            <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                    <h4 className="text-[17px] leading-6 font-extrabold text-[var(--ink)]">{t('haul.drivers')}</h4>
                    <p className="m-0 text-[13px] leading-5 font-semibold text-[var(--text-secondary)]">
                        {t('haul.drivers.hint')}
                    </p>
                </div>
                {closable && (
                    <SecondaryButton type="button" onClick={() => setListOpen(false)} icon="X">
                        {t('haul.close')}
                    </SecondaryButton>
                )}
            </div>
            <ul className="flex flex-col gap-2">
                {[...DRIVERS]
                    .sort((a, b) => a.distanceKm - b.distanceKm || a.id.localeCompare(b.id))
                    .map((d) => {
                        const dv = vehicleOf(d)!;
                        return (
                            <li
                                key={d.id}
                                className={`rounded-2xl border-2 p-3 flex items-center gap-3 flex-wrap transition-all duration-300 ${driver?.id === d.id ? 'border-[color:var(--brand-gold)] bg-[color:color-mix(in_srgb,var(--brand-gold)_18%,transparent)]' : 'border-transparent rc-bg-highlight hover:-translate-y-0.5'}`}
                            >
                                <Icon name={dv.icon} size={22} className="shrink-0 text-[var(--text-accent)]" />
                                {/* One line of text, one action. The busy marker is the exception, so only
                                    the exception is labelled: an available driver is the default. */}
                                <span className="min-w-0 flex-1 text-[var(--ink)]">
                                    <span className="text-[16px] leading-6 font-extrabold break-words">
                                        {d.name} · {d.plate}
                                    </span>{' '}
                                    <span className="text-[14px] leading-6 font-semibold text-[var(--text-secondary)] tabular">
                                        · {t('driver.away', { km: d.distanceKm.toFixed(1) })} ·{' '}
                                        {t('haul.trips', {
                                            n: tripsFor(sacks, dv),
                                            price: peso(tripsFor(sacks, dv) * dv.price)
                                        })}
                                    </span>
                                    {!d.available && (
                                        <span className="ml-2 text-[13px] leading-5 font-extrabold uppercase tracking-[0.06em] text-[var(--danger-strong)]">
                                            {t('haul.busy')}
                                        </span>
                                    )}
                                </span>
                                {driver?.id === d.id ? (
                                    <PrimaryButton
                                        type="button"
                                        onClick={() => pick(d)}
                                        aria-pressed
                                        className="!px-5 !py-2.5"
                                    >
                                        {t('haul.assign')}
                                    </PrimaryButton>
                                ) : (
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => pick(d)}
                                        aria-pressed={false}
                                        className="!px-5 !py-2.5"
                                    >
                                        {t('haul.assign')}
                                    </SecondaryButton>
                                )}
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
    /* Every vehicle option priced for this load, so the coordinator can see the cheapest move before choosing.
       The chosen vehicle's bar is gold, the way its option card is: colour marks the choice, the printed
       figure carries the amount. */
    const costs: Point[] = VEHICLES.map((veh) => ({
        key: veh.id,
        label: t('veh.' + veh.id),
        value: tripsFor(sacks, veh) * veh.price,
        tone: v?.id === veh.id ? 'gold' : 'accent'
    }));
    const costList = costs
        .slice()
        .sort((a, b) => b.value - a.value)
        .map((p) => `${p.label} ${peso(p.value)}`)
        .join('; ');
    /* The same rule the option cards use to grey themselves out: more than three trips means the
       vehicle is the wrong size for this load. Of the ones that fit, the cheapest gets flagged. */
    const bestVehicle = VEHICLES.filter((veh) => tripsFor(sacks, veh) <= 3).sort(
        (a, b) => tripsFor(sacks, a) * a.price - tripsFor(sacks, b) * b.price
    )[0];
    return (
        <ModuleShell title={view === 'form' ? 'haul.new' : 'haul.title'} active="logistics">
            <div className="flex flex-col gap-8">
                <p className="rc-lede">{t('haul.lead')}</p>
                <section
                    aria-labelledby="hl-look"
                    className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]"
                >
                    <h2 id="hl-look" className="sr-only">
                        {t('haul.look.title')}
                    </h2>
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="haul.stat.sacks"
                        value={sacks}
                        unit={t('unit.sacks')}
                        icon="Sack"
                        note={t('haul.sacks.help', {
                            lot: HERO_LOT.id,
                            kg: HERO_LOT.driedKg.toLocaleString('en-US'),
                            n: HERO_LOT.sacks,
                            per: KG_PER_SACK
                        })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        label="haul.stat.km"
                        value={viewHaul.km.toFixed(1)}
                        unit={t('unit.km')}
                        icon="Route"
                        note={t('haul.about', { n: sacks, t: tons(HERO_LOT.driedKg) })}
                    />
                    {driver && v && (
                        <BigStat
                            size="xl"
                            className="panel-solid"
                            label="haul.stat.cost"
                            value={peso(tripsFor(sacks, v) * v.price)}
                            icon="Pay"
                            note={t('haul.trips', { n: tripsFor(sacks, v), price: peso(v.price) })}
                        />
                    )}
                </section>
                {/* The screen answers two questions, and they are named before the work area: who takes the
                    move, and what each vehicle would charge for it. */}
                <SectionHead id="hl-work" title={t('haul.work.title')} hint={t('haul.work.hint')} />
                {/* Narrow: one column (as the canvas board). Wide: request + assignment left; stepper, route and drivers right (derived, not in canvas). */}
                <div className="cq-two">
                    <HaulRequestCard id={viewHaul.id} lot={viewHaul.lot} sacks={sacks} status={status}>
                        {/* Where the request stands belongs with the request at every width. The journey
                            itself stays in the right column when there is one, and below this card on
                            a phone. */}
                        <DeliveryStatusStepper status={status} type="cluster" />
                        <div className="cq-narrow-only">
                            <RouteLine stops={stops} km={viewHaul.km} active={routeActive(status)} />
                        </div>
                        {view === 'form' ? (
                            <div className="rc-subtle p-4 flex flex-col gap-3">
                                <label
                                    htmlFor="haul-sacks"
                                    className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-muted)]"
                                >
                                    {t('haul.sacks')}
                                </label>
                                <input
                                    id="haul-sacks"
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    value={sacks}
                                    onChange={(e) =>
                                        setSacksOverride(Math.max(1, Math.floor(Number(e.target.value) || 1)))
                                    }
                                    className="input-2026 tabular"
                                />
                                <p className="text-[15px] leading-6 font-semibold text-[var(--text-secondary)]">
                                    {t('haul.sacks.help', {
                                        lot: HERO_LOT.id,
                                        kg: HERO_LOT.driedKg.toLocaleString('en-US'),
                                        n: HERO_LOT.sacks,
                                        per: KG_PER_SACK
                                    })}
                                </p>
                                <PrimaryButton type="button" onClick={send} icon="Send" className="w-full">
                                    {t('haul.request')}
                                </PrimaryButton>
                            </div>
                        ) : (
                            <>
                                {/* One label for the whole choice: full-width rows on a phone, two columns once
                                    there is room for them. */}
                                {!isLive && (
                                    <>
                                        <h4 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                                            {t('haul.vehicles', { n: sacks })}
                                        </h4>
                                        <div
                                            role="radiogroup"
                                            aria-label={t('haul.vehicles', { n: sacks })}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                        >
                                            {VEHICLES.map((veh) => (
                                                <VehicleOption
                                                    key={veh.id}
                                                    v={veh}
                                                    sacks={sacks}
                                                    selected={v?.id === veh.id}
                                                    best={bestVehicle?.id === veh.id}
                                                    onSelect={() => {
                                                        const d = nearestOf(veh.id);
                                                        if (d) pick(d);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                {driver && (
                                    <DriverCard
                                        name={driver.name}
                                        vehicle={v?.icon ?? 'Truck'}
                                        plate={driver.plate || '—'}
                                        distanceKm={driver.distanceKm}
                                        auto={!overridden}
                                        onOverride={isLive ? undefined : () => setListOpen((o) => !o)}
                                    />
                                )}
                                {overridden && <StatusChip status="assigned" label="haul.overridden" kind="warning" />}
                                {overridden && driver && base && (
                                    <p className="m-0 text-[14px] font-bold text-[var(--ink)] tabular">
                                        {t('haul.overrideNote', { from: base.name, to: driver.name })}
                                    </p>
                                )}
                                {driver && (
                                    <div className="rc-subtle p-4 flex flex-col gap-2">
                                        <Row label={t('haul.eta')}>{viewHaul.pickup}</Row>
                                        {v && (
                                            <Row label={t('haul.cost')}>
                                                {t('haul.trips', {
                                                    n: tripsFor(sacks, v),
                                                    price: peso(tripsFor(sacks, v) * v.price)
                                                })}
                                            </Row>
                                        )}
                                        {status === 'assigned' && (
                                            <p className="text-[14px] font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                                                <Icon name="Clock" size={20} />
                                                {t('haul.waiting', { driver: driver.name })}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {listOpen && <div className="cq-narrow-only">{driverList(true)}</div>}
                            </>
                        )}
                    </HaulRequestCard>
                    <section
                        className="cq-wide-only flex flex-col gap-3"
                        id="haul-drivers"
                        tabIndex={-1}
                        aria-label={t('haul.route')}
                    >
                        <div className="panel-solid rounded-[1.75rem] p-5 flex flex-col gap-4 outline-none">
                            <h3 className="m-0 text-[22px] leading-7 font-extrabold tracking-[-0.02em] text-[var(--ink)]">
                                {t('haul.route')}
                            </h3>
                            <RouteLine stops={stops} km={viewHaul.km} active={routeActive(status)} />
                            {view !== 'form' && !isLive && driverList(false)}
                        </div>
                    </section>
                </div>
                {/* The comparison is the widest reading on the screen — it prices all four vehicles against
                    each other — so it takes the full width, instead of being squeezed into the right column
                    and leaving the left one half empty. */}
                <section aria-label={t('haul.rank.title')} className="panel-solid rounded-[1.75rem] p-5 md:p-7">
                    <RankedBars
                        title={t('haul.rank.title')}
                        unit=""
                        items={costs}
                        tone="accent"
                        format={peso}
                        summary={t('haul.rank.summary', {
                            sacks,
                            km: viewHaul.km.toFixed(1),
                            list: costList,
                            veh: v ? t('veh.' + v.id) : t('haul.notSent')
                        })}
                    />
                </section>
            </div>
        </ModuleShell>
    );
}

/** /haul/driver — the driver's jobs list (S-18): accept or decline here, then open the job for pickup and
    delivery. Declining is local to this browser (there is no repository path for it yet) and can be undone. */
export function HaulDriverListScreen() {
    const { t } = useI18n();
    const toast = useToast();
    /* Gate 3: the jobs come from the repository list (RLS gives the driver their own rows). */
    const haulsQuery = useHauls({ size: 20 });
    const hauls = haulsQuery.data?.rows ?? [];
    const statuses = useHaulStatuses(hauls.map((h) => h.id));
    const mutation = useSetHaulStatus();
    const [declinedId, setDeclinedId] = useState<string | null>(null);
    const [failedId, setFailedId] = useState<string | null>(null);
    const statusOf = (id: string) => statuses.data?.find((s) => s.id === id)?.status ?? 'assigned';

    async function accept(id: string) {
        setFailedId(null);
        try {
            await mutation.mutateAsync({ id, status: 'accepted' });
            toast.show(t('haul.saved'));
        } catch {
            setFailedId(id);
        }
    }

    if (haulsQuery.isPending)
        return (
            <ModuleShell role="driver" title="haul.driver.jobs" active="jobs">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    if (haulsQuery.isError)
        return (
            <ModuleShell role="driver" title="haul.driver.jobs" active="jobs">
                <ErrorState onRetry={() => void haulsQuery.refetch()} />
            </ModuleShell>
        );
    if (hauls.length === 0)
        return (
            <ModuleShell role="driver" title="haul.driver.jobs" active="jobs">
                <EmptyState
                    className="max-w-[640px] mx-auto"
                    variant="empty"
                    title="state.haul.empty.title"
                    body="state.haul.empty.body"
                />
            </ModuleShell>
        );

    return (
        <ModuleShell role="driver" title="haul.driver.jobs" active="jobs">
            <div className="flex flex-col gap-4 max-w-[720px] mx-auto w-full">
                {hauls.map((h) => {
                    const st = statusOf(h.id);
                    const declined = declinedId === h.id;
                    return (
                        <HaulRequestCard key={h.id} id={h.id} lot={h.lot} sacks={h.sacks} status={st}>
                            <div className="rc-subtle p-4 flex flex-col gap-2">
                                <Row label={t('haul.eta')}>{h.pickup}</Row>
                                <Row label={t('haul.sacks')}>{`${h.sacks} ${t('unit.sacks')}`}</Row>
                                <Row label={t('haul.from')}>{h.from.label}</Row>
                                <Row label={t('haul.to')}>{h.to.label}</Row>
                            </div>
                            {failedId === h.id && <ErrorState className="mt-3" onRetry={() => void accept(h.id)} />}
                            {declined ? (
                                <div className="rc-subtle p-4 flex flex-col gap-3">
                                    <p className="text-[16px] font-bold text-[var(--ink)] flex items-start gap-2">
                                        <Icon
                                            name="CircleX"
                                            size={24}
                                            className="shrink-0 text-[var(--danger-strong)]"
                                        />
                                        {t('haul.declined')}
                                    </p>
                                    <SecondaryButton type="button" onClick={() => setDeclinedId(null)} icon="Retry">
                                        {t('haul.undo')}
                                    </SecondaryButton>
                                </div>
                            ) : st === 'assigned' ? (
                                <div className="flex flex-wrap gap-3">
                                    <PrimaryButton
                                        type="button"
                                        onClick={() => void accept(h.id)}
                                        disabled={mutation.isPending}
                                        icon="Check"
                                        className="flex-[1_1_140px]"
                                    >
                                        {t('haul.accept')}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => setDeclinedId(h.id)}
                                        icon="X"
                                        className="flex-[1_1_140px]"
                                    >
                                        {t('haul.decline')}
                                    </SecondaryButton>
                                </div>
                            ) : (
                                <ZLink
                                    href={`/haul/driver/jobs/${h.id}`}
                                    className="btn-2026 w-full flex items-center justify-center gap-2"
                                >
                                    <Icon name="ArrowRight" size={24} />
                                    <span>{t('haul.open')}</span>
                                </ZLink>
                            )}
                        </HaulRequestCard>
                    );
                })}
            </div>
        </ModuleShell>
    );
}

/** /haul/driver/jobs/{id} — the driver's job card: one forward action per step. Updates sent while offline are
    queued in the card ("Not sent yet") and flushed when the connection returns, so nothing disappears. */
export function HaulDriverScreen({ id, status: forced }: { id?: string; status?: HaulStatus }) {
    const { t } = useI18n();
    const toast = useToast();
    /* Gate 3: the driver's haul comes from the repository list (RLS gives the driver their own rows). */
    const haulsQuery = useHauls({ size: 20 });
    const haul = (id ? haulsQuery.data?.rows.find((h) => h.id === id) : haulsQuery.data?.rows[0]) ?? null;
    const server = useHaulStatus(haul?.id ?? '');
    const lotQuery = useLot(haul?.lot ?? '');
    const mutation = useSetHaulStatus();
    const [declined, setDeclined] = useState(false);
    const [queued, setQueued] = useState<HaulStatus | null>(null);
    const st: HaulStatus = forced ?? queued ?? server.data ?? 'assigned';
    const d = haul?.driver ?? null;
    const v = vehicleOf(d);
    const trips = haul && v ? tripsFor(haul.sacks, v) : 0;

    async function apply(to: HaulStatus) {
        if (!haul) return;
        const fresh = to !== queued;
        if (fresh && ORDER.indexOf(to) <= ORDER.indexOf(st)) return;
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            setQueued(to);
            return;
        }
        try {
            await mutation.mutateAsync({ id: haul.id, status: to });
            setQueued(null);
            toast.show(t('haul.saved'));
        } catch {
            setQueued(to);
        }
    }

    useEffect(() => {
        if (!queued) return;
        const flush = () => void apply(queued);
        window.addEventListener('online', flush);
        return () => window.removeEventListener('online', flush);
    }, [queued]);

    if (haulsQuery.isPending)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="jobs">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    if (haulsQuery.isError)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="jobs">
                <ErrorState onRetry={() => void haulsQuery.refetch()} />
            </ModuleShell>
        );
    if (!haul)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="jobs">
                {id ? (
                    <ErrorState variant="notFound" className="max-w-[640px] mx-auto" />
                ) : (
                    <EmptyState
                        className="max-w-[640px] mx-auto"
                        variant="empty"
                        title="state.haul.empty.title"
                        body="state.haul.empty.body"
                    />
                )}
            </ModuleShell>
        );
    if (!forced && server.isPending)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="jobs">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    if (!forced && server.isError)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="jobs">
                <ErrorState onRetry={() => void server.refetch()} />
            </ModuleShell>
        );

    return (
        <ModuleShell role="driver" title="haul.driver.job" active="jobs">
            <div className="flex flex-col gap-4 max-w-[720px] mx-auto w-full">
                <HaulRequestCard id={haul.id} lot={haul.lot} sacks={haul.sacks} status={st}>
                    <DeliveryStatusStepper status={st} type="cluster" />
                    <div className="rc-subtle p-4 flex flex-col gap-2">
                        <Row label={t('haul.eta')}>{haul.pickup}</Row>
                        {v && d && <Row label={t('haul.driver.pay')}>{peso(trips * v.price)}</Row>}

                        <Row label={t('haul.sacks')}>
                            {lotQuery.data
                                ? t('haul.about', { n: haul.sacks, t: tons(lotQuery.data.driedKg) })
                                : `${haul.sacks} ${t('unit.sacks')}`}
                        </Row>
                        <Row label={t('haul.vehicle')}>{d?.plate || '—'}</Row>
                    </div>
                    {queued && (
                        <div
                            role="status"
                            className="rc-subtle p-4 flex items-center justify-between gap-3 flex-wrap text-[var(--ink)]"
                        >
                            <span className="flex items-center gap-2 text-[15px] font-bold">
                                <Icon name="Clock" size={20} className="shrink-0 text-[var(--text-accent)]" />
                                {t('haul.notSent')}
                            </span>
                            <SecondaryButton type="button" onClick={() => void apply(queued)} icon="Retry">
                                {t('error.retry')}
                            </SecondaryButton>
                        </div>
                    )}
                    {!forced && <OfflineBanner className="rounded-xl" />}
                    {declined ? (
                        <div className="rc-subtle p-4 flex flex-col gap-3">
                            <p className="text-[16px] font-bold text-[var(--ink)] flex items-start gap-2">
                                <Icon name="CircleX" size={24} className="shrink-0 text-[var(--danger-strong)]" />
                                {t('haul.declined')}
                            </p>
                            <SecondaryButton type="button" onClick={() => setDeclined(false)} icon="Retry">
                                {t('haul.undo')}
                            </SecondaryButton>
                        </div>
                    ) : queued ? null : st === 'assigned' ? (
                        <div className="flex flex-wrap gap-3">
                            <PrimaryButton
                                type="button"
                                onClick={() => void apply('accepted')}
                                disabled={mutation.isPending}
                                icon="Check"
                                className="flex-[1_1_140px]"
                            >
                                {t('haul.accept')}
                            </PrimaryButton>
                            <SecondaryButton
                                type="button"
                                onClick={() => setDeclined(true)}
                                icon="X"
                                className="flex-[1_1_140px]"
                            >
                                {t('haul.decline')}
                            </SecondaryButton>
                        </div>
                    ) : st === 'accepted' ? (
                        <PrimaryButton
                            type="button"
                            onClick={() => void apply('pickedup')}
                            disabled={mutation.isPending}
                            icon="Sack"
                            className="w-full"
                        >
                            {t('haul.pickedup')}
                        </PrimaryButton>
                    ) : st === 'pickedup' ? (
                        <PrimaryButton
                            type="button"
                            onClick={() => void apply('delivered')}
                            disabled={mutation.isPending}
                            icon="CircleCheck"
                            className="w-full"
                        >
                            {t('haul.delivered')}
                        </PrimaryButton>
                    ) : st === 'delivered' ? (
                        <p
                            role="status"
                            className="rc-subtle p-4 text-[18px] font-extrabold text-[var(--ink)] flex items-center gap-2"
                        >
                            <Icon name="CircleCheck" size={24} />
                            {t('haul.done')}
                        </p>
                    ) : null}
                    <RouteLine stops={stopsOf(haul)} km={haul.km} active={routeActive(st)} />
                </HaulRequestCard>
            </div>
        </ModuleShell>
    );
}
export { ORDER as HAUL_ORDER };
