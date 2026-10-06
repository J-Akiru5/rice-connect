'use client';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { ZLink as Link, useZoneNav } from '../lib/zone';
import NavLink from './NavLink';
import ApplicationLogo from './ApplicationLogo';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';
import { Dialog } from '../kit/Dialog';
import { DemoChip, LanguageSwitcher } from './Enactus';
import { useI18n, tx } from '@rc/i18n';
import type { SessionRole } from '@rc/store';
import { ACCOUNTS, auth } from '../lib/account';
import { useSession } from '../lib/session';

/* Intentional addition: Karl's AuthenticatedLayout reduced to a reusable shell for the prototype.
   Glass sidebar + header over the flat terrace-contour ground (.rc-ground).
   Prototype port (see docs/DECISIONS.md): the photo ground is removed; nav items without a route
   (Console, Inventory, Settings) are dropped so there are no dead links; every item links to a real route;
   a ThemeToggle and the team footer are added. Haul lives under Logistics, Pay under Orders. */
export type Role = SessionRole;
type Item = { key: string; icon: string; href: string; sub?: string };
const NAV: Record<Role, Item[]> = {
    coordinator: [
        { key: 'home', icon: 'Console', href: '/home' },
        { key: 'farms', icon: 'Farm', href: '/farm' },
        { key: 'plan', icon: 'Plan', href: '/plan' },
        { key: 'market', icon: 'Market', href: '/market' },
        { key: 'dry', icon: 'Dry', href: '/dry' },
        { key: 'logistics', icon: 'Logistics', href: '/haul', sub: 'haul' },
        { key: 'orders', icon: 'Orders', href: '/pay', sub: 'pay' },
        { key: 'sms', icon: 'Sms', href: '/sms' }
    ],
    buyer: [
        { key: 'supply', icon: 'Market', href: '/buyer' },
        { key: 'myorders', icon: 'Orders', href: '/buyer/orders' }
    ],
    /* Driver (docs/DECISIONS.md M52): the jobs list at /haul/driver and the SMS inbox, nothing else. */
    driver: [
        { key: 'jobs', icon: 'Logistics', href: '/haul/driver', sub: 'haul' },
        { key: 'sms', icon: 'Sms', href: '/sms' }
    ],
    /* Farmer (docs/DECISIONS.md M52): the SMS inbox, the harvest plan with its delivery
       booking, central milling and the settlement slip. Four tabs fit; the contract price
       page rides in the More sheet, which splitNav() opens from the fifth item on. */
    farmer: [
        { key: 'sms', icon: 'Sms', href: '/sms' },
        { key: 'plan', icon: 'Plan', href: '/farmer/plan' },
        { key: 'milling', icon: 'Sack', href: '/farmer/milling' },
        { key: 'price', icon: 'Market', href: '/farmer/price' },
        { key: 'slip', icon: 'Pay', href: '/slip' }
    ],
    /* Super admin (prototype addition, docs/DECISIONS.md M20): read-only overview of every app. */
    admin: [
        { key: 'overview', icon: 'Console', href: '/admin' },
        { key: 'users', icon: 'Users', href: '/admin/users' },
        { key: 'config', icon: 'Settings', href: '/admin/settings' },
        { key: 'activity', icon: 'Activity', href: '/admin/activity' }
    ]
};
/* Mobile bottom tabs; everything else in the role's nav goes into the "More" sheet. */
const TABS: Record<Role, string[]> = {
    coordinator: ['home', 'farms', 'logistics', 'orders'],
    buyer: ['supply', 'myorders'],
    driver: ['jobs', 'sms'],
    farmer: ['sms', 'plan', 'milling', 'slip'],
    admin: ['overview', 'users', 'config', 'activity']
};
/* One split for both shells, so the sidebar, the tab bar and the phone frame always agree (WCAG 3.2.3). */
const splitNav = (role: Role) => {
    const nav = NAV[role];
    return {
        nav,
        tabs: nav.filter((n) => TABS[role].includes(n.key)),
        rest: nav.filter((n) => !TABS[role].includes(n.key))
    };
};
const ROLE_LABEL: Record<Role, string> = {
    coordinator: 'role.coordinator',
    buyer: 'role.buyer',
    driver: 'role.driver',
    farmer: 'role.farmer',
    admin: 'role.admin'
};
const isActive = (n: Item, active: string) => active === n.key || active === n.sub;

