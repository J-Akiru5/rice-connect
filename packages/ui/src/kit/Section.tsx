'use client';
import type { PropsWithChildren, ReactNode } from 'react';

/* Section head for the buyer and coordinator screens (prototype addition).
   The canvas boards label a section with a pill; a pill is a chip, and a chip cannot carry the
   hierarchy of a page whose reader is scanning for one number. This draws a real heading: the
   title at heading size, a hairline rule that runs to the edge of the column, and room on the
   right for the control that belongs to that section (a week switch, a filter, a link). */
export function SectionHead({
    id,
    title,
    hint,
    action,
    className = ''
}: PropsWithChildren<{
    id: string;
    title: ReactNode;
    hint?: ReactNode;
    action?: ReactNode;
    className?: string;
}>) {
    return (
        <div className={'flex flex-col gap-3 min-w-0 ' + className}>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 min-w-0">
                <h2
                    id={id}
                    className="m-0 min-w-0 text-[22px] leading-7 font-extrabold tracking-[-0.02em] text-[var(--ink)]"
                >
                    {title}
                </h2>
                {action}
            </div>
            {hint && <p className="rc-lede">{hint}</p>}
            <span className="rule-ink block h-px w-full border-0 border-t" aria-hidden />
        </div>
    );
}
