'use client';
import {
    AppShell,
    BigStat,
    ErrorState,
    Icon,
    LoadingState,
    RankedBars,
    SectionHead,
    StatusChip,
    TrendBars,
    ZLink,
    useI18n,
    type ChartTone,
    type Point,
    type Segment
} from '@rc/ui';
import overrides from '@rc/domain/overrides.json';
import { BARANGAYS, HAUL, HERO_LOT, SETTLEMENT, SLIP, SLOT, WEEKS } from '@rc/domain/seed';
import { dayLabel, isoOf } from '@rc/domain/calendar';
import { peso } from '@rc/domain/money';
import { useFarms, useHaulStatus, useMyCommitments, useOrders, useSmsReplies, useSlotStatus } from '@rc/data';
import { Note } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
/* Three barangays, three tones: the same key runs through every chart on the panel. */
const TONES: ChartTone[] = ['brand', 'accent', 'gold'];
const TODAY = overrides.demoTodayDayIndex; // assumed (docs/NUMBERS.md)
const WEEK = Math.floor(TODAY / 7);

/** One panel of the attention stack: a heading, its content, and the way to the screen that owns it. */
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
        <section aria-labelledby={id} className="glass-panel rounded-[1.75rem] p-5 md:p-6 flex flex-col gap-3 min-w-0">
            <h2 id={id} className="m-0 text-[19px] leading-7 font-extrabold tracking-[-0.01em]">
                {title}
            </h2>
            <span className="rule-ink block h-px w-full border-0 border-t" aria-hidden />
            {children}
            {href && cta && (
                <ZLink
                    href={href}
                    className="self-start inline-flex items-center gap-2 min-h-[44px] text-[15px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                >
                    {cta}
                    <Icon name="ArrowRight" size={20} />
                </ZLink>
            )}
        </section>
    );
}

/** Coordinator Home (derived, not in canvas): what needs attention this week, today first. Live: buyer orders
    and farmer replies made in other apps (other tabs, same origin) appear here through the data hooks.
    Layout: the four counters, then this week's landing read day by day and barangay by barangay, then the
    attention stack. Every figure comes from the same farm profiles the list below shows. */
