'use client';
import type { HTMLAttributes } from 'react';
import { useI18n } from '@rc/i18n';
import { RC_MODE, envLabel } from '../lib/mode';

/** Environment and mode on every route outside production (Demo / Staging / Local); absent in production. */
export default function EnvironmentRibbon({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { t } = useI18n();
    const label = envLabel(RC_MODE, process.env.NEXT_PUBLIC_VERCEL_ENV);
    if (!label) return null;
    return (
        <div
            {...props}
            role="status"
            className={
                'w-full text-center py-1 px-3 bg-[var(--brand-green)] text-white text-[12px] leading-5 font-extrabold uppercase tracking-[0.12em] ' +
                className
            }
        >
            {t('env.' + label)}
        </div>
    );
}
