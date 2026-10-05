'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@rc/i18n';
import Icon from '../Components/Icon';
import { cx } from './cx';

/** Skeleton in the shape of the content after 300 ms; before that, nothing (state matrix). */
export function LoadingState({
    rows = 3,
    delay = 300,
    className
}: {
    rows?: number;
    delay?: number;
    className?: string;
}) {
    const { t } = useI18n();
    const [show, setShow] = useState(false);
    useEffect(() => {
        const id = window.setTimeout(() => setShow(true), delay);
        return () => window.clearTimeout(id);
    }, [delay]);
    if (!show) return null;
    return (
        <div
            role="status"
            aria-busy="true"
            className={cx('glass-panel rounded-[1.5rem] p-5 flex flex-col gap-3', className)}
        >
            <span className="sr-only">{t('state.loading')}</span>
            {Array.from({ length: rows }, (_, i) => (
                <span key={i} className="rc-bg-track block h-5 rounded-full" style={{ width: `${90 - i * 12}%` }} />
            ))}
        </div>
    );
}

export function ErrorState({
    title,
    body,
    reference,
    onRetry,
    variant = 'error',
    className
}: {
    title?: string;
    body?: string;
    reference?: string;
    onRetry?: () => void;
    variant?: 'error' | 'notFound';
    className?: string;
}) {
    const { t } = useI18n();
    const notFound = variant === 'notFound';
    return (
        <div role="alert" className={cx('glass-panel rounded-[1.5rem] p-5 flex flex-col items-start gap-2', className)}>
            <p className="m-0 flex items-center gap-2 text-[16px] font-extrabold">
                <Icon name={notFound ? 'Search' : 'Alert'} size={20} />
                {title ?? t(notFound ? 'state.notFound.title' : 'state.error.title')}
            </p>
            <p className="m-0 text-[14px] leading-5 font-semibold text-[var(--text-secondary)]">
                {body ?? t(notFound ? 'state.notFound.body' : 'state.error.body')}
            </p>
            {reference && (
                <p className="m-0 text-[13px] font-bold tabular text-[var(--text-muted)]">
                    {t('state.error.reference', { code: reference })}
                </p>
            )}
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-1 inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                >
                    <Icon name="RefreshCw" size={18} />
                    <span>{t('error.retry')}</span>
                </button>
            )}
        </div>
    );
}

export function ForbiddenState({
    role,
    onSignIn,
    className
}: {
    role: string;
    onSignIn?: () => void;
    className?: string;
}) {
    const { t } = useI18n();
    return (
        <div className={cx('glass-panel rounded-[1.5rem] p-5 flex flex-col items-start gap-2', className)}>
            <p className="m-0 flex items-center gap-2 text-[16px] font-extrabold">
                <Icon name="Lock" size={20} />
                {t('state.forbidden.title', { role })}
            </p>
            <p className="m-0 text-[14px] leading-5 font-semibold text-[var(--text-secondary)]">
                {t('state.forbidden.body')}
            </p>
            {onSignIn && (
                <button
                    type="button"
                    onClick={onSignIn}
                    className="mt-1 inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                >
                    <Icon name="LogIn" size={18} />
                    <span>{t('state.forbidden.signIn')}</span>
                </button>
            )}
        </div>
    );
}

export function OfflineBanner({ className }: { className?: string }) {
    const { t } = useI18n();
    const [offline, setOffline] = useState(false);
    useEffect(() => {
        const update = () => setOffline(!navigator.onLine);
        update();
        window.addEventListener('online', update);
        window.addEventListener('offline', update);
        return () => {
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        };
    }, []);
    if (!offline) return null;
    return (
        <div
            role="status"
            className={cx(
                'w-full text-center py-2 px-3 bg-[var(--danger-soft)] text-[var(--danger-ink)] text-[13px] leading-5 font-bold',
                className
            )}
        >
            {t('state.offline')}
        </div>
    );
}

/** Small "Updating" marker while data stays on screen (never blank the screen). */
export function RefreshMarker({ className }: { className?: string }) {
    const { t } = useI18n();
    return (
        <span
            role="status"
            className={cx(
                'inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-muted)]',
                className
            )}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--fill-strong)] motion-safe:animate-pulse" />
            {t('state.refresh')}
        </span>
    );
}
