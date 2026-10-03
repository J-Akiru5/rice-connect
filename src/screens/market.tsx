'use client';
import { useMemo, useState } from 'react';
import { AppShell, CommitmentCard, EmptyState, FilterChips, Icon, PrimaryButton, SearchField, StatusChip, useI18n } from '@/components/riceconnect';
import { COMMITMENTS, HERO_LOT, MATCHES, WEEKS, commitmentOfLot, forecastInWindow, type Commitment } from '@/data/seed';
import { peso } from '@/data/money';
import { SectionPill, Note } from './ui';

const t1 = (kg: number) => (Math.round(kg / 100) / 10).toFixed(1);
type Group = 'grade' | 'volume' | 'window';
const key = (g: Group, v: string) => `${g}:${v}`;
const valuesOf = (c: Commitment): Record<Group, string[]> => ({ grade: [c.grade], volume: [`${c.tonnes} t`], window: c.window });

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

    const groups = useMemo(() => (['grade', 'volume', 'window'] as Group[]).map((g) => {
        const vals = g === 'window' ? [...WEEKS] : Array.from(new Set(COMMITMENTS.flatMap((c) => valuesOf(c)[g]))).sort();
        return { g, options: vals.map((v) => ({ id: key(g, v), label: v, count: COMMITMENTS.filter((c) => valuesOf(c)[g].includes(v)).length })) };
    }), []);
    const list = COMMITMENTS.filter((c) => passes(c, on) && (!q.trim() || [c.id, c.buyer, c.grade, c.mc, c.week].join(' ').toLowerCase().includes(q.trim().toLowerCase())));

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
                                    <FilterChips label={t('market.group.' + g)} options={options}
                                        value={on.filter((k) => k.startsWith(g + ':'))}
                                        onChange={(v) => setOn([...on.filter((k) => !k.startsWith(g + ':')), ...v])} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {list.length === 0 ? <EmptyState variant="empty" title="empty.results" /> : (
                        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
                            {list.map((c) => (
                                <div key={c.id} className="flex flex-col gap-2 min-w-0">
                                    <CommitmentCard c={c} highlight={c.id === heroC.id} />
                                    {c.assumed.length > 0 && <Note className="px-2 flex items-center gap-1.5"><Icon name="Info" size={18} />{t('market.assumed', { id: c.id })}</Note>}
                                </div>
                            ))}
                        </div>
                    )}
                    <section aria-labelledby="mk-fc" className="glass-panel rounded-[1.5rem] p-5 overflow-x-auto">
                        <h3 id="mk-fc" className="eyebrow">{t('market.forecast.title')}</h3>
                        <table className="mt-2 w-full tabular text-left">
                            <thead>
                                <tr className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                                    <th scope="col" className="py-2 pr-3">{t('market.col.commitment')}</th>
                                    <th scope="col" className="py-2 px-3 text-right">{t('market.col.requested')}</th>
                                    <th scope="col" className="py-2 px-3 text-right">{t('market.col.forecast')}</th>
                                    <th scope="col" className="py-2 px-3 text-right">{t('market.col.matched')}</th>
                                    <th scope="col" className="py-2 pl-3 text-right">{t('market.col.lots')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MATCHES.map((m) => {
                                    const c = COMMITMENTS.find((x) => x.id === m.commitment)!;
                                    return (
                                        <tr key={m.commitment} className="border-t border-[color:var(--glass-border-strong)] text-[15px] font-bold">
                                            <th scope="row" className="py-2 pr-3 font-extrabold">{c.id} · {c.week}</th>
                                            <td className="py-2 px-3 text-right">{t1(m.requestedKg)} t</td>
                                            <td className="py-2 px-3 text-right">{t1(forecastInWindow(c.window))} t</td>
                                            <td className="py-2 px-3 text-right">{t1(m.kg)} t</td>
                                            <td className="py-2 pl-3 text-right">{m.lots.length}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                </div>
                <aside className="flex-[1_1_340px] min-w-0" aria-labelledby="mk-match">
                    <SectionPill id="mk-match">{t('market.section.matches', { lot: HERO_LOT.id })}</SectionPill>
                    <div className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3.5">
                        <div className="flex justify-between gap-3 items-start">
                            <div>
                                <div className="eyebrow">{t('pay.section.lot', { lot: HERO_LOT.id, farm: HERO_LOT.farm })}</div>
                                <div className="mt-1 text-[24px] leading-7 font-extrabold tabular">{t1(HERO_LOT.driedKg)} t</div>
                                <div className="text-[15px] font-bold tabular">{t('market.lotline', { grade: HERO_LOT.grade, mc: HERO_LOT.mc, week: HERO_LOT.week })}</div>
                            </div>
                            <StatusChip status="matched" />
                        </div>
                        <div className="flex items-center gap-2 text-[15px] font-bold tabular"><Icon name="ArrowRight" size={20} /><span>{heroC.id} · {heroC.buyer} · {peso(heroC.price)}/kg</span></div>
                        <Note>{t('market.match.reason')}. {t('market.fills', { id: heroC.id, filled: t1(heroM.kg), tonnes: heroC.tonnes.toFixed(1), n: heroM.lots.length, lot: HERO_LOT.id })}</Note>
                        {committed ? (
                            <p role="status" className="flex items-center gap-2 text-[20px] leading-7 font-extrabold text-[var(--success-ink)]"><Icon name="CircleCheck" size={24} />{t('market.committed', { id: heroC.id })}</p>
                        ) : (
                            <PrimaryButton icon="Check" onClick={() => setCommitted(true)}>{t('market.commit')}</PrimaryButton>
                        )}
                    </div>
                </aside>
            </div>
        </AppShell>
    );
}
