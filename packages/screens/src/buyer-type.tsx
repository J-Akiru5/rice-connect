'use client';
import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Icon, useI18n } from '@rc/ui';
import { useDemoState, updateDemoState } from '@rc/store/react';
import { setBuyerType } from '@rc/store';
import { BUYER_TYPES, buysPalay, isBuyerType, type BuyerType } from '@rc/domain/buyers';

const DEFAULT: BuyerType = 'restaurant';

/** Buyer type from ?type= (shareable), else the last choice kept in the demo store, else Restaurant. */
export function useBuyerType(): [BuyerType, (t: BuyerType) => void] {
    const sp = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const stored = useDemoState().buyerType;
    const fromUrl = sp.get('type');
    const type = isBuyerType(fromUrl) ? fromUrl : (stored ?? DEFAULT);
    const set = useCallback(
        (t: BuyerType) => {
            updateDemoState(setBuyerType(t));
            const next = new URLSearchParams(sp.toString());
            next.set('type', t);
            router.replace(`${pathname}?${next.toString()}`, { scroll: false });
        },
        [sp, router, pathname]
    );
    return [type, set];
}

/** "I buy as: Miller / Retailer / Market Seller / Restaurant".
    An opaque card with the question on its own line and 48px options: the selection carries a check icon as well as
    fill, so it does not rely on colour alone, and the options stay big enough for older hands and eyes. */
export function BuyerTypePicker({ value, onChange }: { value: BuyerType; onChange: (t: BuyerType) => void }) {
    const { t } = useI18n();
    return (
        <div className="panel-solid rounded-[1.5rem] p-6 flex flex-col gap-4">
            <h2 className="eyebrow m-0">{t('buyer.type')}</h2>
            <div role="radiogroup" aria-label={t('buyer.type')} className="flex flex-wrap gap-3">
                {BUYER_TYPES.map((bt) => (
                    <button
                        key={bt}
                        type="button"
                        role="radio"
                        aria-checked={value === bt}
                        onClick={() => onChange(bt)}
                        className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-[2rem] text-[16px] font-extrabold ${value === bt ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)]' : 'bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)]'}`}
                    >
                        {value === bt && <Icon name="Check" size={20} strokeWidth={3} />}
                        {t('buyer.type.' + bt)}
                    </button>
                ))}
            </div>
            <p className="m-0 text-[16px] leading-6 font-medium text-[var(--ink)] max-w-[70ch]">
                {t(buysPalay(value) ? 'buyer.buys.palay' : 'buyer.buys.rice')}
            </p>
        </div>
    );
}
