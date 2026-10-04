'use client';
import { AppShell, BigStat, EmptyState, Icon, Pagination, SecondaryButton, StatusChip, ZLink, useI18n } from '@rc/ui';
import overrides from '@rc/domain/overrides.json';
import { COMMITMENTS, DRIVERS, FARMS, LOTS, VEHICLES, commitmentOfLot, vehicleOf } from '@rc/domain/seed';
import { MUNICIPALITY, PRICE } from '@rc/domain/params';
import { MILLING } from '@rc/domain/buyers';
import { dayLabel } from '@rc/domain/calendar';
import { paginate } from '@rc/domain/list';
import { peso } from '@rc/domain/money';
import { useDemoState, resetDemoState } from '@rc/store/react';
import { useState } from 'react';
import { staticListState, type ListState } from './list-state';
import { Note, ResponsiveTable, SectionPill, type Col } from './ui';

/* Super admin (prototype addition, docs/DECISIONS.md M20; derived, not in canvas). Read-only views over the seed and
   over the demo state in this browser. No accounts exist, so there is nothing to grant or revoke: "Users and Roles"
   is a directory built from the seeded codes (mobiles masked). Everything carries the DemoChip through AppShell. */

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
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))] tabular">
                    <BigStat
                        icon="Farm"
                        label="admin.stat.farms"
                        value={FARMS.length}
                        note={t('admin.stat.farms.sub', { n: IN_CLUSTER })}
                    />
                    <BigStat
                        icon="Store"
                        label="admin.stat.buyers"
                        value={BUYERS.length}
                        note="admin.stat.buyers.sub"
                    />
                    <BigStat
                        icon="Truck"
                        label="admin.stat.drivers"
                        value={DRIVERS.length}
                        note={t('admin.stat.drivers.sub', { n: VEHICLES.length })}
                    />
                    <BigStat
                        icon="Sack"
                        label="admin.stat.lots"
                        value={LOTS.length}
                        note={t('admin.stat.lots.sub', { n: MATCHED_LOTS })}
                    />
                </div>
                <div className="cq-two">
                    <section
                        aria-labelledby="adm-apps"
                        className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3 min-w-0"
                    >
                        <h2 id="adm-apps" className="eyebrow">
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
                        className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3 min-w-0"
                    >
                        <h2 id="adm-live" className="eyebrow">
                            {t('admin.live.h')}
                        </h2>
                        <dl className="grid grid-cols-2 gap-4 tabular">
                            {live.map(([k, n]) => (
                                <div key={k}>
                                    <dt className="text-[13px] font-bold text-[var(--text-secondary)]">{t(k)}</dt>
                                    <dd className="m-0 text-[28px] font-extrabold">{n}</dd>
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
type URole = 'coordinator' | 'farmer' | 'buyer' | 'driver';
interface UserRow {
    code: string;
    role: URole;
    contact: string;
    where: string;
    detail: string;
    status?: string;
    statusLabel?: string;
}
const USERS: UserRow[] = [
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
const ROLE_ORDER: URole[] = ['coordinator', 'farmer', 'buyer', 'driver'];

/** /admin/users: searchable, filterable by role, paginated with URL state (lists over 12 rows). */
export function AdminUsersScreen({ list }: { list?: ListState }) {
    const { t } = useI18n();
    const L = list ?? staticListState('/admin/users');
    const q = L.q.trim().toLowerCase();
    const role = ROLE_ORDER.includes(L.status as URole) ? (L.status as URole) : '';
    const rows = USERS.filter(
        (u) =>
            (!role || u.role === role) && (!q || [u.code, u.where, u.detail].some((v) => v.toLowerCase().includes(q)))
    );
    const pg = paginate(rows, L.page, L.size);
    const cols: Col<UserRow>[] = [
        { key: 'code', label: t('admin.users.code'), cell: (u) => u.code },
        { key: 'role', label: t('admin.users.role'), cell: (u) => t('admin.role.' + u.role) },
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
    const field =
        'min-h-[44px] md:min-h-[40px] px-4 rounded-full bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] text-[15px] font-bold';
    return (
        <AppShell role="admin" active="users" title="admin.users.title" eyebrow="admin.eyebrow">
            <div className="flex flex-col gap-4">
                <div className="glass-panel rounded-[1.5rem] p-4 flex flex-wrap items-end gap-3">
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
                            {ROLE_ORDER.map((r) => (
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
                        rowKey={(u) => u.role + u.code}
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
        </AppShell>
    );
}

/* ---------- settings ---------- */
interface SetRow {
    k: string;
    value: string;
    src: 'assumed' | 'brief';
}
const SETTINGS: SetRow[] = [
    { k: 'admin.set.kgPerSack', value: `${overrides.kgPerSack} kg`, src: 'assumed' },
    { k: 'admin.set.dryer', value: `${overrides.dryerKgPerDay.toLocaleString('en-PH')} kg`, src: 'assumed' },
    { k: 'admin.set.grade', value: overrides.forecastGrade, src: 'assumed' },
    { k: 'admin.set.mc', value: `${overrides.forecastMcPct}% MC`, src: 'assumed' },
    { k: 'admin.set.smsLead', value: String(overrides.smsSlotLeadDays), src: 'assumed' },
    { k: 'admin.set.buyerPays', value: String(overrides.buyerPaysAfterDays), src: 'assumed' },
    { k: 'admin.set.milling', value: `${MILLING.recoveryPct}%`, src: 'assumed' },
    { k: 'admin.set.ricePrice', value: `${peso(MILLING.price)}/kg · ${MILLING.sackKg} kg sacks`, src: 'assumed' },
    { k: 'admin.set.today', value: dayLabel(overrides.demoTodayDayIndex), src: 'assumed' },
    { k: 'admin.set.advance', value: `${PRICE.advancePct}%`, src: 'brief' }
];

/** /admin/settings: read-only; values from overrides.json (assumed) and the brief. */
export function AdminSettingsScreen() {
    const { t } = useI18n();
    const days = (k: string, v: string) =>
        k === 'admin.set.smsLead' || k === 'admin.set.buyerPays' ? t('admin.days', { n: v }) : v;
    const cols: Col<SetRow>[] = [
        { key: 'k', label: t('admin.settings.setting'), cell: (r) => t(r.k) },
        {
            key: 'v',
            label: t('admin.settings.value'),
            cell: (r) => <span className="tabular">{days(r.k, r.value)}</span>
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
    return (
        <AppShell role="admin" active="config" title="admin.settings.title" eyebrow="admin.eyebrow">
            <div className="flex flex-col gap-4">
                <ResponsiveTable
                    caption={t('admin.settings.caption')}
                    cols={cols}
                    rows={SETTINGS}
                    rowKey={(r) => r.k}
                />
                <Note>{t('admin.settings.note')}</Note>
            </div>
        </AppShell>
    );
}

/* ---------- activity ---------- */
/** /admin/activity: every change the demo made in this browser (the shared store), newest first, plus Reset. */
export function AdminActivityScreen() {
    const { t } = useI18n();
    const s = useDemoState();
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
        ...s.farmsAdded.map((id) => ({ icon: 'Farm', text: t('admin.activity.added', { id }) }))
    ].reverse();
    return (
        <AppShell role="admin" active="activity" title="admin.activity.title" eyebrow="admin.eyebrow">
            <div className="flex flex-col gap-4">
                {items.length === 0 ? (
                    <EmptyState title={t('admin.activity.none')} body={t('admin.activity.noneBody')} />
                ) : (
                    <section aria-labelledby="adm-act" className="glass-panel rounded-[1.5rem] p-5 min-w-0">
                        <SectionPill id="adm-act">{t('nav.activity')}</SectionPill>
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
                <div className="glass-panel rounded-[1.5rem] p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-[18px] font-extrabold">{t('mk.reset.h')}</h2>
                        <p className="m-0 text-[15px] leading-6 font-medium text-[var(--text-secondary)]">
                            {t('mk.reset.p')}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <SecondaryButton
                            icon="Retry"
                            onClick={() => {
                                resetDemoState();
                                setDone(true);
                            }}
                        >
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
        </AppShell>
    );
}
