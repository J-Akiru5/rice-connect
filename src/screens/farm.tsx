'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { EmptyState, FarmProfileCard, Icon, SearchField, StatusChip, useI18n } from '@/components/riceconnect';
import { ModuleShell } from './shell';
import { FARMS, TOTALS, KG_PER_SACK, lotOfFarm, farmById, type Farm } from '@/data/seed';

export type FarmState = 'default' | 'empty' | 'error' | 'success';

function FarmRow({ farm }: { farm: Farm }) {
    const { t } = useI18n();
    return (
        <li>
            <Link href={`/farm/${farm.id}`} aria-label={t('farm.open', { id: farm.id })}
                className="flex items-center gap-3 min-h-[64px] px-4 py-3 border-b border-[color:var(--glass-border-strong)] last:border-0 hover:bg-[rgba(5,150,105,.06)]">
                <span className="min-w-0 flex-1">
                    <span className="block text-[16px] leading-6 font-extrabold tabular">{farm.id} · {farm.areaHa.toFixed(1)} ha</span>
                    <span className="block text-[14px] leading-5 font-semibold text-[var(--text-secondary)] truncate">{farm.barangay}</span>
                </span>
                <StatusChip status={farm.status} />
                <Icon name="ChevronRight" size={24} className="shrink-0 text-[var(--text-muted)]" />
            </Link>
        </li>
    );
}

/** /farm — the cluster's 100 farms (phone). */
export function FarmListScreen({ state = 'default' }: { state?: FarmState }) {
    const { t } = useI18n();
    const [q, setQ] = useState('');
    const list = useMemo(() => {
        const s = q.trim().toLowerCase();
        return s ? FARMS.filter((f) => [f.id, f.barangay, f.variety, f.name].some((x) => x.toLowerCase().includes(s))) : FARMS;
    }, [q]);
    return (
        <ModuleShell title="farm.title" active="farms">
            {state === 'empty' ? (
                <EmptyState variant="empty" title="state.farm.empty.title" body="state.farm.empty.body" />
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <h2 className="eyebrow">{t('farm.list')}</h2>
                            <span className="text-[14px] font-bold tabular">{t('farm.summary', { n: TOTALS.farms, ha: (TOTALS.areaTenths / 10).toFixed(1) })}</span>
                        </div>
                        <SearchField label={t('farm.search')} value={q} onChange={(e) => setQ(e.target.value)} />
                    </div>
                    {list.length === 0 ? (
                        <EmptyState variant="empty" title="empty.results" />
                    ) : (
                        <ul className="glass-panel rounded-[1.5rem] overflow-hidden">{list.map((f) => <FarmRow key={f.id} farm={f} />)}</ul>
                    )}
                </div>
            )}
        </ModuleShell>
    );
}

/** /farm/[id] — one farm, one registered farmer (phone). */
export function FarmProfileScreen({ id, state = 'default', added: forcedAdded }: { id: string; state?: FarmState; added?: boolean }) {
    const { t } = useI18n();
    const router = useRouter();
    const farm = farmById(id)!;
    const lot = lotOfFarm(farm.id);
    const [ownAdded, setAdded] = useState(farm.status === 'cluster');
    const added = forcedAdded ?? ownAdded;
    const [view, setView] = useState<FarmState>(state);
    const next = FARMS[(FARMS.indexOf(farm) + 1) % FARMS.length];
    if (view === 'error') {
        return (
            <ModuleShell title="farm.title" active="farms">
                <EmptyState variant="error" title="state.farm.error.title" body="state.farm.error.body" action="error.retry" onAction={() => setView('default')} />
            </ModuleShell>
        );
    }
    if (view === 'success') {
        return (
            <ModuleShell title="farm.title" active="farms">
                <EmptyState variant="success" title="state.farm.success.title" body={t('state.farm.success.body', { farm: farm.id })} action="state.farm.success.action" onAction={() => router.push(`/farm/${next.id}`)} />
            </ModuleShell>
        );
    }
    return (
        <ModuleShell title="farm.title" active="farms">
            <div className="flex flex-col gap-4">
                <Link href="/farm" className="self-start inline-flex items-center gap-1 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]">
                    <Icon name="ChevronLeft" size={24} />{t('farm.back')}
                </Link>
                <FarmProfileCard farm={farm} added={added} onAdd={farm.status === 'cluster' ? undefined : () => setAdded(true)} />
                <section className="glass-panel rounded-[1.5rem] p-5" aria-labelledby="harvest-h">
                    <h3 id="harvest-h" className="eyebrow">{t('farm.harvest')}</h3>
                    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 tabular">
                        <div><dt className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{t('farm.harvest')}</dt><dd className="text-[16px] font-bold">{t('farm.harvestLine', { week: farm.harvestWeek, date: farm.harvestLabel })}</dd></div>
                        <div><dt className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{t('farm.lot')}</dt><dd className="text-[16px] font-bold">{lot.id}</dd></div>
                        <div className="col-span-2"><dt className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">{t('farm.forecast')}</dt><dd className="text-[16px] font-bold">{farm.driedKg.toLocaleString('en-US')} kg · {Math.ceil(farm.driedKg / KG_PER_SACK)} {t('unit.sacks')}</dd></div>
                    </dl>
                    <Link href="/plan" className="mt-4 inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[2rem] border-2 border-[color:var(--text-accent)] text-[var(--text-accent)] text-[13px] font-extrabold uppercase tracking-[0.08em]">
                        <Icon name="Plan" size={24} /><span>{t('farm.viewPlan')}</span>
                    </Link>
                </section>
            </div>
        </ModuleShell>
    );
}
