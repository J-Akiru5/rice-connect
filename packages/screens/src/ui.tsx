'use client';
import type React from 'react';
import type { PropsWithChildren } from 'react';

/* Markup the canvas boards repeat (not a new design-system component):
   the glass pill that labels a section, and a small muted note line. */
export function SectionPill({ children, id }: PropsWithChildren<{ id?: string }>) {
    return (
        <h2
            id={id}
            className="glass-panel !shadow-none inline-flex mb-3 px-3.5 py-1.5 rounded-full text-[13px] leading-4 font-extrabold tracking-[0.1em] uppercase text-[var(--ink)]"
        >
            {children}
        </h2>
    );
}
export function Note({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
    return (
        <p className={'m-0 text-[14px] leading-5 font-semibold text-[var(--text-secondary)] ' + className}>
            {children}
        </p>
    );
}

export interface Col<T> {
    key: string;
    label: string;
    cell: (row: T) => React.ReactNode;
    align?: 'right';
    nowrap?: boolean;
}
/** A glass table when the content is wide; stacked glass cards (label: value) when it is narrow (derived, not in canvas).
    The first column is the row header and the card title. Text wraps; nothing is cut with an ellipsis. */
export function ResponsiveTable<T>({
    caption,
    cols,
    rows,
    rowKey,
    highlight,
    surface = 'glass'
}: {
    caption: string;
    cols: Col<T>[];
    rows: T[];
    rowKey: (r: T) => string;
    highlight?: (r: T) => boolean;
    /* 'solid' opts a screen into the opaque content sheet (older/government readers);
       the default keeps every existing caller on glass. */
    surface?: 'glass' | 'solid';
}) {
    const [first, ...rest] = cols;
    const head: Col<T> = first ?? { key: 'head', label: caption, cell: rowKey };
    const capCls = 'text-[12px] leading-4 font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)]';
    const panel = surface === 'solid' ? 'panel-solid' : 'glass-panel';
    return (
        <>
            <div className={`cq-wide-only ${panel} rounded-[1.5rem] p-4 min-w-0`}>
                <table className="w-full text-left tabular">
                    <caption className="sr-only">{caption}</caption>
                    <thead>
                        <tr className={capCls}>
                            {cols.map((c) => (
                                <th
                                    key={c.key}
                                    scope="col"
                                    className={`py-2 pr-3 align-bottom ${c.align === 'right' ? 'text-right' : ''}`}
                                >
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr
                                key={rowKey(r)}
                                className={`border-t border-[color:var(--glass-border-strong)] text-[15px] font-bold align-top ${highlight?.(r) ? 'rc-bg-highlight' : ''}`}
                            >
                                <th scope="row" className="py-2.5 pr-3 font-extrabold break-words">
                                    {head.cell(r)}
                                </th>
                                {rest.map((c) => (
                                    <td
                                        key={c.key}
                                        className={`py-2.5 pr-3 ${c.align === 'right' ? 'text-right' : ''} ${c.nowrap ? 'whitespace-nowrap' : 'break-words'}`}
                                    >
                                        {c.cell(r)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ul className="cq-narrow-only flex flex-col gap-3" aria-label={caption}>
                {rows.map((r) => (
                    <li
                        key={rowKey(r)}
                        className={`${panel} rounded-[1.5rem] p-4 ${highlight?.(r) ? 'outline outline-[3px] outline-[color:var(--text-accent)]' : ''}`}
                    >
                        <div className="text-[16px] leading-6 font-extrabold tabular break-words">{head.cell(r)}</div>
                        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 tabular">
                            {rest.map((c) => (
                                <div key={c.key} className="min-w-0">
                                    <dt className={capCls}>{c.label}</dt>
                                    <dd className="text-[16px] leading-6 font-bold break-words">{c.cell(r)}</dd>
                                </div>
                            ))}
                        </dl>
                    </li>
                ))}
            </ul>
        </>
    );
}
