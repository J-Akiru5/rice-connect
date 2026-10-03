import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import Icon from './Icon';
/* Karl's sidebar item: same shape and motion; text now 13px / 0.08em in ink (was emerald-900 at 60%), active fill brand-green.
   Prototype port: Inertia <Link> swapped for next/link. */
export default function NavLink({ active = false, icon, className = '', children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; active?: boolean; icon?: string }) {
    return (
        <Link {...props} href={href} aria-current={active ? 'page' : undefined}
            className={'relative flex items-center min-h-[44px] px-5 py-3 rounded-[1.5rem] text-[13px] font-extrabold uppercase tracking-[0.08em] transition-all duration-500 motion-reduce:transition-none overflow-hidden group ' +
                (active ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)] shadow-[var(--shadow-nav-active)]' : 'text-[var(--ink)] hover:bg-[rgba(5,150,105,.1)]') + ' ' + className}>
            {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[var(--emerald-400)] rounded-r-full" />}
            <span className={`relative z-10 flex items-center gap-3 transition-transform duration-500 motion-reduce:transition-none ${active ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                {icon && <Icon name={icon} size={20} />}{children}
            </span>
        </Link>
    );
}