/** The "More" sheet holds every nav item that is not a bottom tab. One implementation for the responsive
    shell and the phone frame, so the two can never drift apart again. */
function MoreSheet({
    rest,
    active,
    open,
    onOpenChange
}: {
    rest: Item[];
    active: string;
    open: boolean;
    onOpenChange: (o: boolean) => void;
}) {
    const { t } = useI18n();
    return (
        <Dialog
            open={open}
            onOpenChange={(o) => !o && onOpenChange(false)}
            title={t('nav.more')}
            hideTitle
            maxWidth="sm"
            closeButton={false}
            className="!p-0"
        >
            <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="eyebrow">{t('nav.more')}</h2>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                    >
                        <Icon name="X" size={24} />
                        {t('haul.close')}
                    </button>
                </div>
                {rest.map((n) => (
                    <NavLink
                        key={n.key}
                        href={n.href}
                        icon={n.icon}
                        active={isActive(n, active)}
                        onClick={() => onOpenChange(false)}
                    >
                        <span>{t('nav.' + n.key)}</span>
                    </NavLink>
                ))}
            </div>
        </Dialog>
    );
}

/** Sign Out (signed in) or Log In (signed out) for this app's own simulated sign-in (docs/DECISIONS.md M22). */
export function AccountButton({ role }: { role: Role }) {
    const { t } = useI18n();
    const nav = useZoneNav();
    const signedIn = useSession(role);
    const cls =
        'inline-flex items-center gap-2 min-h-[44px] md:min-h-[40px] px-3 md:px-4 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em] whitespace-nowrap rc-hover-accent';
    if (!signedIn)
        return (
            <Link href={ACCOUNTS[role].signIn} className={cls}>
                <Icon name="LogIn" size={20} />
                <span>{t('mk.login')}</span>
            </Link>
        );
    return (
        <button
            type="button"
            className={cls}
            onClick={async () => {
                await auth.signOut(role);
                nav(ACCOUNTS[role].signIn);
            }}
        >
            <Icon name="LogOut" size={20} />
            <span>{t('signin.out')}</span>
        </button>
    );
}
/** "Signed In: Cluster 1" (nothing when signed out). */
function SignedInAs({ role, className = '' }: { role: Role; className?: string }) {
    const { t } = useI18n();
    const id = useSession(role);
    if (!id) return null;
    return (
        <span
            className={
                'inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)] break-words ' +
                className
            }
        >
            <Icon name={ACCOUNTS[role].icon} size={18} className="shrink-0" />
            {t('signin.as', { who: tx(t, id) })}
        </span>
    );
}

export function TeamFooter({ className = '' }: { className?: string }) {
    return (
        <footer className={'px-4 md:px-8 py-4 text-[13px] font-semibold text-[var(--text-secondary)] ' + className}>
            Team Syntaxure Labs · ISUFST
        </footer>
    );
}

/* Responsive shell (prototype addition, derived from Karl's AuthenticatedLayout; see docs/DECISIONS.md):
   <768px  top bar (logo mark, LanguageSwitcher, theme) + title row with DemoChip + bottom tab bar with a More sheet;
   768-1199px collapsed icon rail (icon + word);  >=1200px full left sidebar. Content max-width 1280px, centered.
   Media queries only; module content inside uses container queries (.rc-cq). */
