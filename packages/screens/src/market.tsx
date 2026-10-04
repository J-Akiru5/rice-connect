'use client';
import { useMemo, useState } from 'react';
import {
    AppShell,
    CommitmentCard,
    EmptyState,
    FilterChips,
    Icon,
    PrimaryButton,
    SearchField,
    StatusChip,
    useI18n
} from '@rc/ui';
import {
    COMMITMENTS,
    HERO_LOT,
    MATCHES,
    WEEKS,
    commitmentOfLot,
    forecastInWindow,
    type Commitment
} from '@rc/domain/seed';
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
    const heroC = COMMITMENTS.find((c) => c.id === commitmentOfLot(HERO_LOT.id))!;
    const heroM = MATCHES.find((m) => m.commitment === heroC.id)!;

    const groups = useMemo(
        () =>
            (['grade', 'volume', 'window'] as Group[]).map((g) => {
                const vals =
                    g === 'window'
                        ? [...WEEKS]
                        : Array.from(new Set(COMMITMENTS.flatMap((c) => valuesOf(c)[g]))).sort();
                return {
                    g,
                    options: vals.map((v) => ({
                        id: key(g, v),
                        label: v,
                        count: COMMITMENTS.filter((c) => valuesOf(c)[g].includes(v)).length
                    }))
                };
            }),
        []
    );
    const list = COMMITMENTS.filter(
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
                                    <CommitmentCard c={c} highlight={c.id === heroC.id} />
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
                            rows={MATCHES}
                            rowKey={(m) => m.commitment}
                            cols={[
                                {
                                    key: 'c',
                                    label: t('market.col.commitment'),
                                    cell: (m) => {
                                        const c = COMMITMENTS.find((x) => x.id === m.commitment)!;
                                        return `${c.id} · ${c.week}`;
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
                                        `${t1(forecastInWindow(COMMITMENTS.find((x) => x.id === m.commitment)!.window))} t`
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
                <aside className="flex-[1_1_340px] min-w-0" aria-labelledby="mk-match">
                    <SectionPill id="mk-match">{t('market.section.matches', { lot: HERO_LOT.id })}</SectionPill>
                    <div className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3.5">
                        <div className="flex justify-between gap-3 items-start">
                            <div>
                                <div className="eyebrow">
                                    {t('pay.section.lot', { lot: HERO_LOT.id, farm: HERO_LOT.farm })}
                                </div>
                                <div className="mt-1 text-[24px] leading-7 font-extrabold tabular">
                                    {t1(HERO_LOT.driedKg)} t
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
                                {heroC.id} · {heroC.buyer} · {peso(heroC.price)}/kg
                            </span>
                        </div>
                        <Note>
                            {t('market.match.reason')}.{' '}
                            {t('market.fills', {
                                id: heroC.id,
                                filled: t1(heroM.kg),
                                tonnes: heroC.tonnes.toFixed(1),
                                n: heroM.lots.length,
                                lot: HERO_LOT.id
                            })}
                        </Note>
                        {committed ? (
                            <p
                                role="status"
                                className="flex items-center gap-2 text-[20px] leading-7 font-extrabold text-[var(--success-ink)]"
                            >
                                <Icon name="CircleCheck" size={24} />
                                {t('market.committed', { id: heroC.id })}
                            </p>
                        ) : (
                            <PrimaryButton icon="Check" onClick={() => setCommitted(true)}>
                                {t('market.commit')}
                            </PrimaryButton>
                        )}
                    </div>
                </aside>
            </div>
        </AppShell>
    );
}
