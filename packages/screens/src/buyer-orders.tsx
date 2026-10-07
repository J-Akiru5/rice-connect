'use client';
import { useState } from 'react';
import type { LocalCommitment } from '@rc/store';
import { useDemoState, updateDemoState } from '@rc/store/react';
import { ZLink } from '@rc/ui';
import {
    AppShell,
    CommitmentCard,
    EmptyState,
    ErrorState,
    Icon,
    InputError,
    LoadingState,
    PrimaryButton,
    SecondaryButton,
    StatusChip,
    TabPanel,
    Tabs,
    useI18n,
    useToast
} from '@rc/ui';
import { useCancelOrder, useCreateCommitment, useCreateOrder, useMyCommitments, useOrders } from '@rc/data';
import { isLive } from '@rc/ui/mode';
import {
    COMMITMENTS,
    DRYER,
    HAUL,
    HERO_FARM,
    HERO_LOT,
    MATCHES,
    SLIP,
    SLOT,
    WEEKS,
    farmById,
    lotById
} from '@rc/domain/seed';
import {
    MILLING,
    HERO_RICE_LOT,
    RICE_AVAILABLE_KG,
    UNCOMMITTED_LOTS,
    buysPalay,
    type BuyerType
} from '@rc/domain/buyers';
import { autoMatch } from '@rc/domain/match';
import { isWeek, type Week } from '@rc/domain/schemas';
import { peso } from '@rc/domain/money';
import { BuyerTypePicker } from './buyer-type';
import { SectionPill, Note, ResponsiveTable } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
const fieldCls =
    'min-h-[48px] px-4 rounded-[2rem] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] font-bold text-[17px] w-full tabular';
const labelCls = 'block text-[14px] leading-5 font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2';

/* Orders and commitments live in the demo store (@rc/store): this browser only, synced across tabs. */

/** order → (milled lot → miller) → palay lot → farm → haul → dryer → farmer paid. Glass list, icon + words. */
export function TraceChain({ head, rice }: { head: string; rice: boolean }) {
    const { t } = useI18n();
    const steps: { icon: string; text: string; href?: string }[] = [
        { icon: 'Orders', text: head },
        ...(rice
            ? [
                  {
                      icon: 'Warehouse',
                      text: t('trace.milled', {
                          id: HERO_RICE_LOT.id,
                          kg: HERO_RICE_LOT.kg.toLocaleString('en-US'),
                          miller: MILLING.partnerMiller
                      })
                  }
              ]
            : []),
        {
            icon: 'Sack',
            text: t('trace.palay', {
                id: HERO_LOT.id,
                kg: HERO_LOT.driedKg.toLocaleString('en-US'),
                grade: HERO_LOT.grade,
                mc: HERO_LOT.mc
            })
        },
        {
            icon: 'Farm',
            text: t('trace.farm', { id: HERO_FARM.id, barangay: HERO_FARM.barangay, date: HERO_FARM.harvestLabel }),
            href: `/farm/${HERO_FARM.id}`
        },
        {
            icon: 'Truck',
            text: t('trace.haul', { id: HAUL.id, plate: HAUL.driver?.plate ?? '', km: HAUL.km.toFixed(1) }),
            href: '/haul'
        },
        { icon: 'Dry', text: t('trace.dryer', { id: SLOT.id, day: SLOT.day }) + ` · ${DRYER.name}`, href: '/dry' },
        {
            icon: 'Pay',
            text: t('trace.paid', { advance: peso(SLIP.advance), slip: SLIP.id }),
            href: `/pay/${HERO_LOT.id}`
        }
    ];
    return (
        <section id="trace" aria-label={t('trace.title')} className="panel-solid rounded-[1.5rem] p-6">
            <h3 className="eyebrow !text-[14px]">{t('trace.title')}</h3>
            <ol className="mt-3 flex flex-col gap-0">
                {steps.map((s, i) => (
                    <li key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                        {i < steps.length - 1 && (
                            <span
                                aria-hidden
                                className="absolute left-[21px] top-11 bottom-0 w-0.5 bg-[var(--text-muted)]"
                            />
                        )}
                        <span className="relative z-10 shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[var(--fill-strong)] text-[var(--on-fill-strong)]">
                            <Icon name={s.icon} size={20} />
                        </span>
                        <span className="pt-2.5 text-[16px] leading-6 font-bold tabular break-words">
                            {s.href ? (
                                <ZLink href={s.href} className="text-[var(--text-accent)] underline underline-offset-4">
                                    {s.text}
                                </ZLink>
                            ) : (
                                s.text
                            )}
                        </span>
                    </li>
                ))}
            </ol>
            <Note className="mt-4 !text-[16px] !leading-6">{t('trace.note', { lot: HERO_LOT.id })}</Note>
        </section>
    );
}

