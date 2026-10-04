'use client';
import { useState } from 'react';
import type { LocalCommitment } from '@rc/store';
import { useDemoState, updateDemoState } from '@rc/store/react';
import { ZLink, useZoneNav } from '@rc/ui';
import { AppShell, CommitmentCard, EmptyState, Icon, InputError, PrimaryButton, SecondaryButton, StatusChip, useI18n } from '@rc/ui';
import { COMMITMENTS, DRYER, HAUL, HERO_FARM, HERO_LOT, MATCHES, SLIP, SLOT, WEEKS, farmById, lotById } from '@rc/domain/seed';
import { MILLING, HERO_RICE_LOT, RICE_AVAILABLE_KG, UNCOMMITTED_LOTS, buysPalay, makeRiceOrder, type BuyerType, type RiceOrder } from '@rc/domain/buyers';
import { autoMatch } from '@rc/domain/match';
import { peso } from '@rc/domain/money';
import { BuyerTypePicker } from './buyer-type';
import { SectionPill, Note, ResponsiveTable } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
const fieldCls = 'min-h-[44px] px-4 rounded-[2rem] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] font-bold text-[16px] w-full tabular';
const labelCls = 'block text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5';

/* Orders and commitments live in the demo store (@rc/store): this browser only, synced across tabs. */

/** order → (milled lot → miller) → palay lot → farm → haul → dryer → farmer paid. Glass list, icon + words. */
export function TraceChain({ head, rice }: { head: string; rice: boolean }) {
    const { t } = useI18n();
    const steps: { icon: string; text: string; href?: string }[] = [
        { icon: 'Orders', text: head },
        ...(rice ? [{ icon: 'Warehouse', text: t('trace.milled', { id: HERO_RICE_LOT.id, kg: HERO_RICE_LOT.kg.toLocaleString('en-US'), miller: MILLING.partnerMiller }) }] : []),
        { icon: 'Sack', text: t('trace.palay', { id: HERO_LOT.id, kg: HERO_LOT.driedKg.toLocaleString('en-US'), grade: HERO_LOT.grade, mc: HERO_LOT.mc }) },
        { icon: 'Farm', text: t('trace.farm', { id: HERO_FARM.id, barangay: HERO_FARM.barangay, date: HERO_FARM.harvestLabel }), href: `/farm/${HERO_FARM.id}` },
        { icon: 'Truck', text: t('trace.haul', { id: HAUL.id, plate: HAUL.driver?.plate ?? '', km: HAUL.km.toFixed(1) }), href: '/haul' },
        { icon: 'Dry', text: t('trace.dryer', { id: SLOT.id, day: SLOT.day }) + ` · ${DRYER.name}`, href: '/dry' },
        { icon: 'Pay', text: t('trace.paid', { advance: peso(SLIP.advance), slip: SLIP.id }), href: `/pay/${HERO_LOT.id}` },
    ];
    return (
        <section aria-label={t('trace.title')} className="glass-panel rounded-[1.5rem] p-5">
            <h3 className="eyebrow">{t('trace.title')}</h3>
            <ol className="mt-3 flex flex-col gap-0">
                {steps.map((s, i) => (
                    <li key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                        {i < steps.length - 1 && <span aria-hidden className="absolute left-[21px] top-11 bottom-0 w-0.5 bg-[var(--text-muted)]" />}
                        <span className="relative z-10 shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[var(--fill-strong)] text-[var(--on-fill-strong)]"><Icon name={s.icon} size={20} /></span>
                        <span className="pt-2.5 text-[15px] leading-6 font-bold tabular break-words">
                            {s.href ? <ZLink href={s.href} className="text-[var(--text-accent)] underline underline-offset-4">{s.text}</ZLink> : s.text}
                        </span>
                    </li>
                ))}
            </ol>
            <Note className="mt-3">{t('trace.note', { lot: HERO_LOT.id })}</Note>
        </section>
    );
}

