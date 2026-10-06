'use client';
import { useMemo, useState } from 'react';
import {
    AppShell,
    CommitmentCard,
    EmptyState,
    ErrorState,
    FilterChips,
    Icon,
    LoadingState,
    PrimaryButton,
    SearchField,
    StatusChip,
    useI18n
} from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { useCommitments, useLots } from '@rc/data';
import { HERO_LOT, MATCHES, WEEKS, commitmentOfLot, type Commitment } from '@rc/domain/seed';
import { autoMatch } from '@rc/domain/match';
import { peso } from '@rc/domain/money';
import { SectionPill, Note, ResponsiveTable } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
type Group = 'grade' | 'volume' | 'window';
const key = (g: Group, v: string) => `${g}:${v}`;
const valuesOf = (c: Commitment): Record<Group, string[]> => ({
    grade: [c.grade],
    volume: [`${c.tonnes} t`],
    window: c.window
});

/** OR inside a group, AND across groups. */
function passes(c: Commitment, on: string[]) {
    const v = valuesOf(c);
    return (['grade', 'volume', 'window'] as Group[]).every((g) => {
        const picked = on.filter((k) => k.startsWith(g + ':'));
        return picked.length === 0 || picked.some((k) => v[g].includes(k.slice(g.length + 1)));
    });
}

