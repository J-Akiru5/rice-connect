'use client';
import type { ReactNode } from 'react';
import { AppShell, BigStat, CommitmentCard, EmptyState, ErrorState, LoadingState, useI18n } from '@rc/ui';
import { useCommitments } from '@rc/data';
import { commitmentOfLot } from '@rc/domain/seed';
import { peso } from '@rc/domain/money';
import { SectionPill, Note } from './ui';
import { useMyFarm } from './my-farm';

/** One summary row: a translated label over a value. Values carry their unit; nothing is truncated. */
function Del({ k, children }: { k: string; children: ReactNode }) {
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

/** /farmer/price â€” the commitment's grade, moisture and price beside the lot's rice variety. */
export function FarmerPriceScreen() {
    const { t } = useI18n();
    /* Gate 3: the farmer's own farm and lot come from the repositories (mock in demo, Supabase in live);
       the lot→commitment link is still the seed match (M48), so live shows the empty state until it lands. */
    const mine = useMyFarm();
    const commitmentsQuery = useCommitments({ size: 500 });
    const commitments = commitmentsQuery.data?.rows ?? [];
    const farm = mine.farm;
    const lot = mine.lot;
    const contractId = lot ? commitmentOfLot(lot.id) : undefined;
    const c = commitments.find((x) => x.id === contractId);

    const loading = commitmentsQuery.isPending || mine.isPending;
    const failed = commitmentsQuery.isError || mine.isError;
    const retry = () => {
        void commitmentsQuery.refetch();
        mine.retry();
    };
    if (loading)
        return (
            <AppShell role="farmer" title="price.title" active="price">
                <LoadingState rows={3} />
            </AppShell>
        );
    if (failed)
        return (
            <AppShell role="farmer" title="price.title" active="price">
                <ErrorState onRetry={retry} />
            </AppShell>
        );
    if (!lot || !farm)
        return (
            <AppShell role="farmer" title="price.title" active="price">
                <EmptyState variant="empty" title="plan.noFarm.title" body="plan.noFarm.body" />
            </AppShell>
        );
    if (!c)
        return (
            <AppShell role="farmer" title="price.title" active="price">
                <EmptyState title="price.empty.title" body="price.empty.body" />
            </AppShell>
        );

    return (
        <AppShell
            role="farmer"
            title="price.title"
            active="price"
            eyebrow={t('price.eyebrow', { lot: lot.id, id: c.id })}
        >
            <div className="flex flex-wrap gap-6 items-start max-w-[1600px]">
                <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-3">
                    <SectionPill id="pr-c">{t('price.contract')}</SectionPill>
                    <CommitmentCard c={c} />
                    {c.assumed.length > 0 && (
                        <Note className="px-2 flex items-center gap-1.5">{t('market.assumed', { id: c.id })}</Note>
                    )}
                </div>
                <div className="flex-[999_1_360px] min-w-0 flex flex-col gap-3">
                    <SectionPill id="pr-v">{t('price.variety')}</SectionPill>
                    <BigStat label="price.variety.label" value={farm.variety} icon="Wheat" />
                    <div className="glass-panel rounded-[1.5rem] p-5">
                        <dl className="grid gap-x-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                            <Del k="market.group.grade">{c.grade}</Del>
                            <Del k="price.mc">{c.mc}</Del>
                            <Del k="price.week">{c.week}</Del>
                            <Del k="market.group.volume">{`${c.tonnes.toFixed(1)} ${t('unit.t')}`}</Del>
                            <Del k="price.rate">{`${peso(c.price)}${t('unit.perKg')}`}</Del>
                        </dl>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
