'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell, BigStat, EmptyState, Icon, Pagination, PrimaryButton, SettlementSlip, SmsThread, StatusChip, useI18n, ASSETS } from '@/components/riceconnect';
import { paginate } from '@/lib/list';
import { staticListState, type ListState } from './list-state';
import { COMMITMENTS, DRYER, HAUL, HERO_FARM, HERO_LOT, MATCHES, SETTLEMENT, SLIP, SLOT, farmById, lotById } from '@/data/seed';
import { settle } from '@/data/settlement';
import { peso, rate } from '@/data/money';
import { SectionPill, Note, ResponsiveTable, type Col } from './ui';

/** /pay — lots matched to commitments; only the weighed lot (L-03) settles (desktop; stacked cards when narrow). Paginated. */
export function PayListScreen({ state = 'default', list }: { state?: 'default' | 'empty'; list?: ListState }) {
    const { t } = useI18n();
    const router = useRouter();
    const L = list ?? staticListState('/pay');
    const rows = MATCHES.flatMap((m) => m.lots.map((id) => ({ lot: lotById(id)!, commitment: m.commitment })))
        .sort((a, b) => Number(b.lot.actual) - Number(a.lot.actual) || a.lot.dayIndex - b.lot.dayIndex || a.lot.id.localeCompare(b.lot.id));
    const pg = paginate(rows, L.page, L.size);
    type Row = (typeof rows)[number];
    const cols: Col<Row>[] = [
        { key: 'lot', label: t('pay.col.lot'), cell: ({ lot }) => lot.actual
            ? <Link href={`/pay/${lot.id}`} aria-label={t('pay.open', { lot: lot.id })} className="inline-flex items-center gap-1 min-h-[40px] text-[var(--text-accent)] underline underline-offset-4">{lot.id}<Icon name="ChevronRight" size={20} /></Link>
            : lot.id },
        { key: 'farm', label: t('pay.col.farm'), cell: ({ lot }) => lot.farm },
        { key: 'commitment', label: t('pay.col.commitment'), cell: (r) => r.commitment },
        { key: 'harvest', label: t('pay.col.harvest'), cell: ({ lot }) => { const f = farmById(lot.farm)!; return `${f.harvestWeek} · ${f.harvestLabel}`; } },
        { key: 'kg', label: t('pay.col.kg'), align: 'right', nowrap: true, cell: ({ lot }) => `${lot.driedKg.toLocaleString('en-US')} kg` },
        { key: 'net', label: t('pay.col.net'), align: 'right', nowrap: true, cell: ({ lot }) => peso(settle(lot.driedKg).net) },
        { key: 'status', label: t('pay.col.status'), cell: ({ lot }) => lot.actual ? <StatusChip status="paid" label="pay.badge.paid" /> : <StatusChip status="pending" label="pay.estimate" /> },
    ];
    return (
        <AppShell title="pay.title" eyebrow="pay.eyebrow" active="pay">
            {state === 'empty' ? (
                <EmptyState variant="empty" title="state.pay.empty.title" body="state.pay.empty.body" action="state.pay.empty.action" onAction={() => router.push('/dry')} className="max-w-[640px]" />
            ) : (
                <section aria-labelledby="pay-list" className="flex flex-col gap-3">
                    <div><SectionPill id="pay-list">{t('pay.list.title')}</SectionPill></div>
                    <ResponsiveTable caption={t('pay.list.title')} cols={cols} rows={pg.rows} rowKey={(r) => r.lot.id} highlight={(r) => r.lot.actual} />
                    <Pagination total={pg.total} page={pg.page} pageSize={pg.size} hrefFor={L.pageHref} onSizeChange={(n) => L.set({ size: n })} />
                    <Note>{t('pay.list.note')}</Note>
                </section>
            )}
        </AppShell>
    );
}

function Rec({ k, children }: { k: string; children: React.ReactNode }) {
    const { t } = useI18n();
    return (
        <div className="min-w-0 py-2 border-b border-[color:var(--glass-border-strong)]">
            <dt className="text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{t(k)}</dt>
            <dd className="mt-0.5 text-[15px] leading-6 font-bold tabular break-words">{children}</dd>
        </div>
    );
}