function RiceOrders({ type }: { type: BuyerType }) {
    const { t } = useI18n();
    const [sacks, setSacks] = useState('4');
    const [week, setWeek] = useState('W3');
    const [error, setError] = useState('');
    const orders: RiceOrder[] = useDemoState().riceOrders;
    const mine = orders.filter((o) => o.type === type);
    const used = orders.reduce((s, o) => s + o.kg, 0);
    const available = Math.max(0, RICE_AVAILABLE_KG - used);
    const n = Number(sacks);
    const kg = Number.isInteger(n) && n > 0 ? n * MILLING.sackKg : 0;
    const place = () => {
        if (!Number.isInteger(n) || n < 1) return setError(t('orders.err.sacks'));
        if (kg > available) return setError(t('orders.err.available', { kg: available.toLocaleString('en-US') }));
        const o = makeRiceOrder(type, n, week, orders.length + 1, available);
        updateDemoState((st) => ({ ...st, riceOrders: [o, ...st.riceOrders] }));
        setError('');
    };
    const clear = () => updateDemoState((st) => ({ ...st, riceOrders: st.riceOrders.filter((o) => o.type !== type) }));
    return (
        <div className="cq-two">
            <div className="flex flex-col gap-4">
                <section aria-labelledby="ro-new" className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-4">
                    <h2 id="ro-new" className="eyebrow">{t('orders.new.rice')}</h2>
                    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))]">
                        <label><span className={labelCls}>{t('orders.sacks', { kg: MILLING.sackKg })}</span>
                            <input type="number" inputMode="numeric" min={1} step={1} value={sacks} onChange={(e) => setSacks(e.target.value)} className={fieldCls} aria-invalid={!!error} /></label>
                        <label><span className={labelCls}>{t('orders.week')}</span>
                            <select value={week} onChange={(e) => setWeek(e.target.value)} className={fieldCls}>{WEEKS.map((w) => <option key={w}>{w}</option>)}</select></label>
                    </div>
                    <p className="m-0 text-[16px] font-extrabold tabular">{t('orders.total', { kg: kg.toLocaleString('en-US'), total: peso(kg * MILLING.price), price: peso(MILLING.price) })}</p>
                    <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)] tabular">{t('orders.available', { kg: available.toLocaleString('en-US') })}</p>
                    <InputError message={error} />
                    <PrimaryButton icon="Check" onClick={place} className="self-start">{t('orders.place')}</PrimaryButton>
                </section>
                <section aria-labelledby="ro-mine" className="flex flex-col gap-3">
                    <div><SectionPill id="ro-mine">{t('orders.mine')}</SectionPill></div>
                    {mine.length === 0 ? <EmptyState variant="empty" title="orders.none" body="orders.none.body" /> : (
                        <>
                            <ul className="flex flex-col gap-3">
                                {mine.map((o) => (
                                    <li key={o.id} className="glass-panel rounded-[1.5rem] p-4 flex flex-wrap items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-[16px] font-extrabold">{o.id} · {t('buyer.type.' + o.type)}</div>
                                            <div className="text-[15px] font-bold tabular break-words">{t('orders.line', { sacks: o.sacks, kg: o.kg.toLocaleString('en-US'), week: o.week, total: peso(o.total) })}</div>
                                        </div>
                                        <StatusChip status="requested" />
                                    </li>
                                ))}
                            </ul>
                            <SecondaryButton icon="X" onClick={clear} className="self-start">{t('orders.clear')}</SecondaryButton>
                        </>
                    )}
                </section>
            </div>
            <TraceChain head={mine[0] ? t('trace.order', { id: mine[0].id }) : t('orders.new.rice')} rice />
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
    const mine: LocalCommitment[] = useDemoState().commitments;
    const c01 = COMMITMENTS.find((c) => c.id === 'C-01')!;
    const m01 = MATCHES.find((m) => m.commitment === 'C-01')!;
    const post = () => {
        const tn = Number(tonnes);
        const pc = Math.round(Number(price) * 100);
        const i = WEEKS.indexOf(from as (typeof WEEKS)[number]), j = WEEKS.indexOf(to as (typeof WEEKS)[number]);
        if (!(tn > 0)) return setError(t('orders.err.tonnes'));
        if (!(pc > 0)) return setError(t('orders.err.price'));
        if (i > j) return setError(t('orders.err.window'));
        const window = WEEKS.slice(i, j + 1) as string[];
        const taken = new Set(mine.flatMap((c) => c.lots));
        const pool = UNCOMMITTED_LOTS.filter((l) => !taken.has(l.id)).map((l) => ({ id: l.id, week: l.week, dayIndex: l.dayIndex, driedKg: l.driedKg, grade: l.grade, mcPct: l.mcPct }));
        const id = `C-${String(COMMITMENTS.length + mine.length + 1).padStart(2, '0')}`;
        const [r] = autoMatch([{ id, tonnes: tn, grade: HERO_LOT.grade, mcPct: HERO_LOT.mcPct, window }], pool);
        updateDemoState((st) => ({ ...st, commitments: [{ id, tonnes: tn, price: pc, window, kg: r.kg, lots: r.lots }, ...st.commitments] }));
        setError('');
    };
    const clear = () => updateDemoState((st) => ({ ...st, commitments: [] }));
    return (
        <div className="cq-two">
            <div className="flex flex-col gap-4">
                <section aria-labelledby="pc-new" className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-4">
                    <h2 id="pc-new" className="eyebrow">{t('orders.new.palay')}</h2>
                    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr))]">
                        <label><span className={labelCls}>{t('orders.tonnes')}</span><input type="number" inputMode="decimal" min={0} step="0.1" value={tonnes} onChange={(e) => setTonnes(e.target.value)} className={fieldCls} /></label>
                        <label><span className={labelCls}>{t('orders.price')}</span><input type="number" inputMode="decimal" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldCls} /></label>
                        <label><span className={labelCls}>{t('orders.from')}</span><select value={from} onChange={(e) => setFrom(e.target.value)} className={fieldCls}>{WEEKS.map((w) => <option key={w}>{w}</option>)}</select></label>
                        <label><span className={labelCls}>{t('orders.to')}</span><select value={to} onChange={(e) => setTo(e.target.value)} className={fieldCls}>{WEEKS.map((w) => <option key={w}>{w}</option>)}</select></label>
                    </div>
                    <p className="m-0 text-[14px] font-semibold text-[var(--text-secondary)]">{t('orders.gradeFixed')}</p>
                    <InputError message={error} />
                    <PrimaryButton icon="Check" onClick={post} className="self-start">{t('orders.post')}</PrimaryButton>
                </section>
                <section aria-labelledby="pc-mine" className="flex flex-col gap-3">
                    <div><SectionPill id="pc-mine">{t('orders.mine')}</SectionPill></div>
                    <Note>{t('orders.c01')}</Note>
                    <CommitmentCard c={c01} highlight />
                    {mine.map((c) => (
                        <div key={c.id} className="flex flex-col gap-2">
                            <CommitmentCard c={{ id: c.id, buyer: t('orders.you'), tonnes: c.tonnes, grade: HERO_LOT.grade, mc: HERO_LOT.mc, price: c.price, week: c.window.length > 1 ? `${c.window[0]}-${c.window[c.window.length - 1]}` : c.window[0], filled: Math.round(c.kg / 100) / 10, status: c.kg >= c.tonnes * 1000 ? 'full' : 'open' }} />
                            <Note className="px-2">{t('orders.matched', { kg: t1(c.kg), n: c.lots.length })}</Note>
                        </div>
                    ))}
                    {mine.length > 0 && <SecondaryButton icon="X" onClick={clear} className="self-start">{t('orders.clear')}</SecondaryButton>}
                    <ResponsiveTable caption={c01.id} rows={m01.lots.map((id) => lotById(id)!)} rowKey={(l) => l.id} highlight={(l) => l.id === HERO_LOT.id} cols={[
                        { key: 'lot', label: t('pay.col.lot'), cell: (l) => l.id },
                        { key: 'farm', label: t('pay.col.farm'), cell: (l) => l.farm },
                        { key: 'b', label: t('farm.barangay'), cell: (l) => farmById(l.farm)!.barangay },
                        { key: 'h', label: t('pay.col.harvest'), cell: (l) => `${l.week} · ${farmById(l.farm)!.harvestLabel}` },
                        { key: 'kg', label: t('pay.col.kg'), align: 'right', nowrap: true, cell: (l) => `${l.driedKg.toLocaleString('en-US')} kg` },
                    ]} />
                </section>
            </div>
            <TraceChain head={t('trace.commitment', { id: c01.id }) + ` · ${peso(c01.price)}/kg`} rice={false} />
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