/** /market — commitment board with search, filters (grade, volume, window) and auto-match to forecast (desktop). */
export function MarketScreen({ committed: forced }: { committed?: boolean }) {
    const { t } = useI18n();
    const [q, setQ] = useState('');
    const [on, setOn] = useState<string[]>([]);
    const [own, setCommitted] = useState(false);
    const committed = forced ?? own;
    /* Gate 3: the board and the forecast rows come from the repositories (mock in demo, Supabase in live). */
    const commitmentsQuery = useCommitments({ size: 200 });
    const lotsQuery = useLots({ size: 500 });
    const commitments = useMemo(() => commitmentsQuery.data?.rows ?? [], [commitmentsQuery.data]);
    const lots = useMemo(() => lotsQuery.data?.rows ?? [], [lotsQuery.data]);
    /* Demo keeps the seed's pinned hero match; live auto-matches the repository commitments and lots. */
    const matches = useMemo(
        () =>
            isLive && commitments.length > 0
                ? autoMatch(
                      commitments.map((c) => ({
                          id: c.id,
                          tonnes: c.tonnes,
                          grade: c.grade,
                          mcPct: c.mcPct,
                          window: c.window
                      })),
                      lots.map((l) => ({
                          id: l.id,
                          week: l.week,
                          dayIndex: l.dayIndex,
                          driedKg: l.driedKg,
                          grade: l.grade,
                          mcPct: l.mcPct
                      }))
                  )
                : MATCHES,
        [commitments, lots]
    );
    const forecastOf = (window: string[]) =>
        lots.filter((l) => window.includes(l.week)).reduce((s, l) => s + l.driedKg, 0);
    const loading = commitmentsQuery.isPending || lotsQuery.isPending;
    const failed = commitmentsQuery.isError || lotsQuery.isError;
    const retry = () => {
        void commitmentsQuery.refetch();
        void lotsQuery.refetch();
    };
    if (loading)
        return (
            <AppShell title="market.title" active="market">
                <LoadingState rows={3} />
            </AppShell>
        );
    if (failed)
        return (
            <AppShell title="market.title" active="market">
                <ErrorState onRetry={retry} />
            </AppShell>
        );
    /* The hero match panel is the demo's L-03 story; live commitments have no lot link yet. */
    const focusId = isLive ? undefined : commitmentOfLot(HERO_LOT.id);
    const focus = commitments.find((c) => c.id === focusId);
    const focusMatch = focus ? matches.find((m) => m.commitment === focus.id) : undefined;
    const groups = (['grade', 'volume', 'window'] as Group[]).map((g) => {
        const vals =
            g === 'window' ? [...WEEKS] : Array.from(new Set(commitments.flatMap((c) => valuesOf(c)[g]))).sort();
        return {
            g,
            options: vals.map((v) => ({
                id: key(g, v),
                label: v,
                count: commitments.filter((c) => valuesOf(c)[g].includes(v)).length
            }))
        };
    });
    const list = commitments.filter(
        (c) =>
            passes(c, on) &&
            (!q.trim() ||
                [c.id, c.buyer, c.grade, c.mc, c.week].join(' ').toLowerCase().includes(q.trim().toLowerCase()))
    );
    return (
        <AppShell title="market.title" eyebrow="market.eyebrow" active="market">
            <div className="flex flex-wrap gap-6 items-start max-w-[1600px]">
                <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-4">
                    <div className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
                        <SearchField value={q} onChange={(e) => setQ(e.target.value)} />
                        <div role="group" aria-label={t('market.filters')} className="flex flex-col gap-2">
                            {groups.map(({ g, options }) => (
                                <div key={g} className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    <span className="eyebrow min-w-[72px]">{t('market.group.' + g)}</span>
                                    <FilterChips
                                        label={t('market.group.' + g)}
                                        options={options}
                                        value={on.filter((k) => k.startsWith(g + ':'))}
                                        onChange={(v) => setOn([...on.filter((k) => !k.startsWith(g + ':')), ...v])}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    {list.length === 0 ? (
                        <EmptyState variant="empty" title="empty.results" />
                    ) : (
                        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
                            {list.map((c) => (
                                <div key={c.id} className="flex flex-col gap-2 min-w-0">
                                    <CommitmentCard c={c} highlight={c.id === focus?.id} />
                                    {c.assumed.length > 0 && (
                                        <Note className="px-2 flex items-center gap-1.5">
                                            <Icon name="Info" size={18} />
                                            {t('market.assumed', { id: c.id })}
                                        </Note>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <section aria-labelledby="mk-fc" className="flex flex-col gap-3">
                        <div>
                            <SectionPill id="mk-fc">{t('market.forecast.title')}</SectionPill>
                        </div>
                        <ResponsiveTable
                            caption={t('market.forecast.title')}
                            rows={matches}
                            rowKey={(m) => m.commitment}
                            cols={[
                                {
                                    key: 'c',
                                    label: t('market.col.commitment'),
                                    cell: (m) => {
                                        const c = commitments.find((x) => x.id === m.commitment);
                                        return c ? `${c.id} · ${c.week}` : m.commitment;
                                    }
                                },
                                {
                                    key: 'req',
                                    label: t('market.col.requested'),
                                    align: 'right',
                                    nowrap: true,
                                    cell: (m) => `${t1(m.requestedKg)} t`
                                },
                                {
                                    key: 'fc',
                                    label: t('market.col.forecast'),
                                    align: 'right',
                                    nowrap: true,
                                    cell: (m) =>
                                        `${t1(
                                            forecastOf(commitments.find((x) => x.id === m.commitment)?.window ?? [])
                                        )} t`
                                },
                                {
                                    key: 'm',
                                    label: t('market.col.matched'),
                                    align: 'right',
                                    nowrap: true,
                                    cell: (m) => `${t1(m.kg)} t`
                                },
                                { key: 'n', label: t('market.col.lots'), align: 'right', cell: (m) => m.lots.length }
                            ]}
                        />
                    </section>
                </div>
                {focus && focusMatch && (
                    <aside className="flex-[1_1_340px] min-w-0" aria-labelledby="mk-match">
                        <SectionPill id="mk-match">{t('market.section.matches', { lot: HERO_LOT.id })}</SectionPill>
                        <div className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3.5">
                            <div className="flex justify-between gap-3 items-start">
                                <div>
                                    <div className="eyebrow">
                                        {t('pay.section.lot', { lot: HERO_LOT.id, farm: HERO_LOT.farm })}
                                    </div>
                                    <div className="mt-1 text-[24px] leading-7 font-extrabold tabular">
                                        {t1(HERO_LOT.driedKg)} {t('unit.t')}
                                    </div>
                                    <div className="text-[15px] font-bold tabular">
                                        {t('market.lotline', {
                                            grade: HERO_LOT.grade,
                                            mc: HERO_LOT.mc,
                                            week: HERO_LOT.week
                                        })}
                                    </div>
                                </div>
                                <StatusChip status="matched" />
                            </div>
                            <div className="flex items-center gap-2 text-[15px] font-bold tabular">
                                <Icon name="ArrowRight" size={20} />
                                <span>
                                    {focus.id} · {focus.buyer} · {peso(focus.price)}
                                    {t('unit.perKg')}
                                </span>
                            </div>
                            <Note>
                                {t('market.match.reason')}.{' '}
                                {t('market.fills', {
                                    id: focus.id,
                                    filled: t1(focusMatch.kg),
                                    tonnes: focus.tonnes.toFixed(1),
                                    n: focusMatch.lots.length,
                                    lot: HERO_LOT.id
                                })}
                            </Note>
                            {committed ? (
                                <p
                                    role="status"
                                    className="flex items-center gap-2 text-[20px] leading-7 font-extrabold text-[var(--success-ink)]"
                                >
                                    <Icon name="CircleCheck" size={24} />
                                    {t('market.committed', { id: focus.id })}
                                </p>
                            ) : (
                                <PrimaryButton icon="Check" onClick={() => setCommitted(true)}>
                                    {t('market.commit')}
                                </PrimaryButton>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </AppShell>
    );
}
