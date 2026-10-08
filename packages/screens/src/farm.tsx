'use client';
import { ZLink, useZoneNav } from '@rc/ui';
import { useEffect, useMemo, useState } from 'react';
import {
    BigStat,
    Dialog,
    EmptyState,
    ErrorState,
    FarmProfileCard,
    Field,
    Form,
    Icon,
    LoadingState,
    Pagination,
    SearchField,
    SecondaryButton,
    SectionHead,
    Select,
    ShareBar,
    StatusChip,
    SubmitButton,
    TextInput,
    TrendBars,
    useForm,
    useI18n,
    useToast,
    zodResolver,
    type ChartTone,
    type Point,
    type Segment
} from '@rc/ui';
import { isLive } from '@rc/ui/mode';
import { z } from 'zod';
import { staticListState, type ListState } from './list-state';
import { ModuleShell } from './shell';
import { MUNICIPALITY } from '@rc/domain/params';
import { useDemoState, updateDemoState } from '@rc/store/react';
import { addFarm } from '@rc/store';
import { useCreateFarm, useCreatedFarms, useFarm, useFarms } from '@rc/data';
import { BARANGAYS, FARMS, TOTALS, KG_PER_SACK, VARIETIES, lotOfFarm, type Farm } from '@rc/domain/seed';

export type FarmState = 'default' | 'empty' | 'error' | 'success';
const STATUSES: Farm['status'][] = ['registered', 'verified', 'cluster'];
const STATUS_TONE: Record<Farm['status'], ChartTone> = {
    registered: 'accent',
    verified: 'brand',
    cluster: 'gold'
};
const cap = 'text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]';
const selectCls =
    'min-h-[44px] px-4 rounded-[2rem] bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] font-bold text-[16px] w-full';

/** Narrow container: one card per farm, linking to the full profile (as before; no ellipsis, text wraps).
    Farms created through the Add Farm form have no profile yet, so they render unlinked. */
function FarmCard({ farm, linked = true }: { farm: Farm; linked?: boolean }) {
    const { t } = useI18n();
    const body = (
        <>
            <span className="min-w-0 flex-1">
                <span className="block text-[16px] leading-6 font-extrabold tabular">
                    {farm.id} · {farm.areaHa.toFixed(1)} {t('unit.ha')}
                </span>
                <span className="block text-[14px] leading-5 font-semibold text-[var(--text-secondary)] break-words">
                    {farm.barangay}
                </span>
            </span>
            <StatusChip status={farm.status} />
            {linked && <Icon name="ChevronRight" size={24} className="shrink-0 text-[var(--text-muted)]" />}
        </>
    );
    const cls =
        'flex items-center gap-3 min-h-[64px] px-4 py-3 border-b border-[color:var(--glass-border-strong)] last:border-0';
    return (
        <li>
            {linked ? (
                <ZLink
                    href={`/farm/${farm.id}`}
                    aria-label={t('farm.open', { id: farm.id })}
                    className={cls + ' rc-hover-accent-soft'}
                >
                    {body}
                </ZLink>
            ) : (
                <div className={cls}>{body}</div>
            )}
        </li>
    );
}

const addFarmSchema = z.object({
    name: z.string().min(2),
    barangay: z.enum(BARANGAYS),
    variety: z.enum(VARIETIES),
    areaHa: z.coerce.number().min(0.5).max(2.5),
    week: z.enum(['W1', 'W2', 'W3', 'W4'] as const)
});
type AddFarmValues = z.infer<typeof addFarmSchema>;

