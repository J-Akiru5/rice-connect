'use client';
import { useMemo } from 'react';
import { ZLink } from '@rc/ui';
import { AppShell, BigStat, ErrorState, Icon, LoadingState, useI18n } from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { useCommitments, useFarms, useLots } from '@rc/data';
import { BARANGAYS, WEEKS } from '@rc/domain/seed';
import { MILLING, RICE_AVAILABLE_KG, UNCOMMITTED_LOTS, buysPalay, milledKg, type BuyerType } from '@rc/domain/buyers';
import { peso } from '@rc/domain/money';
import dynamic from 'next/dynamic';
const SupplyMap = dynamic(() => import('./supply-map').then((m) => m.SupplyMap), {
    ssr: false,
    loading: () => <div className="glass-panel rounded-[1.5rem] h-[384px] md:h-[444px]" aria-hidden />
});
import { BuyerTypePicker } from './buyer-type';
import { SectionPill, Note, ResponsiveTable } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);

/** /buyer — what the cluster can supply, for the chosen buyer type (derived, not in canvas). */
export function BuyerSupplyScreen({
    type,
    onType,
    week,
    onWeek
}: {
    type: BuyerType;
    onType: (t: BuyerType) => void;
    week: number;
    onWeek: (w: number) => void;
}) {
    const { t } = useI18n();
    const palay = buysPalay(type);
    /* Gate 3: the supply forecast aggregates repository farms and lots (mock in demo, Supabase in live). */
    const farmsQuery = useFarms({ size: 500 });
    const lotsQuery = useLots({ size: 500 });
    const commitmentsQuery = useCommitments({ size: 200 });
    const farms = useMemo(() => farmsQuery.data?.rows ?? [], [farmsQuery.data]);
    const lots = useMemo(() => lotsQuery.data?.rows ?? [], [lotsQuery.data]);
    const commitments = useMemo(() => commitmentsQuery.data?.rows ?? [], [commitmentsQuery.data]);
    const supply = useMemo(
        () =>
            BARANGAYS.map((b) => {
                const inBarangay = farms.filter((f) => f.barangay === b);
                const palayWeeks = WEEKS.map((w) =>
                    inBarangay.filter((f) => f.harvestWeek === w).reduce((s, f) => s + f.driedKg, 0)
                );
                return {
                    barangay: b,
                    farms: inBarangay.length,
                    palay: palayWeeks,
                    rice: palayWeeks.map(milledKg)
                };
            }),
        [farms]
    );
    /* Live has no lot→commitment link yet, so every repository lot counts as open. */
    const openLots = isLive ? lots : UNCOMMITTED_LOTS;
    const openKg = openLots.reduce((s, l) => s + l.driedKg, 0);
    const supplyWeekTotal = WEEKS.map((_, i) => supply.reduce((s, r) => s + (r.palay[i] ?? 0), 0));
    /* The milling model is assumed (overrides.json); live mills the palay the cluster has committed. */
    const committedKg = commitments.reduce((s, c) => s + c.tonnes * 1000, 0);
    const riceAvailableKg = isLive && committedKg > 0 ? milledKg(committedKg) : RICE_AVAILABLE_KG;
    const partnerName = isLive && commitments[0] ? commitments[0].buyer : MILLING.partnerMiller;
    const loading = farmsQuery.isPending || lotsQuery.isPending || commitmentsQuery.isPending;
    const failed = farmsQuery.isError || lotsQuery.isError || commitmentsQuery.isError;
    const retry = () => {
        void farmsQuery.refetch();
        void lotsQuery.refetch();
        void commitmentsQuery.refetch();
    };
    if (loading)
        return (
            <AppShell role="buyer" title="supply.title" eyebrow="supply.eyebrow" active="supply">
                <LoadingState rows={3} />
            </AppShell>
        );
    if (failed)
        return (
            <AppShell role="buyer" title="supply.title" eyebrow="supply.eyebrow" active="supply">
                <ErrorState onRetry={retry} />
            </AppShell>
        );
    const rows = supply.map((r) => ({ ...r, v: palay ? r.palay : r.rice }));
    const unit = 't';
    return (
        <AppShell role="buyer" title="supply.title" eyebrow="supply.eyebrow" active="supply">
            <div className="flex flex-col gap-6">
                <BuyerTypePicker value={type} onChange={onType} />
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
                    {palay ? (
                        <>
                            <BigStat
                                label="supply.stat.palay"
                                value={t1(supplyWeekTotal.reduce((a, b) => a + b, 0))}
                                unit="t"
                                icon="Wheat"
                                note={t('supply.note.palay', {
                                    n: supply.reduce((s, r) => s + r.farms, 0),
                                    w: WEEKS.length
                                })}
                            />
                            <BigStat
                                label="supply.stat.open"
                                value={t1(openKg)}
                                unit="t"
                                icon="Sack"
                                note={t('supply.note.palay', { n: openLots.length, w: WEEKS.length })}
                            />
                        </>
                    ) : (
                        <>
                            <BigStat
                                label="supply.stat.rice"
                                value={t1(riceAvailableKg)}
                                unit="t"
                                icon="Sack"
                                note={t('supply.note.rice', {
                                    miller: partnerName,
                                    pct: MILLING.recoveryPct
                                })}
                            />
                            <BigStat
                                label="supply.stat.price"
                                value={peso(MILLING.price)}
                                unit="/kg"
                                icon="Pay"
                                note={t('supply.note.price', { sack: MILLING.sackKg })}
                            />
                        </>
                    )}
                </div>
                <section aria-labelledby="sup-map" className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <SectionPill id="sup-map">{t('supply.map', { week: WEEKS[week] ?? WEEKS[0] })}</SectionPill>
                        <div
                            role="radiogroup"
                            aria-label={t('dry.weeks')}
                            className="mb-3 inline-flex p-1 rounded-full glass-panel !shadow-none"
                        >
                            {WEEKS.map((w, i) => (
                                <button
                                    key={w}
                                    type="button"
                                    role="radio"
                                    aria-checked={week === i}
                                    onClick={() => onWeek(i)}
                                    className={`min-w-[44px] min-h-[44px] px-3 rounded-full text-[13px] font-extrabold tracking-[0.06em] ${week === i ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)]'}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="cq-two">
                        <SupplyMap
                            values={rows.map((r) => Number(t1(r.v[week] ?? 0)))}
                            unit={unit}
                            label={t('supply.map', { week: WEEKS[week] ?? WEEKS[0] })}
                        />
                        <div className="flex flex-col gap-3">
                            <ResponsiveTable
                                caption={t('supply.table')}
                                rows={rows}
                                rowKey={(r) => r.barangay}
                                cols={[
                                    { key: 'b', label: t('farm.barangay'), cell: (r) => r.barangay },
                                    ...WEEKS.map((w, i) => ({
                                        key: w,
                                        label: w,
                                        align: 'right' as const,
                                        nowrap: true,
                                        cell: (r: (typeof rows)[number]) => (
                                            <span
                                                className={
                                                    i === week ? 'underline decoration-[3px] underline-offset-4' : ''
                                                }
                                            >
                                                {t1(r.v[i] ?? 0)} {t('unit.t')}
                                            </span>
                                        )
                                    }))
                                ]}
                            />
                            <Note>{t(palay ? 'buyer.buys.palay' : 'buyer.buys.rice')}.</Note>
                            <ZLink href={`/buyer/orders?type=${type}`} className="btn-2026 self-start">
                                <Icon name={palay ? 'Plus' : 'Sack'} size={20} />
                                <span>{t(palay ? 'supply.cta.palay' : 'supply.cta.rice')}</span>
                            </ZLink>
                        </div>
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