/** /pay/[lotId] — lot record, settlement, the advance SMS and the A6 slip with its print view (desktop). */
export function PayLotScreen({ state = 'default' }: { state?: 'default' | 'error' | 'success' }) {
    const { t } = useI18n();
    const [view, setView] = useState(state);
    const c = COMMITMENTS.find((x) => x.id === MATCHES.find((m) => m.lots.includes(HERO_LOT.id))!.commitment)!;
    const s = SETTLEMENT;
    const shell = (body: React.ReactNode) => <AppShell title="pay.title" eyebrow={t('pay.eyebrow.lot', { lot: HERO_LOT.id })} active="pay">{body}</AppShell>;
    if (view === 'error') return shell(<EmptyState variant="error" title="state.pay.error.title" body="state.pay.error.body" action="error.retry" onAction={() => setView('default')} className="max-w-[640px]" />);
    if (view === 'success') return shell(<EmptyState variant="success" title={t('state.pay.success.title', { advance: peso(s.advance) })} body={t('state.pay.success.body', { farm: HERO_FARM.id, balance: peso(s.balance) })} className="max-w-[640px]" />);
    return shell(
        <div className="flex flex-wrap gap-6 items-start max-w-[1600px]">
            <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-4 print:hidden">
                <div className="flex flex-wrap items-center gap-3">
                    <Link href="/pay" className="inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"><Icon name="ChevronLeft" size={20} />{t('pay.back')}</Link>
                </div>
                <SectionPill>{t('pay.section.lot', { lot: HERO_LOT.id, farm: HERO_FARM.id })}</SectionPill>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                    <BigStat label="pay.stat.net" value={peso(s.net)} size="md" icon="Pay" note={t('pay.note.net', { kg: s.kg.toLocaleString('en-US'), net: peso(s.rates.net) })} />
                    <BigStat label="pay.stat.advance" value={peso(s.advance)} size="md" icon="Advance" note="pay.note.advance" />
                    <BigStat label="pay.stat.balance" value={peso(s.balance)} size="md" icon="Clock" note="pay.note.balance" />
                </div>
                <div className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        <StatusChip status="delivered" label={t('pay.badge.delivered', { haul: HAUL.id })} />
                        <StatusChip status="paid" label="pay.badge.paid" />
                        <StatusChip status="pending" label="pay.badge.pending" />
                    </div>
                    <p className="m-0 text-[15px] leading-[22px] font-semibold">{t('pay.explain', { quoted: peso(s.rates.quoted), drying: rate(s.rates.drying), margin: rate(s.rates.margin), net: peso(s.rates.net), rate: peso(s.rates.buyerFee), fee: peso(s.buyerFee) })}</p>
                    <div className="flex flex-wrap gap-3">
                        <PrimaryButton icon="Print" onClick={() => window.print()}>{t('slip.print')}</PrimaryButton>
                        <Link href="/sms" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-[2rem] font-extrabold uppercase text-[13px] leading-4 tracking-[0.08em] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]"><Icon name="Sms" size={20} /><span>{t('pay.viewSms')}</span></Link>
                    </div>
                </div>
                <section aria-labelledby="pay-rec" className="glass-panel rounded-[1.5rem] p-5">
                    <h3 id="pay-rec" className="eyebrow">{t('pay.record')}</h3>
                    <dl className="mt-1 grid gap-x-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                        <Rec k="pay.rec.farm">{HERO_FARM.id} · {HERO_FARM.barangay}</Rec>
                        <Rec k="pay.rec.harvest">{HERO_FARM.harvestWeek} · {HERO_FARM.harvestLabel}</Rec>
                        <Rec k="pay.rec.weight">{HERO_LOT.driedKg.toLocaleString('en-US')} kg · {HERO_LOT.sacks} {t('unit.sacks')}</Rec>
                        <Rec k="pay.rec.quality">{HERO_LOT.grade} · {HERO_LOT.mc}</Rec>
                        <Rec k="pay.rec.buyer">{c.id} · {c.buyer}</Rec>
                        <Rec k="pay.rec.haul">{HAUL.id} · {HAUL.driver?.name} · {HAUL.driver?.plate}</Rec>
                        <Rec k="pay.rec.slot">{SLOT.id} · {DRYER.name} · {SLOT.day}</Rec>
                        <Rec k="pay.rec.slip">{SLIP.id} · {SLIP.date}</Rec>
                    </dl>
                </section>
                <section aria-labelledby="pay-sms">
                    <SectionPill id="pay-sms">{t('sms.title')}</SectionPill>
                    <SmsThread only="advance" />
                </section>
            </div>
            <section className="flex-[1_1_420px] min-w-0" aria-labelledby="pay-slip">
                <div className="print:hidden"><SectionPill id="pay-slip">{t('pay.section.slip')}</SectionPill></div>
                <div className="slip-stage bg-[var(--gray-300)] rounded-2xl p-6 flex justify-center overflow-x-auto">
                    <div className="shadow-[var(--shadow-popover)] print:shadow-none">
                        <SettlementSlip slip={SLIP} farmer={HERO_FARM.name} logoSrc={ASSETS.logoMono} className="print-slip" />
                    </div>
                </div>
            </section>
        </div>,
    );
}