export function CoordinatorHomeScreen() {
    const { t } = useI18n();
    const haul = useHaulStatus(HAUL.id);
    const slotQuery = useSlotStatus(SLOT.id);
    const ordersQuery = useOrders({ size: 50 });
    const commitmentsQuery = useMyCommitments();
    const repliesQuery = useSmsReplies();
    /* Gate 3: harvests come from the repositories (mock in demo, Supabase in live). */
    const farmsQuery = useFarms({ size: 100 });
    const harvests = (farmsQuery.data?.rows ?? [])
        .filter((f) => f.harvestDay >= WEEK * 7 && f.harvestDay < WEEK * 7 + 7)
        .sort((a, b) => a.harvestDay - b.harvestDay || a.id.localeCompare(b.id));
    const hStatus = haul.data ?? 'assigned';
    const waiting = hStatus === 'assigned' || hStatus === 'requested';
    const slot = slotQuery.data ?? 'scheduled';
    const riceOrders = ordersQuery.data?.rows ?? [];
    const commitments = commitmentsQuery.data ?? [];
    const orders = riceOrders.length + commitments.length;
    const replies = repliesQuery.data ?? [];
    const lastReply = replies[replies.length - 1];
    const live = [haul, slotQuery, ordersQuery, commitmentsQuery, repliesQuery, farmsQuery];
    const loading = live.some((q) => q.isPending);
    const failed = live.some((q) => q.isError);
    const retry = () => live.forEach((q) => void q.refetch());
    const gate = (content: React.ReactNode) =>
        loading ? <LoadingState rows={2} /> : failed ? <ErrorState onRetry={retry} /> : content;
    const weekLabel = WEEKS[WEEK] ?? WEEKS[0];
    const totalKg = harvests.reduce((a, f) => a + f.driedKg, 0);

    const unit = t('unit.t');
    /* Each barangay keeps one colour across the whole week-at-a-glance panel: the daily stack, the
       ranking beside it and the season total all use the same key. */
    const byBarangay: (Point & { tone: ChartTone })[] = BARANGAYS.map((b) => ({
        key: b,
        label: b,
        value: Number(t1(harvests.filter((f) => f.barangay === b).reduce((a, f) => a + f.driedKg, 0)))
    }))
        .sort((a, b) => b.value - a.value)
        .map((p, i) => ({ ...p, tone: TONES[i % TONES.length] ?? 'brand' }));
    const toneOf = new Map(byBarangay.map((p) => [p.key, p.tone]));
    /* This week, day by day: the columns are labelled with the date, so a glance matches the calendar,
       and each one is stacked by barangay. The printed total is the sum of that day's own stack. */
    const days: Point[] = Array.from({ length: 7 }, (_, i) => {
        const day = WEEK * 7 + i;
        const parts: Segment[] = BARANGAYS.map((b) => ({
            key: b,
            label: b,
            value: Number(
                t1(harvests.filter((f) => f.harvestDay === day && f.barangay === b).reduce((a, f) => a + f.driedKg, 0))
            ),
            tone: toneOf.get(b) ?? 'brand'
        }));
        return {
            key: String(day),
            label: String(Number(isoOf(day).slice(8, 10))),
            value: Number(parts.reduce((s, p) => s + p.value, 0).toFixed(1)),
            parts
        };
    });
    const heaviest = days.reduce<Point>((a, b) => (b.value > a.value ? b : a), { key: 'none', label: '—', value: -1 });
    const weekTotal = Number(days.reduce((s, p) => s + p.value, 0).toFixed(1));
    const rankList = byBarangay.map((p) => `${p.label} ${p.value.toFixed(1)} ${unit}`).join('; ');

    return (
        <AppShell
            title="home.title"
            eyebrow={t('home.eyebrow', { week: weekLabel, date: dayLabel(TODAY) })}
            active="home"
        >
            <div className="flex flex-col gap-8">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(230px,100%),1fr))]">
                    <BigStat
                        size="xl"
                        label="home.stat.harvests"
                        value={harvests.length}
                        icon="Wheat"
                        note={t('home.note.harvests', { t: t1(totalKg) })}
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

                <section
                    aria-labelledby="h-look"
                    className="panel-solid rounded-[1.75rem] p-5 md:p-7 flex flex-col gap-7"
                >
                    <SectionHead
                        id="h-look"
                        title={t('home.look.title')}
                        hint={t('home.analytics.note', { week: weekLabel })}
                    />
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
                        <TrendBars
                            title={t('home.trend.title')}
                            unit={unit}
                            points={days}
                            current={String(TODAY)}
                            tone="brand"
                            pct
                            summary={t('home.trend.summary', {
                                day: t('home.day', { d: heaviest.label }),
                                value: heaviest.value.toFixed(1),
                                pct: Math.round((heaviest.value / Math.max(1, weekTotal)) * 100),
                                unit
                            })}
                        />
                        <RankedBars
                            title={t('home.rank.title', { week: weekLabel })}
                            unit={t('unit.t')}
                            items={byBarangay}
                            tone="gold"
                            summary={t('home.rank.summary', { list: rankList })}
                        />
                    </div>
                </section>

                <div className="cq-two">
                    <Panel
                        id="h-harvest"
                        title={t('home.harvests', { week: weekLabel })}
                        href="/plan"
                        cta={t('farm.viewPlan')}
                    >
                        <ul className="flex flex-col">
                            {harvests.slice(0, 8).map((f) => (
                                <li
                                    key={f.id}
                                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 border-b border-[color:var(--glass-border-strong)] last:border-0 tabular"
                                >
                                    <ZLink
                                        href={`/farm/${f.id}`}
                                        className="font-extrabold text-[17px] text-[var(--text-accent)] underline underline-offset-4 min-h-[44px] inline-flex items-center"
                                    >
                                        {f.id}
                                    </ZLink>
                                    <span className="text-[16px] font-semibold break-words">
                                        {f.barangay} · {f.harvestLabel}
                                    </span>
                                    <span className="text-[16px] font-extrabold whitespace-nowrap">
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
                                waiting ? (
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <span className="text-[17px] font-extrabold tabular">
                                            {HAUL.id} · {t('unit.lot')} {HAUL.lot} · {HAUL.sacks} {t('unit.sacks')} ·{' '}
                                            {HAUL.pickup}
                                        </span>
                                        <StatusChip status={hStatus} />
                                    </div>
                                ) : (
                                    <p className="m-0 text-[16px] font-bold flex flex-wrap items-center gap-2">
                                        <Icon name="CircleCheck" size={20} />
                                        {t('home.noHauls', { id: HAUL.id })} <StatusChip status={hStatus} />
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
                            <p className="m-0 text-[17px] font-extrabold tabular">
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
                                    <ul className="flex flex-col gap-3" aria-live="polite">
                                        {riceOrders.map((o) => (
                                            <li
                                                key={o.id}
                                                className="flex flex-wrap items-center justify-between gap-2 tabular"
                                            >
                                                <ZLink
                                                    href="/buyer/orders"
                                                    className="text-[16px] font-bold text-[var(--text-accent)] underline underline-offset-4 min-h-[44px] inline-flex items-center"
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
                                                    className="text-[16px] font-bold text-[var(--text-accent)] underline underline-offset-4 min-h-[44px] inline-flex items-center"
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
                                    <span className="text-[16px] font-bold">
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
                <p className="rc-lede">{t('home.simNote')}</p>
            </div>
        </AppShell>
    );
}