export default function AppShell({
    role = 'coordinator',
    active = 'farms',
    title,
    eyebrow,
    actions,
    children
}: PropsWithChildren<{ role?: Role; active?: string; title: ReactNode; eyebrow?: ReactNode; actions?: ReactNode }>) {
    const { t } = useI18n();
    title = tx(t, title);
    eyebrow = tx(t, eyebrow);
    const [more, setMore] = useState(false);
    const { nav, tabs, rest } = splitNav(role);
    const moreActive = rest.some((n) => isActive(n, active));
    return (
        <div className="rc-ground min-h-screen w-full md:flex">
            {/* Tablet rail + desktop sidebar */}
            <aside
                aria-label="Main"
                className="glass-panel !rounded-none hidden md:flex shrink-0 flex-col gap-1 sticky top-0 h-screen overflow-y-auto md:w-[104px] lg:w-[264px] p-3 lg:p-5 border-r border-[color:var(--glass-border)]"
            >
                <Link href="/" className="self-center lg:self-start rounded-xl pb-3 lg:px-2 lg:pb-5">
                    <span className="lg:hidden">
                        <ApplicationLogo variant="mark" height={48} />
                    </span>
                    <span className="hidden lg:inline">
                        <ApplicationLogo height={40} />
                    </span>
                </Link>
                <nav className="hidden lg:flex flex-col gap-1">
                    {nav.map((n) => (
                        <NavLink key={n.key} href={n.href} icon={n.icon} active={isActive(n, active)}>
                            <span>{t('nav.' + n.key)}</span>
                            {n.sub && (
                                <span
                                    className={`ml-1 text-[12px] font-bold normal-case tracking-normal ${isActive(n, active) ? 'text-[var(--on-fill-strong)]' : 'text-[var(--text-muted)]'}`}
                                >
                                    · {t('nav.' + n.sub)}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <nav className="flex lg:hidden flex-col gap-1">
                    {nav.map((n) => (
                        <Link
                            key={n.key}
                            href={n.href}
                            aria-current={isActive(n, active) ? 'page' : undefined}
                            className={`flex flex-col items-center justify-center gap-1 min-h-[64px] px-1 py-2 rounded-2xl text-center text-[12px] leading-4 font-extrabold break-words ${isActive(n, active) ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)] rc-hover-accent'}`}
                        >
                            <Icon name={n.icon} size={20} />
                            {t('nav.' + n.key)}
                        </Link>
                    ))}
                </nav>
                <div className="hidden lg:flex mt-auto px-2 pt-4 flex-col gap-2">
                    <span className="text-[13px] font-semibold text-[var(--text-secondary)] inline-flex items-center gap-2">
                        <Icon name="User" size={18} />
                        {t(ROLE_LABEL[role])}
                    </span>
                    <SignedInAs role={role} />
                </div>
            </aside>
            <div className="flex-1 min-w-0 flex flex-col min-h-screen">
                <header className="glass-panel !rounded-none !shadow-none border-b border-[color:var(--glass-border)] px-4 md:px-6 lg:px-8 py-3 md:py-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link href="/" className="md:hidden rounded-xl">
                            <ApplicationLogo variant="mark" height={48} />
                        </Link>
                        <div className="hidden md:block min-w-0 flex-1">
                            {eyebrow && <div className="eyebrow break-words">{eyebrow}</div>}
                            <h1 className="text-[28px] leading-8 font-extrabold tracking-[-0.03em] uppercase break-words">
                                {title}
                            </h1>
                        </div>
                        <div className="flex-1 md:hidden" />
                        <DemoChip className="hidden md:inline-flex" />
                        <SignedInAs role={role} className="hidden md:inline-flex lg:hidden" />
                        <AccountButton role={role} />
                        {/* One render, kept together: under 768px the pair wraps as a unit to its own row
                            instead of the theme word dropping onto a line by itself. */}
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher />
                            <ThemeToggle iconSize={20} />
                        </div>
                        {actions}
                    </div>
                    <div className="md:hidden mt-2 flex items-center justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            {eyebrow && <div className="eyebrow break-words">{eyebrow}</div>}
                            <h1 className="text-[22px] leading-7 font-extrabold tracking-[-0.02em] uppercase break-words">
                                {title}
                            </h1>
                            <SignedInAs role={role} className="mt-1" />
                        </div>
                        <DemoChip />
                    </div>
                </header>
                <main className="rc-cq flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-4 md:py-8">
                    <div className="mx-auto w-full max-w-[1280px] min-w-0">{children}</div>
                </main>
                <TeamFooter className="pb-[88px] md:pb-4" />
            </div>
            {/* Mobile bottom tab bar */}
            <nav
                aria-label="Main"
                className="md:hidden glass-panel !rounded-none fixed bottom-0 inset-x-0 z-40 grid border-t border-[color:var(--glass-border)]"
                style={{ gridTemplateColumns: `repeat(${tabs.length + (rest.length ? 1 : 0)},minmax(0,1fr))` }}
            >
                {tabs.map((n) => (
                    <Link
                        key={n.key}
                        href={n.href}
                        aria-current={isActive(n, active) ? 'page' : undefined}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[64px] px-1 text-center text-[12px] leading-4 font-extrabold break-words ${isActive(n, active) ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}
                    >
                        <Icon name={n.icon} size={24} />
                        {t('nav.' + n.key)}
                        {isActive(n, active) && <span className="w-6 h-1 rounded-full bg-[var(--text-accent)]" />}
                    </Link>
                ))}
                {rest.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setMore(true)}
                        aria-haspopup="dialog"
                        aria-expanded={more}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[64px] px-1 text-[12px] leading-4 font-extrabold ${moreActive ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}
                    >
                        <Icon name="Plus" size={24} />
                        {t('nav.more')}
                        {moreActive && <span className="w-6 h-1 rounded-full bg-[var(--text-accent)]" />}
                    </button>
                )}
            </nav>
            <MoreSheet rest={rest} active={active} open={more} onOpenChange={setMore} />
        </div>
    );
}

/* Phone version: top bar (logo mark, chip, switcher, theme) + content + bottom tab bar (24px icons + words, 60px tall). */
export function PhoneShell({
    role = 'coordinator',
    active = 'farms',
    title,
    children
}: PropsWithChildren<{ role?: Role; active?: string; title: ReactNode }>) {
    const { t } = useI18n();
    title = tx(t, title);
    /* Same list as the responsive shell, one split (docs/DECISIONS.md M52): the frame used to carry its own
       copy of the tabs, which put coordinator tabs on the farmer's phone and a different label on the driver. */
    const [more, setMore] = useState(false);
    const { tabs, rest } = splitNav(role);
    const moreActive = rest.some((n) => isActive(n, active));
    return (
        <div className="rc-ground min-h-full flex flex-col">
            <header className="glass-panel !rounded-none !shadow-none px-4 pt-2 pb-3 border-b border-[color:var(--glass-border)]">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Link href="/" className="rounded-xl">
                        <ApplicationLogo variant="mark" height={48} />
                    </Link>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <LanguageSwitcher />
                        <ThemeToggle iconSize={24} />
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                    <h1 className="text-[22px] leading-7 font-extrabold tracking-[-0.02em] uppercase">{title}</h1>
                    <DemoChip />
                </div>
            </header>
            <div className="rc-cq flex-1 min-w-0 p-4">{children}</div>
            <TeamFooter className="!px-4 !pt-0 pb-4" />
            <nav
                aria-label="Main"
                className="glass-panel !rounded-none sticky bottom-0 z-40 grid border-t border-[color:var(--glass-border)]"
                style={{ gridTemplateColumns: `repeat(${tabs.length + (rest.length ? 1 : 0)},minmax(0,1fr))` }}
            >
                {tabs.map((n) => (
                    <Link
                        key={n.key}
                        href={n.href}
                        aria-current={isActive(n, active) ? 'page' : undefined}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[60px] px-1 text-center text-[12px] leading-4 font-extrabold break-words ${isActive(n, active) ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}
                    >
                        <Icon name={n.icon} size={24} />
                        {t('nav.' + n.key)}
                        {isActive(n, active) && (
                            <span className="mt-0.5 w-6 h-1 rounded-full bg-[var(--text-accent)]" />
                        )}
                    </Link>
                ))}
                {rest.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setMore(true)}
                        aria-haspopup="dialog"
                        aria-expanded={more}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[60px] px-1 text-center text-[12px] leading-4 font-extrabold break-words ${moreActive ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}
                    >
                        <Icon name="Plus" size={24} />
                        {t('nav.more')}
                        {moreActive && <span className="mt-0.5 w-6 h-1 rounded-full bg-[var(--text-accent)]" />}
                    </button>
                )}
            </nav>
            <MoreSheet rest={rest} active={active} open={more} onOpenChange={setMore} />
        </div>
    );
}
