'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DeliveryStatusStepper, DriverCard, EmptyState, HaulRequestCard, Icon, RouteLine, StatusChip, VehicleOption, useI18n } from '@/components/riceconnect';
import { ModuleShell } from './shell';
import { DRIVERS, DRYER, HAUL, HERO_LOT, KG_PER_SACK, SLOT, VEHICLES, vehicleOf } from '@/data/seed';
import { autoAssign, tripsFor, type Driver } from '@/data/assign';
import { peso } from '@/data/money';

export type HaulStatus = 'requested' | 'assigned' | 'accepted' | 'pickedup' | 'delivered';
const ORDER: HaulStatus[] = ['requested', 'assigned', 'accepted', 'pickedup', 'delivered'];
const STOPS = [
    { label: HAUL.from.label, place: HAUL.from.place, icon: 'Farm' },
    { label: HAUL.via.label, place: HAUL.via.place, icon: 'Dry' },
    { label: HAUL.to.label, place: HAUL.to.place, icon: 'Store' },
];
/** Route progress: at the farm until picked up, then at the dryer, then all done. */
const routeActive = (s: HaulStatus) => (s === 'delivered' ? STOPS.length : s === 'pickedup' ? 1 : 0);
const tons = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
const nearestOf = (vehicle: string) =>
    [...DRIVERS].filter((d) => d.vehicle === vehicle && d.available).sort((a, b) => a.distanceKm - b.distanceKm || a.id.localeCompare(b.id))[0] ?? null;

/** Hard-style row: label left, value right (black on white). */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-3 text-[16px] leading-6 font-extrabold text-black tabular">
            <span>{label}</span><span className="text-right">{children}</span>
        </div>
    );
}

