'use client';
import {
    AlertDialog,
    AppShell,
    BigStat,
    EmptyState,
    ErrorState,
    Icon,
    LoadingState,
    Pagination,
    SecondaryButton,
    SectionHead,
    Select,
    StatusChip,
    ZLink,
    useI18n,
    useToast
} from '@rc/ui';
import overrides from '@rc/domain/overrides.json';
import { COMMITMENTS, DRIVERS, FARMS, LOTS, VEHICLES, commitmentOfLot, vehicleOf } from '@rc/domain/seed';
import { MUNICIPALITY, PRICE } from '@rc/domain/params';
import { MILLING } from '@rc/domain/buyers';
import { dayLabel } from '@rc/domain/calendar';
import { paginate } from '@rc/domain/list';
import { peso } from '@rc/domain/money';
import { DIRECTORY_ROLES, type DirectoryRole } from '@rc/store';
import { useDemoState, resetDemoState } from '@rc/store/react';
import { useAdminOverrides, useClearAssumption, useClearUserRole, useSetAssumption, useSetUserRole } from '@rc/data';
import { useState } from 'react';
import { staticListState, type ListState } from './list-state';
import { Note, ResponsiveTable, type Col } from './ui';

/* Section headings on the admin screens read at heading size, not as a caps label: the reader is
   scanning a long configuration page for one number. */
const H2 = 'm-0 text-[19px] leading-6 font-extrabold tracking-[-0.02em] text-[var(--ink)]';

/* Super admin (prototype addition, docs/DECISIONS.md M20; derived, not in canvas). Read views over the seed and
   the demo state, plus the S-11 simulated writes: role changes and assumption edits, both behind the same
   AdminRepo interfaces a Supabase implementation will use in Phase 3. Nothing here is real access control;
   every dangerous change goes through a typed confirmation (kit AlertDialog) and shows up in the Activity view. */

const BUYERS = [...new Set(COMMITMENTS.map((c) => c.buyer))];
const MATCHED_LOTS = LOTS.filter((l) => commitmentOfLot(l.id)).length;
const IN_CLUSTER = FARMS.filter((f) => f.status === 'cluster').length;

