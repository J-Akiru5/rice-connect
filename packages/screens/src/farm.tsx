'use client';
import Link from 'next/link';
import { ZLink, useZoneNav } from '@rc/ui';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState, FarmProfileCard, Icon, Pagination, SearchField, StatusChip, useI18n } from '@rc/ui';
import { filterFarms, paginate, sortBy } from '@rc/domain/list';
import { staticListState, type ListState } from './list-state';
import { ModuleShell } from './shell';
import { useDemoState, updateDemoState } from '@rc/store/react';
import { addFarm } from '@rc/store';
import {
    BARANGAYS,
    FARMS,
    TOTALS,
    KG_PER_SACK,
    lotOfFarm,
    farmById,
    type Farm,
    type FarmStatus
} from '@rc/domain/seed';

export type FarmState = 'default' | 'empty' | 'error' | 'success';
const STATUSES: FarmStatus[] = ['registered', 'verified', 'cluster'];
const cap = 'text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]';
const selectCls =
    'min-h-[44px] px-4 rounded-[2rem] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] font-bold text-[16px] w-full';

/** Narrow container: one card per farm, linking to the full profile (as before; no ellipsis, text wraps). */
function FarmCard({ farm }: { farm: Farm }) {
    const { t } = useI18n();
    return (
        <li>
            <ZLink
                href={`/farm/${farm.id}`}
                aria-label={t('farm.open', { id: farm.id })}
                className="flex items-center gap-3 min-h-[64px] px-4 py-3 border-b border-[color:var(--glass-border-strong)] last:border-0 hover:bg-[rgba(5,150,105,.06)]"
            >
                <span className="min-w-0 flex-1">
                    <span className="block text-[16px] leading-6 font-extrabold tabular">
                        {farm.id} · {farm.areaHa.toFixed(1)} ha
                    </span>
                    <span className="block text-[14px] leading-5 font-semibold text-[var(--text-secondary)] break-words">
                        {farm.barangay}
                    </span>
                </span>
                <StatusChip status={farm.status} />
                <Icon name="ChevronRight" size={24} className="shrink-0 text-[var(--text-muted)]" />
            </ZLink>
        </li>
    );
}

/** Profile card + harvest panel; used by /farm/[id] and by the /farm detail panel. */
export function FarmDetail({
    farm,
    added,
    onAdd,
    wide = false
}: {
    farm: Farm;
    added: boolean;
    onAdd?: () => void;
    wide?: boolean;
}) {
    const { t } = useI18n();
    const lot = lotOfFarm(farm.id);
    return (
        <div className={wide ? 'cq-two' : 'flex flex-col gap-4'}>
            <FarmProfileCard farm={farm} added={added} onAdd={onAdd} />
            <section className="glass-panel rounded-[1.5rem] p-5" aria-labelledby={`harvest-${farm.id}`}>
                <h3 id={`harvest-${farm.id}`} className="eyebrow">
                    {t('farm.harvest')}
                </h3>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 tabular">
                    <div>
                        <dt className={cap}>{t('farm.harvest')}</dt>
                        <dd className="text-[16px] font-bold">
                            {t('farm.harvestLine', { week: farm.harvestWeek, date: farm.harvestLabel })}
                        </dd>
                    </div>
                    <div>
                        <dt className={cap}>{t('farm.lot')}</dt>
                        <dd className="text-[16px] font-bold">{lot.id}</dd>
                    </div>
                    <div className="col-span-2">
                        <dt className={cap}>{t('farm.forecast')}</dt>
                        <dd className="text-[16px] font-bold">
                            {farm.driedKg.toLocaleString('en-US')} kg · {Math.ceil(farm.driedKg / KG_PER_SACK)}{' '}
                            {t('unit.sacks')}
                        </dd>
                    </div>
                </dl>
                <ZLink
                    href="/plan"
                    className="mt-4 inline-flex items-center gap-2 min-h-[44px] px-4 rounded-[2rem] border-2 border-[color:var(--text-accent)] text-[var(--text-accent)] text-[13px] font-extrabold uppercase tracking-[0.08em]"
                >
                    <Icon name="Plan" size={24} />
                    <span>{t('farm.viewPlan')}</span>
                </ZLink>
            </section>
        </div>
    );
}

