'use client';
import { useMemo, useState } from 'react';
import {
    AlertDialog,
    AppShell,
    ASSETS,
    BigStat,
    EmptyState,
    ErrorState,
    Icon,
    LoadingState,
    Pagination,
    PrimaryButton,
    SecondaryButton,
    SettlementSlip,
    SmsThread,
    StatusChip,
    useI18n,
    useToast,
    ZLink,
    useZoneNav
} from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { useFarm, useHaul, useLot, useLots, useMarkPaid, useSettlement, useSettlementPaid, useSlots } from '@rc/data';
import { paginate } from '@rc/domain/list';
import { staticListState, type ListState } from './list-state';
import { COMMITMENTS, HERO_LOT, commitmentOfLot, farmById } from '@rc/domain/seed';
import { settle } from '@rc/domain/settlement';
import { peso, rate } from '@rc/domain/money';
import { SectionPill, Note, ResponsiveTable, type Col } from './ui';

/** Repository errors carry a typed code; the screens treat `not_found` as the not-found state. */
const codeOf = (error: unknown) =>
    error && typeof error === 'object' && 'code' in error ? String((error as { code?: unknown }).code) : '';

/** /pay — lots matched to commitments; only the weighed lot (L-03) settles (desktop; stacked cards when narrow). Paginated. */
export function PayListScreen({ state = 'default', list }: { state?: 'default' | 'empty'; list?: ListState }) {
    const { t } = useI18n();
    const nav = useZoneNav();
    const L = list ?? staticListState('/pay');
    /* Gate 3: the lots come from the repositories (mock in demo, Supabase in live). */
    const lotsQuery = useLots({ size: 500 });
    /* Demo keeps the seed's matched-lots story; live has no lot→commitment link yet, so every repository lot shows. */
    const rows = useMemo(
        () =>
            (lotsQuery.data?.rows ?? [])
                .filter((lot) => isLive || commitmentOfLot(lot.id))
                .map((lot) => ({ lot, commitment: commitmentOfLot(lot.id) }))
                .sort(
                    (a, b) =>
                        Number(b.lot.actual) - Number(a.lot.actual) ||
                        a.lot.dayIndex - b.lot.dayIndex ||
                        a.lot.id.localeCompare(b.lot.id)
                ),
        [lotsQuery.data]
    );
    const pg = paginate(rows, L.page, L.size);
    type Row = (typeof rows)[number];
    const cols: Col<Row>[] = [
        {
            key: 'lot',
            label: t('pay.col.lot'),
            cell: ({ lot }) =>
                lot.actual ? (
                    <ZLink
                        href={`/pay/${lot.id}`}
                        aria-label={t('pay.open', { lot: lot.id })}
                        className="inline-flex items-center gap-1 min-h-[40px] text-[var(--text-accent)] underline underline-offset-4"
                    >
                        {lot.id}
                        <Icon name="ChevronRight" size={20} />
                    </ZLink>
                ) : (
                    lot.id
                )
        },
        { key: 'farm', label: t('pay.col.farm'), cell: ({ lot }) => lot.farm },
        { key: 'commitment', label: t('pay.col.commitment'), cell: (r) => r.commitment ?? '—' },
        {
            key: 'harvest',
            label: t('pay.col.harvest'),
            cell: ({ lot }) => {
                const f = farmById(lot.farm);
                return f ? `${f.harvestWeek} · ${f.harvestLabel}` : lot.week;
            }
        },
        {
            key: 'kg',
            label: t('pay.col.kg'),
            align: 'right',
            nowrap: true,
            cell: ({ lot }) => `${lot.driedKg.toLocaleString('en-US')} kg`
        },
        {
            key: 'net',
            label: t('pay.col.net'),
            align: 'right',
            nowrap: true,
            cell: ({ lot }) => peso(settle(lot.driedKg).net)
        },
        {
            key: 'status',
            label: t('pay.col.status'),
            cell: ({ lot }) =>
                lot.actual ? (
                    <StatusChip status="paid" label="pay.badge.paid" />
                ) : (
                    <StatusChip status="pending" label="pay.estimate" />
                )
        }
    ];
    return (
        <AppShell title="pay.title" eyebrow="pay.eyebrow" active="pay">
            {state === 'empty' ? (
                <EmptyState
                    variant="empty"
                    title="state.pay.empty.title"
                    body="state.pay.empty.body"
                    action="state.pay.empty.action"
                    onAction={() => nav('/dry')}
                    className="max-w-[640px]"
                />
            ) : lotsQuery.isPending ? (
                <LoadingState rows={3} />
            ) : lotsQuery.isError ? (
                <ErrorState onRetry={() => void lotsQuery.refetch()} />
            ) : pg.total === 0 ? (
                <EmptyState
                    variant="empty"
                    title="state.pay.empty.title"
                    body="state.pay.empty.body"
                    action="state.pay.empty.action"
                    onAction={() => nav('/dry')}
                    className="max-w-[640px]"
                />
            ) : (
                <section aria-labelledby="pay-list" className="flex flex-col gap-3">
                    <div>
                        <SectionPill id="pay-list">{t('pay.list.title')}</SectionPill>
                    </div>
                    <ResponsiveTable
                        caption={t('pay.list.title')}
                        cols={cols}
                        rows={pg.rows}
                        rowKey={(r) => r.lot.id}
                        highlight={(r) => r.lot.actual}
                    />
                    <Pagination
                        total={pg.total}
                        page={pg.page}
                        pageSize={pg.size}
                        hrefFor={L.pageHref}
                        onSizeChange={(n) => L.set({ size: n })}
                    />
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
            <dt className="text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {t(k)}
            </dt>
            <dd className="mt-0.5 text-[15px] leading-6 font-bold tabular break-words">{children}</dd>
        </div>
    );
}

/** /pay/[lotId] — lot record, settlement, the advance SMS and the A6 slip with its print view (desktop). */
export function PayLotScreen({
    lotId = HERO_LOT.id,
    state = 'default'
}: {
    lotId?: string;
    state?: 'default' | 'error' | 'success';
}) {
    const { t } = useI18n();
    const toast = useToast();
    /* Gate 3: the record, the slip and the paid badge come from the repositories; the seed only fills display
       fields the database does not carry yet (the lot→commitment link), guarded below. */
    const lotQuery = useLot(lotId);
    const slipQuery = useSettlement(lotId);
    const paid = useSettlementPaid(lotId);
    const markPaid = useMarkPaid();
    const lot = lotQuery.data;
    const slip = slipQuery.data;
    /* The mapper uses H-0 / D-0 when a settlement has no haul or slot yet. */
    const haulQuery = useHaul(slip && slip.haul !== 'H-0' ? slip.haul : '');
    const farmQuery = useFarm(slip?.farm ?? '');
    const slotsQuery = useSlots({ size: 200 });
    const farm = farmQuery.data;
    const haul = haulQuery.data;
    const slot = slip ? slotsQuery.data?.rows.find((s) => s.id === slip.slot) : undefined;
    const commitmentId = commitmentOfLot(lotId);
    const c = commitmentId ? COMMITMENTS.find((x) => x.id === commitmentId) : undefined;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [view, setView] = useState(state);
    const loading = lotQuery.isPending || slipQuery.isPending || paid.isPending;
    const failed = lotQuery.isError || slipQuery.isError || paid.isError;
    const notFound = [lotQuery.error, slipQuery.error, paid.error].some((e) => codeOf(e) === 'not_found');
    const retry = () => {
        void lotQuery.refetch();
        void slipQuery.refetch();
        void paid.refetch();
    };
    const paidDate = paid.data
        ? new Date(paid.data).toLocaleDateString('en-PH', {
              timeZone: 'Asia/Manila',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
          })
        : null;
    const shell = (body: React.ReactNode) => (
        <AppShell title="pay.title" eyebrow={t('pay.eyebrow.lot', { lot: lotId })} active="pay">
            {body}
        </AppShell>
    );
    if (loading) return shell(<LoadingState rows={3} className="max-w-[640px]" />);
    if (failed || !slip)
        return shell(
            <ErrorState
                variant={notFound ? 'notFound' : 'error'}
                onRetry={notFound ? undefined : retry}
                className="max-w-[640px]"
            />
        );
    const s = settle(slip.kg);
    if (view === 'error')
        return shell(
            <EmptyState
                variant="error"
                title="state.pay.error.title"
                body="state.pay.error.body"
                action="error.retry"
                onAction={() => setView('default')}
                className="max-w-[640px]"
            />
        );
    if (view === 'success')
        return shell(
            <EmptyState
                variant="success"
                title={t('state.pay.success.title', { advance: peso(slip.advance) })}
                body={t('state.pay.success.body', {
                    farm: farm?.id ?? slip.farm,
                    balance: peso(slip.balance)
                })}
                className="max-w-[640px]"
            />
        );
    return shell(
        <div className="flex flex-wrap gap-6 items-start max-w-[1600px]">
            <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-4 print:hidden">
                <div className="flex flex-wrap items-center gap-3">
                    <ZLink
                        href="/pay"
                        className="inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                    >
                        <Icon name="ChevronLeft" size={20} />
                        {t('pay.back')}
                    </ZLink>
                </div>
                <SectionPill>{t('pay.section.lot', { lot: lotId, farm: slip.farm })}</SectionPill>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                    <BigStat
                        label="pay.stat.net"
                        value={peso(slip.net)}
                        size="md"
                        icon="Pay"
                        note={t('pay.note.net', { kg: slip.kg.toLocaleString('en-US'), net: peso(s.rates.net) })}
                    />
                    <BigStat
                        label="pay.stat.advance"
                        value={peso(slip.advance)}
                        size="md"
                        icon="Advance"
                        note="pay.note.advance"
                    />
                    <BigStat
                        label="pay.stat.balance"
                        value={peso(slip.balance)}
                        size="md"
                        icon="Clock"
                        note="pay.note.balance"
                    />
                </div>
                <div className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        <StatusChip status="delivered" label={t('pay.badge.delivered', { haul: slip.haul })} />
                        {paidDate ? (
                            <StatusChip status="paid" label={t('pay.paidOn', { date: paidDate })} />
                        ) : (
                            <StatusChip status="pending" label="pay.badge.pending" />
                        )}
                    </div>
                    <p className="m-0 text-[15px] leading-[22px] font-semibold">
                        {t('pay.explain', {
                            quoted: peso(s.rates.quoted),
                            drying: rate(s.rates.drying),
                            margin: rate(s.rates.margin),
                            net: peso(s.rates.net),
                            rate: peso(s.rates.buyerFee),
                            fee: peso(s.buyerFee)
                        })}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <SecondaryButton icon="Print" onClick={() => window.print()}>
                            {t('slip.print')}
                        </SecondaryButton>
                        <ZLink
                            href="/sms"
                            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-[2rem] font-extrabold uppercase text-[13px] leading-4 tracking-[0.08em] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]"
                        >
                            <Icon name="Sms" size={20} />
                            <span>{t('pay.viewSms')}</span>
                        </ZLink>
                        {!paidDate && (
                            <PrimaryButton icon="Pay" onClick={() => setConfirmOpen(true)}>
                                {t('pay.markPaid')}
                            </PrimaryButton>
                        )}
                    </div>
                    <AlertDialog
                        open={confirmOpen}
                        onOpenChange={setConfirmOpen}
                        title={t('pay.confirm.title')}
                        description={t('pay.confirm.body', {
                            amount: peso(slip.net),
                            farm: farm?.id ?? slip.farm,
                            lot: lotId
                        })}
                        confirmLabel={t('pay.markPaid')}
                        onConfirm={() => {
                            void markPaid
                                .mutateAsync({ lotId })
                                .then(() => toast.show(t('pay.paidToast', { lot: lotId })));
                        }}
                    />
                </div>
                <section aria-labelledby="pay-rec" className="glass-panel rounded-[1.5rem] p-5">
                    <h3 id="pay-rec" className="eyebrow">
                        {t('pay.record')}
                    </h3>
                    <dl className="mt-1 grid gap-x-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                        <Rec k="pay.rec.farm">{farm ? `${farm.id} · ${farm.barangay}` : slip.farm}</Rec>
                        <Rec k="pay.rec.harvest">{farm ? `${farm.harvestWeek} · ${farm.harvestLabel}` : '—'}</Rec>
                        <Rec k="pay.rec.weight">
                            {lot
                                ? `${lot.driedKg.toLocaleString('en-US')} ${t('unit.kg')} · ${lot.sacks} ${t('unit.sacks')}`
                                : '—'}
                        </Rec>
                        <Rec k="pay.rec.quality">{lot ? `${lot.grade} · ${lot.mc}` : '—'}</Rec>
                        <Rec k="pay.rec.buyer">{c ? `${c.id} · ${c.buyer}` : '—'}</Rec>
                        <Rec k="pay.rec.haul">
                            {haul
                                ? `${haul.id}${haul.driver ? ` · ${haul.driver.name} · ${haul.driver.plate}` : ''}`
                                : slip.haul}
                        </Rec>
                        <Rec k="pay.rec.slot">{slot ? `${slot.id} · ${slot.dryer} · ${slot.day}` : slip.slot}</Rec>
                        <Rec k="pay.rec.slip">{`${slip.id} · ${slip.date}`}</Rec>
                    </dl>
                </section>
                <section aria-labelledby="pay-sms">
                    <SectionPill id="pay-sms">{t('sms.title')}</SectionPill>
                    <SmsThread only="advance" />
                </section>
            </div>
            <section className="flex-[1_1_420px] min-w-0" aria-labelledby="pay-slip">
                <div className="print:hidden">
                    <SectionPill id="pay-slip">{t('pay.section.slip')}</SectionPill>
                </div>
                <div className="slip-stage bg-[var(--gray-300)] rounded-2xl p-6 flex justify-center overflow-x-auto">
                    <div className="shadow-[var(--shadow-popover)] print:shadow-none">
                        <SettlementSlip
                            slip={slip}
                            farmer={farm?.name ?? ''}
                            logoSrc={ASSETS.logoMono}
                            className="print-slip"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
