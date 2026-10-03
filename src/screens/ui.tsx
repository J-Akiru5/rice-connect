'use client';
import type { PropsWithChildren } from 'react';

/* Markup the canvas boards repeat (not a new design-system component):
   the glass pill that labels a section, and a small muted note line. */
export function SectionPill({ children, id }: PropsWithChildren<{ id?: string }>) {
    return (
        <h2 id={id} className="glass-panel !shadow-none inline-flex mb-3 px-3.5 py-1.5 rounded-full text-[13px] leading-4 font-extrabold tracking-[0.1em] uppercase text-[var(--ink)]">
            {children}
        </h2>
    );
}
export function Note({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
    return <p className={'m-0 text-[14px] leading-5 font-semibold text-[var(--text-secondary)] ' + className}>{children}</p>;
}
