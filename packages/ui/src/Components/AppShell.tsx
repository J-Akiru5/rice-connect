'use client';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { ZLink as Link, useZoneNav } from '../lib/zone';
import NavLink from './NavLink';
import ApplicationLogo from './ApplicationLogo';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';
import Modal from './Modal';
import { DemoChip, LanguageSwitcher } from './Enactus';
import { useI18n, tx } from '@rc/i18n';

/* Intentional addition: Karl's AuthenticatedLayout reduced to a reusable shell for the prototype.
   Glass sidebar + header over the flat terrace-contour ground (.rc-ground).
   Prototype port (see docs/DECISIONS.md): the photo ground is removed; nav items without a route
   (Console, Inventory, Settings) are dropped so there are no dead links; every item links to a real route;
   a ThemeToggle and the team footer are added. Haul lives under Logistics, Pay under Orders. */
export type Role = 'coordinator' | 'buyer' | 'driver';
type Item = { key: string; icon: string; href: string; sub?: string };
const NAV: Record<Role, Item[]> = {
    coordinator: [
        { key: 'farms', icon: 'Farm', href: '/farm' }, { key: 'plan', icon: 'Plan', href: '/plan' }, { key: 'market', icon: 'Market', href: '/market' },
        { key: 'dry', icon: 'Dry', href: '/dry' }, { key: 'logistics', icon: 'Logistics', href: '/haul', sub: 'haul' },
        { key: 'orders', icon: 'Orders', href: '/pay', sub: 'pay' }, { key: 'sms', icon: 'Sms', href: '/sms' },
    ],
    buyer: [{ key: 'supply', icon: 'Market', href: '/buyer' }, { key: 'myorders', icon: 'Orders', href: '/buyer/orders' }],
    driver: [{ key: 'logistics', icon: 'Logistics', href: '/haul/driver', sub: 'haul' }, { key: 'sms', icon: 'Sms', href: '/sms' }],
};
/* Mobile bottom tabs; everything else in the role's nav goes into the "More" sheet. */
const TABS: Record<Role, string[]> = { coordinator: ['farms', 'logistics', 'orders', 'sms'], buyer: ['supply', 'myorders'], driver: ['logistics', 'sms'] };
const ROLE_LABEL: Record<Role, string> = { coordinator: 'role.coordinator', buyer: 'role.buyer', driver: 'role.driver' };
const isActive = (n: Item, active: string) => active === n.key || active === n.sub;

const HOME: Record<Role, string> = { coordinator: '/farm', buyer: '/buyer', driver: '/haul/driver' };
/** "View as" (prototype addition): switches the demo between user groups. Navigation only, not access control. */
export function RoleSwitcher({ role }: { role: Role }) {
    const { t } = useI18n();
    const nav = useZoneNav();
    return (
        <label className="inline-flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.06em]">
            <Icon name="Users" size={20} /><span className="sr-only md:not-sr-only">{t('role.view')}</span>
            <select value={role} onChange={(e) => nav(HOME[e.target.value as Role])}
                className="min-h-[44px] md:min-h-[40px] px-3 rounded-full bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] text-[14px] font-extrabold normal-case tracking-normal">
                {(['coordinator', 'buyer', 'driver'] as Role[]).map((r) => <option key={r} value={r}>{t('role.name.' + r)}</option>)}
            </select>
        </label>
    );
}

export function TeamFooter({ className = '' }: { className?: string }) {
    return <footer className={'px-4 md:px-8 py-4 text-[13px] font-semibold text-[var(--text-secondary)] ' + className}>Team Syntaxure Labs · ISUFST</footer>;
}

/* Responsive shell (prototype addition, derived from Karl's AuthenticatedLayout; see docs/DECISIONS.md):
   <768px  top bar (logo mark, LanguageSwitcher, theme) + title row with DemoChip + bottom tab bar with a More sheet;
   768-1199px collapsed icon rail (icon + word);  >=1200px full left sidebar. Content max-width 1280px, centered.
   Media queries only; module content inside uses container queries (.rc-cq). */
