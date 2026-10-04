'use client';
import Link from 'next/link';
import Icon from './Icon';
import { useI18n } from '@rc/i18n';
import { getPageWindow, pageCount, clampPage, PAGE_SIZES } from '@rc/domain/list';

/* Prototype addition (logged in docs/DECISIONS.md, derived, not in canvas): one pager for every list over 12 rows.
   Glass panel, line icon + word on Previous/Next, 44px targets, the global 3px focus ring.
   Wide container: "Showing 21-40 of 100", Rows per page (10/20/50), numbered pages with gaps.
   Narrow container (phone, or the phone frame): "Previous | Page 2 of 5 | Next". Pages are links, so Back works. */
export default function Pagination({
    total,
    page,
    pageSize,
    hrefFor,
    onSizeChange,
    sizes = PAGE_SIZES,
    label,
    className = ''
}: {
    total: number;
    page: number;
    pageSize: number;
    hrefFor: (page: number) => string;
    onSizeChange?: (size: number) => void;
    sizes?: readonly number[];
    label?: string;
    className?: string;
}) {
    const { t } = useI18n();
    const pages = pageCount(total, pageSize);
    const cur = clampPage(page, pages);
    const from = total ? (cur - 1) * pageSize + 1 : 0;
    const to = Math.min(total, cur * pageSize);
    const base =
        'inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 rounded-full text-[14px] font-extrabold tabular';
    const off = `${base} border-2 border-[color:var(--text-muted)] opacity-40 cursor-not-allowed`;
    const on = `${base} border-2 border-[color:var(--text-muted)] text-[var(--ink)] rc-hover-accent`;
    const prev = (word: boolean) =>
        cur > 1 ? (
            <Link href={hrefFor(cur - 1)} className={on} rel="prev">
                <Icon name="ChevronLeft" size={20} />
                <span className={word ? '' : 'sr-only'}>{t('list.prev')}</span>
            </Link>
        ) : (
            <span className={off} aria-disabled="true">
                <Icon name="ChevronLeft" size={20} />
                <span className={word ? '' : 'sr-only'}>{t('list.prev')}</span>
            </span>
        );
    const next = (word: boolean) =>
        cur < pages ? (
            <Link href={hrefFor(cur + 1)} className={on} rel="next">
                <span className={word ? '' : 'sr-only'}>{t('list.next')}</span>
                <Icon name="ChevronRight" size={20} />
            </Link>
        ) : (
            <span className={off} aria-disabled="true">
                <span className={word ? '' : 'sr-only'}>{t('list.next')}</span>
                <Icon name="ChevronRight" size={20} />
            </span>
        );
    return (
        <nav
            aria-label={label ?? t('list.pagination')}
            className={'glass-panel rounded-[1.5rem] px-3 py-2 ' + className}
        >
            {/* narrow: compact */}
            <div className="cq-narrow-only flex items-center justify-between gap-2 flex-wrap">
                {prev(true)}
                <span className="text-[14px] font-extrabold tabular text-center" aria-live="polite">
                    {t('list.pageOf', { n: cur, total: pages })}
                </span>
                {next(true)}
            </div>
            {/* wide: full */}
            <div className="cq-wide-only flex items-center gap-x-4 gap-y-2 flex-wrap">
                <span className="text-[14px] font-bold tabular text-[var(--text-secondary)]" aria-live="polite">
                    {t('list.showing', { from, to, total })}
                </span>
                {onSizeChange && (
                    <label className="inline-flex items-center gap-2 text-[14px] font-bold">
                        <span>{t('list.rowsPerPage')}</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onSizeChange(Number(e.target.value))}
                            className="min-h-[40px] px-3 rounded-full bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] font-extrabold tabular"
                        >
                            {sizes.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                <ul className="ml-auto flex items-center gap-1.5 flex-wrap">
                    <li>{prev(true)}</li>
                    {getPageWindow(total, cur, pageSize).map((p, i) => (
                        <li key={p === 'gap' ? `g${i}` : p}>
                            {p === 'gap' ? (
                                <span
                                    aria-hidden
                                    className="inline-flex items-end justify-center min-w-[24px] text-[14px] font-extrabold"
                                >
                                    …
                                </span>
                            ) : p === cur ? (
                                <Link
                                    href={hrefFor(p)}
                                    aria-current="page"
                                    aria-label={t('list.page', { n: p })}
                                    className={`${base} bg-[var(--fill-strong)] text-[var(--on-fill-strong)]`}
                                >
                                    {p}
                                </Link>
                            ) : (
                                <Link href={hrefFor(p)} aria-label={t('list.page', { n: p })} className={on}>
                                    {p}
                                </Link>
                            )}
                        </li>
                    ))}
                    <li>{next(true)}</li>
                </ul>
            </div>
        </nav>
    );
}
