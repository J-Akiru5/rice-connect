'use client';
import {
    AppShell,
    BarChart,
    BigStat,
    ErrorState,
    Icon,
    LoadingState,
    ProgressBar,
    StatusChip,
    StatusDistribution,
    ZLink,
    useI18n
} from '@rc/ui';
import overrides from '@rc/domain/overrides.json';
import { HERO_LOT, SETTLEMENT, SLIP, SLOT, WEEKS } from '@rc/domain/seed';
import { dayLabel } from '@rc/domain/calendar';
import { peso } from '@rc/domain/money';
import {
    useCommitments,
    useFarms,
    useHauls,
    useHaulStatus,
    useHaulStatuses,
    useMyCommitments,
    useOrders,
    useSmsReplies,
    useSlotStatus
} from '@rc/data';
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

/** Coordinator Home (derived, not in canvas): what needs attention this week, today first. Live: buyer orders
    and farmer replies made in other apps (other tabs, same origin) appear here through the data hooks. */
export function CoordinatorHomeScreen() {
    const { t } = useI18n();
    /* Gate 3: the haul comes from the repository list (RLS-scoped), not the seed's fixed H-07. */
    const haulsQuery = useHauls({ size: 20 });
    const haul = haulsQuery.data?.rows[0];
    const haulQuery = useHaulStatus(haul?.id ?? '');
    const slotQuery = useSlotStatus(SLOT.id);
    const ordersQuery = useOrders({ size: 50 });
    const commitmentsQuery = useMyCommitments();
    const repliesQuery = useSmsReplies();
    /* Gate 3: harvests and the dashboard come from the repositories (mock in demo, Supabase in live). */
    const farmsQuery = useFarms({ size: 100 });
    const boardQuery = useCommitments({ size: 20 });
    const farms = farmsQuery.data?.rows ?? [];
    const harvests = farms
        .filter((f) => f.harvestDay >= WEEK * 7 && f.harvestDay < WEEK * 7 + 7)
        .sort((a, b) => a.harvestDay - b.harvestDay || a.id.localeCompare(b.id));
    const hauls = haulsQuery.data?.rows ?? [];
    const haulIds = hauls.map((h) => h.id);
    const statusesQuery = useHaulStatuses(haulIds);
    const hStatus = haulQuery.data ?? 'assigned';
    const waiting = Boolean(haul) && (hStatus === 'assigned' || hStatus === 'requested');
    const slot = slotQuery.data ?? 'scheduled';
    const riceOrders = ordersQuery.data?.rows ?? [];
    const commitments = commitmentsQuery.data ?? [];
    const orders = riceOrders.length + commitments.length;
    const replies = repliesQuery.data ?? [];
    const lastReply = replies[replies.length - 1];
    const weekKg = WEEKS.map((w) => farms.filter((f) => f.harvestWeek === w).reduce((s, f) => s + f.driedKg, 0));
    const board = boardQuery.data?.rows ?? [];
    const statusSegments = (['requested', 'assigned', 'accepted', 'pickedup', 'delivered'] as const).map((s) => ({
        status: s,
        label: t('status.' + s),
        value: (statusesQuery.data ?? []).filter((x) => x.status === s).length
    }));
    /* Disabled queries (no haul yet) stay out of the loading gate: their isPending never settles. */
    const live = [haulsQuery, slotQuery, ordersQuery, commitmentsQuery, repliesQuery, farmsQuery, boardQuery];
    const loading =
        live.some((q) => q.isPending) ||
        (Boolean(haul) && haulQuery.isPending) ||
        (haulIds.length > 0 && statusesQuery.isPending);
    const failed =
        live.some((q) => q.isError) ||
        (Boolean(haul) && haulQuery.isError) ||
        (haulIds.length > 0 && statusesQuery.isError);
    const retry = () => {
        live.forEach((q) => void q.refetch());
        if (haul) void haulQuery.refetch();
        if (haulIds.length > 0) void statusesQuery.refetch();
    };
    const gate = (content: React.ReactNode) =>
        loading ? <LoadingState rows={2} /> : failed ? <ErrorState onRetry={retry} /> : content;
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
                <section aria-labelledby="h-dash" className="glass-panel rounded-[1.5rem] p-5">
                    <h2 id="h-dash" className="eyebrow">
                        {t('home.charts')}
                    </h2>
                    {gate(
                        <div className="mt-4 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
                            <BarChart
                                title={t('home.chart.harvest')}
                                data={WEEKS.map((w, i) => ({ label: w, value: Number(t1(weekKg[i] ?? 0)) }))}
                                unit={t('unit.t')}
                            />
                            <div className="min-w-0 flex flex-col gap-4">
                                <h3 className="eyebrow">{t('home.chart.commitments')}</h3>
                                {board.length === 0 ? (
                                    <Note>{t('chart.noData')}</Note>
                                ) : (
                                    board.map((c) => (
                                        <ProgressBar
                                            key={c.id}
                                            title={c.id}
                                            value={c.filled}
                                            max={c.tonnes}
                                            unit={t('unit.t')}
                                        />
                                    ))
                                )}
                            </div>
                            <StatusDistribution title={t('home.chart.hauls')} segments={statusSegments} />
                        </div>
                    )}
                </section>
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
                                    <span className="text-[14px] font-bold whitespace-nowrap">
                                        {t1(f.driedKg)} {t('unit.t')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        {harvests.length > 8 && <Note>{t('home.more', { n: harvests.length - 8 })}</Note>}
                    </Panel>
                    <div className="flex flex-col gap-4">
                        <Panel id="h-hauls" title={t('home.hauls')} href="/haul" cta={t('home.openHaul')}>
                            {gate(
                                !haul ? (
                                    <Note>{t('home.noHaulRequests')}</Note>
                                ) : waiting ? (
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <span className="text-[16px] font-extrabold tabular">
                                            {haul.id} · {t('unit.lot')} {haul.lot} · {haul.sacks} {t('unit.sacks')} ·{' '}
                                            {haul.pickup}
                                        </span>
                                        <StatusChip status={hStatus} />
                                    </div>
                                ) : (
                                    <p className="m-0 text-[15px] font-bold flex items-center gap-2">
                                        <Icon name="CircleCheck" size={20} />
                                        {t('home.noHauls', { id: haul.id })} <StatusChip status={hStatus} />
                                    </p>
                                )
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
                            {gate(
                                orders === 0 ? (
                                    <Note>{t('home.noOrders')}</Note>
                                ) : (
                                    <ul className="flex flex-col gap-2" aria-live="polite">
                                        {riceOrders.map((o) => (
                                            <li
                                                key={o.id}
                                                className="flex flex-wrap items-center justify-between gap-2 tabular"
                                            >
                                                <ZLink
                                                    href="/buyer/orders"
                                                    className="text-[15px] font-bold text-[var(--text-accent)] underline underline-offset-4 min-h-[40px] inline-flex items-center"
                                                >
                                                    {o.id} · {t('buyer.type.' + o.type)} · {o.sacks} {t('unit.sacks')} ·{' '}
                                                    {o.week} · {peso(o.total)}
                                                </ZLink>
                                                <StatusChip status="requested" />
                                            </li>
                                        ))}
                                        {commitments.map((c) => (
                                            <li
                                                key={c.id}
                                                className="flex flex-wrap items-center justify-between gap-2 tabular"
                                            >
                                                <ZLink
                                                    href="/buyer/orders"
                                                    className="text-[15px] font-bold text-[var(--text-accent)] underline underline-offset-4 min-h-[40px] inline-flex items-center"
                                                >
                                                    {c.id} · {t('buyer.type.miller')} · {c.tonnes} {t('unit.t')} ·{' '}
                                                    {c.window.join('-')}
                                                </ZLink>
                                                <StatusChip status="matched" />
                                            </li>
                                        ))}
                                    </ul>
                                )
                            )}
                        </Panel>
                        <Panel id="h-sms" title={t('home.replies')} href="/sms" cta={t('home.openSms')}>
                            {gate(
                                <div aria-live="polite" className="flex flex-wrap items-center gap-2">
                                    <span className="text-[15px] font-bold">
                                        {lastReply
                                            ? t('home.lastReply', { farm: lastReply.farm, text: lastReply.text })
                                            : t('home.noReplies')}
                                    </span>
                                    <StatusChip
                                        status={
                                            slot === 'confirmed'
                                                ? 'paid'
                                                : slot === 'move-requested'
                                                  ? 'pending'
                                                  : 'open'
                                        }
                                        label={t('slot.' + slot, { id: SLOT.id })}
                                    />
                                </div>
                            )}
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
