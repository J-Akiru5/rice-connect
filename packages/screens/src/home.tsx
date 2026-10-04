'use client';
import { AppShell, BigStat, Icon, StatusChip, ZLink, useI18n } from '@rc/ui';
import overrides from '@rc/domain/overrides.json';
import { FARMS, HAUL, HERO_LOT, SETTLEMENT, SLIP, SLOT, WEEKS } from '@rc/domain/seed';
import { dayLabel } from '@rc/domain/calendar';
import { peso } from '@rc/domain/money';
import { useDemoState } from '@rc/store/react';
import { haulStatus } from '@rc/store';
import { SectionPill, Note } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
const TODAY = overrides.demoTodayDayIndex; // assumed (docs/NUMBERS.md)
const WEEK = Math.floor(TODAY / 7);

function Panel({
    id,
    title,
    children,
    href,
    cta
}: {
    id: string;
    title: string;
    children: React.ReactNode;
    href?: string;
    cta?: string;
}) {
    return (
        <section aria-labelledby={id} className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3 min-w-0">
            <h2 id={id} className="eyebrow">
                {title}
            </h2>
            {children}
            {href && cta && (
                <ZLink
                    href={href}
                    className="self-start inline-flex items-center gap-2 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                >
                    {cta}
                    <Icon name="ArrowRight" size={20} />
                </ZLink>
            )}
        </section>
    );
}

/** Coordinator Home (derived, not in canvas): what needs attention this week. Live: buyer orders and farmer replies
    made in other apps (other tabs, same origin) appear here through the shared store within a second. */
export function CoordinatorHomeScreen() {
    const { t } = useI18n();
    const s = useDemoState();
    const harvests = FARMS.filter((f) => f.harvestDay >= WEEK * 7 && f.harvestDay < WEEK * 7 + 7).sort(
        (a, b) => a.harvestDay - b.harvestDay || a.id.localeCompare(b.id)
    );
    const hStatus = haulStatus(s, HAUL.id);
    const waiting = hStatus === 'assigned' || hStatus === 'requested';
    const slot = s.slots[SLOT.id] ?? 'scheduled';
    const orders = s.riceOrders.length + s.commitments.length;
    const lastReply = s.smsReplies[s.smsReplies.length - 1];
    return (
        <AppShell
            title="home.title"
            eyebrow={t('home.eyebrow', { week: WEEKS[WEEK] ?? WEEKS[0], date: dayLabel(TODAY) })}
            active="home"
        >
            <div className="flex flex-col gap-6">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]">
                    <BigStat
                        label="home.stat.harvests"
                        value={harvests.length}
                        icon="Wheat"
                        note={t('home.note.harvests', { t: t1(harvests.reduce((a, f) => a + f.driedKg, 0)) })}
                    />
                    <BigStat label="home.stat.hauls" value={waiting ? 1 : 0} icon="Truck" note={t('home.note.hauls')} />
                    <BigStat
                        label="home.stat.advances"
                        value={peso(SETTLEMENT.advance)}
                        size="md"
                        icon="Advance"
                        note={t('home.note.advances', { date: SLIP.date })}
                    />
                    <BigStat label="home.stat.orders" value={orders} icon="Orders" note={t('home.note.orders')} />
                </div>
                <div className="cq-two">
                    <Panel
                        id="h-harvest"
                        title={t('home.harvests', { week: WEEKS[WEEK] ?? WEEKS[0] })}
                        href="/plan"
                        cta={t('farm.viewPlan')}
                    >
                        <ul className="flex flex-col">
                            {harvests.slice(0, 8).map((f) => (
                                <li
                                    key={f.id}
                                    className="flex items-center justify-between gap-3 py-2 border-b border-[color:var(--glass-border-strong)] last:border-0 tabular"
                                >
                                    <ZLink
                                        href={`/farm/${f.id}`}
                                        className="font-extrabold text-[var(--text-accent)] underline underline-offset-4 min-h-[40px] inline-flex items-center"
                                    >
                                        {f.id}
                                    </ZLink>
                                    <span className="text-[14px] font-semibold break-words">
                                        {f.barangay} · {f.harvestLabel}
                                    </span>
                                    <span className="text-[14px] font-bold whitespace-nowrap">{t1(f.driedKg)} t</span>
                                </li>
                            ))}
                        </ul>
                        {harvests.length > 8 && <Note>{t('home.more', { n: harvests.length - 8 })}</Note>}
                    </Panel>
                    <div className="flex flex-col gap-4">
                        <Panel id="h-hauls" title={t('home.hauls')} href="/haul" cta={t('home.openHaul')}>
                            {waiting ? (
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-[16px] font-extrabold tabular">
                                        {HAUL.id} · Lot {HAUL.lot} · {HAUL.sacks} {t('unit.sacks')} · {HAUL.pickup}
                                    </span>
                                    <StatusChip status={hStatus} />
                                </div>
                            ) : (
                                <p className="m-0 text-[15px] font-bold flex items-center gap-2">
                                    <Icon name="CircleCheck" size={20} />
                                    {t('home.noHauls', { id: HAUL.id })} <StatusChip status={hStatus} />
                                </p>
                            )}
                        </Panel>
                        <Panel
                            id="h-adv"
                            title={t('home.advances')}
                            href={`/pay/${HERO_LOT.id}`}
                            cta={t('pay.open', { lot: HERO_LOT.id })}
                        >
                            <p className="m-0 text-[16px] font-extrabold tabular">
                                {t('home.advanceLine', {
                                    lot: HERO_LOT.id,
                                    amount: peso(SETTLEMENT.advance),
                                    date: SLIP.date
                                })}
                            </p>
                        </Panel>
                        <Panel id="h-orders" title={t('home.orders')} href="/buyer/orders" cta={t('home.openBuyer')}>
                            {orders === 0 ? (
                                <Note>{t('home.noOrders')}</Note>
                            ) : (
                                <ul className="flex flex-col gap-2" aria-live="polite">
                                    {s.riceOrders.map((o) => (
                                        <li
                                            key={o.id}
                                            className="flex flex-wrap items-center justify-between gap-2 tabular"
                                        >
                                            <span className="text-[15px] font-bold">
                                                {o.id} · {t('buyer.type.' + o.type)} · {o.sacks} {t('unit.sacks')} ·{' '}
                                                {o.week} · {peso(o.total)}
                                            </span>
                                            <StatusChip status="requested" />
                                        </li>
                                    ))}
                                    {s.commitments.map((c) => (
                                        <li
                                            key={c.id}
                                            className="flex flex-wrap items-center justify-between gap-2 tabular"
                                        >
                                            <span className="text-[15px] font-bold">
                                                {c.id} · {t('buyer.type.miller')} · {c.tonnes} t · {c.window.join('-')}
                                            </span>
                                            <StatusChip status="matched" />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Panel>
                        <Panel id="h-sms" title={t('home.replies')} href="/sms" cta={t('home.openSms')}>
                            <div aria-live="polite" className="flex flex-wrap items-center gap-2">
                                <span className="text-[15px] font-bold">
                                    {lastReply
                                        ? t('home.lastReply', { farm: lastReply.farm, text: lastReply.text })
                                        : t('home.noReplies')}
                                </span>
                                <StatusChip
                                    status={
                                        slot === 'confirmed' ? 'paid' : slot === 'move-requested' ? 'pending' : 'open'
                                    }
                                    label={t('slot.' + slot, { id: SLOT.id })}
                                />
                            </div>
                        </Panel>
                    </div>
                </div>
                <div>
                    <SectionPill>{t('home.simNote')}</SectionPill>
                </div>
            </div>
        </AppShell>
    );
}