export default function AppShell({ role = 'coordinator', active = 'farms', title, eyebrow, actions, children }: PropsWithChildren<{ role?: Role; active?: string; title: ReactNode; eyebrow?: ReactNode; actions?: ReactNode }>) {
    const { t } = useI18n(); title = tx(t, title); eyebrow = tx(t, eyebrow);
    const [more, setMore] = useState(false);
    const nav = NAV[role];
    const tabs = nav.filter((n) => TABS[role].includes(n.key));
    const rest = nav.filter((n) => !TABS[role].includes(n.key));
    const moreActive = rest.some((n) => isActive(n, active));
    return (
        <div className="rc-ground min-h-screen w-full md:flex">
            {/* Tablet rail + desktop sidebar */}
            <aside aria-label="Main" className="glass-panel !rounded-none hidden md:flex shrink-0 flex-col gap-1 sticky top-0 h-screen overflow-y-auto md:w-[104px] lg:w-[264px] p-3 lg:p-5 border-r border-[color:var(--glass-border)]">
                <Link href="/" className="self-center lg:self-start rounded-xl pb-3 lg:px-2 lg:pb-5">
                    <span className="lg:hidden"><ApplicationLogo variant="mark" height={48} /></span>
                    <span className="hidden lg:inline"><ApplicationLogo height={40} /></span>
                </Link>
                <nav className="hidden lg:flex flex-col gap-1">
                    {nav.map((n) => (
                        <NavLink key={n.key} href={n.href} icon={n.icon} active={isActive(n, active)}>
                            <span>{t('nav.' + n.key)}</span>
                            {n.sub && <span className={`ml-1 text-[12px] font-bold normal-case tracking-normal ${isActive(n, active) ? 'text-[var(--on-fill-strong)]' : 'text-[var(--text-muted)]'}`}>· {t('nav.' + n.sub)}</span>}
                        </NavLink>
                    ))}
                </nav>
                <nav className="flex lg:hidden flex-col gap-1">
                    {nav.map((n) => (
                        <Link key={n.key} href={n.href} aria-current={isActive(n, active) ? 'page' : undefined}
                            className={`flex flex-col items-center justify-center gap-1 min-h-[64px] px-1 py-2 rounded-2xl text-center text-[12px] leading-4 font-extrabold break-words ${isActive(n, active) ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'text-[var(--ink)] hover:bg-[rgba(5,150,105,.1)]'}`}>
                            <Icon name={n.icon} size={20} />{t('nav.' + n.key)}
                        </Link>
                    ))}
                </nav>
                <div className="hidden lg:flex mt-auto px-2 pt-4 text-[13px] font-semibold text-[var(--text-secondary)] items-center gap-2"><Icon name="User" size={18} />{t(ROLE_LABEL[role])}</div>
            </aside>
            <div className="flex-1 min-w-0 flex flex-col min-h-screen">
                <header className="glass-panel !rounded-none !shadow-none border-b border-[color:var(--glass-border)] px-4 md:px-6 lg:px-8 py-3 md:py-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link href="/" className="md:hidden rounded-xl"><ApplicationLogo variant="mark" height={48} /></Link>
                        <div className="hidden md:block min-w-0 flex-1">
                            {eyebrow && <div className="eyebrow break-words">{eyebrow}</div>}
                            <h1 className="text-[28px] leading-8 font-extrabold tracking-[-0.03em] uppercase break-words">{title}</h1>
                        </div>
                        <div className="flex-1 md:hidden" />
                        <DemoChip className="hidden md:inline-flex" />
                        <RoleSwitcher role={role} />
                        <LanguageSwitcher />
                        <ThemeToggle iconSize={20} />
                        {actions}
                    </div>
                    <div className="md:hidden mt-2 flex items-center justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            {eyebrow && <div className="eyebrow break-words">{eyebrow}</div>}
                            <h1 className="text-[22px] leading-7 font-extrabold tracking-[-0.02em] uppercase break-words">{title}</h1>
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
            <nav aria-label="Main" className="md:hidden glass-panel !rounded-none fixed bottom-0 inset-x-0 z-40 grid border-t border-[color:var(--glass-border)]" style={{ gridTemplateColumns: `repeat(${tabs.length + (rest.length ? 1 : 0)},minmax(0,1fr))` }}>
                {tabs.map((n) => (
                    <Link key={n.key} href={n.href} aria-current={isActive(n, active) ? 'page' : undefined}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[64px] px-1 text-center text-[12px] leading-4 font-extrabold break-words ${isActive(n, active) ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}>
                        <Icon name={n.icon} size={24} />{t('nav.' + n.key)}
                        {isActive(n, active) && <span className="w-6 h-1 rounded-full bg-[var(--text-accent)]" />}
                    </Link>
                ))}
                {rest.length > 0 && (
                    <button type="button" onClick={() => setMore(true)} aria-haspopup="dialog" aria-expanded={more}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[64px] px-1 text-[12px] leading-4 font-extrabold ${moreActive ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}>
                        <Icon name="Plus" size={24} />{t('nav.more')}
                        {moreActive && <span className="w-6 h-1 rounded-full bg-[var(--text-accent)]" />}
                    </button>
                )}
            </nav>
            <Modal show={more} onClose={() => setMore(false)} maxWidth="sm" label={t('nav.more')}>
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="eyebrow">{t('nav.more')}</h2>
                        <button type="button" onClick={() => setMore(false)} className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"><Icon name="X" size={24} />{t('haul.close')}</button>
                    </div>
                    {rest.map((n) => (
                        <NavLink key={n.key} href={n.href} icon={n.icon} active={isActive(n, active)} onClick={() => setMore(false)}>
                            <span>{t('nav.' + n.key)}</span>
                        </NavLink>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

/* Phone version: top bar (logo mark, chip, switcher, theme) + content + bottom tab bar (24px icons + words, 60px tall). */
export function PhoneShell({ role = 'coordinator', active = 'farms', title, children }: PropsWithChildren<{ role?: Role; active?: string; title: ReactNode }>) {
    const { t } = useI18n(); title = tx(t, title);
    const tabs = role === 'driver'
        ? [{ key: 'logistics', icon: 'Truck', label: 'nav.haul', href: '/haul/driver' }, { key: 'sms', icon: 'Sms', label: 'nav.sms', href: '/sms' }]
        : [{ key: 'farms', icon: 'Farm', label: 'nav.farms', href: '/farm' }, { key: 'logistics', icon: 'Truck', label: 'nav.haul', href: '/haul' }, { key: 'orders', icon: 'Pay', label: 'nav.pay', href: '/pay' }, { key: 'sms', icon: 'Sms', label: 'nav.sms', href: '/sms' }];
    return (
        <div className="rc-ground min-h-full flex flex-col">
            <header className="glass-panel !rounded-none !shadow-none px-4 pt-2 pb-3 border-b border-[color:var(--glass-border)]">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Link href="/" className="rounded-xl"><ApplicationLogo variant="mark" height={48} /></Link>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <LanguageSwitcher showDraftNote={false} />
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
            <nav aria-label="Main" className="glass-panel !rounded-none sticky bottom-0 z-40 grid border-t border-[color:var(--glass-border)]" style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}>
                {tabs.map((tb) => (
                    <Link key={tb.key} href={tb.href} aria-current={active === tb.key ? 'page' : undefined}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[60px] text-[12px] font-extrabold ${active === tb.key ? 'text-[var(--text-accent)]' : 'text-[var(--text-secondary)]'}`}>
                        <Icon name={tb.icon} size={24} />{t(tb.label)}
                        {active === tb.key && <span className="mt-0.5 w-6 h-1 rounded-full bg-[var(--text-accent)]" />}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
