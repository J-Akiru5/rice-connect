'use client';
import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
import NavLink from './NavLink';
import ApplicationLogo from './ApplicationLogo';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';
import { DemoChip, LanguageSwitcher } from './Enactus';
import { useI18n, tx } from '../lib/i18n';

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
    buyer: [
        { key: 'market', icon: 'Market', href: '/market' }, { key: 'orders', icon: 'Orders', href: '/pay', sub: 'pay' },
        { key: 'logistics', icon: 'Logistics', href: '/haul', sub: 'haul' },
    ],
    driver: [{ key: 'logistics', icon: 'Logistics', href: '/haul/driver', sub: 'haul' }, { key: 'sms', icon: 'Sms', href: '/sms' }],
};
const ROLE_LABEL: Record<Role, string> = { coordinator: 'role.coordinator', buyer: 'role.buyer', driver: 'role.driver' };

export function TeamFooter({ className = '' }: { className?: string }) {
    return <footer className={'px-4 md:px-8 py-4 text-[13px] font-semibold text-[var(--text-secondary)] ' + className}>Team Syntaxure Labs · ISUFST</footer>;
}

export default function AppShell({ role = 'coordinator', active = 'farms', title, eyebrow, actions, children }: PropsWithChildren<{ role?: Role; active?: string; title: ReactNode; eyebrow?: ReactNode; actions?: ReactNode }>) {
    const { t } = useI18n(); title = tx(t, title); eyebrow = tx(t, eyebrow);
    return (
        <div className="rc-ground min-h-screen w-full flex flex-col md:flex-row">
            <aside className="glass-panel !rounded-none w-full md:w-[272px] shrink-0 flex flex-col gap-1 p-4 md:p-5 border-b md:border-b-0 md:border-r border-[color:var(--glass-border)]" aria-label="Main">
                <Link href="/" className="px-2 pb-3 md:pb-5 self-start rounded-xl"><ApplicationLogo height={40} /></Link>
                <nav className="flex flex-row flex-wrap md:flex-col gap-1">
                    {NAV[role].map((n) => (
                        <NavLink key={n.key} href={n.href} icon={n.icon} active={active === n.key || active === n.sub}>
                            <span>{t('nav.' + n.key)}</span>
                            {n.sub && <span className={`ml-1 text-[12px] font-bold normal-case tracking-normal ${active === n.key || active === n.sub ? 'text-[var(--on-fill-strong)]' : 'text-[var(--text-muted)]'}`}>· {t('nav.' + n.sub)}</span>}
                        </NavLink>
                    ))}
                </nav>
                <div className="hidden md:flex mt-auto px-2 pt-4 text-[13px] font-semibold text-[var(--text-secondary)] items-center gap-2"><Icon name="User" size={18} />{t(ROLE_LABEL[role])}</div>
            </aside>
            <main className="flex-1 min-w-0 flex flex-col">
                <header className="glass-panel !rounded-none !shadow-none border-b border-[color:var(--glass-border)] px-4 md:px-8 py-4 flex items-center gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
                        <h1 className="text-[28px] leading-8 font-extrabold tracking-[-0.03em] uppercase">{title}</h1>
                    </div>
                    <DemoChip />
                    <LanguageSwitcher />
                    <ThemeToggle />
                    {actions}
                </header>
                <div className="flex-1 p-4 md:p-8 min-w-0">{children}</div>
                <TeamFooter />
            </main>
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
            <div className="flex-1 p-4">{children}</div>
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