/** /admin */
export function AdminOverviewScreen() {
    const { t } = useI18n();
    const s = useDemoState();
    const apps = [
        { k: 'main', icon: 'Console', href: '/coordinator/home', name: 'role.name.coordinator' },
        { k: 'buyer', icon: 'Store', href: '/buyer', name: 'role.name.buyer' },
        { k: 'driver', icon: 'Truck', href: '/driver', name: 'role.name.driver' },
        { k: 'farmer', icon: 'Sms', href: '/farmer', name: 'mk.role.farmer.h' }
    ];
    const live = [
        ['admin.live.orders', s.riceOrders.length],
        ['admin.live.commitments', s.commitments.length],
        ['admin.live.replies', s.smsReplies.length],
        ['admin.live.added', s.farmsAdded.length]
    ] as const;
    return (
        <AppShell role="admin" active="overview" title="admin.overview.title" eyebrow="admin.eyebrow">
            <div className="flex flex-col gap-6">
                <p className="rc-lede">{t('admin.lead')}</p>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))] tabular">
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        icon="Farm"
                        label="admin.stat.farms"
                        value={FARMS.length}
                        note={t('admin.stat.farms.sub', { n: IN_CLUSTER })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        icon="Store"
                        label="admin.stat.buyers"
                        value={BUYERS.length}
                        note="admin.stat.buyers.sub"
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        icon="Truck"
                        label="admin.stat.drivers"
                        value={DRIVERS.length}
                        note={t('admin.stat.drivers.sub', { n: VEHICLES.length })}
                    />
                    <BigStat
                        size="xl"
                        className="panel-solid"
                        icon="Sack"
                        label="admin.stat.lots"
                        value={LOTS.length}
                        note={t('admin.stat.lots.sub', { n: MATCHED_LOTS })}
                    />
                </div>
                <div className="cq-two">
                    <section
                        aria-labelledby="adm-apps"
                        className="panel-solid rounded-[1.75rem] p-5 md:p-6 flex flex-col gap-3 min-w-0"
                    >
                        <h2 id="adm-apps" className={H2}>
                            {t('admin.apps.h')}
                        </h2>
                        <ul className="flex flex-col">
                            {apps.map((a) => (
                                <li
                                    key={a.k}
                                    className="flex items-center justify-between gap-3 py-2.5 border-b border-[color:var(--glass-border-strong)] last:border-0"
                                >
                                    <span className="flex items-center gap-3 min-w-0">
                                        <span className="icon-box shrink-0">
                                            <Icon name={a.icon} size={20} />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-[15px] font-extrabold">{t(a.name)}</span>
                                            <span className="block text-[14px] font-semibold text-[var(--text-secondary)]">
                                                {t('admin.apps.' + a.k)}
                                            </span>
                                        </span>
                                    </span>
                                    <ZLink
                                        href={a.href}
                                        className="inline-flex items-center gap-1 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)] whitespace-nowrap"
                                    >
                                        {t('admin.apps.open')}
                                        <Icon name="ArrowRight" size={20} />
                                    </ZLink>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section
                        aria-labelledby="adm-live"
                        className="panel-solid rounded-[1.75rem] p-5 md:p-6 flex flex-col gap-4 min-w-0"
                    >
                        <h2 id="adm-live" className={H2}>
                            {t('admin.live.h')}
                        </h2>
                        <dl className="grid grid-cols-2 gap-5 tabular">
                            {live.map(([k, n]) => (
                                <div key={k}>
                                    <dt className="text-[14px] font-bold text-[var(--text-secondary)]">{t(k)}</dt>
                                    <dd className="m-0 text-[34px] leading-10 font-extrabold">{n}</dd>
                                </div>
                            ))}
                        </dl>
                        <ZLink
                            href="/admin/activity"
                            className="self-start inline-flex items-center gap-2 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-accent)]"
                        >
                            {t('nav.activity')}
                            <Icon name="ArrowRight" size={20} />
                        </ZLink>
                    </section>
                </div>
            </div>
        </AppShell>
    );
}

/* ---------- users ---------- */
type URole = DirectoryRole;
interface BaseUser {
    code: string;
    role: URole;
    contact: string;
    where: string;
    detail: string;
    status?: string;
    statusLabel?: string;
}
interface UserRow extends BaseUser {
    /** The seeded role, kept for the row key and the "was" hint after a simulated change. */
    base: URole;
    changed: boolean;
}
const userKey = (u: BaseUser) => `${u.role}:${u.code}`;
const USERS: BaseUser[] = [
    { code: 'Cluster 1', role: 'coordinator', contact: '—', where: MUNICIPALITY, detail: String(FARMS.length) },
    ...FARMS.map((f) => ({
        code: f.id,
        role: 'farmer' as URole,
        contact: f.mobile,
        where: f.barangay,
        detail: `${f.areaHa.toFixed(1)} ha · ${f.variety}`,
        status: f.status
    })),
    ...BUYERS.map((b) => {
        const cs = COMMITMENTS.filter((c) => c.buyer === b);
        return {
            code: b,
            role: 'buyer' as URole,
            contact: '—',
            where: MUNICIPALITY,
            detail: `${cs.map((c) => c.id).join(', ')} · ${cs.reduce((a, c) => a + c.tonnes, 0).toFixed(1)} t`
        };
    }),
    ...DRIVERS.map((d) => {
        const v = vehicleOf(d);
        return {
            code: d.name,
            role: 'driver' as URole,
            contact: d.plate,
            where: `${d.distanceKm.toFixed(1)} km`,
            detail: `${v.id} · ${v.capacity}`,
            status: d.available ? 'open' : 'failed',
            statusLabel: d.available ? 'admin.driver.available' : 'admin.driver.unavailable'
        };
    })
];

/** /admin/users: searchable, filterable by role, paginated with URL state (lists over 12 rows).
    S-11: a simulated role change per row, behind a typed confirmation (type the code), with Undo. */
export function AdminUsersScreen({ list }: { list?: ListState }) {
    const { t } = useI18n();
    const toast = useToast();
    const L = list ?? staticListState('/admin/users');
    const overridesQ = useAdminOverrides();
    const roleEdits = overridesQ.data?.roles ?? {};
    const setRole = useSetUserRole();
    const clearRole = useClearUserRole();
    const [pending, setPending] = useState<{ row: UserRow; next: URole } | null>(null);
    const q = L.q.trim().toLowerCase();
    const role = DIRECTORY_ROLES.includes(L.status as URole) ? (L.status as URole) : '';
    const rows: UserRow[] = USERS.map((u) => {
        const edited = roleEdits[userKey(u)];
        return { ...u, base: u.role, role: edited ?? u.role, changed: edited !== undefined };
    }).filter(
        (u) =>
            (!role || u.role === role) && (!q || [u.code, u.where, u.detail].some((v) => v.toLowerCase().includes(q)))
    );
    const pg = paginate(rows, L.page, L.size);
    const cols: Col<UserRow>[] = [
        { key: 'code', label: t('admin.users.code'), cell: (u) => u.code },
        {
            key: 'role',
            label: t('admin.users.role'),
            cell: (u) => (
                <span className="inline-flex flex-wrap items-center gap-2">
                    {t('admin.role.' + u.role)}
                    {u.changed && <StatusChip status="pending" kind="warning" label={t('admin.changed')} />}
                    {u.changed && (
                        <span className="text-[13px] font-bold text-[var(--text-muted)]">
                            {t('admin.was', { value: t('admin.role.' + u.base) })}
                        </span>
                    )}
                </span>
            )
        },
        {
            key: 'contact',
            label: t('admin.users.contact'),
            cell: (u) => <span className="tabular">{u.contact}</span>,
            nowrap: true
        },
        { key: 'where', label: t('admin.users.where'), cell: (u) => u.where },
        {
            key: 'detail',
            label: t('admin.users.detail'),
            cell: (u) =>
                u.role === 'coordinator' ? (
                    `${t('admin.stat.farms')}: ${u.detail}`
                ) : u.role === 'driver' ? (
                    <span className="inline-flex flex-wrap items-center gap-2">
                        {u.detail} {t('unit.sacks')}
                        <StatusChip status={u.status!} label={t(u.statusLabel!)} />
                    </span>
                ) : u.status ? (
                    <span className="inline-flex flex-wrap items-center gap-2">
                        {u.detail}
                        <StatusChip status={u.status} label={u.statusLabel ? t(u.statusLabel) : undefined} />
                    </span>
                ) : (
                    u.detail
                )
        }
    ];
    if (overridesQ.isSuccess)
        cols.push({
            key: 'actions',
            label: t('admin.users.actions'),
            cell: (u) => (
                <SecondaryButton icon="User" onClick={() => setPending({ row: u, next: u.role })}>
                    {t('admin.change.role')}
                </SecondaryButton>
            ),
            nowrap: true
        });
    const field =
        'min-h-[44px] md:min-h-[40px] px-4 rounded-full bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] text-[15px] font-bold';
    return (
        <AppShell role="admin" active="users" title="admin.users.title" eyebrow="admin.eyebrow">
            <div className="flex flex-col gap-6">
                <p className="rc-lede">{t('admin.users.lead')}</p>
                {overridesQ.isPending ? (
                    <LoadingState rows={1} />
                ) : overridesQ.isError ? (
                    <ErrorState onRetry={() => void overridesQ.refetch()} />
                ) : null}
                <div className="panel-solid rounded-[1.75rem] p-4 md:p-5 flex flex-wrap items-end gap-3">
                    <label className="flex flex-col gap-1 flex-[1_1_260px] min-w-0">
                        <span className="eyebrow">{t('admin.users.search')}</span>
                        <input
                            type="search"
                            defaultValue={L.q}
                            onChange={(e) => L.set({ q: e.target.value || null, page: null })}
                            className={field}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="eyebrow">{t('admin.users.role')}</span>
                        <select
                            value={role}
                            onChange={(e) => L.set({ status: e.target.value || null, page: null })}
                            className={field}
                        >
                            <option value="">{t('admin.users.all')}</option>
                            {DIRECTORY_ROLES.map((r) => (
                                <option key={r} value={r}>
                                    {t('admin.role.' + r)}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                {pg.total === 0 ? (
                    <EmptyState title={t('admin.users.none')} />
                ) : (
                    <ResponsiveTable
                        caption={t('admin.users.caption')}
                        cols={cols}
                        rows={pg.rows}
                        rowKey={(u) => `${u.base}:${u.code}`}
                    />
                )}
                {pg.total > 12 && (
                    <Pagination
                        total={pg.total}
                        page={pg.page}
                        pageSize={pg.size}
                        hrefFor={L.pageHref}
                        onSizeChange={(n) => L.set({ size: n, page: null })}
                    />
                )}
                <Note>{t('admin.users.note')}</Note>
            </div>
            <AlertDialog
                open={pending !== null}
                onOpenChange={(o) => {
                    if (!o) setPending(null);
                }}
                title={t('admin.change.roleTitle', { code: pending?.row.code ?? '' })}
                description={t('admin.change.roleBody')}
                confirmLabel={t('admin.change.role')}
                typedWord={pending?.row.code}
                confirmDisabled={pending !== null && pending.next === pending.row.role}
                onConfirm={() => {
                    const p = pending;
                    if (!p) return;
                    setPending(null);
                    void setRole
                        .mutateAsync({ key: `${p.row.base}:${p.row.code}`, role: p.next })
                        .then(() =>
                            toast.show(
                                t('admin.change.roleToast', {
                                    code: p.row.code,
                                    role: t('admin.role.' + p.next)
                                }),
                                {
                                    label: t('action.undo'),
                                    onClick: () => {
                                        void clearRole.mutateAsync({ key: `${p.row.base}:${p.row.code}` });
                                    }
                                }
                            )
                        )
                        .catch(() => toast.show(t('admin.change.failed')));
                }}
            >
                <label className="flex flex-col gap-1 text-[13px] font-bold">
                    <span>{t('admin.change.newRole')}</span>
                    <Select
                        value={pending?.next ?? 'farmer'}
                        onValueChange={(v) => setPending((p) => (p ? { ...p, next: v } : p))}
                        label={t('admin.change.newRole')}
                        options={DIRECTORY_ROLES.map((r) => ({ value: r, label: t('admin.role.' + r) }))}
                    />
                </label>
            </AlertDialog>
        </AppShell>
    );
}

/* ---------- settings ---------- */
type SettingKind = 'number' | 'text' | 'fixed';
interface SetRow {
    k: string;
    /** The built-in raw value; a simulated edit in the store replaces it in this browser. */
    raw: string;
    /** Formats a raw value for display (units live next to the number). */
    show: (v: string) => string;
    src: 'assumed' | 'brief';
    kind: SettingKind;
}
const SETTINGS: SetRow[] = [
    {
        k: 'admin.set.kgPerSack',
        raw: String(overrides.kgPerSack),
        show: (v) => `${v} kg`,
        src: 'assumed',
        kind: 'number'
    },
    {
        k: 'admin.set.dryer',
        raw: String(overrides.dryerKgPerDay),
        show: (v) => `${Number(v).toLocaleString('en-PH')} kg`,
        src: 'assumed',
        kind: 'number'
    },
    { k: 'admin.set.grade', raw: overrides.forecastGrade, show: (v) => v, src: 'assumed', kind: 'text' },
    {
        k: 'admin.set.mc',
        raw: String(overrides.forecastMcPct),
        show: (v) => `${v}% MC`,
        src: 'assumed',
        kind: 'number'
    },
    { k: 'admin.set.smsLead', raw: String(overrides.smsSlotLeadDays), show: (v) => v, src: 'assumed', kind: 'number' },
    {
        k: 'admin.set.buyerPays',
        raw: String(overrides.buyerPaysAfterDays),
        show: (v) => v,
        src: 'assumed',
        kind: 'number'
    },
    { k: 'admin.set.milling', raw: String(MILLING.recoveryPct), show: (v) => `${v}%`, src: 'assumed', kind: 'number' },
    {
        k: 'admin.set.ricePrice',
        raw: `${peso(MILLING.price)}/kg · ${MILLING.sackKg} kg sacks`,
        show: (v) => v,
        src: 'assumed',
        kind: 'fixed'
    },
    { k: 'admin.set.today', raw: dayLabel(overrides.demoTodayDayIndex), show: (v) => v, src: 'assumed', kind: 'fixed' },
    { k: 'admin.set.advance', raw: `${PRICE.advancePct}%`, show: (v) => v, src: 'brief', kind: 'fixed' }
];

/** /admin/settings: values from overrides.json (assumed) and the brief. S-11: an assumed value can be changed
    in the prototype behind a typed confirmation; the edit stays in this browser and is listed in the Activity view. */
export function AdminSettingsScreen() {
    const { t } = useI18n();
    const toast = useToast();
    const overridesQ = useAdminOverrides();
    const edits = overridesQ.data?.settings ?? {};
    const setAssumption = useSetAssumption();
    const clearAssumption = useClearAssumption();
    const [pending, setPending] = useState<{ row: SetRow; value: string } | null>(null);
    const days = (k: string, v: string) =>
        k === 'admin.set.smsLead' || k === 'admin.set.buyerPays' ? t('admin.days', { n: v }) : v;
    const valueOf = (r: SetRow) => edits[r.k] ?? r.raw;
    const valid = (r: SetRow, v: string) =>
        r.kind === 'text' ? v.trim().length > 0 : Number.isFinite(Number(v)) && Number(v) > 0;
    const cols: Col<SetRow>[] = [
        { key: 'k', label: t('admin.settings.setting'), cell: (r) => t(r.k) },
        {
            key: 'v',
            label: t('admin.settings.value'),
            cell: (r) => (
                <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="tabular">{days(r.k, r.show(valueOf(r)))}</span>
                    {edits[r.k] !== undefined && (
                        <>
                            <StatusChip status="pending" kind="warning" label={t('admin.changed')} />
                            <span className="text-[13px] font-bold text-[var(--text-muted)]">
                                {t('admin.was', { value: days(r.k, r.show(r.raw)) })}
                            </span>
                        </>
                    )}
                </span>
            )
        },
        {
            key: 's',
            label: t('admin.settings.source'),
            cell: (r) => (
                <StatusChip
                    status={r.src === 'brief' ? 'open' : 'pending'}
                    kind={r.src === 'brief' ? 'brand' : 'warning'}
                    label={t(r.src === 'brief' ? 'admin.src.brief' : 'mk.tag.assumed')}
                />
            )
        }
    ];
    if (overridesQ.isSuccess)
        cols.push({
            key: 'actions',
            label: t('admin.users.actions'),
            cell: (r) =>
                r.kind === 'fixed' ? null : (
                    <SecondaryButton icon="Settings" onClick={() => setPending({ row: r, value: valueOf(r) })}>
                        {t('admin.change.action')}
                    </SecondaryButton>
                ),
            nowrap: true
        });
    return (
        <AppShell role="admin" active="config" title="admin.settings.title" eyebrow="admin.eyebrow">
            <div className="flex flex-col gap-6">
                <p className="rc-lede">{t('admin.settings.lead')}</p>
                {overridesQ.isPending ? (
                    <LoadingState rows={1} />
                ) : overridesQ.isError ? (
                    <ErrorState onRetry={() => void overridesQ.refetch()} />
                ) : null}
                <ResponsiveTable
                    caption={t('admin.settings.caption')}
                    cols={cols}
                    rows={SETTINGS}
                    rowKey={(r) => r.k}
                />
                <Note>{t('admin.settings.note')}</Note>
            </div>
            <AlertDialog
                open={pending !== null}
                onOpenChange={(o) => {
                    if (!o) setPending(null);
                }}
                title={t('admin.change.settingTitle', { setting: pending ? t(pending.row.k) : '' })}
                description={t('admin.change.settingBody', {
                    value: pending ? days(pending.row.k, pending.row.show(valueOf(pending.row))) : ''
                })}
                confirmLabel={t('admin.change.save')}
                typedWord={t('admin.change.word')}
                confirmDisabled={pending !== null && !valid(pending.row, pending.value)}
                onConfirm={() => {
                    const p = pending;
                    if (!p || !valid(p.row, p.value)) return;
                    const value = p.value.trim();
                    setPending(null);
                    void setAssumption
                        .mutateAsync({ key: p.row.k, value })
                        .then(() =>
                            toast.show(
                                t('admin.change.settingToast', {
                                    setting: t(p.row.k),
                                    value: days(p.row.k, p.row.show(value))
                                }),
                                {
                                    label: t('action.undo'),
                                    onClick: () => {
                                        void clearAssumption.mutateAsync({ key: p.row.k });
                                    }
                                }
                            )
                        )
                        .catch(() => toast.show(t('admin.change.failed')));
                }}
            >
                <label className="flex flex-col gap-1 text-[13px] font-bold">
                    <span>{t('admin.change.newValue')}</span>
                    <input
                        type={pending?.row.kind === 'number' ? 'number' : 'text'}
                        step="any"
                        value={pending?.value ?? ''}
                        onChange={(e) => setPending((p) => (p ? { ...p, value: e.target.value } : p))}
                        className="min-h-[44px] px-3 rounded-xl bg-[var(--glass-fill-strong)] border-2 border-[color:var(--text-muted)] text-[16px] font-bold"
                    />
                    {pending && !valid(pending.row, pending.value) && (
                        <span role="alert" className="text-[13px] font-bold text-[var(--danger-ink)]">
                            {t('admin.change.invalid')}
                        </span>
                    )}
                </label>
            </AlertDialog>
        </AppShell>
    );
}

/* ---------- activity ---------- */
/** /admin/activity: the S-11 audit view. Derived from the current demo state in this browser (orders, replies,
    hauls, slots, added farms, role and assumption changes), so it is honest about not being an append-only log:
    Undo or Reset removes an entry. The per-entity audit trail ships with the backend (Phase 3, B-06). */
export function AdminActivityScreen() {
    const { t } = useI18n();
    const s = useDemoState();
    const overridesQ = useAdminOverrides();
    const roleEdits = overridesQ.data?.roles ?? {};
    const settingEdits = overridesQ.data?.settings ?? {};
    const [resetOpen, setResetOpen] = useState(false);
    const [done, setDone] = useState(false);
    const items: { icon: string; text: string }[] = [
        ...s.riceOrders.map((o) => ({
            icon: 'Orders',
            text: t('admin.activity.order', { id: o.id, sacks: o.sacks, total: peso(o.total) })
        })),
        ...s.commitments.map((c) => ({
            icon: 'Market',
            text: t('admin.activity.commitment', { id: c.id, t: c.tonnes })
        })),
        ...s.smsReplies.map((r) => ({ icon: 'Sms', text: t('admin.activity.reply', { farm: r.farm, text: r.text }) })),
        ...Object.entries(s.hauls).map(([id, st]) => ({
            icon: 'Truck',
            text: t('admin.activity.haul', { id, status: t('status.' + st) })
        })),
        ...Object.entries(s.slots).map(([id, st]) => ({
            icon: 'Dry',
            text: t('admin.activity.slot', { id, status: t('slot.' + st, { id }) })
        })),
        ...s.farmsAdded.map((id) => ({ icon: 'Farm', text: t('admin.activity.added', { id }) })),
        ...Object.entries(roleEdits).map(([key, role]) => ({
            icon: 'Users',
            text: t('admin.activity.role', {
                code: key.split(':').slice(1).join(':') || key,
                role: t('admin.role.' + role)
            })
        })),
        ...Object.entries(settingEdits).map(([k, v]) => ({
            icon: 'Settings',
            text: t('admin.activity.setting', { setting: t(k), value: v })
        }))
    ].reverse();
    return (
        <AppShell role="admin" active="activity" title="admin.activity.title" eyebrow="admin.eyebrow">
            <div className="flex flex-col gap-6">
                <p className="rc-lede">{t('admin.activity.lead')}</p>
                {items.length === 0 ? (
                    <EmptyState title={t('admin.activity.none')} body={t('admin.activity.noneBody')} />
                ) : (
                    <section aria-labelledby="adm-act" className="panel-solid rounded-[1.75rem] p-5 md:p-6 min-w-0">
                        <SectionHead id="adm-act" title={t('nav.activity')} />
                        <ol aria-live="polite" className="flex flex-col">
                            {items.map((it, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 py-2.5 border-b border-[color:var(--glass-border-strong)] last:border-0 text-[15px] font-bold tabular"
                                >
                                    <Icon name={it.icon} size={20} className="shrink-0 mt-0.5" />
                                    <span className="break-words">{it.text}</span>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}
                <div className="panel-solid rounded-[1.75rem] p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className={H2}>{t('mk.reset.h')}</h2>
                        <p className="m-0 text-[15px] leading-6 font-medium text-[var(--text-secondary)]">
                            {t('mk.reset.p')}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <SecondaryButton icon="Retry" onClick={() => setResetOpen(true)}>
                            {t('mk.reset.cta')}
                        </SecondaryButton>
                        {done && (
                            <p
                                role="status"
                                className="m-0 text-[14px] font-extrabold text-[var(--success-ink)] flex items-center gap-1"
                            >
                                <Icon name="CircleCheck" size={20} />
                                {t('mk.reset.done')}
                            </p>
                        )}
                    </div>
                </div>
                <Note>{t('admin.activity.note')}</Note>
            </div>
            <AlertDialog
                open={resetOpen}
                onOpenChange={setResetOpen}
                title={t('admin.reset.title')}
                description={t('admin.reset.body')}
                confirmLabel={t('mk.reset.cta')}
                typedWord={t('admin.reset.word')}
                onConfirm={() => {
                    resetDemoState();
                    setDone(true);
                }}
            >
                <p className="m-0 text-[15px] font-bold">{t('admin.reset.count', { n: items.length })}</p>
            </AlertDialog>
        </AppShell>
    );
}