/** Add Farm (S-10): the form kit, simulated data only; the new farm appears in the list as "in cluster". */
function AddFarmDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { t } = useI18n();
    const toast = useToast();
    const createFarm = useCreateFarm();
    const form = useForm<AddFarmValues>({
        resolver: zodResolver(addFarmSchema),
        defaultValues: { name: '', barangay: BARANGAYS[0], variety: VARIETIES[0], areaHa: 1, week: 'W3' }
    });
    const submit = async (values: AddFarmValues) => {
        const { week, ...rest } = values;
        const farm = await createFarm.mutateAsync({ input: { ...rest, harvestWeek: week } });
        toast.show(t('farm.add.saved', { id: farm.id }));
        form.reset();
        onOpenChange(false);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange} title={t('farm.add.title')} maxWidth="md">
            <Form form={form} onSubmit={submit} busy={createFarm.isPending} className="flex flex-col gap-4">
                <Field name="name" label={t('farm.add.name')} hint={t('farm.add.hint')}>
                    {({ value, onChange, onBlur, name, invalid, describedBy }) => (
                        <TextInput
                            name={name}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            className="!text-base"
                        />
                    )}
                </Field>
                <Field name="barangay" label={t('farm.barangay')}>
                    {({ value, onChange, name }) => (
                        <Select
                            value={value}
                            onValueChange={(v) => onChange(v)}
                            label={name}
                            className="w-full"
                            options={BARANGAYS.map((b) => ({ value: b, label: b }))}
                        />
                    )}
                </Field>
                <Field name="variety" label={t('farm.variety')}>
                    {({ value, onChange, name }) => (
                        <Select
                            value={value}
                            onValueChange={(v) => onChange(v)}
                            label={name}
                            className="w-full"
                            options={VARIETIES.map((v) => ({ value: v, label: v }))}
                        />
                    )}
                </Field>
                <Field name="areaHa" label={`${t('farm.area')} (ha)`}>
                    {({ value, onChange, onBlur, name, invalid, describedBy }) => (
                        <TextInput
                            name={name}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            inputMode="decimal"
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            className="!text-base"
                        />
                    )}
                </Field>
                <Field name="week" label={t('dry.weeks')}>
                    {({ value, onChange, name }) => (
                        <Select
                            value={value}
                            onValueChange={(v) => onChange(v)}
                            label={name}
                            className="w-full"
                            options={['W1', 'W2', 'W3', 'W4'].map((w) => ({ value: w, label: w }))}
                        />
                    )}
                </Field>
                <div className="flex flex-wrap justify-end gap-2">
                    <SecondaryButton onClick={() => onOpenChange(false)}>{t('action.cancel')}</SecondaryButton>
                    <SubmitButton icon="Plus" label={t('farm.add.submit')} pendingLabel={t('sms.reply.sending')} />
                </div>
            </Form>
        </Dialog>
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
            <section className="panel-solid rounded-[1.75rem] p-5 md:p-6" aria-labelledby={`harvest-${farm.id}`}>
                <h3
                    id={`harvest-${farm.id}`}
                    className="m-0 text-[19px] leading-6 font-extrabold tracking-[-0.02em] text-[var(--ink)]"
                >
                    {t('farm.harvest')}
                </h3>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 tabular">
                    <div>
                        <dt className={cap}>{t('farm.harvest')}</dt>
                        <dd className="text-[16px] font-bold">
                            {t('farm.harvestLine', { week: farm.harvestWeek, date: farm.harvestLabel })}
                        </dd>
                    </div>
                    <div>
                        <dt className={cap}>{t('farm.lot')}</dt>
                        <dd className="text-[16px] font-bold">{lot ? lot.id : '—'}</dd>
                    </div>
                    <div className="col-span-2">
                        <dt className={cap}>{t('farm.forecast')}</dt>
                        <dd className="text-[16px] font-bold">
                            {farm.driedKg.toLocaleString('en-US')} {t('unit.kg')} ·{' '}
                            {Math.ceil(farm.driedKg / KG_PER_SACK)} {t('unit.sacks')}
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
    const [addOpen, setAddOpen] = useState(false);
    /* Live mode reads the Supabase repositories (B-05); demo mode gets the same shapes from the mock repo. */
    const farmsQuery = useFarms({
        q: L.q || undefined,
        status: STATUSES.includes(L.status as Farm['status']) ? (L.status as Farm['status']) : undefined,
        barangay: BARANGAYS.includes(L.barangay as Farm['barangay']) ? (L.barangay as Farm['barangay']) : undefined,
        page: L.page,
        size: L.size
    });
    const createdQuery = useCreatedFarms();
    const created = useMemo(() => createdQuery.data ?? [], [createdQuery.data]);
    const createdIds = useMemo(() => new Set(created.map((f) => f.id)), [created]);
    const pg = {
        rows: farmsQuery.data?.rows ?? [],
        total: farmsQuery.data?.total ?? 0,
        page: farmsQuery.data?.page ?? 1,
        size: farmsQuery.data?.size ?? 20
    };
    const selected = pg.rows.find((f) => f.id === selectedId) ?? pg.rows[0];
    const farmsAdded = useDemoState().farmsAdded;
    const totalFarms = pg.total;
    /* Demo shows the cluster totals; live sums the page (the plan's aggregate view lands with the dashboard work). */
    const totalHa = isLive
        ? pg.rows.reduce((sum, f) => sum + f.areaTenths, 0) / 10
        : (TOTALS.areaTenths + created.reduce((s, f) => s + f.areaTenths, 0)) / 10;
    /* The same set the register is showing, so every chart below can be traced back to the rows on screen. */
    const chartFarms: Farm[] = isLive ? pg.rows : [...FARMS, ...created];
    const unitT = t('unit.t');
    const forecastT = (chartFarms.reduce((s, f) => s + f.driedKg, 0) / 1000).toFixed(1);
    /* One colour language for the panel: both readings split the register by status, so the same
       three colours mean the same three things in both charts. A barangay is an identity, not a
       colour here — its name is the column label, and the stacks say how far along its farms are. */
    const byBarangay: Point[] = BARANGAYS.map((b) => {
        const ofBarangay = chartFarms.filter((f) => f.barangay === b);
        const parts: Segment[] = STATUSES.map((s) => ({
            key: s,
            label: t('status.' + s),
            tone: STATUS_TONE[s],
            value: ofBarangay.filter((f) => f.status === s).length
        }));
        return { key: b, label: b, value: ofBarangay.length, parts };
    }).sort((a, b) => b.value - a.value);
    const byStatus = STATUSES.map((s) => ({
        key: s,
        label: t('status.' + s),
        tone: STATUS_TONE[s],
        value: chartFarms.filter((f) => f.status === s).length
    }));
    const barangayList = byBarangay
        .slice()
        .sort((a, b) => b.value - a.value)
        .map((p) => `${p.label} ${p.value}`)
        .join('; ');
    const loading = farmsQuery.isPending || createdQuery.isPending;
    const failed = farmsQuery.isError || createdQuery.isError;
    const retry = () => {
        void farmsQuery.refetch();
        void createdQuery.refetch();
    };
    const clearFilters = () => {
        setQ('');
        L.set({ q: '', status: '', barangay: '', page: null, farm: null });
    };

    return (
        <ModuleShell title="farm.title" active="farms">
            {state === 'empty' ? (
                <EmptyState variant="empty" title="state.farm.empty.title" body="state.farm.empty.body" />
            ) : (
                <div className="flex flex-col gap-8">
                    <p className="rc-lede">{t('farm.lead', { place: MUNICIPALITY })}</p>
                    <section
                        aria-labelledby="frm-look"
                        className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]"
                    >
                        <h2 id="frm-look" className="sr-only">
                            {t('farm.look.title')}
                        </h2>
                        <BigStat
                            size="xl"
                            className="panel-solid"
                            label="farm.stat.farms"
                            value={totalFarms}
                            icon="Farm"
                            note={t('farm.summary', { n: totalFarms, ha: totalHa.toFixed(1) })}
                        />
                        <BigStat
                            size="xl"
                            className="panel-solid"
                            label="farm.stat.ha"
                            value={totalHa.toFixed(1)}
                            unit={t('unit.ha')}
                            icon="MapPin"
                            note={t('plan.note.area', { avg: (totalHa / Math.max(1, totalFarms)).toFixed(1) })}
                        />
                        <BigStat
                            size="xl"
                            className="panel-solid"
                            label="farm.stat.forecast"
                            value={forecastT}
                            unit={unitT}
                            icon="Wheat"
                            note={t('farm.stat.forecast.note', { b: BARANGAYS.length, list: BARANGAYS.join(', ') })}
                        />
                    </section>
                    <section
                        aria-labelledby="frm-charts"
                        className="panel-solid rounded-[1.75rem] p-5 md:p-7 flex flex-col gap-7"
                    >
                        <SectionHead id="frm-charts" title={t('farm.look.title')} hint={t('farm.look.hint')} />
                        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
                            <TrendBars
                                title={t('farm.rank.title')}
                                unit={t('unit.farms')}
                                points={byBarangay}
                                height={200}
                                /* A count of farms is a whole number: 34, never 34.0. */
                                format={(v) => v.toLocaleString('en-US')}
                                summary={t('farm.rank.summary', { n: chartFarms.length, list: barangayList })}
                            />
                            <ShareBar
                                title={t('farm.share.title')}
                                unit=""
                                items={byStatus}
                                format={(v) => v.toLocaleString('en-US')}
                                summary={t('farm.share.summary', {
                                    n: chartFarms.length,
                                    cluster: byStatus[2]?.value ?? 0,
                                    verified: byStatus[1]?.value ?? 0,
                                    registered: byStatus[0]?.value ?? 0
                                })}
                            />
                        </div>
                    </section>
                    <div className="glass-panel rounded-[1.5rem] p-4 flex flex-col gap-3">
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <h2 className="text-[22px] leading-7 font-extrabold tracking-[-0.02em] text-[var(--ink)]">
                                {t('farm.list')}
                            </h2>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-[15px] font-bold tabular">
                                    {t('farm.summary', { n: totalFarms, ha: totalHa.toFixed(1) })}
                                </span>
                                <SecondaryButton icon="Plus" onClick={() => setAddOpen(true)}>
                                    {t('farm.add')}
                                </SecondaryButton>
                            </div>
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
                                    name="status"
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
                                    name="barangay"
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
                    {loading ? (
                        <LoadingState rows={3} />
                    ) : failed ? (
                        <ErrorState onRetry={retry} />
                    ) : pg.total === 0 ? (
                        <EmptyState
                            variant="filtered"
                            title="farm.noMatch"
                            action="farm.clearFilters"
                            onAction={clearFilters}
                        />
                    ) : (
                        <>
                            <ul className="cq-narrow-only glass-panel rounded-[1.5rem] overflow-hidden">
                                {pg.rows.map((f) => (
                                    <FarmCard key={f.id} farm={f} linked={!createdIds.has(f.id)} />
                                ))}
                            </ul>
                            <div className="cq-wide-only cq-split">
                                <div className="panel-solid rounded-[1.75rem] p-4 md:p-5 min-w-0">
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
                                                        className={`border-t border-[color:var(--glass-border-strong)] text-[14px] font-bold align-top ${on ? 'rc-bg-highlight' : ''}`}
                                                    >
                                                        <th scope="row" className="py-1.5 pr-3">
                                                            {createdIds.has(f.id) ? (
                                                                <span className="inline-flex items-center min-h-[40px] font-extrabold tabular">
                                                                    {f.id}
                                                                </span>
                                                            ) : (
                                                                <ZLink
                                                                    href={L.href({ farm: f.id, page: pg.page })}
                                                                    replace
                                                                    scroll={false}
                                                                    aria-current={on ? 'true' : undefined}
                                                                    className="inline-flex items-center min-h-[40px] font-extrabold text-[var(--text-accent)] underline underline-offset-4"
                                                                >
                                                                    {f.id}
                                                                </ZLink>
                                                            )}
                                                        </th>
                                                        <td className="py-2.5 pr-3 break-words">{f.name}</td>
                                                        <td className="py-2.5 pr-3 break-words">{f.barangay}</td>
                                                        <td className="py-2.5 pr-3 whitespace-nowrap">
                                                            {f.areaHa.toFixed(1)} {t('unit.ha')}
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
                                        {createdIds.has(selected.id) ? (
                                            <p className="m-0 glass-panel rounded-[1.5rem] p-5 text-[15px] leading-6 font-semibold">
                                                {t('farm.created.note')}
                                            </p>
                                        ) : (
                                            <>
                                                <FarmDetail
                                                    farm={selected}
                                                    added={
                                                        farmsAdded.includes(selected.id) ||
                                                        selected.status === 'cluster'
                                                    }
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
                                            </>
                                        )}
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
            <AddFarmDialog open={addOpen} onOpenChange={setAddOpen} />
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
    /* Live mode reads the farm from the repositories (Gate 3 step 1b); the mock repo serves the seed. */
    const farmQuery = useFarm(id);
    const farm = farmQuery.data;
    const farmsAdded = useDemoState().farmsAdded;
    const [view, setView] = useState<FarmState>(state);
    if (farmQuery.isPending) {
        return (
            <ModuleShell title="farm.title" active="farms">
                <LoadingState rows={3} />
            </ModuleShell>
        );
    }
    if (!farm || farmQuery.isError) {
        return (
            <ModuleShell title="farm.title" active="farms">
                <EmptyState
                    variant="error"
                    title="state.farm.error.title"
                    body="state.farm.error.body"
                    action="error.retry"
                    onAction={() => void farmQuery.refetch()}
                />
            </ModuleShell>
        );
    }
    const ownAdded = farmsAdded.includes(farm.id) || farm.status === 'cluster';
    const added = forcedAdded ?? ownAdded;
    const next = FARMS[(FARMS.indexOf(farm) + 1) % FARMS.length] ?? farm;
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