/** /farm — the cluster's 100 farms. Narrow: card list. Wide: table + detail panel (derived, not in canvas).
    Search, status and barangay filters and the page all live in the URL. */
export function FarmListScreen({
    state = 'default',
    list,
    selectedId = ''
}: {
    state?: FarmState;
    list?: ListState;
    selectedId?: string;
}) {
    const { t } = useI18n();
    const L = list ?? staticListState('/farm');
    const [q, setQ] = useState(L.q);
    useEffect(() => setQ(L.q), [L.q]);
    const filtered = useMemo(
        () => sortBy(filterFarms(FARMS, { q: L.q, status: L.status, barangay: L.barangay }), (f) => f.id),
        [L.q, L.status, L.barangay]
    );
    const pg = paginate(filtered, L.page, L.size);
    const selected = pg.rows.find((f) => f.id === selectedId) ?? pg.rows[0];
    const farmsAdded = useDemoState().farmsAdded;

    return (
        <ModuleShell title="farm.title" active="farms">
            {state === 'empty' ? (
                <EmptyState variant="empty" title="state.farm.empty.title" body="state.farm.empty.body" />
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <h2 className="eyebrow">{t('farm.list')}</h2>
                            <span className="text-[14px] font-bold tabular">
                                {t('farm.summary', { n: TOTALS.farms, ha: (TOTALS.areaTenths / 10).toFixed(1) })}
                            </span>
                        </div>
                        <div
                            role="group"
                            aria-label={t('list.filters')}
                            className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]"
                        >
                            <SearchField
                                label={t('farm.search')}
                                value={q}
                                onChange={(e) => {
                                    setQ(e.target.value);
                                    L.set({ q: e.target.value, farm: null });
                                }}
                            />
                            <label className="block">
                                <span className="sr-only">{t('farm.status')}</span>
                                <select
                                    value={L.status}
                                    onChange={(e) => L.set({ status: e.target.value, farm: null })}
                                    className={selectCls}
                                >
                                    <option value="">{t('filter.allStatuses')}</option>
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {t('status.' + s)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="sr-only">{t('farm.barangay')}</span>
                                <select
                                    value={L.barangay}
                                    onChange={(e) => L.set({ barangay: e.target.value, farm: null })}
                                    className={selectCls}
                                >
                                    <option value="">{t('filter.allBarangays')}</option>
                                    {BARANGAYS.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    {pg.total === 0 ? (
                        <EmptyState variant="empty" title="farm.noMatch" />
                    ) : (
                        <>
                            <ul className="cq-narrow-only glass-panel rounded-[1.5rem] overflow-hidden">
                                {pg.rows.map((f) => (
                                    <FarmCard key={f.id} farm={f} />
                                ))}
                            </ul>
                            <div className="cq-wide-only cq-split">
                                <div className="glass-panel rounded-[1.5rem] p-4 min-w-0">
                                    <table className="w-full text-left tabular">
                                        <caption className="sr-only">{t('farm.list')}</caption>
                                        <thead>
                                            <tr className={cap}>
                                                {[
                                                    'farm.id',
                                                    'farm.name',
                                                    'farm.barangay',
                                                    'farm.area',
                                                    'farm.variety',
                                                    'farm.planting',
                                                    'farm.status'
                                                ].map((k) => (
                                                    <th key={k} scope="col" className="py-2 pr-3 align-bottom">
                                                        {t(k)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pg.rows.map((f) => {
                                                const on = f.id === selected?.id;
                                                return (
                                                    <tr
                                                        key={f.id}
                                                        className={`border-t border-[color:var(--glass-border-strong)] text-[14px] font-bold align-top ${on ? 'bg-[rgba(2,70,53,.08)]' : ''}`}
                                                    >
                                                        <th scope="row" className="py-1.5 pr-3">
                                                            <Link
                                                                href={L.href({ farm: f.id, page: pg.page })}
                                                                replace
                                                                scroll={false}
                                                                aria-current={on ? 'true' : undefined}
                                                                className="inline-flex items-center min-h-[40px] font-extrabold text-[var(--text-accent)] underline underline-offset-4"
                                                            >
                                                                {f.id}
                                                            </Link>
                                                        </th>
                                                        <td className="py-2.5 pr-3 break-words">{f.name}</td>
                                                        <td className="py-2.5 pr-3 break-words">{f.barangay}</td>
                                                        <td className="py-2.5 pr-3 whitespace-nowrap">
                                                            {f.areaHa.toFixed(1)} ha
                                                        </td>
                                                        <td className="py-2.5 pr-3 break-words">{f.variety}</td>
                                                        <td className="py-2.5 pr-3">{f.plantingWeek}</td>
                                                        <td className="py-1.5">
                                                            <StatusChip status={f.status} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {selected && (
                                    <aside aria-label={t('farm.title')} className="flex flex-col gap-3 min-w-0">
                                        <FarmDetail
                                            farm={selected}
                                            added={farmsAdded.includes(selected.id) || selected.status === 'cluster'}
                                            onAdd={
                                                selected.status === 'cluster'
                                                    ? undefined
                                                    : () => updateDemoState(addFarm(selected.id))
                                            }
                                        />
                                        <ZLink
                                            href={`/farm/${selected.id}`}
                                            className="self-start inline-flex items-center gap-2 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                                        >
                                            {t('farm.fullPage', { id: selected.id })}
                                            <Icon name="ArrowRight" size={20} />
                                        </ZLink>
                                    </aside>
                                )}
                            </div>
                            <Pagination
                                total={pg.total}
                                page={pg.page}
                                pageSize={pg.size}
                                hrefFor={(n) => L.href({ page: n, farm: null })}
                                onSizeChange={(s) => L.set({ size: s, farm: null })}
                            />
                        </>
                    )}
                </div>
            )}
        </ModuleShell>
    );
}

/** /farm/[id] — one farm, one registered farmer (full page at every width). */
export function FarmProfileScreen({
    id,
    state = 'default',
    added: forcedAdded
}: {
    id: string;
    state?: FarmState;
    added?: boolean;
}) {
    const { t } = useI18n();
    const nav = useZoneNav();
    const farm = farmById(id)!;
    const ownAdded = useDemoState().farmsAdded.includes(farm.id) || farm.status === 'cluster';
    const added = forcedAdded ?? ownAdded;
    const [view, setView] = useState<FarmState>(state);
    const next = FARMS[(FARMS.indexOf(farm) + 1) % FARMS.length];
    if (view === 'error') {
        return (
            <ModuleShell title="farm.title" active="farms">
                <EmptyState
                    variant="error"
                    title="state.farm.error.title"
                    body="state.farm.error.body"
                    action="error.retry"
                    onAction={() => setView('default')}
                />
            </ModuleShell>
        );
    }
    if (view === 'success') {
        return (
            <ModuleShell title="farm.title" active="farms">
                <EmptyState
                    variant="success"
                    title="state.farm.success.title"
                    body={t('state.farm.success.body', { farm: farm.id })}
                    action="state.farm.success.action"
                    onAction={() => nav(`/farm/${next.id}`)}
                />
            </ModuleShell>
        );
    }
    return (
        <ModuleShell title="farm.title" active="farms">
            <div className="flex flex-col gap-4 max-w-[960px]">
                <ZLink
                    href="/farm"
                    className="self-start inline-flex items-center gap-1 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                >
                    <Icon name="ChevronLeft" size={24} />
                    {t('farm.back')}
                </ZLink>
                <FarmDetail
                    farm={farm}
                    added={added}
                    onAdd={farm.status === 'cluster' ? undefined : () => updateDemoState(addFarm(farm.id))}
                    wide
                />
            </div>
        </ModuleShell>
    );
}
