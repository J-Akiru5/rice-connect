'use client';
import { useEffect, useState } from 'react';
import { ZLink } from '@rc/ui';
import {
    DeliveryStatusStepper,
    DriverCard,
    EmptyState,
    ErrorState,
    HaulRequestCard,
    Icon,
    LoadingState,
    OfflineBanner,
    RouteLine,
    StatusChip,
    VehicleOption,
    useI18n,
    useToast
} from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { ModuleShell } from './shell';
import { useHauls, useHaulStatus, useLot, useSetHaulStatus } from '@rc/data';
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
        <div className="flex justify-between gap-3 text-[16px] leading-6 font-extrabold text-black tabular">
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
        <div className="hard-thin p-3 flex flex-col gap-2" aria-label={t('haul.drivers')} role="group">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-black">
                    {t('haul.drivers')}
                </h4>
                {closable && (
                    <button
                        type="button"
                        onClick={() => setListOpen(false)}
                        className="hard-btn bg-white text-black !min-h-[44px] !px-3"
                    >
                        <Icon name="X" size={24} />
                        <span>{t('haul.close')}</span>
                    </button>
                )}
            </div>
            <ul className="flex flex-col gap-2">
                {[...DRIVERS]
                    .sort((a, b) => a.distanceKm - b.distanceKm || a.id.localeCompare(b.id))
                    .map((d) => {
                        const dv = vehicleOf(d)!;
                        return (
                            <li key={d.id} className="border-2 border-black p-2 flex items-center gap-2 flex-wrap">
                                <Icon name={dv.icon} size={24} className="shrink-0 text-black" />
                                <span className="min-w-0 flex-1 text-black">
                                    <span className="block text-[15px] font-extrabold break-words">
                                        {d.name} · {d.plate}
                                    </span>
                                    <span className="block text-[14px] font-semibold text-[var(--gray-900)] tabular">
                                        {t('driver.away', { km: d.distanceKm.toFixed(1) })} ·{' '}
                                        {t('haul.trips', {
                                            n: tripsFor(sacks, dv),
                                            price: peso(tripsFor(sacks, dv) * dv.price)
                                        })}
                                    </span>
                                </span>
                                <span className="flex flex-col items-end gap-1">
                                    <StatusChip
                                        status={d.available ? 'open' : 'pending'}
                                        label={d.available ? 'haul.free' : 'haul.busy'}
                                        kind={d.available ? 'success' : 'warning'}
                                        hard
                                    />
                                    <button
                                        type="button"
                                        onClick={() => pick(d)}
                                        aria-pressed={driver?.id === d.id}
                                        className="hard-btn bg-white text-black !min-h-[44px] !px-3 !py-2"
                                    >
                                        {t('haul.assign')}
                                    </button>
                                </span>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
    return (
        <ModuleShell title={view === 'form' ? 'haul.new' : 'haul.title'} active="logistics">
            {/* Narrow: one column (as the canvas board). Wide: request + assignment left; stepper, route and drivers right (derived, not in canvas). */}
            <div className="cq-two">
                <HaulRequestCard id={viewHaul.id} lot={viewHaul.lot} sacks={sacks} status={status}>
                    <div className="cq-narrow-only flex flex-col gap-3">
                        <DeliveryStatusStepper status={status} type="cluster" />
                        <RouteLine stops={stops} km={viewHaul.km} active={routeActive(status)} />
                    </div>
                    {view === 'form' ? (
                        <div className="hard-thin p-3 flex flex-col gap-2">
                            <label
                                htmlFor="haul-sacks"
                                className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-black"
                            >
                                {t('haul.sacks')}
                            </label>
                            <input
                                id="haul-sacks"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                value={sacks}
                                onChange={(e) => setSacksOverride(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
                                className="hard-thin min-h-[48px] px-3 text-[18px] font-extrabold tabular w-full"
                            />
                            <p className="text-[16px] leading-6 font-semibold text-[var(--gray-900)]">
                                {t('haul.sacks.help', {
                                    lot: HERO_LOT.id,
                                    kg: HERO_LOT.driedKg.toLocaleString('en-US'),
                                    n: HERO_LOT.sacks,
                                    per: KG_PER_SACK
                                })}
                            </p>
                            <button
                                type="button"
                                onClick={send}
                                className="hard-btn bg-[var(--warning)] text-black w-full"
                            >
                                <Icon name="Send" size={24} />
                                <span>{t('haul.request')}</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {!isLive && (
                                <div
                                    role="radiogroup"
                                    aria-label={t('haul.vehicles', { n: sacks })}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {VEHICLES.map((veh) => (
                                        <VehicleOption
                                            key={veh.id}
                                            v={veh}
                                            sacks={sacks}
                                            selected={v?.id === veh.id}
                                            onSelect={() => {
                                                const d = nearestOf(veh.id);
                                                if (d) pick(d);
                                            }}
                                        />
                                    ))}
                                </div>
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
                            {overridden && <StatusChip status="assigned" label="haul.overridden" kind="warning" hard />}
                            {overridden && driver && base && (
                                <p className="m-0 text-[14px] font-bold text-black tabular">
                                    {t('haul.overrideNote', { from: base.name, to: driver.name })}
                                </p>
                            )}
                            {driver && (
                                <div className="hard-thin p-3 flex flex-col gap-1.5">
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
                                        <p className="text-[14px] font-bold text-black flex items-center gap-1.5">
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
                    className="cq-wide-only hard p-4 flex flex-col gap-3 outline-none"
                    id="haul-drivers"
                    tabIndex={-1}
                    aria-label={t('haul.route')}
                >
                    <DeliveryStatusStepper status={status} type="cluster" />
                    <RouteLine stops={stops} km={viewHaul.km} active={routeActive(status)} />
                    {view !== 'form' && !isLive && driverList(false)}
                </section>
            </div>
        </ModuleShell>
    );
}

/** /haul/driver — the driver's job card: one forward action per step. Updates sent while offline are queued
    in the card ("Not sent yet") and flushed when the connection returns, so nothing disappears. */
export function HaulDriverScreen({ status: forced }: { status?: HaulStatus }) {
    const { t } = useI18n();
    const toast = useToast();
    /* Gate 3: the driver's haul comes from the repository list (RLS gives the driver their own rows). */
    const haulsQuery = useHauls({ size: 20 });
    const haul = haulsQuery.data?.rows[0];
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
            <ModuleShell role="driver" title="haul.driver.job" active="logistics">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    if (haulsQuery.isError)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="logistics">
                <ErrorState onRetry={() => void haulsQuery.refetch()} />
            </ModuleShell>
        );
    if (!haul)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="logistics">
                <EmptyState
                    className="max-w-[640px] mx-auto"
                    variant="empty"
                    title="state.haul.empty.title"
                    body="state.haul.empty.body"
                />
            </ModuleShell>
        );
    if (!forced && server.isPending)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="logistics">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    if (!forced && server.isError)
        return (
            <ModuleShell role="driver" title="haul.driver.job" active="logistics">
                <ErrorState onRetry={() => void server.refetch()} />
            </ModuleShell>
        );

    return (
        <ModuleShell role="driver" title="haul.driver.job" active="logistics">
            <div className="flex flex-col gap-4 max-w-[720px] mx-auto w-full">
                <HaulRequestCard id={haul.id} lot={haul.lot} sacks={haul.sacks} status={st}>
                    <DeliveryStatusStepper status={st} type="cluster" />
                    <div className="hard-thin p-3 flex flex-col gap-1.5">
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
                            className="hard-thin p-3 flex items-center justify-between gap-2 flex-wrap text-black"
                        >
                            <span className="flex items-center gap-2 text-[15px] font-bold">
                                <Icon name="Clock" size={20} className="shrink-0" />
                                {t('haul.notSent')}
                            </span>
                            <button
                                type="button"
                                onClick={() => void apply(queued)}
                                className="hard-btn bg-white text-black !min-h-[44px] !px-3 !py-2"
                            >
                                <Icon name="Retry" size={20} />
                                <span>{t('error.retry')}</span>
                            </button>
                        </div>
                    )}
                    {!forced && <OfflineBanner className="rounded-xl" />}
                    {declined ? (
                        <div className="hard-thin p-3 flex flex-col gap-2">
                            <p className="text-[16px] font-bold text-black flex items-start gap-2">
                                <Icon name="CircleX" size={24} className="shrink-0" />
                                {t('haul.declined')}
                            </p>
                            <button
                                type="button"
                                onClick={() => setDeclined(false)}
                                className="hard-btn bg-white text-black"
                            >
                                <Icon name="Retry" size={24} />
                                <span>{t('haul.undo')}</span>
                            </button>
                        </div>
                    ) : queued ? null : st === 'assigned' ? (
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => void apply('accepted')}
                                disabled={mutation.isPending}
                                className="hard-btn flex-[1_1_140px] bg-[var(--success)] text-black"
                            >
                                <Icon name="Check" size={24} />
                                <span>{t('haul.accept')}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeclined(true)}
                                className="hard-btn flex-[1_1_140px] bg-white text-black"
                            >
                                <Icon name="X" size={24} />
                                <span>{t('haul.decline')}</span>
                            </button>
                        </div>
                    ) : st === 'accepted' ? (
                        <button
                            type="button"
                            onClick={() => void apply('pickedup')}
                            disabled={mutation.isPending}
                            className="hard-btn w-full bg-[var(--warning)] text-black"
                        >
                            <Icon name="Sack" size={24} />
                            <span>{t('haul.pickedup')}</span>
                        </button>
                    ) : st === 'pickedup' ? (
                        <button
                            type="button"
                            onClick={() => void apply('delivered')}
                            disabled={mutation.isPending}
                            className="hard-btn w-full bg-[var(--success)] text-black"
                        >
                            <Icon name="CircleCheck" size={24} />
                            <span>{t('haul.delivered')}</span>
                        </button>
                    ) : st === 'delivered' ? (
                        <p
                            role="status"
                            className="hard-thin p-3 text-[18px] font-extrabold text-black flex items-center gap-2"
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