/** /haul — coordinator: request, auto-assigned driver, override (phone). Hard logistics content inside the glass shell. */
export function HaulCoordinatorScreen({ state = 'default', status: forced }: { state?: 'default' | 'empty' | 'error' | 'success'; status?: HaulStatus }) {
    const { t } = useI18n();
    const [view, setView] = useState<'form' | 'card' | 'empty' | 'error' | 'success'>(state === 'default' ? 'card' : state);
    const [sacks, setSacks] = useState(HAUL.sacks);
    const [driver, setDriver] = useState<Driver | null>(HAUL.driver);
    const [overridden, setOverridden] = useState(false);
    const [listOpen, setListOpen] = useState(false);
    const status: HaulStatus = forced ?? (view === 'form' ? 'requested' : 'assigned');

    const send = () => {
        const d = autoAssign(sacks, DRIVERS, VEHICLES);
        setDriver(d); setOverridden(false);
        setView(d ? 'card' : 'error');
    };
    const pick = (d: Driver) => { setDriver(d); setOverridden(true); setListOpen(false); };

    if (view === 'empty') return (
        <ModuleShell title="haul.title" active="logistics">
            <EmptyState variant="empty" title="state.haul.empty.title" body="state.haul.empty.body" action="state.haul.empty.action" onAction={() => setView('form')} />
        </ModuleShell>
    );
    if (view === 'error') return (
        <ModuleShell title="haul.title" active="logistics">
            <EmptyState variant="error" title="state.haul.error.title" body="state.haul.error.body" action="error.retry" onAction={() => setView('form')} />
        </ModuleShell>
    );
    if (view === 'success') return (
        <ModuleShell title="haul.title" active="logistics">
            <div className="flex flex-col gap-4">
                <EmptyState variant="success" title={t('state.haul.success.title', { haul: HAUL.id })}
                    body={t('state.haul.success.body', { sacks: HAUL.sacks, dryer: DRYER.name, slot: SLOT.id, day: SLOT.day })} />
                <Link href="/dry" className="btn-2026 self-center"><Icon name="ArrowRight" size={24} /><span>{t('state.haul.success.action')}</span></Link>
            </div>
        </ModuleShell>
    );

    const v = driver ? vehicleOf(driver) : null;
    return (
        <ModuleShell title={view === 'form' ? 'haul.new' : 'haul.title'} active="logistics">
            <div className="flex flex-col gap-4">
                <HaulRequestCard id={HAUL.id} lot={HAUL.lot} sacks={sacks} status={status}>
                    <DeliveryStatusStepper status={status} type="cluster" />
                    <RouteLine stops={STOPS} km={HAUL.km} active={routeActive(status)} />
                    {view === 'form' ? (
                        <div className="hard-thin p-3 flex flex-col gap-2">
                            <label htmlFor="haul-sacks" className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-black">{t('haul.sacks')}</label>
                            <input id="haul-sacks" type="number" inputMode="numeric" min={1} value={sacks}
                                onChange={(e) => setSacks(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
                                className="hard-thin min-h-[48px] px-3 text-[18px] font-extrabold tabular w-full" />
                            <p className="text-[16px] leading-6 font-semibold text-[var(--gray-900)]">{t('haul.sacks.help', { lot: HERO_LOT.id, kg: HERO_LOT.driedKg.toLocaleString('en-US'), n: HERO_LOT.sacks, per: KG_PER_SACK })}</p>
                            <button type="button" onClick={send} className="hard-btn bg-[var(--warning)] text-black w-full"><Icon name="Send" size={24} /><span>{t('haul.request')}</span></button>
                        </div>
                    ) : (
                        <>
                            <div role="radiogroup" aria-label={t('haul.vehicles', { n: sacks })} className="grid grid-cols-2 gap-3">
                                {VEHICLES.map((veh) => (
                                    <VehicleOption key={veh.id} v={veh} sacks={sacks} selected={v?.id === veh.id}
                                        onSelect={() => { const d = nearestOf(veh.id); if (d) pick(d); }} />
                                ))}
                            </div>
                            {driver && v && (
                                <DriverCard name={driver.name} vehicle={v.icon} plate={driver.plate} distanceKm={driver.distanceKm} auto={!overridden}
                                    onOverride={() => setListOpen((o) => !o)} />
                            )}
                            {overridden && <StatusChip status="assigned" label="haul.overridden" kind="warning" hard />}
                            {driver && v && (
                                <div className="hard-thin p-3 flex flex-col gap-1.5">
                                    <Row label={t('haul.eta')}>{HAUL.pickup}</Row>
                                    <Row label={t('haul.cost')}>{t('haul.trips', { n: tripsFor(sacks, v), price: peso(tripsFor(sacks, v) * v.price) })}</Row>
                                    {status === 'assigned' && <p className="text-[14px] font-bold text-black flex items-center gap-1.5"><Icon name="Clock" size={20} />{t('haul.waiting', { driver: driver.name })}</p>}
                                </div>
                            )}
                            {listOpen && (
                                <div className="hard-thin p-3 flex flex-col gap-2" aria-label={t('haul.drivers')} role="group">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-black">{t('haul.drivers')}</h4>
                                        <button type="button" onClick={() => setListOpen(false)} className="hard-btn bg-white text-black !min-h-[44px] !px-3"><Icon name="X" size={24} /><span>{t('haul.close')}</span></button>
                                    </div>
                                    <ul className="flex flex-col gap-2">
                                        {[...DRIVERS].sort((a, b) => a.distanceKm - b.distanceKm || a.id.localeCompare(b.id)).map((d) => {
                                            const dv = vehicleOf(d);
                                            return (
                                                <li key={d.id} className="border-2 border-black p-2 flex items-center gap-2">
                                                    <Icon name={dv.icon} size={24} className="shrink-0 text-black" />
                                                    <span className="min-w-0 flex-1 text-black">
                                                        <span className="block text-[15px] font-extrabold">{d.name} · {d.plate}</span>
                                                        <span className="block text-[14px] font-semibold text-[var(--gray-900)] tabular">{t('driver.away', { km: d.distanceKm.toFixed(1) })} · {t('haul.trips', { n: tripsFor(sacks, dv), price: peso(tripsFor(sacks, dv) * dv.price) })}</span>
                                                    </span>
                                                    <span className="flex flex-col items-end gap-1">
                                                        <StatusChip status={d.available ? 'open' : 'pending'} label={d.available ? 'haul.free' : 'haul.busy'} kind={d.available ? 'success' : 'warning'} hard />
                                                        <button type="button" onClick={() => pick(d)} aria-pressed={driver?.id === d.id} className="hard-btn bg-white text-black !min-h-[44px] !px-3 !py-2">{t('haul.assign')}</button>
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </HaulRequestCard>
            </div>
        </ModuleShell>
    );
}

/** /haul/driver — the driver's job card: Accept / Decline, then status updates (phone). */
export function HaulDriverScreen({ status: forced }: { status?: HaulStatus }) {
    const { t } = useI18n();
    const [own, setOwn] = useState<HaulStatus>('assigned');
    const [declined, setDeclined] = useState(false);
    const st = forced ?? own;
    const d = HAUL.driver!;
    const v = vehicleOf(d);
    const trips = tripsFor(HAUL.sacks, v);
    const step = (to: HaulStatus) => () => setOwn(to);
    return (
        <ModuleShell role="driver" title="haul.driver.job" active="logistics">
            <div className="flex flex-col gap-4">
                <HaulRequestCard id={HAUL.id} lot={HAUL.lot} sacks={HAUL.sacks} status={st}>
                    <DeliveryStatusStepper status={st} type="cluster" />
                    <div className="hard-thin p-3 flex flex-col gap-1.5">
                        <Row label={t('haul.eta')}>{HAUL.pickup}</Row>
                        <Row label={t('haul.driver.pay')}>{peso(trips * v.price)}</Row>
                        <Row label={t('haul.sacks')}>{t('haul.about', { n: HAUL.sacks, t: tons(HERO_LOT.driedKg) })}</Row>
                        <Row label={t('haul.vehicle')}>{d.plate}</Row>
                    </div>
                    {declined ? (
                        <div className="hard-thin p-3 flex flex-col gap-2">
                            <p className="text-[16px] font-bold text-black flex items-start gap-2"><Icon name="CircleX" size={24} className="shrink-0" />{t('haul.declined')}</p>
                            <button type="button" onClick={() => setDeclined(false)} className="hard-btn bg-white text-black"><Icon name="Retry" size={24} /><span>{t('haul.undo')}</span></button>
                        </div>
                    ) : st === 'assigned' ? (
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={step('accepted')} className="hard-btn flex-[1_1_140px] bg-[var(--success)] text-black"><Icon name="Check" size={24} /><span>{t('haul.accept')}</span></button>
                            <button type="button" onClick={() => setDeclined(true)} className="hard-btn flex-[1_1_140px] bg-white text-black"><Icon name="X" size={24} /><span>{t('haul.decline')}</span></button>
                        </div>
                    ) : st === 'accepted' ? (
                        <button type="button" onClick={step('pickedup')} className="hard-btn w-full bg-[var(--warning)] text-black"><Icon name="Sack" size={24} /><span>{t('haul.pickedup')}</span></button>
                    ) : st === 'pickedup' ? (
                        <button type="button" onClick={step('delivered')} className="hard-btn w-full bg-[var(--success)] text-black"><Icon name="CircleCheck" size={24} /><span>{t('haul.delivered')}</span></button>
                    ) : st === 'delivered' ? (
                        <p role="status" className="hard-thin p-3 text-[18px] font-extrabold text-black flex items-center gap-2"><Icon name="CircleCheck" size={24} />{t('haul.done')}</p>
                    ) : null}
                    <RouteLine stops={STOPS} km={HAUL.km} active={routeActive(st)} />
                </HaulRequestCard>
            </div>
        </ModuleShell>
    );
}
export { ORDER as HAUL_ORDER };