function RiceOrders({ type }: { type: BuyerType }) {
    const { t } = useI18n();
    const toast = useToast();
    const ordersQuery = useOrders({ size: 100 });
    const createOrder = useCreateOrder();
    const cancelOrder = useCancelOrder();
    const [step, setStep] = useState<'compose' | 'review'>('compose');
    const [sacks, setSacks] = useState(4);
    const [week, setWeek] = useState<Week>('W3');
    const [error, setError] = useState('');
    const all = ordersQuery.data?.rows ?? [];
    const mine = all.filter((o) => o.type === type);
    const used = all.reduce((s, o) => s + o.kg, 0);
    const available = Math.max(0, RICE_AVAILABLE_KG - used);
    const maxSacks = Math.max(1, Math.floor(available / MILLING.sackKg));
    const kg = sacks * MILLING.sackKg;
    const total = kg * MILLING.price;
    const totalLine = t('orders.total', {
        kg: kg.toLocaleString('en-US'),
        total: peso(total),
        price: peso(MILLING.price)
    });
    const setCount = (next: number) => {
        setError('');
        setSacks(Math.min(maxSacks, Math.max(1, next)));
    };
    const place = async () => {
        if (kg > available) {
            setError(t('orders.err.available', { kg: available.toLocaleString('en-US') }));
            return;
        }
        try {
            const order = await createOrder.mutateAsync({ type, sacks, week });
            setStep('compose');
            setSacks(4);
            setError('');
            toast.show(t('orders.placed', { id: order.id }), {
                label: t('action.undo'),
                onClick: () => {
                    void cancelOrder.mutateAsync({ id: order.id }).then(() => toast.show(t('orders.cancelled')));
                }
            });
        } catch {
            setError(t('orders.err.available', { kg: available.toLocaleString('en-US') }));
        }
    };
    const clear = () => {
        for (const o of mine) void cancelOrder.mutateAsync({ id: o.id });
    };
    if (ordersQuery.isPending) return <LoadingState rows={3} />;
    if (ordersQuery.isError) return <ErrorState onRetry={() => void ordersQuery.refetch()} />;
    const stepButton =
        'inline-flex items-center justify-center min-h-[48px] min-w-[48px] rounded-full border-2 border-[color:var(--text-muted)] text-[var(--ink)]';
    return (
        <div className="cq-two">
            <div className="flex flex-col gap-4">
                <section aria-labelledby="ro-new" className="panel-solid rounded-[1.5rem] p-6 flex flex-col gap-4">
                    <h2 id="ro-new" className="eyebrow !text-[14px]">
                        {step === 'review' ? t('orders.summary') : t('orders.new.rice')}
                    </h2>
                    {step === 'compose' ? (
                        <>
                            <div className="flex flex-col gap-2">
                                <span className={labelCls}>{t('orders.sacks', { kg: MILLING.sackKg })}</span>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                        type="button"
                                        aria-label={t('orders.less')}
                                        onClick={() => setCount(sacks - 1)}
                                        disabled={sacks <= 1}
                                        className={stepButton}
                                    >
                                        <Icon name="Minus" size={20} />
                                    </button>
                                    <span className="text-[28px] leading-9 font-extrabold tabular min-w-[3ch] text-center">
                                        {sacks}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label={t('orders.more')}
                                        onClick={() => setCount(sacks + 1)}
                                        disabled={sacks >= maxSacks}
                                        className={stepButton}
                                    >
                                        <Icon name="Plus" size={20} />
                                    </button>
                                    <span className="text-[16px] font-bold text-[var(--text-secondary)]">
                                        {t('unit.sacks')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={labelCls}>{t('orders.week')}</span>
                                <Tabs
                                    value={week}
                                    onValueChange={(v) => {
                                        if (isWeek(v)) setWeek(v);
                                    }}
                                    label={t('orders.week')}
                                    items={WEEKS.map((w) => ({ value: w, label: w }))}
                                >
                                    {WEEKS.map((w) => (
                                        <TabPanel key={w} value={w} className="sr-only">
                                            {w}
                                        </TabPanel>
                                    ))}
                                </Tabs>
                            </div>
                            <p className="m-0 text-[17px] leading-7 font-extrabold tabular">{totalLine}</p>
                            <p className="m-0 text-[16px] leading-6 font-semibold text-[var(--text-secondary)] tabular">
                                {t('orders.available', { kg: available.toLocaleString('en-US') })}
                            </p>
                            <InputError message={error} />
                            <PrimaryButton icon="ArrowRight" onClick={() => setStep('review')} className="self-start">
                                {t('orders.review')}
                            </PrimaryButton>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 tabular">
                                <div className="flex justify-between gap-3 text-[16px] font-bold">
                                    <span>{t('orders.week')}</span>
                                    <span>{week}</span>
                                </div>
                                <div className="flex justify-between gap-3 text-[16px] font-bold">
                                    <span>{t('buyer.type.' + type)}</span>
                                    <span>
                                        {sacks} {t('unit.sacks')}
                                    </span>
                                </div>
                                <p className="m-0 mt-1 text-[20px] leading-7 font-extrabold">{totalLine}</p>
                            </div>
                            <InputError message={error} />
                            <div className="flex flex-wrap gap-2">
                                <SecondaryButton icon="ChevronLeft" onClick={() => setStep('compose')}>
                                    {t('orders.back')}
                                </SecondaryButton>
                                <PrimaryButton
                                    icon="Check"
                                    disabled={createOrder.isPending}
                                    onClick={() => void place()}
                                >
                                    {createOrder.isPending ? t('orders.placing') : t('orders.place')}
                                </PrimaryButton>
                            </div>
                        </>
                    )}
                </section>
                <section aria-labelledby="ro-mine" className="flex flex-col gap-3">
                    <div>
                        <SectionPill id="ro-mine">{t('orders.mine')}</SectionPill>
                    </div>
                    {mine.length === 0 ? (
                        <EmptyState variant="empty" title="orders.none" body="orders.none.body" />
                    ) : (
                        <>
                            <ul className="flex flex-col gap-3">
                                {mine.map((o) => (
                                    <li
                                        key={o.id}
                                        className="panel-solid rounded-[1.5rem] p-5 flex flex-wrap items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="text-[17px] font-extrabold">
                                                {o.id} · {t('buyer.type.' + o.type)}
                                            </div>
                                            <div className="text-[16px] font-bold tabular break-words">
                                                {t('orders.line', {
                                                    sacks: o.sacks,
                                                    kg: o.kg.toLocaleString('en-US'),
                                                    week: o.week,
                                                    total: peso(o.total)
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <StatusChip status="requested" />
                                            <ZLink
                                                href="#trace"
                                                className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                                            >
                                                <Icon name="Search" size={20} />
                                                <span>{t('trace.title')}</span>
                                            </ZLink>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <SecondaryButton icon="X" onClick={clear} className="self-start">
                                {t('orders.clear')}
                            </SecondaryButton>
                        </>
                    )}
                </section>
            </div>
            {!isLive && (
                <TraceChain head={mine[0] ? t('trace.order', { id: mine[0].id }) : t('orders.new.rice')} rice />
            )}
        </div>
    );
}

function PalayCommitments() {
    const { t } = useI18n();
    const [tonnes, setTonnes] = useState('10');
    const [price, setPrice] = useState('');
    const [from, setFrom] = useState('W3');
    const [to, setTo] = useState('W4');
    const [error, setError] = useState('');
    /* Demo keeps the local store's auto-matched record; live reads and posts through the repositories. */
    const demoMine = useDemoState().commitments;
    const mineQuery = useMyCommitments();
    const createCommitment = useCreateCommitment();
    const mine: LocalCommitment[] = isLive ? (mineQuery.data ?? []) : demoMine;
    const c01 = COMMITMENTS.find((c) => c.id === 'C-01')!;
    const m01 = MATCHES.find((m) => m.commitment === 'C-01')!;
    if (isLive && mineQuery.isPending) return <LoadingState rows={3} />;
    if (isLive && mineQuery.isError) return <ErrorState onRetry={() => void mineQuery.refetch()} />;
    const post = () => {
        const tn = Number(tonnes);
        const pc = Math.round(Number(price) * 100);
        const i = WEEKS.indexOf(from as (typeof WEEKS)[number]),
            j = WEEKS.indexOf(to as (typeof WEEKS)[number]);
        if (!(tn > 0)) return setError(t('orders.err.tonnes'));
        if (!(pc > 0)) return setError(t('orders.err.price'));
        if (i > j) return setError(t('orders.err.window'));
        const window = WEEKS.slice(i, j + 1) as string[];
        if (isLive) {
            void createCommitment
                .mutateAsync({ tonnes: tn, price: pc, window: window as Week[] })
                .then(() => setError(''))
                .catch(() => setError(t('orders.err.post')));
            return;
        }
        const taken = new Set(mine.flatMap((c) => c.lots));
        const pool = UNCOMMITTED_LOTS.filter((l) => !taken.has(l.id)).map((l) => ({
            id: l.id,
            week: l.week,
            dayIndex: l.dayIndex,
            driedKg: l.driedKg,
            grade: l.grade,
            mcPct: l.mcPct
        }));
        const id = `C-${String(COMMITMENTS.length + mine.length + 1).padStart(2, '0')}`;
        const [r] = autoMatch([{ id, tonnes: tn, grade: HERO_LOT.grade, mcPct: HERO_LOT.mcPct, window }], pool);
        if (!r) throw new Error('auto-match returned no result for the new commitment');
        updateDemoState((st) => ({
            ...st,
            commitments: [{ id, tonnes: tn, price: pc, window, kg: r.kg, lots: r.lots }, ...st.commitments]
        }));
        setError('');
    };
    const clear = () => updateDemoState((st) => ({ ...st, commitments: [] }));
    return (
        <div className="cq-two">
            <div className="flex flex-col gap-4">
                <section aria-labelledby="pc-new" className="panel-solid rounded-[1.5rem] p-6 flex flex-col gap-4">
                    <h2 id="pc-new" className="eyebrow !text-[14px]">
                        {t('orders.new.palay')}
                    </h2>
                    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr))]">
                        <label>
                            <span className={labelCls}>{t('orders.tonnes')}</span>
                            <input
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.1"
                                value={tonnes}
                                onChange={(e) => setTonnes(e.target.value)}
                                className={fieldCls}
                            />
                        </label>
                        <label>
                            <span className={labelCls}>{t('orders.price')}</span>
                            <input
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={fieldCls}
                            />
                        </label>
                        <label>
                            <span className={labelCls}>{t('orders.from')}</span>
                            <select value={from} onChange={(e) => setFrom(e.target.value)} className={fieldCls}>
                                {WEEKS.map((w) => (
                                    <option key={w}>{w}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span className={labelCls}>{t('orders.to')}</span>
                            <select value={to} onChange={(e) => setTo(e.target.value)} className={fieldCls}>
                                {WEEKS.map((w) => (
                                    <option key={w}>{w}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <p className="m-0 text-[16px] leading-6 font-semibold text-[var(--text-secondary)] max-w-[70ch]">
                        {t('orders.gradeFixed')}
                    </p>
                    <InputError message={error} />
                    <PrimaryButton icon="Check" onClick={post} className="self-start">
                        {t('orders.post')}
                    </PrimaryButton>
                </section>
                <section aria-labelledby="pc-mine" className="flex flex-col gap-3">
                    <div>
                        <SectionPill id="pc-mine">{t('orders.mine')}</SectionPill>
                    </div>
                    {/* The standing C-01 commitment and its matched lots are the demo fixture. */}
                    {!isLive && <Note className="!text-[16px] !leading-6">{t('orders.c01')}</Note>}
                    {!isLive && <CommitmentCard c={c01} highlight className="panel-solid" />}
                    {mine.map((c) => (
                        <div key={c.id} className="flex flex-col gap-2">
                            <CommitmentCard
                                className="panel-solid"
                                c={{
                                    id: c.id,
                                    buyer: t('orders.you'),
                                    tonnes: c.tonnes,
                                    grade: HERO_LOT.grade,
                                    mc: HERO_LOT.mc,
                                    price: c.price,
                                    week:
                                        c.window.length > 1
                                            ? `${c.window[0] ?? ''}-${c.window[c.window.length - 1] ?? ''}`
                                            : (c.window[0] ?? ''),
                                    filled: Math.round(c.kg / 100) / 10,
                                    status: c.kg >= c.tonnes * 1000 ? 'full' : 'open'
                                }}
                            />
                            <Note className="px-2 !text-[16px] !leading-6">
                                {t('orders.matched', { kg: t1(c.kg), n: c.lots.length })}
                            </Note>
                        </div>
                    ))}
                    {mine.length > 0 && (
                        <SecondaryButton icon="X" onClick={clear} className="self-start">
                            {t('orders.clear')}
                        </SecondaryButton>
                    )}
                    {!isLive && (
                        <ResponsiveTable
                            surface="solid"
                            caption={c01.id}
                            rows={m01.lots.map((id) => lotById(id)!)}
                            rowKey={(l) => l.id}
                            highlight={(l) => l.id === HERO_LOT.id}
                            cols={[
                                { key: 'lot', label: t('pay.col.lot'), cell: (l) => l.id },
                                { key: 'farm', label: t('pay.col.farm'), cell: (l) => l.farm },
                                { key: 'b', label: t('farm.barangay'), cell: (l) => farmById(l.farm)!.barangay },
                                {
                                    key: 'h',
                                    label: t('pay.col.harvest'),
                                    cell: (l) => `${l.week} · ${farmById(l.farm)!.harvestLabel}`
                                },
                                {
                                    key: 'kg',
                                    label: t('pay.col.kg'),
                                    align: 'right',
                                    nowrap: true,
                                    cell: (l) => `${l.driedKg.toLocaleString('en-US')} kg`
                                }
                            ]}
                        />
                    )}
                </section>
            </div>
            {!isLive && (
                <TraceChain head={t('trace.commitment', { id: c01.id }) + ` · ${peso(c01.price)}/kg`} rice={false} />
            )}
        </div>
    );
}

/** /buyer/orders — rice buyers order milled rice; millers post palay commitments that auto-match (derived, not in canvas). */
export function BuyerOrdersScreen({ type, onType }: { type: BuyerType; onType: (t: BuyerType) => void }) {
    return (
        <AppShell role="buyer" title="orders.title" eyebrow="orders.eyebrow" active="myorders">
            <div className="flex flex-col gap-6">
                <BuyerTypePicker value={type} onChange={onType} />
                {buysPalay(type) ? <PalayCommitments /> : <RiceOrders key={type} type={type} />}
            </div>
        </AppShell>
    );
}
